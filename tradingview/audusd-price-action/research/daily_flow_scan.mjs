// Daily scalp scan: at scheduled flow times, fade or follow the previous 30 minutes. IS (2005-2012) and VAL (2013-2016).
// Month-end days are excluded so the result is independent of the month-end strategy.
import { loadM1, tradingWeekOnly, tzOffsetMin } from './data.mjs';
import { SPLITS } from './research.mjs';
const m1 = tradingWeekOnly(loadM1('AUD_USD'));
const T0 = m1.t[0], N = m1.t[m1.n - 1] - T0 + 2;
const ff = new Int32Array(N).fill(-1), lastSeen = new Int32Array(N).fill(-1);
for (let i = 0; i < m1.n; i++) { ff[m1.t[i] - T0] = m1.c[i]; lastSeen[m1.t[i] - T0] = m1.t[i]; }
for (let k = 1; k < N; k++) if (ff[k] < 0) { ff[k] = ff[k - 1]; lastSeen[k] = lastSeen[k - 1]; }
// price at time T (minutes) = close of the bar that started at T-1 (or the last bar before it, if traded within 10 minutes)
const P = (T) => { const k = T - 1 - T0; if (k < 0 || k >= N || ff[k] < 0 || T - 1 - lastSeen[k] > 10) return NaN; return ff[k]; };
const EVENTS = [
  ['Tokyo open 09:00', 'Asia/Tokyo', 540], ['Tokyo fix 09:55', 'Asia/Tokyo', 595], ['China data 10:00 Beijing', 'Asia/Shanghai', 600],
  ['AU data 11:30 Sydney', 'Australia/Sydney', 690], ['Tokyo close 15:00', 'Asia/Tokyo', 900], ['Frankfurt open 08:00', 'Europe/Berlin', 480],
  ['London open 08:00', 'Europe/London', 480], ['ECB fix 14:15 CET', 'Europe/Berlin', 855], ['US data 08:30 NY', 'America/New_York', 510],
  ['NY open 09:30', 'America/New_York', 570], ['NY cut 10:00', 'America/New_York', 600], ['London fix 16:00', 'Europe/London', 960],
];
const isLastTD = (y, mo, d) => { const dt = new Date(Date.UTC(y, mo, d)); do { dt.setUTCDate(dt.getUTCDate() + 1); } while (dt.getUTCDay() === 0 || dt.getUTCDay() === 6); return dt.getUTCMonth() !== mo; };
const rows = [];
for (const [name, tz, lm] of EVENTS) {
  // event instants: for every local calendar weekday
  const inst = [];
  for (let day = Math.floor(T0 / 1440) - 1; day * 1440 < T0 + N; day++) {
    const dt = new Date(day * 86400000), wd = dt.getUTCDay();
    if (wd === 0 || wd === 6) continue;
    if (isLastTD(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())) continue;
    const approx = day * 1440 + lm;
    const T = approx - tzOffsetMin(tz, approx);
    inst.push(T);
  }
  for (const H of [30, 60]) for (const thr of [0, 5]) for (const dirName of ['fade', 'follow']) {
    const res = {};
    for (const per of ['IS', 'VAL']) {
      const xs = [];
      for (const T of inst) {
        if (T < SPLITS[per][0] || T >= SPLITS[per][1]) continue;
        const p0 = P(T - 30), p1 = P(T), p2 = P(T + H);
        if ([p0, p1, p2].some(Number.isNaN)) continue;
        const pre = (p1 - p0) / 10; if (pre === 0 || Math.abs(pre) < thr) continue;
        const s = dirName === 'fade' ? -Math.sign(pre) : Math.sign(pre);
        xs.push(s * (p2 - p1) / 10);
      }
      const m = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
      res[per] = { n: xs.length, m, t: m / (sd / Math.sqrt(xs.length)) };
    }
    rows.push({ name, H, thr, dirName, ...res });
  }
}
console.log(`${rows.length} variants scanned. Gross pips per trade before costs (1 pip cost must be beaten).`);
console.log('variant'.padEnd(52), 'IS n / mean / t'.padEnd(26), 'VAL n / mean / t');
const fmt = (r) => `${String(r.n).padStart(4)} ${(r.m >= 0 ? '+' : '') + r.m.toFixed(2).padStart(5)} (${r.t.toFixed(1).padStart(4)})`;
const best = [...rows].sort((a, b) => Math.min(b.IS.m, b.VAL.m) - Math.min(a.IS.m, a.VAL.m)).slice(0, 15);
for (const r of best) console.log(`${r.name} | ${r.dirName} | hold ${r.H}m | move>=${r.thr}`.padEnd(52), fmt(r.IS).padEnd(26), fmt(r.VAL));
const pass = rows.filter((r) => r.IS.m > 1 && r.VAL.m > 1 && r.IS.t > 2 && r.VAL.t > 2);
console.log(`\nvariants beating 1 pip gross with t > 2 in BOTH periods: ${pass.length}`);
const consistent = rows.filter((r) => Math.sign(r.IS.m) === Math.sign(r.VAL.m) && Math.abs(r.IS.t) > 2 && Math.abs(r.VAL.t) > 2);
console.log(`variants with the same sign and |t| > 2 in both periods (any size): ${consistent.length}`, consistent.map((r) => `${r.name}/${r.dirName}/${r.H}m/>=${r.thr}: IS ${r.IS.m.toFixed(2)} VAL ${r.VAL.m.toFixed(2)}`).join(' ; '));
