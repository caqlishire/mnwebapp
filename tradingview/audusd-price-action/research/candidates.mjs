// Pre-registered candidate fixes (rationale in comments). IS and VAL only; every run is logged.
import { evaluate, fmt, logVariant } from './research.mjs';
const sw = { mode: 'Swing' };
const cands = [
  // C0 reference: current defaults on their intended timeframes
  ['C0  v2 Scalp M15 (current default)', 15, { mode: 'Scalp' }],
  ['C0  v2 Swing H1', 60, sw],
  ['C0  v2 Swing H4', 240, sw],
  // C1 drop round-number sweeps (event study: no reversal after round-number sweeps)
  ['C1  H4 Swing, no round numbers', 240, { ...sw, useRound: false }],
  ['C1  H1 Swing, no round numbers', 60, { ...sw, useRound: false }],
  ['C1  M15 Scalp, no round numbers', 15, { mode: 'Scalp', useRound: false }],
  // C2 previous-day high/low only (the one level with consistent reversion in both periods)
  ['C2  H1 Swing, PDH/PDL only', 60, { ...sw, useRound: false, useSwing: false, useAsia: false }],
  ['C2  M15, PDH/PDL only, 2R, any session', 15, { mode: 'Custom', cMinStop: 8, cMaxStop: 40, cTpR: 2, cBeR: 1, cSess: false, useRound: false, useSwing: false, useAsia: false }],
  // C3 confluence of two level types
  ['C3  H1 Swing, min confluence 2', 60, { ...sw, minConf: 2 }],
  ['C3  H4 Swing, min confluence 2', 240, { ...sw, minConf: 2 }],
  // C4 cost control on M15: stop >= 12 pips so 1 pip cost < 8.5% of R, 2R target
  ['C4  M15, stop 12-40, 2R, LDN/NY', 15, { mode: 'Custom', cMinStop: 12, cMaxStop: 40, cTpR: 2, cBeR: 1, cSess: true }],
  ['C4  M15, stop 12-40, 2R, LDN/NY, no round', 15, { mode: 'Custom', cMinStop: 12, cMaxStop: 40, cTpR: 2, cBeR: 1, cSess: true, useRound: false }],
  // C5 no break-even (BE converts some winners into scratches; check its cost)
  ['C5  H4 Swing, no break-even', 240, { mode: 'Custom', cMinStop: 15, cMaxStop: 80, cTpR: 2, cBeR: 0, cSess: false }],
  ['C5  H1 Swing, no break-even', 60, { mode: 'Custom', cMinStop: 15, cMaxStop: 80, cTpR: 2, cBeR: 0, cSess: false }],
];
for (const [name, tf, p] of cands) {
  const r = evaluate(tf, p);
  logVariant(name, tf, p, r.out);
  console.log(name.padEnd(44), 'IS ', fmt(r.out.IS));
  console.log(''.padEnd(44), 'VAL', fmt(r.out.VAL));
}
