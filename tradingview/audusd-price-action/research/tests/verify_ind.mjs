import fs from 'fs';
import { genCandles, runPine, series } from './harness.mjs';
import { check, near, summary } from './scen_lib.mjs';
const FILE = process.argv[2] || new URL('../../', import.meta.url).pathname + 'AUDUSD_Liquidity_Sweep.pine';
const src = fs.readFileSync(FILE, 'utf8');
const N = { sig: 'Signal (1 buy, -1 sell)', ent: 'Signal entry', sl: 'Signal stop', tp: 'Signal target', trend: 'HTF trend', ek: 'Exit kind (1 TP, -1 SL, 0 BE, 2 EOD, 99 none)', er: 'Exit net R' };
const eq = (a, b) => (Number.isNaN(a) && Number.isNaN(b)) || a === b || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-9);

for (const seed of [11, 23, 57]) {
  console.log(`\n=== random data seed ${seed} ===`);
  const candles = genCandles({ days: 70, seed });
  const full = await runPine(src, candles);
  const F = Object.fromEntries(Object.entries(N).map(([k, n]) => [k, series(full, n)]));
  const nSig = F.sig.filter((v) => v === 1 || v === -1).length;
  console.log(`bars ${candles.length}, signals ${nSig}`);

  // --- 1) no repainting / no look-ahead: truncated runs must reproduce the same history ---
  for (const cut of [Math.floor(candles.length * 0.35), Math.floor(candles.length * 0.62), Math.floor(candles.length * 0.9)]) {
    const part = await runPine(src, candles.slice(0, cut));
    let diffs = 0, first = -1;
    for (const k of Object.keys(N)) {
      const P = series(part, N[k]);
      for (let i = 0; i < cut - 2; i++) if (!eq(P[i], F[k][i])) { diffs++; if (first < 0) first = i; }
    }
    check(`prefix invariance at cut ${cut} (all signal/trend/exit series identical on bars < cut-2)`, diffs === 0, `diffs=${diffs} first@${first}`);
  }

  // --- 2) independent re-simulation of every trade (spec: SL first on shared candle, BE from next candle, EOD at 17:00 bar close) ---
  const cost = 1.0 * 0.0001, tpR = 1.5, beR = 1.0;
  const hold = (t) => { const h = new Date(t).getUTCHours(); return h >= 7 && h < 17; };
  const sims = [];
  for (let i = 0; i < F.sig.length; i++) if (F.sig[i] === 1 || F.sig[i] === -1) {
    const d = F.sig[i], e = F.ent[i], risk = Math.abs(e - F.sl[i]); let sl = F.sl[i], be = false, out = null;
    for (let j = i + 1; j < candles.length; j++) {
      const c = candles[j]; const hitSL = d === 1 ? c.low <= sl : c.high >= sl, hitTP = d === 1 ? c.high >= F.tp[i] : c.low <= F.tp[i];
      if (hitSL) { out = { bar: j, kind: be ? 0 : -1, px: sl }; break; }
      if (hitTP) { out = { bar: j, kind: 1, px: F.tp[i] }; break; }
      if (!hold(c.openTime)) { out = { bar: j, kind: 2, px: c.close }; break; }
      if (!be && (d === 1 ? c.high >= e + beR * risk : c.low <= e - beR * risk)) { be = true; sl = e; }
    }
    if (out) sims.push({ ...out, r: d * (out.px - e) / risk - cost / risk, entryBar: i });
  }
  const got = []; for (let i = 0; i < F.ek.length; i++) if (F.ek[i] !== 99 && Number.isFinite(F.ek[i])) got.push({ bar: i, kind: F.ek[i], r: F.er[i] });
  check(`exit engine matches independent re-simulation (${sims.length} closed trades)`, sims.length === got.length && sims.every((s, i) => s.bar === got[i].bar && s.kind === got[i].kind && near(s.r, got[i].r, 1e-7)),
    `sims=${sims.length} got=${got.length} firstDiff=${sims.findIndex((s, i) => !got[i] || s.bar !== got[i].bar || s.kind !== got[i].kind || !near(s.r, got[i].r, 1e-7))}`);

  // --- 3) statistics engine ---
  const last = (n) => { const v = series(full, n); return v[v.length - 1]; };
  let cum = 0, peak = 0, dd = 0; for (const g of got) { cum += g.r; peak = Math.max(peak, cum); dd = Math.max(dd, peak - cum); }
  check('sim trade count / net R / max drawdown equal recomputation', last('Sim trades') === got.length && near(last('Sim net R'), cum, 1e-7) && near(last('Sim max drawdown R'), dd, 1e-7),
    `script: ${last('Sim trades')} ${last('Sim net R')} ${last('Sim max drawdown R')}  recomputed: ${got.length} ${cum} ${dd}`);

  // --- 4) invariants on every signal ---
  let bad = 0; for (let i = 0; i < F.sig.length; i++) if (F.sig[i] === 1 || F.sig[i] === -1) {
    const d = F.sig[i], rk = Math.abs(F.ent[i] - F.sl[i]) / 1e-4, h = new Date(candles[i].openTime).getUTCHours() + new Date(candles[i].openTime).getUTCMinutes() / 60;
    const okSide = d === 1 ? F.sl[i] < F.ent[i] && F.tp[i] > F.ent[i] : F.sl[i] > F.ent[i] && F.tp[i] < F.ent[i];
    const okRR = near(Math.abs(F.tp[i] - F.ent[i]) / Math.abs(F.ent[i] - F.sl[i]), 1.5, 1e-6);
    const okWin = h >= 7 && h < 15.5, okRisk = rk >= 6 - 1e-9 && rk <= 25 + 1e-9, okBias = F.trend[i] === d;
    if (!(okSide && okRR && okWin && okRisk && okBias)) { bad++; if (bad < 4) console.log('  bad signal', i, { d, okSide, okRR, okWin, okRisk, okBias, rk, h }); }
  }
  check('every signal: correct side of entry, exactly 1.5R target, inside entry window, 6-25 pip stop, aligned with HTF bias', bad === 0, `bad=${bad}`);
  // one trade at a time: entry bar never lies inside a previous trade
  let overlap = 0; for (let i = 1; i < sims.length; i++) if (sims[i].entryBar <= sims[i - 1].bar - 0 && sims[i].entryBar < sims[i - 1].bar) overlap++;
  check('no overlapping trades', overlap === 0, `overlap=${overlap}`);
  // per-day cap
  const perDay = {}; for (let i = 0; i < F.sig.length; i++) if (F.sig[i] === 1 || F.sig[i] === -1) { const k = new Date(candles[i].openTime).toISOString().slice(0, 10); perDay[k] = (perDay[k] || 0) + 1; }
  check('max 3 trades per day', Math.max(0, ...Object.values(perDay)) <= 3, JSON.stringify(perDay));
}
process.exit(summary() ? 1 : 0);
