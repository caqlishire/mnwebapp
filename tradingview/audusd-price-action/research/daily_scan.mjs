// Daily price-action stylized facts (FX days, 17:00 NY). Mean next-days move in the stated direction, pips, with t-stat.
// Rollover-neutral: each 17:00 NY crossing is corrected by the year's average rollover jump (swap offsets it in practice).
import { ctxFor, SPLITS } from './research.mjs';
const ctx = ctxFor(15);
const D = ctx.D, pip = 1e-4, N = D.n;
const O = Array.from(D.o, (v) => v / 1e5), H = Array.from(D.h, (v) => v / 1e5), L = Array.from(D.l, (v) => v / 1e5), C = Array.from(D.c, (v) => v / 1e5);
const yearOf = (k) => new Date(D.t[k] * 60000).getUTCFullYear();
const ROLL = { 2005: -0.34, 2006: -0.05, 2007: -0.62, 2008: -0.84, 2009: -1.11, 2010: -1.14, 2011: -0.98, 2012: -0.78, 2013: -0.5, 2014: -0.76, 2015: -0.85, 2016: 0.24 };
// forward move from close of day k to close of day k+M, rollover-neutral, in direction dir
const fwd = (k, M, dir) => { let r = (C[k + M] - C[k]) / pip; for (let j = k + 1; j <= k + M; j++) r -= ROLL[yearOf(j)] ?? 0; return dir * r; };
const inP = (k, P) => D.t[k] >= SPLITS[P][0] && D.t[k] < SPLITS[P][1];
const rows = [];
function test(name, sig) { // sig(k) -> +1 / -1 / 0 (direction to trade at the close of day k)
  const out = [name];
  for (const P of ['IS', 'VAL']) for (const M of [1, 3, 5]) {
    const xs = []; for (let k = 25; k + M < N; k++) { if (!inP(k, P)) continue; const d = sig(k); if (d) xs.push(fwd(k, M, d)); }
    const m = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
    out.push(`${m.toFixed(1).padStart(6)}(${(m / (sd / Math.sqrt(xs.length))).toFixed(1).padStart(4)}) n${xs.length}`);
  }
  console.log(out[0].padEnd(46), out.slice(1, 4).join(' '), ' | ', out.slice(4).join(' '));
}
const avgRange = (k, n) => { let s = 0; for (let j = k - n; j < k; j++) s += H[j] - L[j]; return s / n; };
const hiN = (k, n) => Math.max(...H.slice(k - n + 1, k + 1)), loN = (k, n) => Math.min(...L.slice(k - n + 1, k + 1));
console.log('pattern (trade direction)'.padEnd(46), 'IS: 1 day / 3 days / 5 days', '                  |  VAL: 1 / 3 / 5 days');
for (const n of [5, 10, 20]) {
  test(`close in top 10% of ${n}-day range -> SELL (fade)`, (k) => { const hi = hiN(k, n), lo = loN(k, n); const p = (C[k] - lo) / (hi - lo); return p >= 0.9 ? -1 : p <= 0.1 ? 1 : 0; });
  test(`new ${n}-day closing high/low -> follow`, (k) => { const prevHi = Math.max(...C.slice(k - n, k)), prevLo = Math.min(...C.slice(k - n, k)); return C[k] > prevHi ? 1 : C[k] < prevLo ? -1 : 0; });
}
test('big day (range > 2x 20d avg), close top/bottom 25% -> follow', (k) => { const r = H[k] - L[k]; if (r < 2 * avgRange(k, 20)) return 0; const p = (C[k] - L[k]) / r; return p >= 0.75 ? 1 : p <= 0.25 ? -1 : 0; });
test('big day (range > 1.5x 20d avg), close extreme -> follow', (k) => { const r = H[k] - L[k]; if (r < 1.5 * avgRange(k, 20)) return 0; const p = (C[k] - L[k]) / r; return p >= 0.8 ? 1 : p <= 0.2 ? -1 : 0; });
test('close in top/bottom 10% of the day range -> follow', (k) => { const r = H[k] - L[k]; const p = (C[k] - L[k]) / r; return p >= 0.9 ? 1 : p <= 0.1 ? -1 : 0; });
test('pin bar: wick >= 2/3 of range at the 10d extreme -> reversal', (k) => { const r = H[k] - L[k]; const up = H[k] - Math.max(O[k], C[k]), dn = Math.min(O[k], C[k]) - L[k]; if (up >= 0.66 * r && H[k] >= hiN(k, 10)) return -1; if (dn >= 0.66 * r && L[k] <= loN(k, 10)) return 1; return 0; });
test('outside day (engulfs prior range) -> follow its close side', (k) => (H[k] > H[k - 1] && L[k] < L[k - 1] ? (C[k] > O[k] ? 1 : -1) : 0));
test('2 consecutive days same direction -> follow', (k) => (C[k] > C[k - 1] && C[k - 1] > C[k - 2] ? 1 : C[k] < C[k - 1] && C[k - 1] < C[k - 2] ? -1 : 0));
test('3 consecutive days same direction -> fade', (k) => (C[k] > C[k - 1] && C[k - 1] > C[k - 2] && C[k - 2] > C[k - 3] ? -1 : C[k] < C[k - 1] && C[k - 1] < C[k - 2] && C[k - 2] < C[k - 3] ? 1 : 0));
