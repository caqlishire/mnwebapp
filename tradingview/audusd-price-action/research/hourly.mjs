// Mean AUDUSD move per UTC hour (pips) in IS and VAL, with t-stats. Uses M15 bars aggregated to the hour.
import { ctxFor, SPLITS } from './research.mjs';
const ctx = ctxFor(60);
const pip = 0.0001;
const res = {};
for (let i = 0; i < ctx.n; i++) {
  const tm = ctx.t[i];
  const P = tm >= SPLITS.IS[0] && tm < SPLITS.IS[1] ? 'IS' : tm >= SPLITS.VAL[0] && tm < SPLITS.VAL[1] ? 'VAL' : null;
  if (!P) continue;
  const h = new Date(tm * 60000).getUTCHours();
  const r = (ctx.C[i] - ctx.O[i]) / pip;
  const k = P + h; (res[k] ||= []).push(r);
}
const st = (a) => { const m = a.reduce((x, y) => x + y, 0) / a.length; const sd = Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1)); return [m, m / (sd / Math.sqrt(a.length)), a.length]; };
console.log('UTC hour | IS mean pips (t)      | VAL mean pips (t)     | London hour (winter)');
let cumIS = 0, cumVAL = 0;
for (let h = 0; h < 24; h++) {
  const [mi, ti, ni] = st(res['IS' + h]), [mv, tv, nv] = st(res['VAL' + h]);
  cumIS += mi; cumVAL += mv;
  const flag = Math.sign(mi) === Math.sign(mv) && Math.abs(ti) > 1.5 && Math.abs(tv) > 1.5 ? '  <-- same sign, |t|>1.5 both' : '';
  console.log(`   ${String(h).padStart(2)}    | ${mi.toFixed(2).padStart(6)} (${ti.toFixed(1).padStart(5)}) n=${ni} | ${mv.toFixed(2).padStart(6)} (${tv.toFixed(1).padStart(5)}) n=${nv} | ${String(h).padStart(2)}:00${flag}`);
}
console.log(`daily drift: IS ${cumIS.toFixed(2)} pips/day, VAL ${cumVAL.toFixed(2)} pips/day`);
