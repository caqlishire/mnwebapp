// Neighbourhood check for the swing configuration without round numbers (IS and VAL). Logged.
import { evaluate, fmt, logVariant, byYear } from './research.mjs';
const base = { mode: 'Swing', useRound: false };
const grid = [];
for (const tf of [60, 240]) {
  grid.push([`tf ${tf} base`, tf, base]);
  for (const swingLen of [3, 8]) grid.push([`tf ${tf} swingLen ${swingLen}`, tf, { ...base, swingLen }]);
  for (const minReject of [0.5, 0.7]) grid.push([`tf ${tf} minReject ${minReject}`, tf, { ...base, minReject }]);
  for (const confirmBars of [1, 5]) grid.push([`tf ${tf} confirmBars ${confirmBars}`, tf, { ...base, confirmBars }]);
  for (const tpR of [1.5, 3]) grid.push([`tf ${tf} target ${tpR}R`, tf, { ...base, mode: 'Custom', cMinStop: 15, cMaxStop: 80, cTpR: tpR, cBeR: 1, cSess: false }]);
  grid.push([`tf ${tf} bias off`, tf, { ...base, useBias: false }]);
  grid.push([`tf ${tf} immediate entry`, tf, { ...base, entryMode: 'Immediate' }]);
  for (const costPips of [0, 2]) grid.push([`tf ${tf} cost ${costPips} pip`, tf, { ...base, costPips }]);
}
const rows = [];
for (const [name, tf, p] of grid) {
  const r = evaluate(tf, p);
  logVariant('robustness ' + name, tf, p, r.out);
  rows.push([name, r.out.IS.avgR, r.out.VAL.avgR]);
  console.log(name.padEnd(26), 'IS ', fmt(r.out.IS), '\n'.padEnd(27), 'VAL', fmt(r.out.VAL));
}
const r = evaluate(240, base);
console.log('\nH4 swing, no round numbers, by year (IS + VAL):');
for (const [y, s] of Object.entries({ ...byYear(r.ctx, r.trades.IS), ...byYear(r.ctx, r.trades.VAL) })) console.log('  ', y, fmt(s));
