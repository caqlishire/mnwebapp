// Stress tests for the locked AUDUSD rule over 2005-01..2020-05 (no parameter changes).
import { loadM1, tradingWeekOnly } from './data.mjs';
import { buildDays, simulate, summarize, isLastTD } from './mefix.mjs';
import { aggregate } from './data.mjs';
const m1 = tradingWeekOnly(loadM1('AUD_USD'));
const days = buildDays(m1);
const RULE = { stop: 'pips', stopPips: 20, tp: 'retrace', exit: 1020, minMove: 3, costPips: 1 };
const f = (s) => `n=${String(s.n).padStart(3)} win ${String(s.win).padStart(3)}% avg ${String(s.avgPips).padStart(5)} pips (t ${String(s.t).padStart(4)}) total ${String(s.totalPips).padStart(4)} PF ${String(s.pf).padStart(4)} maxDD ${String(s.maxDDpips).padStart(3)}`;
const base = simulate(days, RULE);
console.log('locked rule, 1-minute data           ', f(summarize(base)));
console.log('cost 1.5 pips                        ', f(summarize(simulate(days, { ...RULE, costPips: 1.5 }))));
console.log('cost 2.0 pips                        ', f(summarize(simulate(days, { ...RULE, costPips: 2 }))));
console.log('entry 1 minute late (16:01 price)    ', f(summarize(simulate(days, { ...RULE, fix: 961 }))));
console.log('entry 2 minutes late (16:02 price)   ', f(summarize(simulate(days, { ...RULE, fix: 962 }))));
// bar granularity: rebuild "days" from M5 / M15 bars (what a TradingView chart sees)
for (const tf of [5, 15]) {
  const a = aggregate(m1, tf);
  const asM1 = { n: a.n, t: a.t, o: a.o, h: a.h, l: a.l, c: a.c, v: new Int32Array(a.n) };
  // with bars of tf minutes, "last close strictly before 15:30" = close of the bar ending 15:30; exits are checked on bar highs/lows
  const d2 = buildDays(asM1);
  console.log(`M${tf} bars (stop checked first in a bar)`.padEnd(37), f(summarize(simulate(d2, RULE))));
}
// outlier dependence
const sorted = [...base].sort((a, b) => b.pips - a.pips);
const drop = (k) => summarize(sorted.slice(k));
console.log('without the best 5 trades            ', f(drop(5)));
console.log('without the best 10 trades           ', f(drop(10)));
console.log('buys only                            ', f(summarize(base.filter((x) => x.dir === 1))));
console.log('sells only                           ', f(summarize(base.filter((x) => x.dir === -1))));
console.log('quarter-end months                   ', f(summarize(base.filter((x) => [2, 5, 8, 11].includes(new Date(x.dk * 86400000).getUTCMonth())))));
console.log('other month-ends                     ', f(summarize(base.filter((x) => ![2, 5, 8, 11].includes(new Date(x.dk * 86400000).getUTCMonth())))));
const kinds = {}; for (const x of base) kinds[x.kind] = (kinds[x.kind] || 0) + 1;
console.log('exit types:', JSON.stringify(kinds), ' median trade', [...base].sort((a, b) => a.pips - b.pips)[Math.floor(base.length / 2)].pips.toFixed(1), 'pips');
const yr = {}; for (const x of base) { const y = new Date(x.dk * 86400000).getUTCFullYear(); (yr[y] ||= []).push(x.pips); }
console.log('by year (pips, trades):', Object.entries(yr).map(([y, a]) => `${y} ${a.reduce((s, v) => s + v, 0).toFixed(0)} (${a.length})`).join(', '));
console.log('losing years:', Object.entries(yr).filter(([, a]) => a.reduce((s, v) => s + v, 0) < 0).map(([y]) => y).join(', ') || 'none');
