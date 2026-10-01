// ICT Silver Bullet exploration grid on M5, 2005-2012 (in-sample) only.
import { ctxFor, split } from './research.mjs';
import { stats } from './engine.mjs';
import { runSilverBullet } from './silver_bullet.mjs';
import fs from 'fs';
const ctx = ctxFor(5);
const rows = [];
for (const win of ['LO', 'AM', 'PM']) for (const sweep of [false, true]) for (const entryAt of ['edge', 'mid']) for (const tpR of [1, 2, 3]) {
  const p = { win, sweep, entryAt, tpR };
  const tr = split(ctx, runSilverBullet(ctx, p));
  const s = stats(tr.IS, 8);
  const gross = tr.IS.length ? tr.IS.reduce((a, t) => a + t.netR + 0.0001 / t.risk, 0) / tr.IS.length : NaN;
  const stopPips = tr.IS.length ? tr.IS.reduce((a, t) => a + t.risk / 0.0001, 0) / tr.IS.length : NaN;
  rows.push({ ...p, IS: s, gross, stopPips });
}
fs.writeFileSync(new URL('./sb_grid_is.json', import.meta.url), JSON.stringify(rows));
rows.sort((a, b) => b.IS.avgR - a.IS.avgR);
console.log('ICT Silver Bullet (M5 signal, 1-minute fills), 2005-2012 in-sample, 1 pip cost');
for (const r of rows) console.log(`${r.win} raid ${String(r.sweep).padEnd(5)} entry ${r.entryAt.padEnd(4)} ${r.tpR}R | n ${String(r.IS.n).padStart(4)} (${String(r.IS.perYear).padStart(3)}/y) win ${String(r.IS.win).padStart(4)}% avgR ${(r.IS.avgR >= 0 ? '+' : '') + r.IS.avgR.toFixed(3)} [${r.IS.lo},${r.IS.hi}] PF ${String(r.IS.pf).padStart(4)} gross ${(r.gross >= 0 ? '+' : '') + r.gross.toFixed(3)} avg stop ${r.stopPips.toFixed(1)} pips`);
