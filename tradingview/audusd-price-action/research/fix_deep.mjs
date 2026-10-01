// Month-end London fix fade: path profile, pre-fix window, threshold, adverse excursion, by year. IS and VAL only.
import { loadM1, tradingWeekOnly, localMinOfDay, tzOffsetMin } from './data.mjs';
import { SPLITS } from './research.mjs';
const m1 = tradingWeekOnly(loadM1());
const pip = 1e-4;
// index minutes by London calendar day: day -> {min -> close, highs/lows}
const days = new Map();
for (let i = 0; i < m1.n; i++) {
  const t = m1.t[i], off = tzOffsetMin('Europe/London', t), lt = t + off;
  const lm = ((lt % 1440) + 1440) % 1440;
  if (lm < 840 || lm > 1140) continue; // 14:00-19:00 London
  const dk = Math.floor(lt / 1440);
  let d = days.get(dk); if (!d) { d = { dk, t, bars: [] }; days.set(dk, d); }
  d.bars.push({ lm, o: m1.o[i] / 1e5, h: m1.h[i] / 1e5, l: m1.l[i] / 1e5, c: m1.c[i] / 1e5 });
}
const lastTradingDayOfMonth = (dk) => { const d = new Date(dk * 86400000); const nx = new Date(d); do { nx.setUTCDate(nx.getUTCDate() + 1); } while (nx.getUTCDay() === 0 || nx.getUTCDay() === 6); return nx.getUTCMonth() !== d.getUTCMonth(); };
const priceAt = (d, lm) => { let p; for (const b of d.bars) { if (b.lm <= lm) p = b.c; else break; } return p; }; // close of last minute <= lm
const P_OF = (t) => (t >= SPLITS.IS[0] && t < SPLITS.IS[1] ? 'IS' : t >= SPLITS.VAL[0] && t < SPLITS.VAL[1] ? 'VAL' : null);
const ev = [];
for (const d of days.values()) {
  const P = P_OF(d.t); if (!P || !lastTradingDayOfMonth(d.dk)) continue;
  const fix = priceAt(d, 959); if (fix === undefined) continue;
  ev.push({ d, P, fix, y: new Date(d.dk * 86400000).getUTCFullYear() });
}
console.log(`month-end days: IS ${ev.filter((e) => e.P === 'IS').length}, VAL ${ev.filter((e) => e.P === 'VAL').length}`);
const tstat = (xs) => { const m = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1)); return [m, m / (sd / Math.sqrt(xs.length))]; };
// 1) pre-fix window start x exit time: mean reversal (pips) and t
console.log('\nmean move AGAINST the pre-fix move, measured from the 16:00 fix price (pips, t):');
const exits = [965, 970, 980, 990, 1010, 1020, 1050, 1080];
console.log('pre-fix window'.padEnd(18), ...exits.map((x) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`.padStart(19)));
for (const start of [899, 929, 944]) for (const P of ['IS', 'VAL']) {
  const cells = exits.map((x) => { const xs = []; for (const e of ev) { if (e.P !== P) continue; const p0 = priceAt(e.d, start), px = priceAt(e.d, x - 1); if (p0 === undefined || px === undefined) continue; const pre = e.fix - p0; if (pre === 0) continue; xs.push(-Math.sign(pre) * (px - e.fix) / pip); } const [m, t] = tstat(xs); return `${m.toFixed(2).padStart(6)} (${t.toFixed(1).padStart(4)}) n${xs.length}`.padStart(19); });
  console.log(`${Math.floor((start + 1) / 60)}:${String((start + 1) % 60).padStart(2, '0')}-16:00 ${P.padEnd(3)}`.padEnd(18), ...cells);
}
// 2) threshold on the pre-fix move size (15:30-16:00), exit 16:50
console.log('\nthreshold on |15:30->16:00 move| (exit 16:50): mean reversal pips (t) n');
for (const thr of [0, 3, 5, 8, 12]) {
  const row = [];
  for (const P of ['IS', 'VAL']) { const xs = []; for (const e of ev) { if (e.P !== P) continue; const pre = (e.fix - priceAt(e.d, 929)) / pip; if (Math.abs(pre) < thr) continue; xs.push(-Math.sign(pre) * (priceAt(e.d, 1009) - e.fix) / pip); } const [m, t] = tstat(xs); row.push(`${P} ${m.toFixed(2).padStart(6)} (${t.toFixed(1)}) n${xs.length}`); }
  console.log(`  >= ${String(thr).padStart(2)} pips: ${row.join('   ')}`);
}
// 3) adverse excursion between 16:00 and 16:50 against the trade, and favourable excursion
console.log('\nexcursions 16:00-16:50 for the fade trade (pips): percentiles of max adverse (MAE) and max favourable (MFE)');
for (const P of ['IS', 'VAL']) {
  const mae = [], mfe = [];
  for (const e of ev) { if (e.P !== P) continue; const pre = e.fix - priceAt(e.d, 929); if (pre === 0) continue; const dir = -Math.sign(pre); let a = 0, f = 0; for (const b of e.d.bars) { if (b.lm < 960 || b.lm > 1009) continue; a = Math.max(a, dir === 1 ? (e.fix - b.l) / pip : (b.h - e.fix) / pip); f = Math.max(f, dir === 1 ? (b.h - e.fix) / pip : (e.fix - b.l) / pip); } mae.push(a); mfe.push(f); }
  const pct = (a, q) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(q * s.length))].toFixed(1); };
  console.log(`  ${P}: MAE p50 ${pct(mae, 0.5)} p75 ${pct(mae, 0.75)} p90 ${pct(mae, 0.9)} max ${pct(mae, 0.999)} | MFE p50 ${pct(mfe, 0.5)} p75 ${pct(mfe, 0.75)} p90 ${pct(mfe, 0.9)}`);
}
// 4) by year, exit 16:50, window 15:30
console.log('\nby year (15:30-16:00 window, exit 16:50): sum of pips (n)');
const yr = {}; for (const e of ev) { const pre = e.fix - priceAt(e.d, 929); if (pre === 0) continue; const r = -Math.sign(pre) * (priceAt(e.d, 1009) - e.fix) / pip; (yr[e.y] ||= []).push(r); }
console.log('  ' + Object.entries(yr).map(([y, a]) => `${y}: ${a.reduce((s, v) => s + v, 0).toFixed(0)} (${a.length})`).join('  '));
