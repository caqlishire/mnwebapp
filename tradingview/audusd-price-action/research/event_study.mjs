// Forward drift (pips, in the trade direction) after liquidity events on M15. In-sample unless PERIOD=VAL.
import { ctxFor, SPLITS } from './research.mjs';
import { GE, GT, LE, LT } from './engine.mjs';
const PER = process.env.PERIOD || 'IS';
if (PER === 'OOS' && process.env.OPEN_OOS !== '1') throw new Error('OOS closed');
const [A, B] = SPLITS[PER];
const ctx = ctxFor(15);
const { n, H, L, C, t } = ctx;
const pip = 0.0001, HZ = [4, 8, 16, 32, 96];
// Asian range (Tokyo 09:00-16:00) and previous-week high/low
const asHi = new Float64Array(n).fill(NaN), asLo = new Float64Array(n).fill(NaN);
{ let hi = NaN, lo = NaN, ph = NaN, pl = NaN, prev = false;
  for (let i = 0; i < n; i++) { const inA = ctx.tkyMin[i] >= 540 && ctx.tkyMin[i] < 960;
    if (inA) { if (!prev) { hi = H[i]; lo = L[i]; ph = NaN; pl = NaN; } else { hi = Math.max(hi, H[i]); lo = Math.min(lo, L[i]); } }
    else if (prev) { ph = hi; pl = lo; }
    prev = inA; asHi[i] = inA ? NaN : ph; asLo[i] = inA ? NaN : pl; } }
const ev = {}; // name -> array of {i, dir}
const add = (k, i, dir) => (ev[k] ||= []).push({ i, dir });
const rStep = 50 * pip;
for (let i = 1; i < n - 100; i++) {
  if (t[i] < A || t[i] >= B) continue;
  const lon = ctx.lonMin[i], sess = lon >= 420 && lon < 1020 ? 'LDN/NY' : 'ASIA/late';
  const lv = { PD: [ctx.pdh[i], ctx.pdl[i]], ASIA: [asHi[i], asLo[i]] };
  const rUp = Math.floor(H[i] / rStep + 1e-9) * rStep, rDn = Math.ceil(L[i] / rStep - 1e-9) * rStep;
  lv.ROUND = [rUp, rDn];
  const rng = H[i] - L[i];
  for (const [name, [hi, lo]] of Object.entries(lv)) {
    if (!Number.isNaN(hi)) {
      // breakout: previous close at/below, this close above
      if (name !== 'ROUND' && LE(C[i - 1], hi) && GT(C[i], hi)) add(`${name} breakout   up  ${sess}`, i, 1);
      // sweep-reject: wick >= 1 pip above, close back below, close in lower 40% of range
      if (GE(H[i] - hi, pip) && LT(C[i], hi) && rng > 0 && (H[i] - C[i]) / rng >= 0.6) add(`${name} sweep->sell     ${sess}`, i, -1);
    }
    if (!Number.isNaN(lo)) {
      if (name !== 'ROUND' && GE(C[i - 1], lo) && LT(C[i], lo)) add(`${name} breakout   down ${sess}`, i, -1);
      if (GE(lo - L[i], pip) && GT(C[i], lo) && rng > 0 && (C[i] - L[i]) / rng >= 0.6) add(`${name} sweep->buy      ${sess}`, i, 1);
    }
  }
  // round-number cross (close-to-close) in either direction
  const cUp = Math.floor(C[i - 1] / rStep + 1e-9) * rStep + rStep;
  if (GT(C[i], cUp) && LE(C[i - 1], cUp)) add(`ROUND breakout   up  ${sess}`, i, 1);
  const cDn = Math.ceil(C[i - 1] / rStep - 1e-9) * rStep - rStep;
  if (LT(C[i], cDn) && GE(C[i - 1], cDn)) add(`ROUND breakout   down ${sess}`, i, -1);
}
// unconditional baseline: every bar, long
console.log(`Forward drift after events, M15, ${PER} (${new Date(A * 60000).getUTCFullYear()}-${new Date(B * 60000).getUTCFullYear() - 1}). Mean move in trade direction, pips (t-stat). Cost to beat: ~1 pip.`);
console.log('event'.padEnd(34), 'n'.padStart(6), ...HZ.map((h) => `${(h / 4)}h`.padStart(15)));
for (const k of Object.keys(ev).sort()) {
  const E = ev[k];
  const cols = HZ.map((h) => {
    let s = 0, s2 = 0, m = 0;
    for (const { i, dir } of E) { if (i + h >= n) continue; const r = dir * (C[i + h] - C[i]) / pip; s += r; s2 += r * r; m++; }
    const mu = s / m, sd = Math.sqrt((s2 - m * mu * mu) / (m - 1));
    return `${mu.toFixed(2).padStart(6)} (${(mu / (sd / Math.sqrt(m))).toFixed(1).padStart(4)})`;
  });
  console.log(k.padEnd(34), String(E.length).padStart(6), ...cols.map((c) => c.padStart(15)));
}
