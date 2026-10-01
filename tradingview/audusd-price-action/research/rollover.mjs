// Minute-level average move around the 17:00 New York rollover, by year (mid prices).
import { loadM1, tradingWeekOnly, localMinOfDay } from './data.mjs';
const m1 = tradingWeekOnly(loadM1());
const pip = 1e-4;
const prof = {}, jump = {};
for (let i = 1; i < m1.n; i++) {
  const ny = localMinOfDay('America/New_York', m1.t[i]);
  const rel = ny - 1020; // minutes after 17:00 NY
  if (rel < -20 || rel > 40) continue;
  if (m1.t[i] - m1.t[i - 1] > 60 * 24) continue; // skip the weekly open
  const y = new Date(m1.t[i] * 60000).getUTCFullYear();
  const r = (m1.c[i] - m1.c[i - 1]) / 10; // pips (points/10), close-to-close
  const k = rel; (prof[k] ||= []).push(r);
  if (rel >= -2 && rel <= 5) jump[y] = (jump[y] || 0) + r, jump[y + 'n'] = (jump[y + 'n'] || 0) + 1;
}
console.log('minutes after 17:00 NY : mean close-to-close move (pips), all years');
for (let k = -5; k <= 10; k++) { const a = prof[k] || []; const m = a.reduce((x, y) => x + y, 0) / a.length; console.log(`  ${String(k).padStart(3)}  ${m.toFixed(3).padStart(7)}  n=${a.length}`); }
let tot = 0, cnt = 0; for (let k = -20; k <= 40; k++) { const a = prof[k] || []; tot += a.reduce((x, y) => x + y, 0); cnt = Math.max(cnt, a.length); }
console.log(`sum over -20..+40 min: ${(tot / cnt).toFixed(2)} pips per day`);
console.log('per-year average move in the -2..+5 minute window (pips per day):');
for (let y = 2005; y <= 2016; y++) console.log(`  ${y}: ${((jump[y] || 0) / ((jump[y + 'n'] || 1) / 8)).toFixed(2)}`);
