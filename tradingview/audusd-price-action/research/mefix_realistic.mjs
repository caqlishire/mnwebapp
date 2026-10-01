import { loadM1, tradingWeekOnly } from './data.mjs';
import { SPLITS } from './research.mjs';
import { buildDays, simulate, summarize } from './mefix.mjs';
const days = buildDays(tradingWeekOnly(loadM1('AUD_USD')));
const RULE = { stop: 'pips', stopPips: 20, tp: 'retrace', exit: 1020, minMove: 3, costPips: 1 };
const per = (tr, P) => tr.filter((x) => x.t >= SPLITS[P][0] && x.t < SPLITS[P][1]);
const f = (s) => `n=${String(s.n).padStart(3)} win ${String(s.win).padStart(3)}% avg ${String(s.avgPips).padStart(5)} pips (t ${String(s.t).padStart(4)}) PF ${String(s.pf).padStart(4)} maxDD ${String(s.maxDDpips).padStart(3)}`;
const at = simulate(days, RULE), nx = simulate(days, { ...RULE, entryAt: 'nextOpen', exitAt: 'nextOpen' });
const slip = nx.map((x) => { const a = at.find((y) => y.dk === x.dk); return a ? x.dir * (a.entry - x.entry) / 10 : NaN; }).filter(Number.isFinite);
console.log(`first price after 16:00:00 vs the fix price, in the trade direction: mean ${(-slip.reduce((s, v) => s + v, 0) / slip.length).toFixed(2)} pips (negative = worse)`);
for (const [nm, tr] of [['entry at the 16:00 fix price      ', at], ['entry at first price after 16:00  ', nx]]) {
  console.log(nm, 'IS ', f(summarize(per(tr, 'IS'))), '| VAL', f(summarize(per(tr, 'VAL'))));
  console.log(''.padEnd(nm.length), 'OOS', f(summarize(per(tr, 'OOS'))), '| ALL', f(summarize(tr)));
}
