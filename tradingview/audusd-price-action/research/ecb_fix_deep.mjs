// ECB-fix fade deep dive (IS and VAL only): plateau check, by year, buys/sells, and the EURUSD / GBPUSD / USDCAD mechanism check.
import { loadM1, tradingWeekOnly, tzOffsetMin } from './data.mjs';
import { SPLITS } from './research.mjs';
function priceFn(m1) {
  const T0 = m1.t[0], N = m1.t[m1.n - 1] - T0 + 2;
  const ff = new Int32Array(N).fill(-1), last = new Int32Array(N).fill(-1);
  for (let i = 0; i < m1.n; i++) { ff[m1.t[i] - T0] = m1.c[i]; last[m1.t[i] - T0] = m1.t[i]; }
  for (let k = 1; k < N; k++) if (ff[k] < 0) { ff[k] = ff[k - 1]; last[k] = last[k - 1]; }
  return { T0, N, P: (T) => { const k = T - 1 - T0; if (k < 0 || k >= N || ff[k] < 0 || T - 1 - last[k] > 10) return NaN; return ff[k]; } };
}
const isLastTD = (y, mo, d) => { const dt = new Date(Date.UTC(y, mo, d)); do { dt.setUTCDate(dt.getUTCDate() + 1); } while (dt.getUTCDay() === 0 || dt.getUTCDay() === 6); return dt.getUTCMonth() !== mo; };
function instants(T0, N, tz, lm) {
  const out = [];
  for (let day = Math.floor(T0 / 1440) - 1; day * 1440 < T0 + N; day++) {
    const dt = new Date(day * 86400000), wd = dt.getUTCDay();
    if (wd === 0 || wd === 6 || isLastTD(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())) continue;
    const a = day * 1440 + lm; out.push(a - tzOffsetMin(tz, a));
  }
  return out;
}
function measure(px, inst, { pre = 30, hold = 30, thr = 5, per }) {
  const xs = [], ys = [];
  for (const T of inst) {
    if (per && (T < SPLITS[per][0] || T >= SPLITS[per][1])) continue;
    const p0 = px.P(T - pre), p1 = px.P(T), p2 = px.P(T + hold);
    if (Number.isNaN(p0) || Number.isNaN(p1) || Number.isNaN(p2)) continue;
    const mv = (p1 - p0) / 10; if (mv === 0 || Math.abs(mv) < thr) continue;
    xs.push(-Math.sign(mv) * (p2 - p1) / 10); ys.push({ T, dir: -Math.sign(mv), r: -Math.sign(mv) * (p2 - p1) / 10 });
  }
  const m = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
  return { n: xs.length, m, t: m / (sd / Math.sqrt(xs.length)), trades: ys };
}
const f = (r) => `${String(r.n).padStart(4)} ${(r.m >= 0 ? '+' : '') + r.m.toFixed(2)} (t ${r.t.toFixed(1)})`;
const aud = tradingWeekOnly(loadM1('AUD_USD')), pa = priceFn(aud);
const inst = instants(pa.T0, pa.N, 'Europe/Berlin', 855);
console.log('AUDUSD fade of the move into 14:15 CET. Gross pips per trade (IS | VAL):');
console.log('-- pre-window x hold (threshold 5 pips)');
for (const pre of [15, 30, 60]) console.log(`   pre ${String(pre).padStart(2)}m:`, [10, 20, 30, 45, 60].map((hold) => `hold ${hold}m ${f(measure(pa, inst, { pre, hold, thr: 5, per: 'IS' }))} | ${f(measure(pa, inst, { pre, hold, thr: 5, per: 'VAL' }))}`).join('   '));
console.log('-- threshold (pre 30m, hold 30m)');
console.log('   ' + [0, 3, 5, 8, 12].map((thr) => `>=${thr}: ${f(measure(pa, inst, { thr, per: 'IS' }))} | ${f(measure(pa, inst, { thr, per: 'VAL' }))}`).join('   '));
console.log('-- event time shifted (is it really the 14:15 fix?): pre 30m, hold 30m, >=5 pips');
for (const lm of [795, 825, 840, 855, 870, 885, 915]) { const ins = instants(pa.T0, pa.N, 'Europe/Berlin', lm); console.log(`   ${Math.floor(lm / 60)}:${String(lm % 60).padStart(2, '0')} CET  IS ${f(measure(pa, ins, { per: 'IS' }))} | VAL ${f(measure(pa, ins, { per: 'VAL' }))}`); }
const all = measure(pa, inst, {});
const byY = {}; for (const x of all.trades) { if (x.T >= SPLITS.VAL[1]) continue; const y = new Date(x.T * 60000).getUTCFullYear(); (byY[y] ||= []).push(x.r); }
console.log('-- by year (2005-2016, gross pips sum / trades):', Object.entries(byY).map(([y, a]) => `${y} ${a.reduce((s, v) => s + v, 0).toFixed(0)}/${a.length}`).join(', '));
const isval = all.trades.filter((x) => x.T < SPLITS.VAL[1]);
const sb = (d) => { const a = isval.filter((x) => x.dir === d).map((x) => x.r); return (a.reduce((s, v) => s + v, 0) / a.length).toFixed(2) + ` (n ${a.length})`; };
console.log('-- buys', sb(1), ' sells', sb(-1));
console.log('\nMechanism check: same rule (pre 30m, hold 30m, >=5 pips) on other pairs:');
for (const instr of ['EUR_USD', 'GBP_USD', 'USD_CAD']) {
  const m = tradingWeekOnly(loadM1(instr)), px = priceFn(m), ins = instants(px.T0, px.N, 'Europe/Berlin', 855);
  console.log(`   ${instr}: IS ${f(measure(px, ins, { per: 'IS' }))} | VAL ${f(measure(px, ins, { per: 'VAL' }))}`);
}
