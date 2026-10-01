// Trade-for-trade parity: real Pine indicator in PineTS vs the fast engine, on real AUDUSD bars.
import fs from 'fs';
import { loadM1, tradingWeekOnly, iso } from './data.mjs';
import { prepare, run } from './engine.mjs';
import { runPineReal, series, sliceM1 } from './pinets_real.mjs';
import { patchInputs } from './tests/scen_lib.mjs';

const FILE = process.argv[2] || new URL('../', import.meta.url).pathname + 'AUDUSD_Liquidity_Sweep.pine';
const cases = JSON.parse(process.argv[3] || '[{"tf":15,"from":"2015-02-01","to":"2015-06-01","pine":{},"eng":{}}]');
const all = tradingWeekOnly(loadM1());
const dbg = `
plot(sessOK ? 1 : 0, "dbg_sess")
plot(holdOK ? 1 : 0, "dbg_hold")
plot(inAsia ? 1 : 0, "dbg_asia")
plot(newDay ? 1 : 0, "dbg_newday")
plot(pdh, "dbg_pdh")
plot(pdl, "dbg_pdl")
plot(asiaHiPrev, "dbg_asiahi")
`;
let totalBad = 0;
for (const cs of cases) {
  const m1 = sliceM1(all, cs.from, cs.to);
  const src = patchInputs(fs.readFileSync(FILE, 'utf8'), cs.pine) + dbg;
  const t0 = Date.now();
  const pctx = await runPineReal(src, m1, cs.tf);
  const pineMs = Date.now() - t0;
  const ctx = prepare(m1, cs.tf);
  const t1 = Date.now();
  const res = run(ctx, { dayRoll: 'utc', trendMode: 'pinets', ...cs.eng });
  const engMs = Date.now() - t1;
  const S = (n) => series(pctx, n);
  const n = ctx.n;
  console.log(`\n=== ${cs.tf} ${cs.from}..${cs.to}  bars ${n} (PineTS ${S('dbg_sess').length})  pine ${pineMs} ms, engine ${engMs} ms  ${JSON.stringify(cs.pine)}`);
  // --- intermediate features ---
  const P = res.params;
  const useSession = P.mode === 'Scalp' ? true : P.mode === 'Swing' ? false : P.cSess;
  const feat = {
    dbg_sess: (i) => (!useSession || ctx.chartSec >= 14400 || (ctx.lonMin[i] >= 420 && ctx.lonMin[i] < 930)) ? 1 : 0,
    dbg_hold: (i) => (!useSession || ctx.chartSec >= 14400 || (ctx.lonMin[i] >= 420 && ctx.lonMin[i] < 1020)) ? 1 : 0,
    dbg_asia: (i) => (P.useAsia && ctx.chartSec < 14400 && ctx.tkyMin[i] >= 540 && ctx.tkyMin[i] < 960) ? 1 : 0,
    dbg_newday: (i) => ctx.newDayUTC[i],
    dbg_pdh: (i) => ctx.pdh[i],
    dbg_pdl: (i) => ctx.pdl[i],
  };
  // PineTS returns na for HTF values on the final (still open) daily bar of the data: compare features before it
  const lastDay = ctx.dayIdx[n - 1]; let nCmp = n; while (nCmp > 0 && ctx.dayIdx[nCmp - 1] === lastDay) nCmp--;
  for (const [k, f] of Object.entries(feat)) {
    const v = S(k); let bad = 0, first = -1;
    for (let i = 0; i < nCmp; i++) { const a = v[i], b = f(i); const same = (Number.isNaN(a) && Number.isNaN(b)) || a === b || Math.abs(a - b) < 1e-12; if (!same) { bad++; if (first < 0) first = i; } }
    console.log(`  feature ${k.padEnd(10)} mismatches ${bad}${bad ? ` (first at ${first} ${iso(ctx.t[first])}: pine ${v[first]} engine ${f(first)})` : ''}`);
    totalBad += bad;
  }
  const trP = S('HTF trend');
  const { trendSeries, biasTFfor } = await import('./engine.mjs');
  const trE = trendSeries(ctx, biasTFfor(ctx.chartSec, P.biasTFin), P.biasLen, 'pinets');
  let tb = 0, tf0 = -1; for (let i = 0; i < nCmp; i++) if (trP[i] !== trE[i]) { tb++; if (tf0 < 0) tf0 = i; }
  console.log(`  feature trend      mismatches ${tb}${tb ? ` (first at ${tf0} ${iso(ctx.t[tf0])}: pine ${trP[tf0]} engine ${trE[tf0]})` : ''}`);
  totalBad += tb;
  // --- signals and exits ---
  const sig = S('Signal (1 buy, -1 sell)'), ent = S('Signal entry'), sl = S('Signal stop'), tp = S('Signal target');
  const ek = S('Exit kind (1 TP, -1 SL, 0 BE, 2 EOD, 99 none)'), er = S('Exit net R');
  const ps = [], pe = [];
  for (let i = 0; i < n; i++) { if (sig[i] === 1 || sig[i] === -1) ps.push({ bar: i, dir: sig[i], entry: ent[i], sl: sl[i], tp: tp[i] }); if (ek[i] !== 99 && Number.isFinite(ek[i])) pe.push({ bar: i, kind: ek[i], r: er[i] }); }
  const es = res.trades.map((t) => ({ bar: t.entryBar, dir: t.dir, entry: t.entry, sl: t.sl0, tp: t.tp }));
  if (res.open) es.push({ bar: res.open.entryBar, dir: res.open.dir, entry: NaN, sl: NaN, tp: NaN, open: true });
  const ee = res.trades.map((t) => ({ bar: t.exitBar, kind: t.kind, r: t.netR }));
  let sBad = 0, xBad = 0;
  const m = Math.max(ps.length, es.length);
  for (let k = 0; k < m; k++) {
    const a = ps[k], b = es[k];
    const ok = a && b && a.bar === b.bar && a.dir === b.dir && (b.open || (Math.abs(a.entry - b.entry) < 1e-12 && Math.abs(a.sl - b.sl) < 1e-12 && Math.abs(a.tp - b.tp) < 1e-12));
    if (!ok) { sBad++; if (sBad <= 3) console.log('   signal diff', k, JSON.stringify(a), JSON.stringify(b), a ? iso(ctx.t[a.bar]) : '', b ? iso(ctx.t[b.bar]) : ''); }
  }
  for (let k = 0; k < Math.max(pe.length, ee.length); k++) {
    const a = pe[k], b = ee[k];
    const ok = a && b && a.bar === b.bar && a.kind === b.kind && Math.abs(a.r - b.r) < 1e-9;
    if (!ok) { xBad++; if (xBad <= 3) console.log('   exit diff', k, JSON.stringify(a), JSON.stringify(b)); }
  }
  console.log(`  signals pine ${ps.length} / engine ${es.length}: mismatches ${sBad};  exits pine ${pe.length} / engine ${ee.length}: mismatches ${xBad}`);
  totalBad += sBad + xBad;
}
console.log(`\nTOTAL mismatches: ${totalBad}`);
process.exit(totalBad ? 1 : 0);
