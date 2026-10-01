// Shared scenario definitions, used by both the indicator and the strategy test-suites.
import { B, q, ramp, mirror, check, near } from './scen_lib.mjs';
export const START = '2025-01-08T00:00:00Z'; // London == UTC in January
export const M = 0.6425;                       // mirror centre: a multiple of 0.0025 so 0.005 round levels map onto round levels
export const costR = 0.0001 / 0.0015;

export function sellLead() {
  const b = [];
  b.push(...ramp(0.6400, 0.6428, 20));
  b.push(B(0.6428, 0.6430, 0.6425, 0.6426));   // 20 swing high 0.6430
  b.push(...ramp(0.6426, 0.6412, 7));           // 21-27
  b.push(...ramp(0.6412, 0.6428, 9));           // 28-36
  return b;
}
export const S = B(0.6428, 0.6434, 0.6424, 0.6425);
export const C = B(0.6425, 0.6426, 0.6418, 0.6420);
export const tail = (n, from = 0.6398) => ramp(from, from - 0.0002 * n, n);

// run a scenario in the sell orientation and again mirrored (buy orientation)
export async function both(name, runFn, mkBars, start, ov, fn) {
  console.log(name);
  for (const side of ['sell', 'buy']) {
    const bars = side === 'sell' ? mkBars() : mirror(mkBars(), M);
    const r = await runFn(bars, start, ov);
    const P = side === 'sell' ? (x) => x : (x) => q(2 * M - x);
    const D = side === 'sell' ? -1 : 1;
    console.log(`  [${side}]`);
    fn(r, P, D, side);
  }
}
