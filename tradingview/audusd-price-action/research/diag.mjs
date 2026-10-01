// In-sample diagnostics of the v2 sweep logic with the filters opened up (large sample), grouped by feature.
import { evaluate, fmt } from './research.mjs';
import { stats } from './engine.mjs';
const open = { useBias: false, maxPerDay: 50, maxLossesDay: 0, cooldown: 0 };
const grp = (trades, key) => { const g = {}; for (const t of trades) { const k = key(t); (g[k] ||= []).push(t); } return g; };
const gross = (ts) => ts.length ? +(ts.reduce((a, t) => a + t.grossR, 0) / ts.length).toFixed(3) : NaN;
for (const [label, tf, base] of [['M15 scalp-sized', 15, { mode: 'Scalp' }], ['H1 swing-sized', 60, { mode: 'Swing' }], ['H4 swing-sized', 240, { mode: 'Swing' }]]) {
  const r = evaluate(tf, { ...base, ...open });
  const T = r.trades.IS, ctx = r.ctx;
  const avgStop = T.reduce((a, t) => a + t.risk / 1e-4, 0) / T.length;
  console.log(`\n##### ${label}, bias filter off, no daily limits  (IS 2005-2012)`);
  console.log(`all            ${fmt(stats(T, 8))}   gross avgR ${gross(T)}  avg stop ${avgStop.toFixed(1)} pips`);
  const show = (title, g, order) => { console.log(`-- ${title}`); for (const k of order || Object.keys(g).sort()) if (g[k]) console.log(`   ${String(k).padEnd(12)} ${fmt(stats(g[k]))}  gross ${gross(g[k])}`); };
  show('trend at entry vs trade direction', grp(T, (t) => t.trend === 0 ? 'neutral' : t.trend === t.dir ? 'with-trend' : 'counter'), ['with-trend', 'counter', 'neutral']);
  show('level type (single type only)', grp(T.filter((t) => [1, 2, 4, 8].includes(t.mask)), (t) => ({ 1: 'swing', 2: 'PDH/PDL', 4: 'Asia', 8: 'round' })[t.mask]));
  show('number of level types swept', grp(T, (t) => [1, 2, 4, 8].filter((b) => t.mask & b).length));
  if (tf < 240) show('London hour of entry', grp(T, (t) => String(Math.floor(ctx.lonMin[t.entryBar] / 60)).padStart(2, '0')));
  show('direction', grp(T, (t) => (t.dir === 1 ? 'buy' : 'sell')));
  show('stop size (pips)', grp(T, (t) => { const p = t.risk / 1e-4; return p < 10 ? 'a <10' : p < 15 ? 'b 10-15' : p < 25 ? 'c 15-25' : p < 40 ? 'd 25-40' : 'e 40+'; }));
  show('bars from sweep to entry', grp(T, (t) => t.entryBar - t.sweepBar));
}
