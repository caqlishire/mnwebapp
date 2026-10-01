// Same month-end fix fade rule, unchanged, on other USD pairs. IS and VAL only.
import { loadM1, tradingWeekOnly } from './data.mjs';
import { SPLITS } from './research.mjs';
import { buildDays, simulate, summarize } from './mefix.mjs';
const RULE = { stop: 'pips', stopPips: 20, tp: 'retrace', exit: 1020, minMove: 3, costPips: 1 };
const RULE_TIME = { stop: 'pips', stopPips: 20, exit: 1020, minMove: 3, costPips: 1 };
const per = (tr, P) => tr.filter((x) => x.t >= SPLITS[P][0] && x.t < SPLITS[P][1]);
const f = (s) => `n=${String(s.n).padStart(3)} win ${String(s.win).padStart(3)}% avg ${String(s.avgPips).padStart(5)} pips (t ${String(s.t).padStart(4)}) PF ${String(s.pf).padStart(4)} maxDD ${String(s.maxDDpips).padStart(3)}`;
for (const instr of ['AUD_USD', 'EUR_USD', 'GBP_USD', 'USD_CAD']) {
  const days = buildDays(tradingWeekOnly(loadM1(instr)));
  for (const [nm, rule] of [['stop 20 + retrace target', RULE], ['stop 20 + 17:00 exit', RULE_TIME]]) {
    const tr = simulate(days, rule);
    console.log(`${instr} ${nm.padEnd(25)} IS  ${f(summarize(per(tr, 'IS')))}   VAL ${f(summarize(per(tr, 'VAL')))}`);
  }
}
