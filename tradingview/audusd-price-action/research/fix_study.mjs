// London 4pm fix: does the move into the fix (15:30-16:00 London) reverse afterwards? All days and month-end days.
import { loadM1, tradingWeekOnly, localMinOfDay } from './data.mjs';
import { SPLITS } from './research.mjs';
const m1 = tradingWeekOnly(loadM1());
const pip = 1e-4;
const byDay = new Map();
for (let i = 0; i < m1.n; i++) {
  const lm = localMinOfDay('Europe/London', m1.t[i]);
  if (lm < 930 || lm > 1050) continue;
  const off = lm - (m1.t[i] % 1440 + 1440) % 1440; // london offset (unused)
  const dkey = Math.floor((m1.t[i] + 60) / 1440);
  let r = byDay.get(dkey); if (!r) { r = { t: m1.t[i] }; byDay.set(dkey, r); }
  const px = m1.c[i] / 1e5;
  if (lm <= 930) r.p1530 = px;            // last close at or before 15:30
  if (lm <= 959) r.p1559 = px;            // close of 15:59 bar = price at the fix
  if (lm <= 1029) r.p1630 = px;
  if (lm <= 1049) r.p1650 = px;
}
const isMonthEnd = (tm) => { const d = new Date(tm * 60000); const nx = new Date(d); nx.setUTCDate(d.getUTCDate() + 1); while (nx.getUTCDay() === 0 || nx.getUTCDay() === 6) nx.setUTCDate(nx.getUTCDate() + 1); return nx.getUTCMonth() !== d.getUTCMonth(); };
for (const P of ['IS', 'VAL']) for (const sub of ['all days', 'month-end']) for (const thr of [0, 5]) {
  const xs = [];
  for (const r of byDay.values()) {
    if (r.t < SPLITS[P][0] || r.t >= SPLITS[P][1] || r.p1530 === undefined || r.p1559 === undefined || r.p1650 === undefined) continue;
    if (sub === 'month-end' && !isMonthEnd(r.t)) continue;
    const pre = (r.p1559 - r.p1530) / pip; if (Math.abs(pre) < thr) continue;
    xs.push(-Math.sign(pre) * (r.p1650 - r.p1559) / pip);
  }
  const m = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
  console.log(`${P.padEnd(4)} ${sub.padEnd(10)} |pre-fix move| >= ${thr} pips: n=${String(xs.length).padStart(4)}  reversal 16:00->16:50 = ${m.toFixed(2)} pips (t ${(m / (sd / Math.sqrt(xs.length))).toFixed(1)})`);
}
