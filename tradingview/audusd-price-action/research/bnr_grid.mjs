// Break-and-retest exploration grid: 2005-2012 (in-sample) only.
import { ctxFor, split } from './research.mjs';
import { stats } from './engine.mjs';
import { runBnR } from './bnr.mjs';
import fs from 'fs';
const rows = [];
for (const tf of [5, 15]) {
  const ctx = ctxFor(tf);
  for (const levels of ['swing', 'swing+pd']) for (const tpR of [1, 1.5, 2]) for (const trend of ['off', 'with']) for (const strongBreak of [false, true]) {
    const p = { levels, tpR, trend, strongBreak, ...(tf === 15 ? { minStop: 6, maxStop: 30 } : {}) };
    const tr = split(ctx, runBnR(ctx, p));
    const s = stats(tr.IS, 8);
    const gross = tr.IS.length ? tr.IS.reduce((a, t) => a + t.netR + 0.0001 / t.risk, 0) / tr.IS.length : NaN;
    rows.push({ tf, ...p, IS: s, gross });
  }
}
fs.writeFileSync(new URL('./bnr_grid_is.json', import.meta.url), JSON.stringify(rows));
rows.sort((a, b) => b.IS.avgR - a.IS.avgR);
console.log('break & retest, 2005-2012 in-sample, 1 pip cost (avgR net; gross = before costs)');
for (const r of rows) console.log(`M${String(r.tf).padEnd(2)} ${r.levels.padEnd(8)} ${String(r.tpR).padEnd(3)}R trend ${r.trend.padEnd(4)} strong ${String(r.strongBreak).padEnd(5)} | n ${String(r.IS.n).padStart(5)} (${String(r.IS.perYear).padStart(4)}/y) win ${String(r.IS.win).padStart(4)}% avgR ${(r.IS.avgR >= 0 ? '+' : '') + r.IS.avgR.toFixed(3)} [${r.IS.lo},${r.IS.hi}] PF ${r.IS.pf} gross ${r.gross.toFixed(3)}`);
