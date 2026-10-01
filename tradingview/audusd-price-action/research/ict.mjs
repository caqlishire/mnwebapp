// Mechanical versions of Inner Circle Trader (ICT) models. Signals on M5 bars (New York time), limit/market orders
// filled and managed on 1-minute bars (stop first when a minute touches both), 1 pip round-trip cost.
import { pivotHigh, pivotLow, trendSeries } from './engine.mjs';
import { aggregate } from './data.mjs';

const PIP = 0.0001;

// ---------- shared preparation (cached on ctx) ----------
export function ictPrep(ctx) {
  if (ctx.ict) return ctx.ict;
  const { n, O, H, L, C, m1 } = ctx;
  const M1O = Float64Array.from(m1.o, (v) => v / 1e5);
  const sw = 3, ph = new Float64Array(n).fill(NaN), pl = new Float64Array(n).fill(NaN);
  for (let i = 0; i < n; i++) { ph[i] = pivotHigh(H, i, sw, sw); pl[i] = pivotLow(L, i, sw, sw); }
  // per FX day: Asian range (20:00-24:00 NY), midnight open, London killzone range (02:00-05:00 NY)
  const days = new Map();
  for (let i = 0; i < n; i++) {
    const k = ctx.dayIdx[i], ny = ctx.nyMin[i];
    let d = days.get(k); if (!d) { d = { asHi: -Infinity, asLo: Infinity, mo: NaN, ldHi: -Infinity, ldLo: Infinity, first: i }; days.set(k, d); }
    if (ny >= 1200) { d.asHi = Math.max(d.asHi, H[i]); d.asLo = Math.min(d.asLo, L[i]); }
    if (ny < 1020 && Number.isNaN(d.mo)) d.mo = O[i];
    if (ny >= 120 && ny < 300) { d.ldHi = Math.max(d.ldHi, H[i]); d.ldLo = Math.min(d.ldLo, L[i]); }
  }
  // daily bias: (a) D structure of the previous completed day, (b) previous day's candle direction
  const biasStruct = trendSeries(ctx, 'D', 3, 'tv');
  const D = ctx.D, biasCandle = new Int8Array(n);
  for (let i = 0; i < n; i++) { const k = ctx.dayIdx[i]; biasCandle[i] = k >= 1 ? Math.sign(D.c[k - 1] - D.o[k - 1]) : 0; }
  ctx.ict = { M1O, ph, pl, days, biasStruct, biasCandle };
  return ctx.ict;
}

const firstM1AtOrAfter = (m1, T) => { let lo = 0, hi = m1.n; while (lo < hi) { const mid = (lo + hi) >> 1; if (m1.t[mid] < T) lo = mid + 1; else hi = mid; } return lo; };
const nyTimeToT = (ctx, i, nyMinTarget) => ctx.t[i] - ctx.nyMin[i] + nyMinTarget + (nyMinTarget < ctx.nyMin[i] && ctx.nyMin[i] >= 1020 && nyMinTarget < 1020 ? 1440 : 0);

// Limit (or market) order placed after chart bar i closes. Returns a trade or null (not filled).
export function execute(ctx, i, { dir, entry = NaN, market = false, sl, tp, validUntilT, exitT, costPips = 1 }) {
  const { m1 } = ctx, { M1O } = ctx.ict, M1H = ctx.m1H, M1L = ctx.m1L;
  let j = ctx.m1Last[i] + 1, fillJ = -1, fillPx = NaN;
  if (market) { if (j >= m1.n) return null; fillJ = j; fillPx = M1O[j]; }
  else {
    for (; j < m1.n && m1.t[j] < validUntilT; j++) {
      if (dir === 1 ? M1L[j] <= entry : M1H[j] >= entry) { fillJ = j; fillPx = dir === 1 ? Math.min(entry, M1O[j]) : Math.max(entry, M1O[j]); break; }
      // cancel if the stop is traded through before the fill
      if (dir === 1 ? M1L[j] <= sl : M1H[j] >= sl) return null;
    }
    if (fillJ < 0) return null;
  }
  if (dir === 1 ? fillPx <= sl : fillPx >= sl) return null;
  let exitPx = NaN, kind = 'time';
  if (!market && (dir === 1 ? M1L[fillJ] <= sl : M1H[fillJ] >= sl)) { exitPx = sl; kind = 'stop'; }
  else {
    const jEnd = firstM1AtOrAfter(m1, exitT);
    for (let k = market ? fillJ : fillJ + 1; k < m1.n && k < jEnd; k++) {
      if (dir === 1 ? M1L[k] <= sl : M1H[k] >= sl) { exitPx = sl; kind = 'stop'; break; }
      if (dir === 1 ? M1H[k] >= tp : M1L[k] <= tp) { exitPx = tp; kind = 'target'; break; }
    }
    if (Number.isNaN(exitPx)) exitPx = M1O[Math.min(jEnd, m1.n - 1)];
  }
  const risk = Math.abs(fillPx - sl);
  return { entryBar: i, dir, kind, risk, netR: (dir * (exitPx - fillPx) - costPips * PIP) / risk, grossR: dir * (exitPx - fillPx) / risk, stopPips: risk / PIP };
}

const biasOf = (I, mode, i) => (mode === 'struct' ? I.biasStruct[i] : mode === 'candle' ? I.biasCandle[i] : 0);
const okBias = (mode, b, dir) => mode === 'off' || b === dir;

// ---------- Model A: ICT 2022 mentorship (sweep -> market structure shift -> FVG entry) ----------
// kz 'LDN': 02:00-05:00 NY, pool = Asian range; kz 'NY': 08:30-11:00 NY, pool = London killzone range.
export function model2022(ctx, { kz = 'LDN', entryAt = 'edge', target = '2R', bias = 'off', minStop = 4, maxStop = 40, costPips = 1 } = {}) {
  const I = ictPrep(ctx), { n, H, L, C } = ctx;
  const [ks, ke, exitNy] = kz === 'LDN' ? [120, 300, 720] : [510, 660, 960];
  const trades = [];
  let i = 0;
  while (i < n) {
    const ny = ctx.nyMin[i];
    if (!(ny >= ks && ny < ke)) { i++; continue; }
    const dk = ctx.dayIdx[i], d = I.days.get(dk);
    const poolHi = kz === 'LDN' ? d.asHi : d.ldHi, poolLo = kz === 'LDN' ? d.asLo : d.ldLo;
    let done = false, sweep = 0, ext = NaN, structLvl = NaN, sweepBar = -1;
    let j = i;
    for (; j < n && ctx.dayIdx[j] === dk && ctx.nyMin[j] >= ks && ctx.nyMin[j] < ke; j++) {
      if (done || !Number.isFinite(poolHi) || !Number.isFinite(poolLo)) continue;
      if (sweep === 0) {
        if (H[j] > poolHi) { sweep = -1; ext = H[j]; sweepBar = j; }         // buy-side taken -> look for shorts
        else if (L[j] < poolLo) { sweep = 1; ext = L[j]; sweepBar = j; }     // sell-side taken -> look for longs
        if (sweep !== 0) { // structure level = most recent confirmed opposite swing before the sweep
          for (let k = j; k >= Math.max(0, j - 60); k--) { const v = sweep === -1 ? I.pl[k] : I.ph[k]; if (!Number.isNaN(v)) { structLvl = v; break; } }
          if (Number.isNaN(structLvl)) { done = true; }
        }
        continue;
      }
      ext = sweep === -1 ? Math.max(ext, H[j]) : Math.min(ext, L[j]);
      const mss = sweep === -1 ? C[j] < structLvl : C[j] > structLvl;
      if (!mss) continue;
      done = true;
      if (!okBias(bias, biasOf(I, bias, j), sweep)) continue;
      // displacement FVG between the sweep and the MSS bar (most recent one)
      let edge = NaN, far = NaN;
      for (let k = j; k >= Math.max(sweepBar + 2, 2); k--) {
        if (sweep === -1 && H[k] < L[k - 2]) { edge = H[k]; far = L[k - 2]; break; }
        if (sweep === 1 && L[k] > H[k - 2]) { edge = L[k]; far = H[k - 2]; break; }
      }
      if (Number.isNaN(edge)) continue;
      const entry = entryAt === 'edge' ? edge : (edge + far) / 2;
      const sl = ext + (sweep === -1 ? 1 : -1) * PIP;
      const risk = Math.abs(entry - sl), rp = risk / PIP;
      if (rp < minStop || rp > maxStop) continue;
      const tp = target === 'pool' ? (sweep === -1 ? poolLo : poolHi) : entry + sweep * parseFloat(target) * risk;
      if (sweep === -1 ? tp >= entry : tp <= entry) continue;
      const kzEndT = nyTimeToT(ctx, j, ke), exitT = nyTimeToT(ctx, j, exitNy);
      const tr = execute(ctx, j, { dir: sweep, entry, sl, tp, validUntilT: kzEndT, exitT, costPips });
      if (tr) trades.push(tr);
    }
    i = j + 1;
  }
  return trades;
}

// ---------- Model B: Judas swing / Power of 3 (London) ----------
// With a daily bias, London (02:00-05:00 NY) raids the Asian range against the bias, below (longs) / above (shorts)
// the midnight open by >= raidMin pips; enter at the close that reclaims the Asian range; stop beyond the raid extreme.
export function modelJudas(ctx, { bias = 'struct', raidMin = 5, target = '2R', minStop = 4, maxStop = 40, costPips = 1 } = {}) {
  const I = ictPrep(ctx), { n, H, L, C } = ctx;
  const trades = [];
  let lastDay = -1;
  for (let i = 0; i < n; i++) {
    const ny = ctx.nyMin[i]; if (!(ny >= 120 && ny < 300)) continue;
    const dk = ctx.dayIdx[i]; if (dk === lastDay) continue;
    const d = I.days.get(dk); if (!Number.isFinite(d.asHi) || Number.isNaN(d.mo)) continue;
    let b = biasOf(I, bias, i);
    // scan the killzone for the raid and the reclaim
    let raidExt = NaN, dirTrade = 0, j = i;
    for (; j < n && ctx.dayIdx[j] === dk && ctx.nyMin[j] >= 120 && ctx.nyMin[j] < 300; j++) {
      const wantLong = bias === 'off' ? true : b === 1, wantShort = bias === 'off' ? true : b === -1;
      if (wantLong && (d.asLo - L[j]) >= raidMin * PIP && L[j] < d.mo) raidExt = Number.isNaN(raidExt) || dirTrade !== 1 ? L[j] : Math.min(raidExt, L[j]), dirTrade = 1;
      if (wantShort && dirTrade !== 1 && (H[j] - d.asHi) >= raidMin * PIP && H[j] > d.mo) raidExt = Number.isNaN(raidExt) ? H[j] : Math.max(raidExt, H[j]), dirTrade = -1;
      if (dirTrade === 1 && C[j] > d.asLo) break;
      if (dirTrade === -1 && C[j] < d.asHi) break;
    }
    lastDay = dk;
    if (dirTrade === 0 || j >= n || ctx.dayIdx[j] !== dk || ctx.nyMin[j] >= 300) continue;
    const entry = C[j], sl = raidExt - dirTrade * PIP, risk = Math.abs(entry - sl), rp = risk / PIP;
    if (rp < minStop || rp > maxStop) continue;
    const tp = target === 'range' ? (dirTrade === 1 ? d.asHi : d.asLo) : entry + dirTrade * parseFloat(target) * risk;
    if (dirTrade === 1 ? tp <= entry : tp >= entry) continue;
    const tr = execute(ctx, j, { dir: dirTrade, market: true, sl, tp, exitT: nyTimeToT(ctx, j, 720), costPips });
    if (tr) trades.push(tr);
  }
  return trades;
}

// ---------- Model C: Optimal Trade Entry (OTE) ----------
// A confirmed swing high that breaks the previous swing high (bullish structure) defines the leg from the latest
// swing low; a buy limit sits at the 70.5% retracement, stop below the swing low, target at 0 / -0.27 / -0.62.
export function modelOTE(ctx, { minLeg = 10, target = 0, bias = 'off', validBars = 36, costPips = 1, kzOnly = true } = {}) {
  const I = ictPrep(ctx), { n } = ctx;
  const trades = [];
  let lastSH = NaN, lastSL = NaN, lastSLBar = -1, lastSHBar = -1, busyUntil = -1;
  const inKZ = (ny) => (ny >= 120 && ny < 300) || (ny >= 420 && ny < 600);
  for (let i = 0; i < n; i++) {
    const ph = I.ph[i], pl = I.pl[i];
    if (!Number.isNaN(ph)) {
      if (!Number.isNaN(lastSH) && ph > lastSH && !Number.isNaN(lastSL) && lastSLBar < i - 3 && i > busyUntil) {
        const leg = ph - lastSL;
        if (leg >= minLeg * PIP && (!kzOnly || inKZ(ctx.nyMin[i])) && okBias(bias, biasOf(I, bias, i), 1)) {
          const entry = ph - 0.705 * leg, sl = lastSL - PIP, tp = ph + target * leg;
          const tr = execute(ctx, i, { dir: 1, entry, sl, tp, validUntilT: ctx.t[i] + validBars * 5, exitT: ctx.t[i] + validBars * 5 + 240, costPips });
          if (tr) { trades.push(tr); busyUntil = i + validBars; }
        }
      }
      lastSH = ph; lastSHBar = i - 3;
    }
    if (!Number.isNaN(pl)) {
      if (!Number.isNaN(lastSL) && pl < lastSL && !Number.isNaN(lastSH) && lastSHBar < i - 3 && i > busyUntil) {
        const leg = lastSH - pl;
        if (leg >= minLeg * PIP && (!kzOnly || inKZ(ctx.nyMin[i])) && okBias(bias, biasOf(I, bias, i), -1)) {
          const entry = pl + 0.705 * leg, sl = lastSH + PIP, tp = pl - target * leg;
          const tr = execute(ctx, i, { dir: -1, entry, sl, tp, validUntilT: ctx.t[i] + validBars * 5, exitT: ctx.t[i] + validBars * 5 + 240, costPips });
          if (tr) { trades.push(tr); busyUntil = i + validBars; }
        }
      }
      lastSL = pl; lastSLBar = i - 3;
    }
  }
  return trades;
}

// ---------- Model D: Order block ----------
// Displacement: a candle closes beyond the latest confirmed swing high (low) and leaves an FVG. Order block = the last
// opposite-colour candle before the displacement leg. Limit at its mean threshold (50% of the body) or its edge.
export function modelOB(ctx, { entryAt = 'mt', tpR = 2, bias = 'off', validBars = 24, minStop = 4, maxStop = 30, costPips = 1, kzOnly = true } = {}) {
  const I = ictPrep(ctx), { n, O, H, L, C } = ctx;
  const trades = [];
  let swH = NaN, swL = NaN, busyUntil = -1;
  const inKZ = (ny) => (ny >= 120 && ny < 300) || (ny >= 420 && ny < 600);
  for (let i = 2; i < n; i++) {
    if (i > busyUntil && (!kzOnly || inKZ(ctx.nyMin[i]))) {
      for (const dir of [1, -1]) {
        const lvl = dir === 1 ? swH : swL;
        if (Number.isNaN(lvl)) continue;
        const brk = dir === 1 ? C[i] > lvl && C[i - 1] <= lvl : C[i] < lvl && C[i - 1] >= lvl;
        const fvg = dir === 1 ? L[i] > H[i - 2] : H[i] < L[i - 2];
        if (!brk || !fvg || !okBias(bias, biasOf(I, bias, i), dir)) continue;
        let ob = -1; for (let k = i - 1; k >= Math.max(0, i - 10); k--) { if (dir === 1 ? C[k] < O[k] : C[k] > O[k]) { ob = k; break; } }
        if (ob < 0) continue;
        const entry = entryAt === 'mt' ? (O[ob] + C[ob]) / 2 : (dir === 1 ? H[ob] : L[ob]);
        const sl = dir === 1 ? L[ob] - PIP : H[ob] + PIP, risk = Math.abs(entry - sl), rp = risk / PIP;
        if (rp < minStop || rp > maxStop) continue;
        const tr = execute(ctx, i, { dir, entry, sl, tp: entry + dir * tpR * risk, validUntilT: ctx.t[i] + validBars * 5, exitT: ctx.t[i] + validBars * 5 + 240, costPips });
        if (tr) { trades.push(tr); busyUntil = i + validBars; }
        break;
      }
    }
    if (!Number.isNaN(I.ph[i])) swH = I.ph[i];
    if (!Number.isNaN(I.pl[i])) swL = I.pl[i];
  }
  return trades;
}

// ---------- Silver Bullet v2 (as described in common write-ups) ----------
// First FVG in the daily-bias direction inside the window; limit at the gap edge; stop beyond the manipulation swing
// (the window's extreme before the gap); target 20 pips or 2R; flat one hour after the window.
export const SB_WIN = { LO: [180, 240], AM: [600, 660], PM: [840, 900] };
export function modelSB2(ctx, { win = 'AM', bias = 'struct', target = '20p', minStop = 4, maxStop = 30, costPips = 1 } = {}) {
  const I = ictPrep(ctx), { n, H, L } = ctx;
  const [ws, we] = SB_WIN[win];
  const trades = [];
  let i = 0;
  while (i < n) {
    if (!(ctx.nyMin[i] >= ws && ctx.nyMin[i] < we)) { i++; continue; }
    const dk = ctx.dayIdx[i], b = bias === 'off' ? 0 : biasOf(I, bias, i);
    let lo = Infinity, hi = -Infinity, done = false, j = i;
    for (; j < n && ctx.dayIdx[j] === dk && ctx.nyMin[j] >= ws && ctx.nyMin[j] < we; j++) {
      if (!done && j - i >= 2) {
        const bull = L[j] > H[j - 2] && (b === 1 || b === 0), bear = H[j] < L[j - 2] && (b === -1 || b === 0);
        const dir = bull ? 1 : bear ? -1 : 0;
        if (dir !== 0) {
          done = true;
          const entry = dir === 1 ? L[j] : H[j];
          const sl = dir === 1 ? Math.min(lo, L[j - 2], L[j - 1]) - PIP : Math.max(hi, H[j - 2], H[j - 1]) + PIP;
          const risk = Math.abs(entry - sl), rp = risk / PIP;
          if (rp >= minStop && rp <= maxStop) {
            const tp = target === '20p' ? entry + dir * 20 * PIP : entry + dir * 2 * risk;
            const tr = execute(ctx, j, { dir, entry, sl, tp, validUntilT: nyTimeToT(ctx, j, we), exitT: nyTimeToT(ctx, j, we + 60), costPips });
            if (tr) trades.push(tr);
          }
        }
      }
      lo = Math.min(lo, L[j]); hi = Math.max(hi, H[j]);
    }
    i = j + 1;
  }
  return trades;
}
