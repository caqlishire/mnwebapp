// Pre-registered ICT 2022 London rule: stress on 2005-2016, then (OPEN_OOS=1) the single 2017-2020 run of the family.
import { ctxFor, split } from './research.mjs';
import { model2022 } from './ict.mjs';
const ctx = ctxFor(5);
const LOCK = { kz: 'LDN', entryAt: 'mid', target: '3R', bias: 'off' };
const S = (ts, y) => {
  const n = ts.length; if (!n) return 'n=0';
  const rs = ts.map((t) => t.netR), m = rs.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(rs.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  let gp = 0, gl = 0, cum = 0, pk = 0, dd = 0; for (const r of rs) { if (r > 0) gp += r; else gl -= r; cum += r; pk = Math.max(pk, cum); dd = Math.max(dd, pk - cum); }
  const win = ts.filter((t) => t.kind === 'target' || (t.kind === 'time' && t.netR > 0)).length;
  return `n ${String(n).padStart(4)} (${(n / y).toFixed(0)}/y) win ${(100 * win / n).toFixed(0)}% avgR ${(m >= 0 ? '+' : '') + m.toFixed(3)} (t ${(m / (sd / Math.sqrt(n))).toFixed(1)}) PF ${(gp / gl).toFixed(2)} netR ${cum.toFixed(1)} maxDD ${dd.toFixed(1)}R`;
};
const both = (tr) => [...tr.IS, ...tr.VAL];
if (process.env.OPEN_OOS !== '1') {
  console.log('Locked rule:', JSON.stringify(LOCK));
  for (const [nm, p] of [['as locked (1 pip cost)', {}], ['cost 1.5 pips', { costPips: 1.5 }], ['cost 2 pips', { costPips: 2 }], ['min stop 8 pips', { minStop: 8 }], ['max stop 25 pips', { maxStop: 25 }]]) {
    const tr = split(ctx, model2022(ctx, { ...LOCK, ...p }));
    console.log(`   ${nm.padEnd(24)} 2005-2016: ${S(both(tr), 12)}`);
  }
  const tr = split(ctx, model2022(ctx, LOCK));
  const yr = {}; for (const t of both(tr)) { const y = new Date(ctx.t[t.entryBar] * 60000).getUTCFullYear(); (yr[y] ||= []).push(t.netR); }
  console.log('   by year (net R):', Object.entries(yr).map(([y, a]) => `${y} ${a.reduce((s, v) => s + v, 0).toFixed(1)}(${a.length})`).join(', '));
} else {
  console.log('== OUT-OF-SAMPLE 2017 - May 2020 (single run) ==');
  const tr = split(ctx, model2022(ctx, LOCK));
  console.log('LOCKED  LDN mid 3R bias off:', S(tr.OOS, 3.37));
  let pos = 0, cnt = 0;
  for (const entryAt of ['edge', 'mid']) for (const target of ['2R', '3R', 'pool']) for (const bias of ['off', 'struct']) {
    const t2 = split(ctx, model2022(ctx, { kz: 'LDN', entryAt, target, bias }));
    const m = t2.OOS.reduce((a, t) => a + t.netR, 0) / t2.OOS.length; pos += m > 0; cnt++;
    console.log(`   family LDN ${entryAt.padEnd(4)} ${target.padEnd(4)} bias ${bias.padEnd(6)} ${S(t2.OOS, 3.37)}`);
  }
  console.log(`   London family positive in 2017-2020: ${pos}/${cnt}`);
}
