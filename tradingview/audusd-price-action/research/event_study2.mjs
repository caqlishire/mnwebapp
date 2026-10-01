// Direction-neutral event drift: spikes, previous-week levels, weekend gaps. IS and VAL.
import { ctxFor, SPLITS } from './research.mjs';
import { aggregate } from './data.mjs';
import { GE, GT, LE, LT } from './engine.mjs';
const pip = 0.0001;
const inP = (tm, P) => tm >= SPLITS[P][0] && tm < SPLITS[P][1];
function report(title, ctx, ev, HZ, unit) {
  console.log(`\n${title}  (mean move in event direction, pips; t-stat)`);
  for (const P of ['IS', 'VAL']) {
    const E = ev.filter((e) => inP(ctx.t[e.i], P));
    const cols = HZ.map((h) => { let s = 0, s2 = 0, m = 0; for (const { i, dir } of E) { if (i + h >= ctx.n) continue; const r = dir * (ctx.C[i + h] - ctx.C[i]) / pip; s += r; s2 += r * r; m++; } const mu = s / m, sd = Math.sqrt((s2 - m * mu * mu) / (m - 1)); return `${h * unit}m ${mu.toFixed(2).padStart(6)} (${(mu / (sd / Math.sqrt(m))).toFixed(1).padStart(4)})`; });
    console.log(`  ${P.padEnd(4)} n=${String(E.length).padStart(5)} up/down ${E.filter((e) => e.dir === 1).length}/${E.filter((e) => e.dir === -1).length}  `, cols.join('   '));
  }
}
// 1) spikes: bar range >= k x median range of the previous 96 bars, direction = candle direction
for (const tf of [5, 15]) {
  const ctx = ctxFor(tf);
  const { n, O, H, L, C } = ctx;
  for (const k of [3, 5]) {
    const ev = []; const win = [];
    for (let i = 0; i < n - 300; i++) {
      const r = H[i] - L[i];
      if (win.length === 96) { const med = [...win].sort((a, b) => a - b)[48]; if (med > 0 && r >= k * med && Math.abs(C[i] - O[i]) > 0.5 * r) ev.push({ i, dir: Math.sign(C[i] - O[i]) }); win.shift(); }
      win.push(r);
    }
    report(`SPIKE M${tf}: range >= ${k}x median of last 96 bars, body > half range; + = continuation`, ctx, ev, tf === 5 ? [1, 3, 12, 48, 288] : [1, 4, 16, 96], tf);
  }
}
// 2) previous-week high/low on H1: sweep (wick beyond >= 2 pips, close back inside) and breakout (close beyond)
{
  const ctx = ctxFor(60), W = aggregate(ctx.m1, 'W');
  let wk = 0; const sweep = [], brk = [];
  const doneS = new Set(), doneB = new Set(), doneBU = new Set(), doneBD = new Set();
  for (let i = 1; i < ctx.n; i++) {
    while (wk + 1 < W.n && W.t[wk + 1] <= ctx.t[i]) wk++;
    if (wk < 1) continue;
    const pwh = W.h[wk - 1] / 1e5, pwl = W.l[wk - 1] / 1e5;
    if (GE(ctx.H[i] - pwh, 2 * pip) && LT(ctx.C[i], pwh) && !doneS.has(wk)) { sweep.push({ i, dir: -1 }); doneS.add(wk); }
    if (GE(pwl - ctx.L[i], 2 * pip) && GT(ctx.C[i], pwl) && !doneB.has(wk)) { sweep.push({ i, dir: 1 }); doneB.add(wk); }
    if (GT(ctx.C[i], pwh) && LE(ctx.C[i - 1], pwh) && !doneBU.has(wk)) { brk.push({ i, dir: 1 }); doneBU.add(wk); }
    if (LT(ctx.C[i], pwl) && GE(ctx.C[i - 1], pwl) && !doneBD.has(wk)) { brk.push({ i, dir: -1 }); doneBD.add(wk); }
  }
  report('PREV-WEEK sweep (first per side per week), + = reversal works', ctx, sweep, [4, 24, 72, 120], 60);
  report('PREV-WEEK breakout close (first per side per week), + = continuation', ctx, brk, [4, 24, 72, 120], 60);
}
// 3) weekend gap: first bar of the week vs previous Friday close, |gap| >= 10 pips, direction = fade (towards the close)
{
  const ctx = ctxFor(15); const ev = [];
  for (let i = 1; i < ctx.n; i++) {
    if (ctx.t[i] - ctx.t[i - 1] < 24 * 60) continue; // weekend break
    const gap = ctx.O[i] - ctx.C[i - 1];
    if (Math.abs(gap) >= 10 * pip) ev.push({ i: i - 0, dir: -Math.sign(gap), gap: gap / pip });
  }
  // measure from the OPEN of the first bar (fade entry at the open): shift by using previous close as reference is wrong; adjust
  console.log(`\nWEEKEND GAP >= 10 pips: ${ev.length} weeks. Fill = price trades back to Friday's close.`);
  for (const P of ['IS', 'VAL']) {
    const E = ev.filter((e) => inP(ctx.t[e.i], P));
    let fill24 = 0, fill120 = 0, mv = [];
    for (const e of E) {
      const target = ctx.C[e.i - 1];
      let f = -1; for (let j = e.i; j < Math.min(ctx.n, e.i + 480); j++) { if (e.dir === -1 ? ctx.L[j] <= target : ctx.H[j] >= target) { f = j - e.i; break; } }
      if (f >= 0 && f < 96) fill24++; if (f >= 0 && f < 480) fill120++;
      mv.push(e.dir * (ctx.C[Math.min(ctx.n - 1, e.i + 96)] - ctx.O[e.i]) / pip);
    }
    const mu = mv.reduce((a, b) => a + b, 0) / mv.length;
    console.log(`  ${P}: weeks ${E.length}, avg |gap| ${(E.reduce((a, e) => a + Math.abs(e.gap), 0) / E.length).toFixed(1)} pips, filled within 24h ${(100 * fill24 / E.length).toFixed(0)}%, within 5 days ${(100 * fill120 / E.length).toFixed(0)}%, mean 24h move in fade direction from the open ${mu.toFixed(1)} pips (before the wide Sunday spread)`);
  }
}
