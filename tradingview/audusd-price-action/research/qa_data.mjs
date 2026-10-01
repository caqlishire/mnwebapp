import { loadM1, aggregate, iso, tzOffsetMin, nySessionStart, fxWeekStart, localMinOfDay } from './data.mjs';
const t0 = Date.now();
const m1 = loadM1();
console.log(`M1 rows ${m1.n} loaded in ${Date.now() - t0} ms: ${iso(m1.t[0])} -> ${iso(m1.t[m1.n - 1])}`);
const byYear = {}; let weekend = 0, badHL = 0, spikes = [], zeroRange = 0;
for (let i = 0; i < m1.n; i++) {
  const d = new Date(m1.t[i] * 60000), y = d.getUTCFullYear();
  byYear[y] = (byYear[y] || 0) + 1;
  if (m1.h[i] < m1.l[i] || m1.h[i] < Math.max(m1.o[i], m1.c[i]) || m1.l[i] > Math.min(m1.o[i], m1.c[i])) badHL++;
  if (m1.h[i] === m1.l[i]) zeroRange++;
  if (m1.h[i] - m1.l[i] > 1500) spikes.push(`${iso(m1.t[i])} range ${(m1.h[i] - m1.l[i]) / 10} pips`);
  // Saturday (UTC) or Sunday before 20:00 UTC = outside the FX week
  const wd = d.getUTCDay(), hr = d.getUTCHours();
  if (wd === 6 || (wd === 0 && hr < 20) || (wd === 5 && hr >= 22)) weekend++;
}
console.log('rows per year:', JSON.stringify(byYear));
console.log(`OHLC inconsistencies ${badHL}, zero-range minutes ${(100 * zeroRange / m1.n).toFixed(1)}%, weekend-hour rows ${weekend}`);
console.log(`M1 bars with range > 150 pips: ${spikes.length}`, spikes.slice(0, 8));
// largest gaps inside the trading week
const gaps = [];
for (let i = 1; i < m1.n; i++) { const g = m1.t[i] - m1.t[i - 1]; if (g > 180 && g < 2000) gaps.push([g, iso(m1.t[i - 1])]); }
gaps.sort((a, b) => b[0] - a[0]);
console.log('largest intra-week gaps (minutes):', gaps.slice(0, 10).map((g) => `${g[0]}@${g[1]}`).join(', '), `| gaps >3h: ${gaps.length}`);
// time-zone sanity
const ex = Date.UTC(2015, 6, 15, 12, 0) / 60000;
console.log('NY/London/Tokyo offsets mid-July 2015:', tzOffsetMin('America/New_York', ex), tzOffsetMin('Europe/London', ex), tzOffsetMin('Asia/Tokyo', ex));
const ex2 = Date.UTC(2006, 3, 1, 12, 0) / 60000; // 1 Apr 2006, old US DST rules (DST started 2 Apr)
console.log('NY offset 1 Apr 2006 (old rules, expect -300):', tzOffsetMin('America/New_York', ex2), ' 3 Apr 2006 (expect -240):', tzOffsetMin('America/New_York', ex2 + 2 * 1440));
console.log('session start for 2015-07-15 12:00 UTC:', iso(nySessionStart(ex)), ' week start:', iso(fxWeekStart(ex)));
for (const tf of [5, 15, 60, 240, 'D', 'W']) {
  const a = aggregate(m1, tf);
  const hrs = {}; for (let k = 0; k < Math.min(a.n, 4000); k++) { const h = new Date(a.t[k] * 60000).getUTCHours(); hrs[h] = (hrs[h] || 0) + 1; }
  console.log(`tf ${String(tf).padStart(3)}: ${a.n} bars; first ${iso(a.t[0])}; open hours UTC (first 4000 bars):`, tf === 240 || tf === 'D' || tf === 'W' ? JSON.stringify(hrs) : '');
}
const d = aggregate(m1, 'D');
let wds = {}; for (let k = 0; k < d.n; k++) { const wd = new Date((d.t[k] + 7 * 60 + 300) * 60000).getUTCDay(); wds[wd] = (wds[wd] || 0) + 1; }
console.log('daily bars by weekday label (0=Sun..6=Sat):', JSON.stringify(wds));
