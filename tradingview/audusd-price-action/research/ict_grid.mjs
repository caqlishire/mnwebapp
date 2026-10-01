// ICT models: exploration grid on 2005-2012 (in-sample) only.
import fs from 'fs';
import { ctxFor, split } from './research.mjs';
import { model2022, modelJudas, modelOTE, modelOB, modelSB2 } from './ict.mjs';
const ctx = ctxFor(5);
const S = (ts) => {
  const n = ts.length; if (!n) return { n: 0, avgR: NaN, t: NaN, gross: NaN };
  const rs = ts.map((t) => t.netR), m = rs.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(rs.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  let gp = 0, gl = 0; for (const r of rs) { if (r > 0) gp += r; else gl -= r; }
  const win = ts.filter((t) => t.kind === 'target' || (t.kind === 'time' && t.netR > 0)).length;
  return { n, perY: n / 8, win: 100 * win / n, avgR: m, t: m / (sd / Math.sqrt(n)), pf: gp / gl, gross: ts.reduce((a, t) => a + t.grossR, 0) / n, stop: ts.reduce((a, t) => a + t.stopPips, 0) / n };
};
const configs = [];
for (const kz of ['LDN', 'NY']) for (const entryAt of ['edge', 'mid']) for (const target of ['2R', '3R', 'pool']) for (const bias of ['off', 'struct'])
  configs.push(['2022 model', { kz, entryAt, target, bias }, (p) => model2022(ctx, p)]);
for (const bias of ['struct', 'candle', 'off']) for (const raidMin of [3, 10]) for (const target of ['2R', '3R', 'range'])
  configs.push(['Judas swing', { bias, raidMin, target }, (p) => modelJudas(ctx, p)]);
for (const minLeg of [10, 20]) for (const target of [0, 0.27, 0.62]) for (const bias of ['off', 'struct'])
  configs.push(['OTE', { minLeg, target, bias }, (p) => modelOTE(ctx, p)]);
for (const entryAt of ['mt', 'edge']) for (const tpR of [2, 3]) for (const bias of ['off', 'struct'])
  configs.push(['Order block', { entryAt, tpR, bias }, (p) => modelOB(ctx, p)]);
for (const win of ['LO', 'AM', 'PM']) for (const target of ['20p', '2R']) for (const bias of ['struct', 'off'])
  configs.push(['Silver Bullet v2', { win, target, bias }, (p) => modelSB2(ctx, p)]);
const rows = [];
for (const [model, p, fn] of configs) { const tr = split(ctx, fn(p)); rows.push({ model, p, IS: S(tr.IS) }); }
fs.writeFileSync(new URL('./ict_grid_is.json', import.meta.url), JSON.stringify(rows));
console.log(`${rows.length} ICT configurations, 2005-2012, M5 signals, 1-minute fills, 1 pip cost`);
for (const model of ['2022 model', 'Judas swing', 'OTE', 'Order block', 'Silver Bullet v2']) {
  const rs = rows.filter((r) => r.model === model).sort((a, b) => b.IS.avgR - a.IS.avgR);
  const pos = rs.filter((r) => r.IS.avgR > 0).length;
  console.log(`\n== ${model}: ${pos}/${rs.length} configs positive after costs; average gross ${(rs.reduce((a, r) => a + r.IS.gross, 0) / rs.length).toFixed(3)}R`);
  for (const r of rs.slice(0, 4)) console.log(`   ${JSON.stringify(r.p).padEnd(52)} n ${String(r.IS.n).padStart(5)} (${r.IS.perY.toFixed(0)}/y) win ${r.IS.win.toFixed(0)}% avgR ${(r.IS.avgR >= 0 ? '+' : '') + r.IS.avgR.toFixed(3)} (t ${r.IS.t.toFixed(1)}) PF ${r.IS.pf.toFixed(2)} gross ${(r.IS.gross >= 0 ? '+' : '') + r.IS.gross.toFixed(3)} stop ${r.IS.stop.toFixed(1)}p`);
  const w = rs[rs.length - 1]; console.log(`   worst: ${JSON.stringify(w.p)} avgR ${w.IS.avgR.toFixed(3)}`);
}
