// Final reported numbers: realistic fills (first price after 16:00 and after 17:00), 1-minute data.
import { loadM1, tradingWeekOnly } from './data.mjs';
import { SPLITS } from './research.mjs';
import { buildDays, simulate, summarize } from './mefix.mjs';
const days = buildDays(tradingWeekOnly(loadM1('AUD_USD')));
const RULE = { stop: 'pips', stopPips: 20, tp: 'retrace', exit: 1020, minMove: 3, costPips: 1, entryAt: 'nextOpen', exitAt: 'nextOpen' };
const per = (tr, P) => tr.filter((x) => x.t >= SPLITS[P][0] && x.t < SPLITS[P][1]);
const row = (nm, s, extra = '') => console.log(`| ${nm} | ${s.n} | ${s.win}% | ${s.avgPips >= 0 ? '+' : ''}${s.avgPips} | ${s.t} | ${s.pf} | ${s.totalPips >= 0 ? '+' : ''}${s.totalPips} | ${s.maxDDpips} |${extra}`);
const tr = simulate(days, RULE);
console.log('| Period | Trades | Win rate | Avg net pips | t-stat | Profit factor | Net pips | Max drawdown (pips) |');
console.log('|---|---|---|---|---|---|---|---|');
row('2005-2012 (rules found here)', summarize(per(tr, 'IS')));
row('2013-2016 (confirmation)', summarize(per(tr, 'VAL')));
row('2017-May 2020 (unseen, tested once)', summarize(per(tr, 'OOS')));
row('All 2005-May 2020', summarize(tr));
console.log('\ncost sensitivity (all years):');
for (const c of [0.5, 1, 1.5, 2, 3]) { const s = summarize(simulate(days, { ...RULE, costPips: c })); console.log(`  ${c} pip: avg ${s.avgPips} pips, PF ${s.pf}, win ${s.win}%, t ${s.t}`); }
const yr = {}; for (const x of tr) { const y = new Date(x.dk * 86400000).getUTCFullYear(); (yr[y] ||= []).push(x.pips); }
const ys = Object.entries(yr).map(([y, a]) => [y, a.reduce((s, v) => s + v, 0), a.length]);
console.log('\nby year:', ys.map(([y, s, n]) => `${y} ${s >= 0 ? '+' : ''}${s.toFixed(0)} (${n})`).join(', '));
console.log('positive years:', ys.filter(([, s]) => s > 0).length, 'of', ys.length);
let st = 0, mst = 0; for (const x of tr) { if (x.pips < 0) { st++; mst = Math.max(mst, st); } else st = 0; }
const kinds = {}; for (const x of tr) kinds[x.kind] = (kinds[x.kind] || 0) + 1;
const sorted = [...tr].sort((a, b) => a.pips - b.pips);
console.log('max losing streak', mst, '| worst trade', sorted[0].pips.toFixed(1), 'pips', new Date(sorted[0].dk * 86400000).toISOString().slice(0, 10), '| best', sorted.at(-1).pips.toFixed(1), '| median', sorted[Math.floor(sorted.length / 2)].pips.toFixed(1), '| exits', JSON.stringify(kinds));
console.log('average risk per trade (pips):', (tr.reduce((s, x) => s + x.riskPips, 0) / tr.length).toFixed(1), ' avg R:', (tr.reduce((s, x) => s + x.R, 0) / tr.length).toFixed(3));
