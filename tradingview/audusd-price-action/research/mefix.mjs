// Month-End Fix Fade: minute-precise simulation. Exported for later out-of-sample and cross-pair runs.
import { loadM1, tradingWeekOnly, tzOffsetMin } from './data.mjs';
export function buildDays(m1, tz = 'Europe/London', fromMin = 840, toMin = 1200) {
  const days = new Map();
  for (let i = 0; i < m1.n; i++) {
    const t = m1.t[i], lt = t + tzOffsetMin(tz, t), lm = ((lt % 1440) + 1440) % 1440;
    if (lm < fromMin || lm > toMin) continue;
    const dk = Math.floor(lt / 1440);
    let d = days.get(dk); if (!d) { d = { dk, t, bars: [] }; days.set(dk, d); }
    d.bars.push({ lm, o: m1.o[i], h: m1.h[i], l: m1.l[i], c: m1.c[i] });
  }
  return days;
}
const nextWeekday = (dk) => { const d = new Date(dk * 86400000); do { d.setUTCDate(d.getUTCDate() + 1); } while (d.getUTCDay() === 0 || d.getUTCDay() === 6); return d; };
export const isLastTD = (dk) => nextWeekday(dk).getUTCMonth() !== new Date(dk * 86400000).getUTCMonth();
// params (minutes of London day): preStart 930 (=15:30), fix 960 (=16:00), exit 1020 (=17:00)
// all prices in points (1e-5); pipPts = points per pip (10 for 5-decimal pairs, 10 for JPY 3-decimal pairs too)
export function simulate(days, { preStart = 930, fix = 960, exit = 1020, minMove = 3, stop = 'none', stopPips = 25, tp = 'none', costPips = 1, pipPts = 10, entryAt = 'close', exitAt = 'close' } = {}) {
  const trades = [];
  for (const d of days.values()) {
    if (!isLastTD(d.dk)) continue;
    const at = (lm) => { let p; for (const b of d.bars) { if (b.lm < lm) p = b.c; else break; } return p; }; // last close strictly before minute lm
    const p0 = at(preStart), pf = at(fix);
    if (p0 === undefined || pf === undefined) continue;
    const move = (pf - p0) / pipPts;
    if (Math.abs(move) < minMove || move === 0) continue;
    const dir = -Math.sign(move);
    let entry = pf;
    if (entryAt === 'nextOpen') { const nb = d.bars.find((b) => b.lm >= fix); if (!nb) continue; entry = nb.o; }
    let preHi = -Infinity, preLo = Infinity;
    for (const b of d.bars) if (b.lm >= preStart && b.lm < fix) { preHi = Math.max(preHi, b.h); preLo = Math.min(preLo, b.l); }
    let sl = NaN;
    if (stop === 'pips') sl = pf - dir * stopPips * pipPts; // stop is set from the fix price, as the indicator draws it
    if (stop === 'preExt') sl = dir === -1 ? Math.max(preHi, entry) + stopPips * pipPts : Math.min(preLo, entry) - stopPips * pipPts;
    const tpx = tp === 'retrace' ? p0 : NaN;
    let exitPx = NaN, kind = 'time';
    for (const b of d.bars) {
      if (b.lm < fix) continue;
      if (b.lm >= exit) { if (exitAt === 'nextOpen' && kind === 'time') exitPx = b.o; break; }
      const hs = !Number.isNaN(sl) && (dir === 1 ? b.l <= sl : b.h >= sl);
      const ht = !Number.isNaN(tpx) && (dir === 1 ? b.h >= tpx : b.l <= tpx);
      if (hs) { exitPx = sl; kind = 'stop'; break; }
      if (ht) { exitPx = tpx; kind = 'target'; break; }
      exitPx = b.c;
    }
    if (Number.isNaN(exitPx)) continue;
    const pips = (dir * (exitPx - entry)) / pipPts - costPips;
    const riskPips = Number.isNaN(sl) ? stopPips : Math.abs(entry - sl) / pipPts;
    trades.push({ dk: d.dk, t: d.t, dir, move, entry, exitPx, kind, pips, R: pips / riskPips, riskPips });
  }
  return trades;
}
export function summarize(tr) {
  const n = tr.length; if (!n) return { n: 0 };
  const ps = tr.map((x) => x.pips), m = ps.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(ps.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  let cum = 0, pk = 0, dd = 0, gp = 0, gl = 0, w = 0; for (const p of ps) { cum += p; pk = Math.max(pk, cum); dd = Math.max(dd, pk - cum); if (p > 0) { gp += p; w++; } else gl -= p; }
  const rs = tr.map((x) => x.R), mr = rs.reduce((a, b) => a + b, 0) / n;
  return { n, win: +(100 * w / n).toFixed(0), avgPips: +m.toFixed(2), t: +(m / (sd / Math.sqrt(n))).toFixed(1), totalPips: +cum.toFixed(0), pf: gl ? +(gp / gl).toFixed(2) : Infinity, maxDDpips: +dd.toFixed(0), avgR: +mr.toFixed(3) };
}
