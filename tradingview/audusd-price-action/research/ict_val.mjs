// Confirmation on 2013-2016 for the two ICT families that were broadly positive in 2005-2012.
import { ctxFor, split } from './research.mjs';
import { model2022, modelOTE } from './ict.mjs';
const ctx = ctxFor(5);
const S = (ts, y) => {
  const n = ts.length; if (!n) return 'n=0';
  const rs = ts.map((t) => t.netR), m = rs.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(rs.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  let gp = 0, gl = 0; for (const r of rs) { if (r > 0) gp += r; else gl -= r; }
  return `n ${String(n).padStart(4)} (${(n / y).toFixed(0)}/y) avgR ${(m >= 0 ? '+' : '') + m.toFixed(3)} (t ${(m / (sd / Math.sqrt(n))).toFixed(1).padStart(4)}) PF ${(gp / gl).toFixed(2)} gross ${(ts.reduce((a, t) => a + t.grossR, 0) / n).toFixed(3)}`;
};
let posIS = 0, posVAL = 0, both = 0, cnt = 0;
console.log('== ICT 2022 model: every configuration, 2005-2012 | 2013-2016');
for (const kz of ['LDN', 'NY']) for (const entryAt of ['edge', 'mid']) for (const target of ['2R', '3R', 'pool']) for (const bias of ['off', 'struct']) {
  const sp = split(ctx, model2022(ctx, { kz, entryAt, target, bias }));
  const mi = sp.IS.reduce((a, t) => a + t.netR, 0) / sp.IS.length, mv = sp.VAL.reduce((a, t) => a + t.netR, 0) / sp.VAL.length;
  posIS += mi > 0; posVAL += mv > 0; both += mi > 0 && mv > 0; cnt++;
  console.log(`   ${kz.padEnd(3)} ${entryAt.padEnd(4)} ${target.padEnd(4)} bias ${bias.padEnd(6)} IS ${S(sp.IS, 8)} | VAL ${S(sp.VAL, 4)}`);
}
console.log(`   positive: IS ${posIS}/${cnt}, VAL ${posVAL}/${cnt}, both ${both}/${cnt}`);
posIS = posVAL = both = cnt = 0;
console.log('\n== OTE: every configuration, 2005-2012 | 2013-2016');
for (const minLeg of [10, 20]) for (const target of [0, 0.27, 0.62]) for (const bias of ['off', 'struct']) {
  const sp = split(ctx, modelOTE(ctx, { minLeg, target, bias }));
  const mi = sp.IS.reduce((a, t) => a + t.netR, 0) / sp.IS.length, mv = sp.VAL.reduce((a, t) => a + t.netR, 0) / sp.VAL.length;
  posIS += mi > 0; posVAL += mv > 0; both += mi > 0 && mv > 0; cnt++;
  console.log(`   leg>=${String(minLeg).padEnd(2)} target ${String(target).padEnd(4)} bias ${bias.padEnd(6)} IS ${S(sp.IS, 8)} | VAL ${S(sp.VAL, 4)}`);
}
console.log(`   positive: IS ${posIS}/${cnt}, VAL ${posVAL}/${cnt}, both ${both}/${cnt}`);
