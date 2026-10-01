import { loadM1, tradingWeekOnly } from './data.mjs';
import { SPLITS } from './research.mjs';
import { buildDays, simulate, summarize } from './mefix.mjs';
const days = buildDays(tradingWeekOnly(loadM1()));
const per = (tr, P) => tr.filter((x) => x.t >= SPLITS[P][0] && x.t < SPLITS[P][1]);
const f = (s) => `n=${String(s.n).padStart(3)} win ${String(s.win).padStart(3)}% avg ${String(s.avgPips).padStart(5)} pips (t ${String(s.t).padStart(4)}) total ${String(s.totalPips).padStart(4)} PF ${String(s.pf).padStart(4)} maxDD ${String(s.maxDDpips).padStart(3)} pips avgR ${s.avgR}`;
const variants = [
  ['time exit 17:00, no stop', { stop: 'none' }],
  ['time exit 17:00, stop 15 pips', { stop: 'pips', stopPips: 15 }],
  ['time exit 17:00, stop 20 pips', { stop: 'pips', stopPips: 20 }],
  ['time exit 17:00, stop 25 pips', { stop: 'pips', stopPips: 25 }],
  ['time exit 17:00, stop 30 pips', { stop: 'pips', stopPips: 30 }],
  ['stop 5 pips beyond pre-fix extreme', { stop: 'preExt', stopPips: 5 }],
  ['stop 10 pips beyond pre-fix extreme', { stop: 'preExt', stopPips: 10 }],
  ['stop 20 pips + target = 15:30 price', { stop: 'pips', stopPips: 20, tp: 'retrace' }],
  ['stop 25, exit 16:30', { stop: 'pips', stopPips: 25, exit: 990 }],
  ['stop 25, exit 17:30', { stop: 'pips', stopPips: 25, exit: 1050 }],
  ['stop 25, cost 2 pips', { stop: 'pips', stopPips: 25, costPips: 2 }],
  ['stop 25, min move 0', { stop: 'pips', stopPips: 25, minMove: 0 }],
  ['stop 25, min move 8', { stop: 'pips', stopPips: 25, minMove: 8 }],
];
for (const [name, p] of variants) {
  const tr = simulate(days, p);
  console.log(name.padEnd(38), 'IS ', f(summarize(per(tr, 'IS'))));
  console.log(''.padEnd(38), 'VAL', f(summarize(per(tr, 'VAL'))));
}
