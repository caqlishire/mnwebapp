// Strategy (next-open fills) in PineTS vs the research simulator with the same fill model, real AUDUSD M15 bars.
import fs from 'fs';
import { loadM1, tradingWeekOnly, aggregate, tzOffsetMin } from './data.mjs';
import { runPineReal, sliceM1 } from './pinets_real.mjs';
import { buildDays, simulate } from './mefix.mjs';
const FILE = new URL('../', import.meta.url).pathname + 'AUDUSD_MonthEnd_Fix_Fade_Strategy.pine';
const CHUNKS = JSON.parse(process.argv[2] || '[["2005-01-01","2009-01-01"],["2009-01-01","2013-01-01"],["2013-01-01","2017-01-01"],["2017-01-01","2020-06-01"]]');
const all = tradingWeekOnly(loadM1('AUD_USD'));
const src = fs.readFileSync(FILE, 'utf8');
const RULE = { stop: 'pips', stopPips: 20, tp: 'retrace', exit: 1020, minMove: 3, costPips: 0, entryAt: 'nextOpen', exitAt: 'nextOpen' };
let bad = 0, n = 0, pinePips = 0, engPips = 0;
for (const [a, b] of CHUNKS) {
  const m1 = sliceM1(all, a, b), bars = aggregate(m1, 15);
  const r = await runPineReal(src, m1, 15);
  const ct = r.strategy.closedtrades;
  const asM1 = { n: bars.n, t: bars.t, o: bars.o, h: bars.h, l: bars.l, c: bars.c, v: new Int32Array(bars.n) };
  const eng = simulate(buildDays(asM1), RULE);
  let cb = 0;
  for (let k = 0; k < Math.max(ct.length, eng.length); k++) {
    const p = ct[k], e = eng[k];
    const pPips = p ? Math.sign(p.size) * (p.exit_price - p.entry_price) / 1e-4 : NaN;
    const ok = p && e && Math.sign(p.size) === e.dir && Math.abs(p.entry_price - e.entry / 1e5) < 1e-9 && Math.abs(p.exit_price - e.exitPx / 1e5) < 1e-9;
    if (!ok) { cb++; if (cb <= 4) console.log('   diff', k, p && JSON.stringify({ dir: Math.sign(p.size), entry: p.entry_price, exit: p.exit_price, id: p.exit_id }), e && JSON.stringify({ day: new Date(e.dk * 86400000).toISOString().slice(0, 10), dir: e.dir, entry: e.entry / 1e5, exit: e.exitPx / 1e5, kind: e.kind })); }
    if (p) pinePips += pPips; if (e) engPips += e.pips;
  }
  console.log(`${a}..${b}: strategy trades ${ct.length}, simulator ${eng.length}, mismatches ${cb}`);
  bad += cb; n += ct.length;
}
console.log(`\nTOTAL ${n} strategy trades; gross pips strategy ${pinePips.toFixed(1)} vs simulator ${engPips.toFixed(1)}; mismatches ${bad}`);
process.exit(bad ? 1 : 0);
