// Break-and-retest scalper: fast bar-close engine (pure price action), minute-resolved exits.
// Short: a support level breaks (close >= breakBuf below), price moves >= minAway further, then within
// maxRetest bars a candle trades back up to the level (high within retestTol) and closes back below it
// -> sell at that close, stop above the retest high, target = tpR x risk. Longs mirrored.
import { pivotHigh, pivotLow, trendSeries, biasTFfor, resolveM1, GE, GT, LE, LT } from './engine.mjs';

export const BNR_DEFAULTS = {
  levels: 'swing',       // 'swing' | 'pd' | 'swing+pd'
  swingLen: 5, maxAge: 200,
  breakBuf: 1.0, strongBreak: false,  // strong = break candle closes in its outer 30% with a body >= half its range
  minAway: 3.0, retestTol: 1.0, maxRetest: 12, reclaimBuf: 1.0,
  rejectRetest: false,   // retest candle must close in the far half of its range
  slBuf: 1.0, minStop: 4, maxStop: 20, tpR: 1.5,
  entryWin: [420, 960], holdWin: [420, 1020], // London minutes: entries 07:00-16:00, flat by 17:00
  trend: 'off',          // 'off' | 'with' (trade only in the direction of the higher-timeframe structure)
  biasTFin: 'Auto', biasLen: 3,
  maxPerDay: 5, cooldown: 0, costPips: 1.0, exitMode: 'm1',
};

export function runBnR(ctx, params = {}) {
  const P = { ...BNR_DEFAULTS, ...params };
  const { n, H, L, C, O } = ctx;
  const pip = 0.00001 * 10;
  const tr = P.trend === 'off' ? null : trendSeries(ctx, biasTFfor(ctx.chartSec, P.biasTFin), P.biasLen, 'tv');
  const sup = [], res = [];           // active levels {p, b, kind}
  let broken = [];                    // {dir, lvl, bb, ext}
  let trDir = 0, trEntry = NaN, trSL = NaN, trTP = NaN, trRisk = NaN, trBar = 0, trMask = 0;
  let lastEntry = -1e9, tradesToday = 0;
  const trades = [];
  for (let i = 0; i < n; i++) {
    const high = H[i], low = L[i], close = C[i], open = O[i];
    const lm = ctx.lonMin[i];
    const entryOK = lm >= P.entryWin[0] && lm < P.entryWin[1], holdOK = lm >= P.holdWin[0] && lm < P.holdWin[1];
    if (ctx.newDayNY[i]) tradesToday = 0;
    // ---- manage open trade ----
    if (trDir !== 0 && i > trBar) {
      const hitSL = trDir === 1 ? LE(low, trSL) : GE(high, trSL);
      const hitTP = trDir === 1 ? GE(high, trTP) : LE(low, trTP);
      let px = NaN, kind = 0;
      let slFirst = hitSL;
      if (hitSL && hitTP && P.exitMode === 'm1') slFirst = resolveM1(ctx, i, trDir, trSL, trTP);
      if (hitSL && slFirst) { px = trSL; kind = -1; }
      else if (hitTP) { px = trTP; kind = 1; }
      else if (!holdOK) { px = close; kind = 2; }
      if (!Number.isNaN(px)) {
        const netR = (trDir * (px - trEntry) - P.costPips * pip) / trRisk;
        trades.push({ entryBar: trBar, exitBar: i, dir: trDir, kind, netR, risk: trRisk, mask: trMask, entry: trEntry });
        trDir = 0;
      }
    }
    const flat = trDir === 0;
    // ---- breaks of active levels (levels formed on earlier bars) ----
    for (let k = sup.length - 1; k >= 0; k--) {
      const s = sup[k];
      if (s.kind === 1 && i - s.b > P.maxAge) { sup.splice(k, 1); continue; }
      if (LE(close, s.p - P.breakBuf * pip)) {
        const rng = high - low;
        const strong = rng > 0 && (close - low) / rng <= 0.3 && Math.abs(close - open) >= 0.5 * rng;
        if (!P.strongBreak || strong) broken.push({ dir: -1, lvl: s.p, bb: i, ext: low, kind: s.kind });
        sup.splice(k, 1);
      }
    }
    for (let k = res.length - 1; k >= 0; k--) {
      const r = res[k];
      if (r.kind === 1 && i - r.b > P.maxAge) { res.splice(k, 1); continue; }
      if (GE(close, r.p + P.breakBuf * pip)) {
        const rng = high - low;
        const strong = rng > 0 && (high - close) / rng <= 0.3 && Math.abs(close - open) >= 0.5 * rng;
        if (!P.strongBreak || strong) broken.push({ dir: 1, lvl: r.p, bb: i, ext: high, kind: r.kind });
        res.splice(k, 1);
      }
    }
    // ---- retests of broken levels ----
    let sig = null;
    const keep = [];
    for (const b of broken) {
      if (b.bb === i) { keep.push(b); continue; }                      // the break bar itself
      if (i - b.bb > P.maxRetest) continue;                           // expired
      const away = b.dir === -1 ? (b.lvl - b.ext) / pip : (b.ext - b.lvl) / pip;
      if (b.dir === -1) {
        if (GE(close, b.lvl + P.reclaimBuf * pip)) continue;          // level reclaimed: break failed
        const touched = GE(high, b.lvl - P.retestTol * pip), held = LT(close, b.lvl);
        const rng = high - low, rej = !P.rejectRetest || (rng > 0 && (high - close) / rng >= 0.5);
        if (!sig && GE(away, P.minAway) && touched && held && rej) { sig = { dir: -1, lvl: b.lvl, kind: b.kind, sl: Math.max(high, b.lvl) + P.slBuf * pip }; continue; }
        b.ext = Math.min(b.ext, low);
      } else {
        if (LE(close, b.lvl - P.reclaimBuf * pip)) continue;
        const touched = LE(low, b.lvl + P.retestTol * pip), held = GT(close, b.lvl);
        const rng = high - low, rej = !P.rejectRetest || (rng > 0 && (close - low) / rng >= 0.5);
        if (!sig && GE(away, P.minAway) && touched && held && rej) { sig = { dir: 1, lvl: b.lvl, kind: b.kind, sl: Math.min(low, b.lvl) - P.slBuf * pip }; continue; }
        b.ext = Math.max(b.ext, high);
      }
      keep.push(b);
    }
    broken = keep.slice(-10);
    // ---- new levels (usable from the next bar) ----
    if (P.levels !== 'pd') {
      const ph = pivotHigh(H, i, P.swingLen, P.swingLen), pl = pivotLow(L, i, P.swingLen, P.swingLen);
      if (!Number.isNaN(ph)) { res.push({ p: ph, b: i - P.swingLen, kind: 1 }); if (res.length > 12) res.shift(); }
      if (!Number.isNaN(pl)) { sup.push({ p: pl, b: i - P.swingLen, kind: 1 }); if (sup.length > 12) sup.shift(); }
    }
    if (P.levels !== 'swing' && ctx.newDayNY[i] && !Number.isNaN(ctx.pdh[i])) {
      for (const arr of [sup, res]) for (let k = arr.length - 1; k >= 0; k--) if (arr[k].kind === 2) arr.splice(k, 1); // yesterday's levels expire
      res.push({ p: ctx.pdh[i], b: i, kind: 2 }); sup.push({ p: ctx.pdl[i], b: i, kind: 2 });
    }
    // ---- entry ----
    if (sig && flat && entryOK && tradesToday < P.maxPerDay && i - lastEntry >= P.cooldown && (!tr || tr[i] === sig.dir)) {
      const risk = Math.abs(close - sig.sl), rp = risk / pip;
      if (GE(rp, P.minStop) && LE(rp, P.maxStop)) {
        trDir = sig.dir; trEntry = close; trSL = sig.sl; trRisk = risk; trTP = close + sig.dir * P.tpR * risk; trBar = i; trMask = sig.kind;
        tradesToday++; lastEntry = i;
      }
    }
  }
  return trades;
}
