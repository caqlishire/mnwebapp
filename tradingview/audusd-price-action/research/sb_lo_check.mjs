// London-open Silver Bullet with liquidity raid: robustness on 2005-2012, then the whole family on 2013-2016.
import { ctxFor, split, YEARS } from './research.mjs';
import { runSilverBullet } from './silver_bullet.mjs';
const ctx = ctxFor(5);
const S = (ts, years) => {
  const n = ts.length; if (!n) return 'n=0';
  const rs = ts.map((t) => t.netR), m = rs.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(rs.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  let gp = 0, gl = 0, cum = 0, pk = 0, dd = 0; for (const r of rs) { if (r > 0) gp += r; else gl -= r; cum += r; pk = Math.max(pk, cum); dd = Math.max(dd, pk - cum); }
  const win = ts.filter((t) => t.kind === 'target' || (t.kind === 'time' && t.netR > 0)).length;
  const gross = ts.reduce((a, t) => a + t.netR + 0.0001 / t.risk, 0) / n;
  return `n ${String(n).padStart(4)} (${(n / years).toFixed(0)}/y) win ${(100 * win / n).toFixed(0)}% avgR ${(m >= 0 ? '+' : '') + m.toFixed(3)} (t ${(m / (sd / Math.sqrt(n))).toFixed(1)}) PF ${(gp / gl).toFixed(2)} netR ${cum.toFixed(1)} maxDD ${dd.toFixed(1)}R gross ${(gross >= 0 ? '+' : '') + gross.toFixed(3)}`;
};
const base = { win: 'LO', sweep: true };
console.log('-- robustness on 2005-2012 (base: London-open window, raid, mid entry, 2R)');
for (const [nm, p] of [
  ['base mid 2R', { entryAt: 'mid', tpR: 2 }],
  ['minGap 0.5', { entryAt: 'mid', tpR: 2, minGap: 0.5 }], ['minGap 2', { entryAt: 'mid', tpR: 2, minGap: 2 }],
  ['raid lookback 30 min', { entryAt: 'mid', tpR: 2, preBars: 6 }], ['raid lookback 2 h', { entryAt: 'mid', tpR: 2, preBars: 24 }],
  ['stop buffer 0.5', { entryAt: 'mid', tpR: 2, slBuf: 0.5 }], ['stop buffer 2', { entryAt: 'mid', tpR: 2, slBuf: 2 }],
  ['hold 30 min after', { entryAt: 'mid', tpR: 2, holdAfter: 30 }], ['hold 120 min after', { entryAt: 'mid', tpR: 2, holdAfter: 120 }],
  ['min stop 5 pips', { entryAt: 'mid', tpR: 2, minStop: 5 }], ['cost 1.5 pips', { entryAt: 'mid', tpR: 2, costPips: 1.5 }],
]) console.log(`   ${nm.padEnd(22)} ${S(split(ctx, runSilverBullet(ctx, { ...base, ...p })).IS, YEARS.IS)}`);
console.log('\n-- the whole family on 2013-2016 (confirmation)');
for (const entryAt of ['edge', 'mid']) for (const tpR of [1, 2, 3]) {
  const sp = split(ctx, runSilverBullet(ctx, { ...base, entryAt, tpR }));
  console.log(`   entry ${entryAt.padEnd(4)} ${tpR}R   IS  ${S(sp.IS, YEARS.IS)}\n${' '.repeat(18)}VAL ${S(sp.VAL, YEARS.VAL)}`);
}
