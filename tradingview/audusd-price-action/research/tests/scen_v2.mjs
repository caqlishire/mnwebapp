import fs from 'fs';
import { B, q, ramp, run, check, near, summary, BASE_OFF } from './scen_lib.mjs';
import { START, sellLead, S, C, tail } from './scen_common.mjs';
import { genCandles, runPine, series } from './harness.mjs';
const FILE = process.argv[2] || new URL('../../', import.meta.url).pathname + 'AUDUSD_Liquidity_Sweep.pine';
const R = (bars, start, ov, opts) => run(FILE, bars, start, ov, opts);

// compact patterns (swingLen 2): entry p+0.0008, stop p+0.0025 (17 pips), 1R = 17 pips, target 1.5R = p-0.00175
const head = (p) => [...ramp(p, p + 0.0015, 3), B(p + 0.0015, p + 0.0020, p + 0.0013, p + 0.0014), ...ramp(p + 0.0014, p + 0.0004, 3), ...ramp(p + 0.0004, p + 0.0016, 4),
  B(p + 0.0016, p + 0.0024, p + 0.0012, p + 0.0013), B(p + 0.0013, p + 0.0014, p + 0.0006, p + 0.0008)];
const patW = (p) => [...head(p), ...ramp(p + 0.0008, p - 0.0020, 3)];                    // target hit  -> ends p-0.0020
const patL = (p) => [...head(p), ...ramp(p + 0.0008, p + 0.0032, 3)];                    // stop hit    -> ends p+0.0032
const patBE = (p) => [...head(p), B(p + 0.0008, p + 0.0009, p - 0.0010, p - 0.0008), B(p - 0.0008, p + 0.00085, p - 0.0009, p + 0.0004), ...ramp(p + 0.0004, p + 0.0002, 2)]; // +1R then back to entry
const ends = { W: (p) => p - 0.0020, L: (p) => p + 0.0032, BE: (p) => p + 0.0002 };
const chain = (kinds, p0 = 0.6500) => { let p = p0, out = []; for (const k of kinds) { out.push(...({ W: patW, L: patL, BE: patBE })[k](p)); p = ends[k](p); } return out; };
const custom = { ...BASE_OFF, mode: 'Custom', cSess: false, swingLen: 2, maxPerDay: 20, cooldown: 0 };

console.log('V1  circuit breaker: stop for the day after N losing trades');
{
  let r = await R(chain(['L', 'L', 'W']), '2025-01-08T08:00:00Z', { ...custom, maxLossesDay: 2 });
  check('L,L,W with limit 2 => 2 signals (third blocked)', r.signals.length === 2 && r.exits.length === 2 && r.exits.every((e) => e.kind === -1), JSON.stringify(r.signals.map((s) => s.bar)) + JSON.stringify(r.exits));
  r = await R(chain(['L', 'L', 'W']), '2025-01-08T08:00:00Z', { ...custom, maxLossesDay: 1 });
  check('limit 1 => 1 signal', r.signals.length === 1, JSON.stringify(r.signals.map((s) => s.bar)));
  r = await R(chain(['L', 'L', 'W']), '2025-01-08T08:00:00Z', { ...custom, maxLossesDay: 0 });
  check('limit 0 (off) => all 3 signals', r.signals.length === 3, JSON.stringify(r.signals.map((s) => s.bar)));
  r = await R(chain(['BE', 'BE', 'W']), '2025-01-08T08:00:00Z', { ...custom, maxLossesDay: 1 });
  check('break-even exits are not losses: BE,BE,W with limit 1 => 3 signals', r.signals.length === 3 && r.exits[0].kind === 0 && r.exits[1].kind === 0, JSON.stringify(r.exits));
  r = await R(chain(['W', 'L', 'W']), '2025-01-08T08:00:00Z', { ...custom, maxLossesDay: 1 });
  check('a win does not count: W,L,W with limit 1 => 2 signals', r.signals.length === 2, JSON.stringify(r.signals.map((s) => s.bar)));
  const t0 = Date.parse('2025-01-08T20:00:00Z');
  r = await R(chain(['L', 'W']), '2025-01-08T20:00:00Z', { ...custom, maxLossesDay: 1 });
  const days = r.signals.map((s) => new Date(t0 + s.bar * 15 * 60000).toISOString().slice(0, 10));
  check('day rollover resets the counter: loss before midnight, next trade after', r.signals.length === 2 && days[0] !== days[1], JSON.stringify(days));
  r = await R(chain(['L', 'W']), '2025-01-08T08:00:00Z', { ...custom, maxLossesDay: 1 });
  check('same day: loss then second setup blocked', r.signals.length === 1, JSON.stringify(r.signals.map((s) => s.bar)));
}

console.log('V2  pending-setup trigger line');
{
  const dotted = (r) => r.ctx.plots.__lines__.data[0].value.filter((l) => l.style === 'style_dotted');
  const base = [...sellLead(), S];
  let r = await R([...base, C, ...tail(6, 0.6420)], START, { ...BASE_OFF });
  let d = dotted(r);
  check('line created on the sweep candle at its low, ends on the trigger candle (bar 37 -> 38)', d.length === 1 && d[0].x1 === 37 && near(d[0].y1, 0.6424) && d[0].x2 === 38, JSON.stringify(d));
  const nb = (o, c) => B(o, Math.max(o, c) + 0.00005, Math.min(o, c) - 0.00003, c);
  r = await R([...base, nb(0.6425, 0.6427), nb(0.6427, 0.6426), nb(0.6426, 0.6427), B(0.6427, 0.6428, 0.6417, 0.6418), ...tail(6, 0.6418)], START, { ...BASE_OFF });
  d = dotted(r);
  check('expiry: line ends on the first bar after the window (bar 41)', d.length === 1 && d[0].x1 === 37 && d[0].x2 === 41, JSON.stringify(d));
  r = await R([...base, B(0.6425, 0.64355, 0.6423, 0.6430), B(0.6430, 0.6431, 0.6418, 0.6419), ...tail(6, 0.6419)], START, { ...BASE_OFF });
  d = dotted(r);
  check('invalidation by the stop level: line ends on that candle (bar 38)', d.length === 1 && d[0].x2 === 38, JSON.stringify(d));
  r = await R([...base, C, ...tail(6, 0.6420)], START, { ...BASE_OFF, showPending: false });
  check('showPending=false => no dotted line', dotted(r).length === 0);
  r = await R([...base, ...tail(8, 0.6425)], START, { ...BASE_OFF, entryMode: 'Immediate' });
  check('Immediate mode => no pending line', dotted(r).length === 0);
}

console.log('V3  JSON / text alert messages');
{
  const bars = [...sellLead(), S, C, ...tail(6, 0.6420)];
  let r = await R(bars, START, { ...BASE_OFF, alertFmt: 'JSON' }, { alertAll: true });
  const al = (r.ctx.alerts || []).filter((a) => a.type !== 'alertcondition'); const first = al[0];
  let j = null; try { j = JSON.parse(first?.message ?? first?.msg ?? first?.text); } catch (e) {}
  check('JSON alert parses and carries symbol/action/entry/sl/tp', j && j.symbol === 'AUDUSD' && j.action === 'sell' && near(j.entry, 0.642) && near(j.sl, 0.6435) && near(j.tp, 0.63975), JSON.stringify(first));
  r = await R(bars, START, { ...BASE_OFF }, { alertAll: true });
  const t = (r.ctx.alerts || []).filter((a) => a.type !== 'alertcondition')[0]; const tm = String(t?.message ?? t?.msg ?? t?.text);
  check('text alert starts with SELL and names the levels', /^SELL AUDUSD 15 @ 0\.64200 \| SL 0\.64350 \| TP 0\.63975/.test(tm), tm);
}

console.log('V4  diagnostics table vs independent recomputation (3 trades, hand-computable)');
const cell = (r, tb, row, col) => r.ctx.plots.__tables__.data[0].value[tb].cells[row][col].text;
{
  const r = await R(chain(['L', 'L', 'W']), '2025-01-08T08:00:00Z', { ...custom, maxLossesDay: 0 });
  const c = 0.0001 / 0.0017, Rs = [-1 - c, -1 - c, 1.5 - c], mean = Rs.reduce((a, b) => a + b, 0) / 3;
  const dash = (row) => cell(r, 0, row, 1), diag = (row, col) => cell(r, 1, row, col);
  check('dashboard: 3 sim trades, win rate 33.3%', dash(5) === '3' && dash(6) === '33.3%', dash(5) + ' ' + dash(6));
  check('dashboard: coin-flip win rate at 1.5R = 40%', Math.abs(parseFloat(dash(7)) - 40) < 1e-9, dash(7));
  check('dashboard: net R / avg R', Math.abs(parseFloat(dash(11)) - Rs.reduce((a, b) => a + b, 0)) < 0.006 && Math.abs(parseFloat(dash(9)) - mean) < 0.006, dash(11) + ' ' + dash(9));
  check('diagnostics: Swing row n=3, win 33%', diag(1, 1) === '3' && diag(1, 2) === '33%', diag(1, 1) + ' ' + diag(1, 2));
  check('diagnostics: other level types empty, Sells n=3, Buys n=0', diag(2, 1) === '0' && diag(3, 1) === '0' && diag(4, 1) === '0' && diag(5, 1) === '0' && diag(6, 1) === '0' && diag(7, 1) === '3', [2, 3, 4, 5, 6, 7].map((i) => diag(i, 1)).join(','));
  check('diagnostics: verdict says too few trades', diag(9, 1).startsWith('too few'), diag(9, 1));
  check('diagnostics: halves (n=3 -> 1 / 2): 1st = -1.06, 2nd = +0.19', Math.abs(parseFloat(diag(10, 1)) - Rs[0]) < 0.006 && Math.abs(parseFloat(diag(10, 3)) - (Rs[1] + Rs[2]) / 2) < 0.006, diag(10, 1) + ' ' + diag(10, 3));
  check('diagnostics: best-3 share of net R is na when net R <= 0', diag(11, 1).startsWith('n/a'), diag(11, 1));
}

console.log('V5  diagnostics on 70 days of random candles vs recomputation (CI, halves, concentration, categories)');
{
  const candles = genCandles({ days: 70, seed: 23 });
  const src = fs.readFileSync(FILE, 'utf8');
  const ctx = await runPine(src, candles);
  const g = (n) => series(ctx, n);
  const sig = g('Signal (1 buy, -1 sell)'), ek = g('Exit kind (1 TP, -1 SL, 0 BE, 2 EOD, 99 none)'), er = g('Exit net R');
  const Rs = []; for (let i = 0; i < ek.length; i++) if (ek[i] !== 99 && Number.isFinite(ek[i])) Rs.push(er[i]);
  const dirs = []; for (let i = 0; i < sig.length; i++) if (sig[i] === 1 || sig[i] === -1) dirs.push(sig[i]);
  const tips = ctx.plots.__labels__.data[0].value.filter((l) => l.text === 'BUY' || l.text === 'SELL').map((l) => l.tooltip);
  const types = tips.map((t) => /Liquidity swept: (.*)\n/.exec(t)[1]);
  const n = Rs.length, sum = Rs.reduce((a, b) => a + b, 0), mean = sum / n, sd = Math.sqrt(Rs.reduce((a, r) => a + (r - mean) ** 2, 0) / (n - 1)), se = sd / Math.sqrt(n);
  const lo = mean - 1.96 * se, hi = mean + 1.96 * se, h = Math.floor(n / 2);
  const h1 = Rs.slice(0, h).reduce((a, b) => a + b, 0) / h, h2 = Rs.slice(h).reduce((a, b) => a + b, 0) / (n - h);
  const top3 = [...Rs].sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b, 0);
  const diag = (row, col) => ctx.plots.__tables__.data[0].value[1].cells[row][col].text, f = (x) => (Math.abs(x) < 0.005 ? 0 : x);
  const close2 = (txt, x) => Math.abs(parseFloat(txt) - x) < 0.0061;
  check(`n=${n}: interval ${lo.toFixed(2)}..${hi.toFixed(2)} around mean ${mean.toFixed(3)}`, close2(diag(8, 1), mean) && close2(diag(8, 2).replace('[', ''), lo) && close2(diag(8, 3).replace(']', ''), hi), [diag(8, 1), diag(8, 2), diag(8, 3)].join(' '));
  const wantV = n < 30 ? 'too few' : lo > 0 ? 'edge likely' : hi < 0 ? 'negative' : 'no edge proven';
  check(`verdict "${wantV}"`, diag(9, 1).startsWith(wantV), diag(9, 1));
  check(`halves ${h1.toFixed(2)} / ${h2.toFixed(2)}`, close2(diag(10, 1), h1) && close2(diag(10, 3), h2), diag(10, 1) + ' ' + diag(10, 3));
  if (sum > 0) check(`top-3 share ${(100 * top3 / sum).toFixed(0)}%`, Math.abs(parseFloat(diag(11, 1)) - 100 * top3 / sum) < 1, diag(11, 1));
  const cats = [(t) => t.includes('Swing'), (t) => t.includes('PD'), (t) => t.includes('Asia'), (t) => t.includes('Round'), (t) => ['Swing', 'PD', 'Asia', 'Round'].filter((x) => t.includes(x)).length >= 2, null, null];
  let okAll = true, why = '';
  for (let ci = 0; ci < 7; ci++) {
    const idx = Rs.map((_, i) => i).filter((i) => ci < 5 ? cats[ci](types[i]) : ci === 5 ? dirs[i] === 1 : dirs[i] === -1);
    const cn = idx.length, cw = cn ? 100 * idx.filter((i) => Rs[i] > 0 && true).length / cn : NaN, ca = cn ? idx.reduce((a, i) => a + Rs[i], 0) / cn : NaN;
    const gotN = parseInt(diag(ci + 1, 1)), gotA = diag(ci + 1, 3);
    if (gotN !== cn || (cn && !close2(gotA, ca))) { okAll = false; why += ` cat${ci}: want n=${cn} avg=${ca.toFixed(2)} got n=${gotN} avg=${gotA};`; }
  }
  check('all 7 category rows (level type / 2+ types / buys / sells) match independent counts and averages', okAll, why);
}
process.exit(summary() ? 1 : 0);
