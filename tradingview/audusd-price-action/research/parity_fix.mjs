// Parity: the real Pine month-end indicator in PineTS vs the research simulator, real AUDUSD bars.
import fs from 'fs';
import { loadM1, tradingWeekOnly, aggregate, tzOffsetMin } from './data.mjs';
import { runPineReal, series, sliceM1 } from './pinets_real.mjs';
import { buildDays, simulate } from './mefix.mjs';
const FILE = new URL('../', import.meta.url).pathname + 'AUDUSD_MonthEnd_Fix_Fade.pine';
const TF = Number(process.argv[2] || 15);
const CHUNKS = JSON.parse(process.argv[3] || '[["2005-01-01","2009-01-01"],["2009-01-01","2013-01-01"],["2013-01-01","2017-01-01"],["2017-01-01","2020-06-01"]]');
const all = tradingWeekOnly(loadM1('AUD_USD'));
const src = fs.readFileSync(FILE, 'utf8');
const RULE = { stop: 'pips', stopPips: 20, tp: 'retrace', exit: 1020, minMove: 3, costPips: 1 };
let totalP = 0, totalE = 0, bad = 0, sumP = 0, sumE = 0;
for (const [a, b] of CHUNKS) {
  const m1 = sliceM1(all, a, b);
  const bars = aggregate(m1, TF);
  const t0 = Date.now();
  const ctx = await runPineReal(src, m1, TF);
  const S = (k) => series(ctx, k);
  const sig = S('Signal (1 buy, -1 sell)'), ent = S('Signal entry'), ek = S('Exit kind (1 TP, -1 SL, 2 time, 99 none)'), ep = S('Exit net pips');
  const pine = []; let open = null;
  const lonDate = (tMin) => Math.floor((tMin + tzOffsetMin('Europe/London', tMin)) / 1440);
  for (let i = 0; i < bars.n; i++) {
    if (ek[i] !== 99 && Number.isFinite(ek[i]) && open) { open.kind = ek[i] === 1 ? 'target' : ek[i] === -1 ? 'stop' : 'time'; open.pips = ep[i]; pine.push(open); open = null; }
    if (sig[i] === 1 || sig[i] === -1) open = { dk: lonDate(bars.t[i]), dir: sig[i], entry: ent[i] };
  }
  // research simulator on the same bars
  const asM1 = { n: bars.n, t: bars.t, o: bars.o, h: bars.h, l: bars.l, c: bars.c, v: new Int32Array(bars.n) };
  const eng = simulate(buildDays(asM1), RULE);
  const key = (x) => x.dk;
  const mp = new Map(pine.map((x) => [key(x), x])), me = new Map(eng.map((x) => [key(x), x]));
  let cBad = 0;
  for (const k of new Set([...mp.keys(), ...me.keys()])) {
    const p = mp.get(k), e = me.get(k);
    const ok = p && e && p.dir === e.dir && Math.abs(p.entry - e.entry / 1e5) < 1e-9 && p.kind === e.kind && Math.abs(p.pips - e.pips) < 1e-6;
    if (!ok) { cBad++; if (cBad <= 4) console.log('   diff', new Date(k * 86400000).toISOString().slice(0, 10), JSON.stringify(p), JSON.stringify(e && { dir: e.dir, entry: e.entry / 1e5, kind: e.kind, pips: +e.pips.toFixed(4) })); }
  }
  const sp = pine.reduce((s, x) => s + x.pips, 0), se = eng.reduce((s, x) => s + x.pips, 0);
  console.log(`M${TF} ${a}..${b}: bars ${bars.n}, PineTS ${((Date.now() - t0) / 1000).toFixed(0)} s | trades pine ${pine.length} engine ${eng.length} | net pips pine ${sp.toFixed(1)} engine ${se.toFixed(1)} | mismatches ${cBad}`);
  totalP += pine.length; totalE += eng.length; bad += cBad; sumP += sp; sumE += se;
}
console.log(`\nTOTAL trades pine ${totalP} / engine ${totalE}, net pips pine ${sumP.toFixed(1)} / engine ${sumE.toFixed(1)}, mismatches ${bad}`);
process.exit(bad ? 1 : 0);
