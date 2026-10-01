import fs from 'fs';
import { genCandles, runPine, series } from './harness.mjs';
import { patchInputs } from './scen_lib.mjs';
const D = new URL('../../', import.meta.url).pathname + '';
let total = 0, bad = 0;
for (const lim of [0, 1, 2]) {
  // Scalp values with break-even off (the emulator cannot modify exit orders); no costs in either
  const indSrc = patchInputs(fs.readFileSync(D + 'AUDUSD_Liquidity_Sweep.pine', 'utf8'), { mode: 'Custom', cBeR: 0, costPips: 0, maxLossesDay: lim });
  const strSrc = patchInputs(fs.readFileSync(D + 'AUDUSD_Liquidity_Sweep_Strategy.pine', 'utf8'), { mode: 'Custom', cBeR: 0, maxLossesDay: lim }).replace('slippage = 5', 'slippage = 0');
  let nSig = 0, d = 0, capViol = 0;
  for (const seed of [11, 23, 57, 91, 5, 77]) {
    const candles = genCandles({ days: 70, seed });
    const ind = await runPine(indSrc, candles), str = await runPine(strSrc, candles);
    const S = (n) => series(ind, n);
    const sig = S('Signal (1 buy, -1 sell)'), ent = S('Signal entry'), ek = S('Exit kind (1 TP, -1 SL, 0 BE, 2 EOD, 99 none)'), er = S('Exit net R');
    const isig = [], iex = [];
    for (let i = 0; i < sig.length; i++) { if (sig[i] === 1 || sig[i] === -1) isig.push({ bar: i, dir: sig[i], entry: ent[i] }); if (ek[i] !== 99 && Number.isFinite(ek[i])) iex.push({ bar: i, kind: ek[i], r: er[i] }); }
    const ct = str.strategy.closedtrades;
    if (ct.length !== isig.length) d++;
    isig.forEach((s, k) => { const t = ct[k], e = iex[k]; if (!t || !e) { d++; return; }
      const okE = (t.entry_bar_index === s.bar || t.entry_bar_index === s.bar + 1) && Math.abs(t.entry_price - s.entry) < 1e-9 && (t.size > 0) === (s.dir === 1);
      const okX = e.kind === 2 ? (t.exit_bar_index === e.bar || t.exit_bar_index === e.bar + 1) && Math.abs(t.exit_price - candles[e.bar].close) < 1e-9 : t.exit_bar_index === e.bar;
      if (!okE || !okX) d++; });
    // the cap itself: within a UTC day, once `lim` losses (R <= -0.5) have been realised no further signal may appear
    if (lim > 0) { const lossesByDay = {}; let ei = 0;
      for (let i = 0; i < candles.length; i++) { const day = new Date(candles[i].openTime).toISOString().slice(0, 10);
        while (ei < iex.length && iex[ei].bar <= i) { const dd = new Date(candles[iex[ei].bar].openTime).toISOString().slice(0, 10); if (iex[ei].r <= -0.5) lossesByDay[dd] = (lossesByDay[dd] || 0) + 1; ei++; }
        if ((sig[i] === 1 || sig[i] === -1) && (lossesByDay[day] || 0) >= lim) capViol++; } }
    nSig += isig.length;
  }
  console.log(`maxLossesDay=${lim}: ${nSig} trades compared across 6 datasets, strategy/indicator mismatches ${d}, signals after the daily loss limit ${lim ? capViol : 'n/a'}`);
  total += nSig; bad += d + capViol;
}
console.log(`\nTOTAL ${total} trades, ${bad} problems`);
process.exit(bad ? 1 : 0);
