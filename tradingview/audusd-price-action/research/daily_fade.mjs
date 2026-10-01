// Daily "13:15 London" fade: minute-precise simulation with stops (IS and VAL only unless OPEN_OOS=1).
import { loadM1, tradingWeekOnly, tzOffsetMin } from './data.mjs';
import { SPLITS } from './research.mjs';
export function buildDaily(m1, tz = 'Europe/London', fromMin = 690, toMin = 900) {
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
export function simDaily(days, { ev = 795, pre = 30, hold = 30, minMove = 5, stopPips = 0, costPips = 1, skip = () => false } = {}) {
  const out = [];
  for (const d of days.values()) {
    if (skip(d.dk)) continue;
    const at = (lm) => { let p; for (const b of d.bars) { if (b.lm < lm) p = b.c; else break; } return p; };
    const p0 = at(ev - pre), pf = at(ev);
    if (p0 === undefined || pf === undefined) continue;
    const mv = (pf - p0) / 10; if (mv === 0 || Math.abs(mv) < minMove) continue;
    const dir = -Math.sign(mv);
    const nb = d.bars.find((b) => b.lm >= ev); if (!nb) continue;
    const entry = nb.o, sl = stopPips ? pf - dir * stopPips * 10 : NaN;
    let exitPx = NaN, kind = 'time', mae = 0;
    for (const b of d.bars) {
      if (b.lm < ev) continue;
      if (b.lm >= ev + hold) { exitPx = b.o; break; }
      mae = Math.max(mae, dir === 1 ? (entry - b.l) / 10 : (b.h - entry) / 10);
      if (!Number.isNaN(sl) && (dir === 1 ? b.l <= sl : b.h >= sl)) { exitPx = sl; kind = 'stop'; break; }
    }
    if (Number.isNaN(exitPx)) continue;
    out.push({ dk: d.dk, t: d.t, dir, pips: dir * (exitPx - entry) / 10 - costPips, kind, mae });
  }
  return out;
}
export function summ(tr) {
  const n = tr.length; if (!n) return { n: 0 };
  const ps = tr.map((x) => x.pips), m = ps.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(ps.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  let cum = 0, pk = 0, dd = 0, gp = 0, gl = 0, w = 0; for (const p of ps) { cum += p; pk = Math.max(pk, cum); dd = Math.max(dd, pk - cum); if (p > 0) { gp += p; w++; } else gl -= p; }
  return { n, win: +(100 * w / n).toFixed(0), avg: +m.toFixed(2), t: +(m / (sd / Math.sqrt(n))).toFixed(1), total: +cum.toFixed(0), pf: +(gp / gl).toFixed(2), maxDD: +dd.toFixed(0) };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const days = buildDaily(tradingWeekOnly(loadM1('AUD_USD')));
  const per = (tr, P) => tr.filter((x) => x.t >= SPLITS[P][0] && x.t < SPLITS[P][1]);
  const f = (s) => `n=${String(s.n).padStart(4)} win ${s.win}% avg ${(s.avg >= 0 ? '+' : '') + s.avg} pips (t ${s.t}) PF ${s.pf} total ${s.total} maxDD ${s.maxDD}`;
  const isNFP = (dk) => { const d = new Date(dk * 86400000); return d.getUTCDay() === 5 && d.getUTCDate() <= 7; };
  for (const [nm, p] of [
    ['no stop, 1 pip cost', {}],
    ['stop 10 pips', { stopPips: 10 }], ['stop 15 pips', { stopPips: 15 }], ['stop 20 pips', { stopPips: 20 }], ['stop 30 pips', { stopPips: 30 }],
    ['no stop, cost 1.5 pips', { costPips: 1.5 }],
    ['no stop, skip payrolls Fridays', { skip: isNFP }],
    ['no stop, ONLY payrolls Fridays', { skip: (dk) => !isNFP(dk) }],
  ]) {
    const tr = simDaily(days, p);
    console.log(nm.padEnd(32), 'IS ', f(summ(per(tr, 'IS'))), '| VAL', f(summ(per(tr, 'VAL'))));
  }
  const tr = simDaily(days, {}).filter((x) => x.t < SPLITS.VAL[1]);
  const maes = tr.map((x) => x.mae).sort((a, b) => a - b), q = (p) => maes[Math.floor(p * (maes.length - 1))].toFixed(1);
  console.log(`\nadverse excursion within the 30 minutes (2005-2016): median ${q(0.5)}, 90% ${q(0.9)}, 99% ${q(0.99)}, max ${q(1)} pips`);
}
