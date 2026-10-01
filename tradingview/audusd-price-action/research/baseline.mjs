import { evaluate, fmt, byYear, logVariant } from './research.mjs';
const runs = [
  ['v2 Scalp  M5 ', 5, { mode: 'Scalp' }],
  ['v2 Scalp  M15', 15, { mode: 'Scalp' }],
  ['v2 Swing  M15', 15, { mode: 'Swing' }],
  ['v2 Swing  H1 ', 60, { mode: 'Swing' }],
  ['v2 Swing  H4 ', 240, { mode: 'Swing' }],
];
for (const [name, tf, p] of runs) {
  const t0 = Date.now();
  const r = evaluate(tf, p);
  const r2 = evaluate(tf, { ...p, exitMode: 'slfirst' });
  console.log(`${name} IS  ${fmt(r.out.IS)}   (${Date.now() - t0} ms)`);
  console.log(`${name} VAL ${fmt(r.out.VAL)}`);
  console.log(`${name}      same-bar stop-first (indicator dashboard): IS avgR ${r2.out.IS.avgR}  VAL avgR ${r2.out.VAL.avgR}`);
  logVariant('baseline ' + name.trim(), tf, p, r.out);
}
const r = evaluate(15, { mode: 'Scalp' });
console.log('\nv2 Scalp M15 by year (IS+VAL):');
for (const [y, s] of Object.entries({ ...byYear(r.ctx, r.trades.IS), ...byYear(r.ctx, r.trades.VAL) })) console.log('  ', y, fmt(s));
const kinds = {}; for (const t of [...r.trades.IS, ...r.trades.VAL]) kinds[t.kind] = (kinds[t.kind] || 0) + 1;
console.log('exit kinds (1 TP, -1 SL, 0 BE, 2 session end):', JSON.stringify(kinds));
