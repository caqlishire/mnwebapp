// THE single out-of-sample look (2017-01 .. 2020-05). Rules were fixed before this run; nothing is tuned afterwards.
import { loadM1, tradingWeekOnly } from './data.mjs';
import { SPLITS, evaluate, fmt } from './research.mjs';
import { buildDays, simulate, summarize } from './mefix.mjs';
const PRIMARY = { stop: 'pips', stopPips: 20, tp: 'retrace', exit: 1020, minMove: 3, costPips: 1 };
const SECONDARY = { stop: 'pips', stopPips: 20, exit: 1020, minMove: 3, costPips: 1 };
const per = (tr, P) => tr.filter((x) => x.t >= SPLITS[P][0] && x.t < SPLITS[P][1]);
const f = (s) => s.n ? `n=${String(s.n).padStart(3)} win ${String(s.win).padStart(3)}% avg ${String(s.avgPips).padStart(5)} pips (t ${String(s.t).padStart(4)}) total ${String(s.totalPips).padStart(4)} PF ${String(s.pf).padStart(4)} maxDD ${String(s.maxDDpips).padStart(3)} pips` : 'n=0';
console.log('=== Month-End Fix Fade (primary: stop 20, target = 15:30 price, exit 17:00 London, 1 pip cost)');
for (const instr of ['AUD_USD', 'EUR_USD', 'GBP_USD', 'USD_CAD']) {
  const days = buildDays(tradingWeekOnly(loadM1(instr)));
  for (const [nm, rule] of [['primary', PRIMARY], ['time-exit variant', SECONDARY]]) {
    const tr = simulate(days, rule);
    console.log(`${instr} ${nm.padEnd(18)} OOS ${f(summarize(per(tr, 'OOS')))}`);
    if (instr === 'AUD_USD' && nm === 'primary') {
      const o = per(tr, 'OOS');
      console.log('   OOS trades:', o.map((x) => `${new Date(x.dk * 86400000).toISOString().slice(0, 7)} ${x.dir > 0 ? 'B' : 'S'} ${x.kind[0]} ${x.pips.toFixed(1)}`).join(' | '));
      const all = summarize(tr.filter((x) => x.t < SPLITS.OOS[1]));
      console.log('   AUDUSD 2005-2020 all periods:', f(all));
    }
  }
}
console.log('\n=== Liquidity sweep references (engine, 1 pip cost, minute-resolved exits)');
for (const [nm, tf, p] of [['v2 default Scalp M15', 15, { mode: 'Scalp' }], ['Swing H4, no round numbers', 240, { mode: 'Swing', useRound: false }]]) {
  const r = evaluate(tf, p, { periods: ['IS', 'VAL', 'OOS'] });
  console.log(nm.padEnd(30), 'OOS', fmt(r.out.OOS));
}
