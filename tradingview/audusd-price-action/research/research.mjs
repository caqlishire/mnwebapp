// Research helpers. The out-of-sample period stays hidden unless OPEN_OOS=1 is set explicitly.
import fs from 'fs';
import { loadM1, tradingWeekOnly } from './data.mjs';
import { prepare, run, stats } from './engine.mjs';

export const SPLITS = {
  IS: [Date.UTC(2005, 0, 1) / 60000, Date.UTC(2013, 0, 1) / 60000],
  VAL: [Date.UTC(2013, 0, 1) / 60000, Date.UTC(2017, 0, 1) / 60000],
  OOS: [Date.UTC(2017, 0, 1) / 60000, Date.UTC(2020, 5, 1) / 60000],
};
export const YEARS = { IS: 8, VAL: 4, OOS: 3.37 };
const OPEN_OOS = process.env.OPEN_OOS === '1';

let M1 = null;
const CTX = {};
export function ctxFor(tf) {
  M1 ||= tradingWeekOnly(loadM1());
  return (CTX[tf] ||= prepare(M1, tf));
}

export function split(ctx, trades) {
  const out = { IS: [], VAL: [], OOS: [] };
  for (const t of trades) {
    const tm = ctx.t[t.entryBar];
    for (const [k, [a, b]] of Object.entries(SPLITS)) if (tm >= a && tm < b) out[k].push(t);
  }
  return out;
}

export function evaluate(tf, params, { periods = ['IS', 'VAL'] } = {}) {
  if (periods.includes('OOS') && !OPEN_OOS) throw new Error('OOS is closed');
  const ctx = ctxFor(tf);
  const res = run(ctx, { exitMode: 'm1', dayRoll: 'ny17', trendMode: 'tv', ...params });
  const sp = split(ctx, res.trades);
  const out = {};
  for (const p of periods) out[p] = stats(sp[p], YEARS[p]);
  return { out, trades: sp, ctx, res };
}

export function byYear(ctx, trades) {
  const g = {};
  for (const t of trades) { const y = new Date(ctx.t[t.entryBar] * 60000).getUTCFullYear(); (g[y] ||= []).push(t); }
  return Object.fromEntries(Object.entries(g).map(([y, ts]) => [y, stats(ts)]));
}

export function fmt(s) {
  if (!s || !s.n) return 'n=0';
  return `n=${String(s.n).padStart(5)} (${String(s.perYear ?? '').padStart(4)}/y) win ${String(s.win).padStart(5)}%  avgR ${(s.avgR >= 0 ? '+' : '') + s.avgR.toFixed(3)} [${s.lo.toFixed(2)},${s.hi.toFixed(2)}]  PF ${String(s.pf).padStart(5)}  netR ${String(s.netR).padStart(7)}  maxDD ${String(s.maxDD).padStart(5)}R`;
}

export function logVariant(name, tf, params, result) {
  fs.appendFileSync(new URL('./variants.log', import.meta.url), JSON.stringify({ ts: new Date().toISOString(), name, tf, params, IS: result.IS, VAL: result.VAL }) + '\n');
}
