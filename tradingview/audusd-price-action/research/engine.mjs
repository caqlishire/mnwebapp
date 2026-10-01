// Fast re-implementation of the v2 Pine signal + simulation engine (one pass per closed bar).
// Every formula mirrors the Pine source so that results can be checked trade-for-trade against PineTS.
import { aggregate, bucketStart, localMinOfDay, makeLocator } from './data.mjs';

export const PIP = 0.00001 * 10; // Pine: syminfo.mintick * 10

export const DEFAULTS = {
  mode: 'Scalp', swingLen: 5, useSwing: true, usePDHL: true, useAsia: true, useRound: true, roundPips: 50,
  minConf: 1, minSweepP: 1.0, minReject: 0.6, maxAge: 200,
  entryMode: 'Confirmed', confirmBars: 3, slBuffer: 1.0, flatEOD: true,
  useBias: true, biasTFin: 'Auto', biasLen: 3,
  entryWin: [420, 930], holdWin: [420, 1020], tradeTZ: 'Europe/London', asiaWin: [540, 960],
  maxPerDay: 3, maxLossesDay: 2, cooldown: 6, costPips: 1.0,
  cMinStop: 6, cMaxStop: 25, cTpR: 1.5, cBeR: 1.0, cSess: true,
  dayRoll: 'ny17',     // 'ny17' = TradingView FX day (17:00 New York); 'utc' = PineTS timeframe.change("D")
  exitMode: 'slfirst', // 'slfirst' = indicator dashboard; 'm1' = same-bar stop/target order resolved with minute data
  trendMode: 'tv',     // 'tv' = previous completed HTF bar (TradingView); 'pinets' = PineTS bug: current HTF bar's final state
};

const EPS = 1e-10;
const GE = (a, b) => Math.abs(a - b) < EPS ? true : a > b;
const GT = (a, b) => Math.abs(a - b) < EPS ? false : a > b;
const LE = (a, b) => Math.abs(a - b) < EPS ? true : a < b;
const LT = (a, b) => Math.abs(a - b) < EPS ? false : a < b;
export { GE, GT, LE, LT };

const TF_SEC = { 1: 60, 5: 300, 15: 900, 30: 1800, 60: 3600, 240: 14400, D: 86400, W: 604800 };

export function pivotHigh(H, n, left, right) {
  if (n < left + right) return NaN;
  const a = H[n - right];
  for (let o = 1; o <= left; o++) if (H[n - right - o] > a) return NaN;
  for (let o = 1; o <= right; o++) if (H[n - right + o] >= a) return NaN;
  return a;
}
export function pivotLow(L, n, left, right) {
  if (n < left + right) return NaN;
  const a = L[n - right];
  for (let o = 1; o <= left; o++) if (L[n - right - o] < a) return NaN;
  for (let o = 1; o <= right; o++) if (L[n - right + o] <= a) return NaN;
  return a;
}

export function structureStates(H, L, C, len) {
  const n = H.length, st = new Int8Array(n);
  let lastH = NaN, lastL = NaN, state = 0;
  for (let j = 0; j < n; j++) {
    const sH = pivotHigh(H, j, len, len), sL = pivotLow(L, j, len, len);
    if (!Number.isNaN(sH)) lastH = sH;
    if (!Number.isNaN(sL)) lastL = sL;
    if (!Number.isNaN(lastH) && GT(C[j], lastH)) { state = 1; lastH = NaN; }
    if (!Number.isNaN(lastL) && LT(C[j], lastL)) { state = -1; lastL = NaN; }
    st[j] = state;
  }
  return st;
}

const toF = (a) => { const f = new Float64Array(a.length); for (let i = 0; i < a.length; i++) f[i] = a[i] / 1e5; return f; };

// Everything that depends only on the data and the chart timeframe (reused across parameter sets).
export function prepare(m1, tf) {
  const b = aggregate(m1, tf);
  const ctx = { m1, tf, chartSec: TF_SEC[tf], n: b.n, t: b.t, m1First: b.m1First, m1Last: b.m1Last,
    O: toF(b.o), H: toF(b.h), L: toF(b.l), C: toF(b.c), htf: {}, trendCache: {}, sessCache: {} };
  ctx.m1H = toF(m1.h); ctx.m1L = toF(m1.l);
  // previous FX-day high / low (request.security "D", high[1], lookahead_on)
  const D = aggregate(m1, 'D');
  ctx.D = D;
  const locD = makeLocator(D);
  ctx.pdh = new Float64Array(b.n); ctx.pdl = new Float64Array(b.n); ctx.dayIdx = new Int32Array(b.n);
  for (let i = 0; i < b.n; i++) {
    const k = locD(b.t[i]);
    ctx.dayIdx[i] = k;
    ctx.pdh[i] = k >= 1 ? D.h[k - 1] / 1e5 : NaN;
    ctx.pdl[i] = k >= 1 ? D.l[k - 1] / 1e5 : NaN;
  }
  ctx.newDayNY = new Uint8Array(b.n); ctx.newDayUTC = new Uint8Array(b.n);
  for (let i = 1; i < b.n; i++) {
    ctx.newDayNY[i] = ctx.dayIdx[i] !== ctx.dayIdx[i - 1] ? 1 : 0;
    ctx.newDayUTC[i] = Math.floor(b.t[i] / 1440) !== Math.floor(b.t[i - 1] / 1440) ? 1 : 0;
  }
  ctx.lonMin = new Int16Array(b.n); ctx.tkyMin = new Int16Array(b.n); ctx.nyMin = new Int16Array(b.n);
  for (let i = 0; i < b.n; i++) {
    ctx.lonMin[i] = localMinOfDay('Europe/London', b.t[i]);
    ctx.tkyMin[i] = localMinOfDay('Asia/Tokyo', b.t[i]);
    ctx.nyMin[i] = localMinOfDay('America/New_York', b.t[i]);
  }
  return ctx;
}

export function biasTFfor(chartSec, biasTFin) {
  if (biasTFin !== 'Auto') return biasTFin;
  return chartSec < 900 ? 60 : chartSec < 3600 ? 240 : chartSec < 14400 ? 'D' : 'W';
}

export function trendSeries(ctx, biasTF, biasLen, mode = 'tv') {
  const key = `${biasTF}|${biasLen}|${mode}`;
  if (ctx.trendCache[key]) return ctx.trendCache[key];
  const tr = new Int8Array(ctx.n);
  if (TF_SEC[biasTF] > ctx.chartSec) {
    const H = (ctx.htf[biasTF] ||= aggregate(ctx.m1, biasTF));
    const st = structureStates(toF(H.h), toF(H.l), toF(H.c), biasLen);
    const loc = makeLocator(H);
    const sh = mode === 'pinets' ? 0 : 1;
    for (let i = 0; i < ctx.n; i++) { const k = loc(ctx.t[i]); tr[i] = k >= sh ? st[k - sh] : 0; }
  } else {
    tr.set(structureStates(ctx.H, ctx.L, ctx.C, biasLen));
  }
  ctx.trendCache[key] = tr;
  return tr;
}

const inWin = (m, w) => m >= w[0] && m < w[1];

export function run(ctx, params = {}) {
  const P = { ...DEFAULTS, ...params };
  const { n, O, H, L, C, chartSec } = ctx;
  const minStopPips = P.mode === 'Scalp' ? 6.0 : P.mode === 'Swing' ? 15.0 : P.cMinStop;
  const maxStopPips = P.mode === 'Scalp' ? 25.0 : P.mode === 'Swing' ? 80.0 : P.cMaxStop;
  const tpR = P.mode === 'Scalp' ? 1.5 : P.mode === 'Swing' ? 2.0 : P.cTpR;
  const beR = P.mode === 'Scalp' ? 1.0 : P.mode === 'Swing' ? 1.0 : P.cBeR;
  const useSession = P.mode === 'Scalp' ? true : P.mode === 'Swing' ? false : P.cSess;

  const pip = PIP, minSweep = P.minSweepP * pip, buf = P.slBuffer * pip, rStep = P.roundPips * pip;
  const dailyOK = chartSec < 86400;
  const biasTF = biasTFfor(chartSec, P.biasTFin);
  const trend = trendSeries(ctx, biasTF, P.biasLen, P.trendMode);
  const newDay = P.dayRoll === 'utc' ? ctx.newDayUTC : ctx.newDayNY;
  const sessMin = P.tradeTZ === 'Europe/London' ? ctx.lonMin : P.tradeTZ === 'America/New_York' ? ctx.nyMin : P.tradeTZ === 'Asia/Tokyo' ? ctx.tkyMin : null;
  if (!sessMin) throw new Error('unsupported tradeTZ ' + P.tradeTZ);

  // state
  const shP = [], shB = [], slP = [], slB = [];
  let pendDir = 0, pendTrig = NaN, pendSL = NaN, pendBar = 0, pendMask = 0;
  let lastEntryBar = -100000, tradesToday = 0, lossesToday = 0;
  let trDir = 0, trEntry = NaN, trSL = NaN, trSL0 = NaN, trTP = NaN, trRisk = NaN, trBE = false, trBar = 0, trMask = 0, trSweepBar = 0;
  let asiaHi = NaN, asiaLo = NaN, asiaHiPrev = NaN, asiaLoPrev = NaN, prevInAsia = false;
  const trades = [];

  for (let i = 0; i < n; i++) {
    const high = H[i], low = L[i], close = C[i];
    const entryRaw = inWin(sessMin[i], P.entryWin), holdRaw = inWin(sessMin[i], P.holdWin);
    const asiaRaw = inWin(ctx.tkyMin[i], P.asiaWin);
    const sessOK = !useSession || chartSec >= 14400 || entryRaw;
    const holdOK = !useSession || chartSec >= 14400 || holdRaw;
    const inAsia = P.useAsia && chartSec < 14400 && asiaRaw;

    if (inAsia) {
      if (!prevInAsia) { asiaHi = high; asiaLo = low; asiaHiPrev = NaN; asiaLoPrev = NaN; }
      else { asiaHi = Math.max(asiaHi, high); asiaLo = Math.min(asiaLo, low); }
    } else if (prevInAsia) { asiaHiPrev = asiaHi; asiaLoPrev = asiaLo; }
    prevInAsia = inAsia;

    const pdh = ctx.pdh[i], pdl = ctx.pdl[i];
    const ph = pivotHigh(H, i, P.swingLen, P.swingLen), pl = pivotLow(L, i, P.swingLen, P.swingLen);
    const tr = trend[i];

    if (newDay[i]) { tradesToday = 0; lossesToday = 0; }

    // ---- simulated trade management ----
    if (trDir !== 0 && i > trBar) {
      const hitSL = trDir === 1 ? LE(low, trSL) : GE(high, trSL);
      const hitTP = trDir === 1 ? GE(high, trTP) : LE(low, trTP);
      const eodOut = P.flatEOD && !holdOK;
      let exitPx = NaN, exitKind = 99;
      let slFirst = hitSL;
      if (hitSL && hitTP && P.exitMode === 'm1') slFirst = resolveM1(ctx, i, trDir, trSL, trTP);
      if (hitSL && slFirst) { exitPx = trSL; exitKind = trBE ? 0 : -1; }
      else if (hitTP) { exitPx = trTP; exitKind = 1; }
      else if (eodOut) { exitPx = close; exitKind = 2; }
      if (!Number.isNaN(exitPx)) {
        const grossR = trDir * (exitPx - trEntry) / trRisk;
        const netR = grossR - P.costPips * pip / trRisk;
        if (LE(netR, -0.5)) lossesToday += 1;
        trades.push({ entryBar: trBar, sweepBar: trSweepBar, dir: trDir, entry: trEntry, sl0: trSL0, risk: trRisk, tp: trTP, exitBar: i, kind: exitKind, exitPx, grossR, netR, mask: trMask, trend: trend[trBar] });
        trDir = 0;
      } else {
        const beHit = GT(beR, 0) && !trBE && (trDir === 1 ? GE(high, trEntry + beR * trRisk) : LE(low, trEntry - beR * trRisk));
        if (beHit) { trBE = true; trSL = trEntry; }
      }
    }
    const flat = trDir === 0;

    // ---- 1) liquidity sweep scan ----
    let swS = false, swB = false, lvS = NaN, lvB = NaN;
    for (let k = 0, nH = shP.length; k < nH; k++) {
      const j = nH - 1 - k, lvH = shP[j], lbH = shB[j];
      if (i - lbH > P.maxAge) { shP.splice(j, 1); shB.splice(j, 1); }
      else if (GT(high, lvH)) {
        if (LT(close, lvH) && GE(high - lvH, minSweep)) { swS = true; if (Number.isNaN(lvS) || GT(lvH, lvS)) lvS = lvH; shP.splice(j, 1); shB.splice(j, 1); }
        else if (GE(close, lvH)) { shP.splice(j, 1); shB.splice(j, 1); }
      }
    }
    for (let k = 0, nL = slP.length; k < nL; k++) {
      const j = nL - 1 - k, lvL = slP[j], lbL = slB[j];
      if (i - lbL > P.maxAge) { slP.splice(j, 1); slB.splice(j, 1); }
      else if (LT(low, lvL)) {
        if (GT(close, lvL) && GE(lvL - low, minSweep)) { swB = true; if (Number.isNaN(lvB) || LT(lvL, lvB)) lvB = lvL; slP.splice(j, 1); slB.splice(j, 1); }
        else if (LE(close, lvL)) { slP.splice(j, 1); slB.splice(j, 1); }
      }
    }
    if (!Number.isNaN(ph)) { shP.unshift(ph); shB.unshift(i - P.swingLen); if (shP.length > 12) { shP.pop(); shB.pop(); } }
    if (!Number.isNaN(pl)) { slP.unshift(pl); slB.unshift(i - P.swingLen); if (slP.length > 12) { slP.pop(); slB.pop(); } }

    const rUp = Math.floor(high / rStep + 0.000000001) * rStep;
    const rDn = Math.ceil(low / rStep - 0.000000001) * rStep;
    const tSwS = P.useSwing && swS, tSwB = P.useSwing && swB;
    const tPdS = P.usePDHL && dailyOK && !Number.isNaN(pdh) && GE(high - pdh, minSweep) && LT(close, pdh);
    const tPdB = P.usePDHL && dailyOK && !Number.isNaN(pdl) && GE(pdl - low, minSweep) && GT(close, pdl);
    const tAsS = P.useAsia && !inAsia && !Number.isNaN(asiaHiPrev) && GE(high - asiaHiPrev, minSweep) && LT(close, asiaHiPrev);
    const tAsB = P.useAsia && !inAsia && !Number.isNaN(asiaLoPrev) && GE(asiaLoPrev - low, minSweep) && GT(close, asiaLoPrev);
    const tRnS = P.useRound && GE(high - rUp, minSweep) && LT(close, rUp);
    const tRnB = P.useRound && GE(rDn - low, minSweep) && GT(close, rDn);
    const confS = (tSwS ? 1 : 0) + (tPdS ? 1 : 0) + (tAsS ? 1 : 0) + (tRnS ? 1 : 0);
    const confB = (tSwB ? 1 : 0) + (tPdB ? 1 : 0) + (tAsB ? 1 : 0) + (tRnB ? 1 : 0);
    const rng = high - low;
    const rejS = GT(rng, 0) && GE((high - close) / rng, P.minReject);
    const rejB = GT(rng, 0) && GE((close - low) / rng, P.minReject);

    // ---- 2) pending setup ----
    let eDir = 0, eSL = NaN, eMask = 0, eSweepBar = 0;
    if (pendDir !== 0 && i > pendBar) {
      if (i - pendBar > P.confirmBars) pendDir = 0;
      else if ((pendDir === 1 && LE(low, pendSL)) || (pendDir === -1 && GE(high, pendSL))) pendDir = 0;
      else if ((pendDir === 1 && GT(close, pendTrig)) || (pendDir === -1 && LT(close, pendTrig))) { eDir = pendDir; eSL = pendSL; eMask = pendMask; eSweepBar = pendBar; pendDir = 0; }
    }

    // ---- 3) new sweep-and-reject candle ----
    let newDir = 0;
    if (confS >= P.minConf && rejS) newDir = -1;
    else if (confB >= P.minConf && rejB) newDir = 1;
    if (newDir !== 0 && (!P.useBias || tr === newDir) && flat && eDir === 0) {
      const exS = newDir === -1 ? high + buf : low - buf;
      const mask = newDir === -1 ? (tSwS ? 1 : 0) | (tPdS ? 2 : 0) | (tAsS ? 4 : 0) | (tRnS ? 8 : 0) : (tSwB ? 1 : 0) | (tPdB ? 2 : 0) | (tAsB ? 4 : 0) | (tRnB ? 8 : 0);
      if (P.entryMode === 'Immediate') { eDir = newDir; eSL = exS; eMask = mask; eSweepBar = i; }
      else { pendDir = newDir; pendTrig = newDir === -1 ? low : high; pendSL = exS; pendBar = i; pendMask = mask; }
    }

    // ---- 4) accept or reject the entry ----
    if (eDir !== 0) {
      const ePx = close, riskD = Math.abs(ePx - eSL), riskP = riskD / pip;
      const okBias = !P.useBias || tr === eDir;
      const okRisk = GE(riskP, minStopPips) && LE(riskP, maxStopPips);
      const okDay = tradesToday < P.maxPerDay && (P.maxLossesDay === 0 || lossesToday < P.maxLossesDay);
      if (okBias && okRisk && okDay && sessOK && flat && i - lastEntryBar >= P.cooldown) {
        trDir = eDir; trEntry = ePx; trSL = eSL; trSL0 = eSL; trTP = ePx + eDir * tpR * riskD; trRisk = Math.abs(ePx - eSL);
        trBE = false; trBar = i; trMask = eMask; trSweepBar = eSweepBar;
        tradesToday += 1; lastEntryBar = i;
      }
    }
    if (P.trace) P.trace(i, { tr, flat, pendDir, pendTrig, pendSL, pendBar, eDir, eSL, newDir, confS, confB, rejS, rejB, tSwS, tSwB, tPdS, tPdB, tAsS, tAsB, tRnS, tRnB, tradesToday, lossesToday, trDir, sessOK, nSH: shP.length, nSL: slP.length, shP: shP.slice(0, 4), slP: slP.slice(0, 4), asiaLoPrev, asiaHiPrev });
  }
  return { trades, open: trDir !== 0 ? { entryBar: trBar, dir: trDir } : null, params: P, tpR, beR };
}

// true if the stop is reached before the target inside chart bar i (minute data; a minute touching both counts as stop)
export function resolveM1(ctx, i, dir, sl, tp) {
  const { m1H, m1L } = ctx;
  for (let j = ctx.m1First[i]; j <= ctx.m1Last[i]; j++) {
    const s = dir === 1 ? LE(m1L[j], sl) : GE(m1H[j], sl);
    const t = dir === 1 ? GE(m1H[j], tp) : LE(m1L[j], tp);
    if (s) return true;
    if (t) return false;
  }
  return true;
}

export function stats(trades, years = null) {
  const rs = trades.map((t) => t.netR);
  const n = rs.length;
  if (!n) return { n: 0 };
  let cum = 0, pk = 0, dd = 0, gp = 0, gl = 0, s2 = 0, wins = 0;
  for (const r of rs) { cum += r; s2 += r * r; if (r > 0) gp += r; else gl -= r; pk = Math.max(pk, cum); dd = Math.max(dd, pk - cum); }
  for (const t of trades) if (t.kind === 1 || (t.kind === 2 && t.netR > 0)) wins++;
  const mean = cum / n, sd = n > 1 ? Math.sqrt(Math.max(0, (s2 - n * mean * mean) / (n - 1))) : NaN, se = sd / Math.sqrt(n);
  const out = { n, win: +(100 * wins / n).toFixed(1), avgR: +mean.toFixed(3), lo: +(mean - 1.96 * se).toFixed(3), hi: +(mean + 1.96 * se).toFixed(3), netR: +cum.toFixed(1), pf: gl > 0 ? +(gp / gl).toFixed(2) : Infinity, maxDD: +dd.toFixed(1) };
  if (years) out.perYear = +(n / years).toFixed(0);
  return out;
}
