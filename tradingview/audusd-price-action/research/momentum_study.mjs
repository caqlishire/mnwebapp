// Time-series momentum on FX days and intraday session predictability. IS (2005-2012) and VAL (2013-2016).
import { ctxFor, SPLITS } from './research.mjs';
const ctx = ctxFor(15);
const D = ctx.D, pip = 0.0001;
const dc = Array.from(D.c, (v) => v / 1e5), dt = Array.from(D.t);
const inP = (tm, P) => tm >= SPLITS[P][0] && tm < SPLITS[P][1];
console.log('Time-series momentum on daily closes: mean of sign(past N-day move) x next M-day move, pips (t-stat)');
console.log('N\\M'.padEnd(6), ...[1, 5, 20].flatMap((M) => [`IS M=${M}`.padStart(16), `VAL M=${M}`.padStart(16)]));
for (const N of [5, 10, 20, 60, 120, 250]) {
  const cells = [];
  for (const M of [1, 5, 20]) for (const P of ['IS', 'VAL']) {
    const xs = [];
    for (let k = N; k + M < dc.length; k += M) { if (!inP(dt[k], P)) continue; xs.push(Math.sign(dc[k] - dc[k - N]) * (dc[k + M] - dc[k]) / pip); }
    const m = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
    cells.push(`${m.toFixed(1).padStart(6)} (${(m / (sd / Math.sqrt(xs.length))).toFixed(1).padStart(4)})`.padStart(16));
  }
  console.log(String(N).padEnd(6), ...cells);
}
// session returns per FX day: Asia 00-07 UTC (Tokyo 09-16), London 07-12, NY 12-17 (London time), late 17-24
console.log('\nSession predictability: correlation and mean next-session move in the direction of the previous session (pips)');
const sessOf = (lm) => (lm >= 420 && lm < 720 ? 'LDN_AM' : lm >= 720 && lm < 1020 ? 'LDN_PM/NY' : null);
const { n, C, O, t } = ctx;
const days = new Map();
for (let i = 0; i < n; i++) {
  const d = ctx.dayIdx[i]; let rec = days.get(d); if (!rec) { rec = { t: t[i] }; days.set(d, rec); }
  const tk = ctx.tkyMin[i], lm = ctx.lonMin[i];
  const s = tk >= 540 && tk < 960 ? 'ASIA' : sessOf(lm);
  if (!s) continue;
  if (rec[s + '_o'] === undefined) rec[s + '_o'] = O[i];
  rec[s + '_c'] = C[i];
}
const pairs = [['ASIA', 'LDN_AM'], ['ASIA', 'LDN_PM/NY'], ['LDN_AM', 'LDN_PM/NY']];
for (const P of ['IS', 'VAL']) {
  for (const [a, b] of pairs) {
    const xs = [], ys = [];
    for (const rec of days.values()) {
      if (!inP(rec.t, P) || rec[a + '_o'] === undefined || rec[b + '_o'] === undefined) continue;
      xs.push((rec[a + '_c'] - rec[a + '_o']) / pip); ys.push((rec[b + '_c'] - rec[b + '_o']) / pip);
    }
    const mx = xs.reduce((s, v) => s + v, 0) / xs.length, my = ys.reduce((s, v) => s + v, 0) / ys.length;
    let sxy = 0, sxx = 0, syy = 0; for (let k = 0; k < xs.length; k++) { sxy += (xs[k] - mx) * (ys[k] - my); sxx += (xs[k] - mx) ** 2; syy += (ys[k] - my) ** 2; }
    const corr = sxy / Math.sqrt(sxx * syy);
    const follow = xs.map((x, k) => Math.sign(x) * ys[k]); const mf = follow.reduce((s, v) => s + v, 0) / follow.length;
    const sdf = Math.sqrt(follow.reduce((s, v) => s + (v - mf) ** 2, 0) / (follow.length - 1));
    console.log(`${P.padEnd(4)} ${a.padEnd(7)} -> ${b.padEnd(10)} days ${String(xs.length).padStart(4)}  corr ${corr.toFixed(3).padStart(6)}  follow ${mf.toFixed(2).padStart(6)} pips (t ${(mf / (sdf / Math.sqrt(follow.length))).toFixed(1)})  mean session moves ${mx.toFixed(1)} / ${my.toFixed(1)} pips`);
  }
}
