// Previous-day high/low failure: trade simulation on M15 with stops, several exits. IS and VAL only.
import { ctxFor, SPLITS } from './research.mjs';
import { GE, GT, LE, LT, stats } from './engine.mjs';
const ctx = ctxFor(15);
const { n, H, L, C, t } = ctx;
const pip = 0.0001, cost = 1.0 * pip;
// trigger: 'sweep' = wick >= 1 pip beyond PDH/PDL and close back inside (any close location)
//          'sweepRej' = same + close in far 40% of the bar (v2 rejection)
//          'reentry' = first close back inside after an earlier close beyond the level today
function events(trigger) {
  const ev = [];
  let day = -1, doneS = false, doneB = false, closedAbove = false, closedBelow = false, dayHi = -Infinity, dayLo = Infinity;
  for (let i = 1; i < n; i++) {
    if (ctx.dayIdx[i] !== day) { day = ctx.dayIdx[i]; doneS = doneB = closedAbove = closedBelow = false; dayHi = -Infinity; dayLo = Infinity; }
    dayHi = Math.max(dayHi, H[i]); dayLo = Math.min(dayLo, L[i]);
    const pdh = ctx.pdh[i], pdl = ctx.pdl[i];
    if (Number.isNaN(pdh)) continue;
    const rng = H[i] - L[i];
    let s = false, b = false;
    if (trigger === 'reentry') {
      s = closedAbove && LT(C[i], pdh); b = closedBelow && GT(C[i], pdl);
    } else {
      s = GE(H[i] - pdh, pip) && LT(C[i], pdh); b = GE(pdl - L[i], pip) && GT(C[i], pdl);
      if (trigger === 'sweepRej') { s = s && rng > 0 && (H[i] - C[i]) / rng >= 0.6; b = b && rng > 0 && (C[i] - L[i]) / rng >= 0.6; }
    }
    if (s && !doneS) { ev.push({ i, dir: -1, ext: dayHi }); doneS = true; }
    if (b && !doneB) { ev.push({ i, dir: 1, ext: dayLo }); doneB = true; }
    if (GT(C[i], pdh)) closedAbove = true;
    if (LT(C[i], pdl)) closedBelow = true;
  }
  return ev;
}
// one trade per event (overlap allowed in this study); stop beyond the day's extreme so far + 1 pip
function simulate(ev, { tpR = 2, maxBars = 96, minStop = 8, maxStop = 60, stopAt = 'dayExt', target = 'R' }) {
  const out = [];
  for (const e of ev) {
    const i = e.i, entry = C[i];
    const ext = stopAt === 'dayExt' ? e.ext : (e.dir === -1 ? H[i] : L[i]);
    const sl = e.dir === -1 ? ext + pip : ext - pip;
    const risk = Math.abs(entry - sl);
    if (risk / pip < minStop || risk / pip > maxStop) continue;
    const tp = target === 'R' ? entry + e.dir * tpR * risk : target === 'opp' ? (e.dir === -1 ? ctx.pdl[i] : ctx.pdh[i]) : target === 'mid' ? (ctx.pdh[i] + ctx.pdl[i]) / 2 : NaN;
    if (!Number.isNaN(tp) && (e.dir === -1 ? tp >= entry : tp <= entry)) continue; // target already passed
    let exitPx = NaN, kind = 2, j = i + 1;
    for (; j < Math.min(n, i + 1 + maxBars); j++) {
      const hs = e.dir === -1 ? GE(H[j], sl) : LE(L[j], sl), ht = !Number.isNaN(tp) && (e.dir === -1 ? LE(L[j], tp) : GE(H[j], tp));
      if (hs) { exitPx = sl; kind = -1; break; }
      if (ht) { exitPx = tp; kind = 1; break; }
    }
    if (Number.isNaN(exitPx)) { j = Math.min(n - 1, i + maxBars); exitPx = C[j]; }
    const netR = (e.dir * (exitPx - entry) - cost) / risk;
    out.push({ entryBar: i, exitBar: j, dir: e.dir, kind, netR, risk, pips: (e.dir * (exitPx - entry) - cost) / pip });
  }
  return out;
}
const per = (tr, P) => tr.filter((x) => t[x.entryBar] >= SPLITS[P][0] && t[x.entryBar] < SPLITS[P][1]);
const f = (s) => s.n ? `n=${String(s.n).padStart(4)} avgR ${(s.avgR >= 0 ? '+' : '') + s.avgR.toFixed(3)} [${s.lo.toFixed(2)},${s.hi.toFixed(2)}] PF ${String(s.pf).padStart(4)} DD ${String(s.maxDD).padStart(5)}` : 'n=0';
const avgPips = (tr) => (tr.reduce((a, x) => a + x.pips, 0) / tr.length).toFixed(2);
for (const trig of ['sweep', 'sweepRej', 'reentry']) {
  const ev = events(trig);
  console.log(`\n=== trigger ${trig}: ${ev.length} events (first per side per FX day)`);
  for (const cfg of [
    { tpR: 1, maxBars: 96 }, { tpR: 1.5, maxBars: 96 }, { tpR: 2, maxBars: 96 }, { tpR: 3, maxBars: 96 },
    { target: 'none', maxBars: 32 }, { target: 'none', maxBars: 96 }, { target: 'mid', maxBars: 96 }, { target: 'opp', maxBars: 192 },
  ]) {
    const tr = simulate(ev, cfg);
    const a = per(tr, 'IS'), b = per(tr, 'VAL');
    const sb = (x, d) => stats(x.filter((y) => y.dir === d));
    console.log(`${JSON.stringify(cfg).padEnd(30)} IS ${f(stats(a))} pips ${avgPips(a).padStart(5)} | VAL ${f(stats(b))} pips ${avgPips(b).padStart(5)} | buys/sells avgR IS ${sb(a, 1).avgR}/${sb(a, -1).avgR} VAL ${sb(b, 1).avgR}/${sb(b, -1).avgR}`);
  }
}
