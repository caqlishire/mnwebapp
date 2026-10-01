// Fix-reversal on other scheduled flow days. Measure: move AGAINST the pre-fix move, from the fix price. IS and VAL only.
import { loadM1, tradingWeekOnly, tzOffsetMin } from './data.mjs';
import { SPLITS } from './research.mjs';
const m1 = tradingWeekOnly(loadM1());
const pip = 1e-4;
function dayMap(tz, fromMin, toMin) {
  const days = new Map();
  for (let i = 0; i < m1.n; i++) {
    const t = m1.t[i], lt = t + tzOffsetMin(tz, t), lm = ((lt % 1440) + 1440) % 1440;
    if (lm < fromMin || lm > toMin) continue;
    const dk = Math.floor(lt / 1440);
    let d = days.get(dk); if (!d) { d = { dk, t, bars: [] }; days.set(dk, d); }
    d.bars.push({ lm, c: m1.c[i] / 1e5 });
  }
  return days;
}
const priceAt = (d, lm) => { let p; for (const b of d.bars) { if (b.lm <= lm) p = b.c; else break; } return p; };
const P_OF = (t) => (t >= SPLITS.IS[0] && t < SPLITS.IS[1] ? 'IS' : t >= SPLITS.VAL[0] && t < SPLITS.VAL[1] ? 'VAL' : null);
const nextWeekday = (dk, k = 1) => { const d = new Date(dk * 86400000); let c = 0; while (c < k) { d.setUTCDate(d.getUTCDate() + 1); if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) c++; } return d; };
const prevWeekday = (dk) => { const d = new Date(dk * 86400000); do { d.setUTCDate(d.getUTCDate() - 1); } while (d.getUTCDay() === 0 || d.getUTCDay() === 6); return d; };
const isLastTD = (dk) => nextWeekday(dk).getUTCMonth() !== new Date(dk * 86400000).getUTCMonth();
const isSecondLastTD = (dk) => !isLastTD(dk) && nextWeekday(dk, 2).getUTCMonth() !== new Date(dk * 86400000).getUTCMonth();
const isFirstTD = (dk) => prevWeekday(dk).getUTCMonth() !== new Date(dk * 86400000).getUTCMonth();
const isQuarterEnd = (dk) => isLastTD(dk) && [2, 5, 8, 11].includes(new Date(dk * 86400000).getUTCMonth());
const isFriday = (dk) => new Date(dk * 86400000).getUTCDay() === 5;
const isGotobi = (dk) => { const d = new Date(dk * 86400000), dom = d.getUTCDate(); if (dom % 5 === 0) return true; const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate(); return dom === last; };
function study(label, days, preStart, fixMin, exitMin, filter) {
  const out = [];
  for (const P of ['IS', 'VAL']) {
    const xs = [];
    for (const d of days.values()) {
      if (P_OF(d.t) !== P || !filter(d.dk)) continue;
      const p0 = priceAt(d, preStart), pf = priceAt(d, fixMin), px = priceAt(d, exitMin);
      if (p0 === undefined || pf === undefined || px === undefined || pf === p0) continue;
      xs.push(-Math.sign(pf - p0) * (px - pf) / pip);
    }
    const m = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
    out.push(`${P} ${m.toFixed(2).padStart(6)} pips (t ${(m / (sd / Math.sqrt(xs.length))).toFixed(1).padStart(4)}) n${String(xs.length).padStart(4)}`);
  }
  console.log(label.padEnd(52), out.join('   '));
}
const ldn = dayMap('Europe/London', 840, 1140);
console.log('London 4pm fix, pre-fix 15:30-16:00, exit 16:50 London:');
study('  last trading day of month (reference)', ldn, 929, 959, 1009, isLastTD);
study('  quarter-end only', ldn, 929, 959, 1009, isQuarterEnd);
study('  second-to-last trading day', ldn, 929, 959, 1009, isSecondLastTD);
study('  first trading day of month', ldn, 929, 959, 1009, isFirstTD);
study('  Fridays (not month-end)', ldn, 929, 959, 1009, (dk) => isFriday(dk) && !isLastTD(dk));
study('  all other days', ldn, 929, 959, 1009, (dk) => !isLastTD(dk));
const tky = dayMap('Asia/Tokyo', 480, 720);
console.log('Tokyo 9:55 fix, pre-fix 9:25-9:55 Tokyo, exit 10:45 Tokyo:');
study('  gotobi days (5,10,15,20,25,last)', tky, 564, 594, 644, isGotobi);
study('  non-gotobi days', tky, 564, 594, 644, (dk) => !isGotobi(dk));
study('  last trading day of month', tky, 564, 594, 644, isLastTD);
