// Edge-case scenarios for the month-end fix fade indicator (synthetic candles, run in PineTS).
import fs from 'fs';
import { runPine, series, MIN } from './harness.mjs';
import { check, near, summary, patchInputs } from './scen_lib.mjs';
const FILE = process.argv[2] || new URL('../../', import.meta.url).pathname + 'AUDUSD_MonthEnd_Fix_Fade.pine';
const SRC = fs.readFileSync(FILE, 'utf8');
const q = (x) => Math.round(x * 1e5) / 1e5;
// One trading day of bars (tf minutes) from 12:00 to 20:00 London. path(lm) -> mid price at London minute lm.
// londonOffsetMin: 0 (GMT) or 60 (BST). Extra (lm -> {h,l}) overrides allow wicks.
function dayBars(dateISO, londonOffsetMin, path, { tf = 5, wick = {} } = {}) {
  const base = Date.parse(dateISO + 'T00:00:00Z') / 60000 - londonOffsetMin;
  const out = [];
  for (let lm = 12 * 60; lm < 20 * 60; lm += tf) {
    const o = q(path(lm)), c = q(path(lm + tf));
    let h = Math.max(o, c) + 0.00002, l = Math.min(o, c) - 0.00002;
    if (wick[lm]) { if (wick[lm].h !== undefined) h = wick[lm].h; if (wick[lm].l !== undefined) l = wick[lm].l; }
    const t = (base + lm) * MIN;
    out.push({ openTime: t, closeTime: t + tf * MIN, open: o, high: q(h), low: q(l), close: c, volume: 1, quoteAssetVolume: 0, numberOfTrades: 0, takerBuyBaseAssetVolume: 0, takerBuyQuoteAssetVolume: 0, ignore: 0 });
  }
  return out;
}
const P0 = 0.65000, pip = 0.0001;
// default path: flat until 15:30, linear move of `pre` pips to 16:00, then post(lm) after 16:00
const mkPath = (pre, post = () => 0) => (lm) => lm <= 930 ? P0 : lm <= 960 ? P0 + pre * pip * (lm - 930) / 30 : P0 + pre * pip + post(lm) * pip;
async function run(candles, overrides = {}, tf = '5') {
  const ctx = await runPine(patchInputs(SRC, overrides), candles, { tf, alertAll: true });
  const S = (k) => series(ctx, k);
  const sig = S('Signal (1 buy, -1 sell)'), ent = S('Signal entry'), sl = S('Signal stop'), tp = S('Signal target'), ek = S('Exit kind (1 TP, -1 SL, 2 time, 99 none)'), ep = S('Exit net pips');
  const signals = [], exits = [];
  for (let i = 0; i < sig.length; i++) {
    if (sig[i] === 1 || sig[i] === -1) signals.push({ i, dir: sig[i], entry: ent[i], sl: sl[i], tp: tp[i], t: new Date(candles[i].closeTime).toISOString().slice(0, 16) });
    if (ek[i] !== 99 && Number.isFinite(ek[i])) exits.push({ i, kind: ek[i], pips: ep[i], t: new Date(candles[i].closeTime).toISOString().slice(0, 16) });
  }
  return { signals, exits, ctx };
}
const lastTD = async (label, dateISO, off, expectTrade) => {
  const r = await run(dayBars(dateISO, off, mkPath(6, () => -6)));
  check(`${label}: ${expectTrade ? 'trades' : 'no trade'} on ${dateISO}`, (r.signals.length === 1) === expectTrade, JSON.stringify(r.signals));
  return r;
};

console.log('F1  last trading day of the month');
await lastTD('weekday month-end (Fri 31 Jan 2025)', '2025-01-31', 0, true);
await lastTD('day before month-end (Thu 30 Jan 2025)', '2025-01-30', 0, false);
await lastTD('month ends Saturday -> Friday 30 May 2025', '2025-05-30', 60, true);
await lastTD('month ends Sunday -> Friday 29 Aug 2025', '2025-08-29', 60, true);
await lastTD('Thursday 28 Aug 2025 (not last trading day)', '2025-08-28', 60, false);
await lastTD('year-end Tuesday 31 Dec 2024', '2024-12-31', 0, true);
await lastTD('leap-year February Thursday 29 Feb 2024', '2024-02-29', 0, true);
await lastTD('Wednesday 28 Feb 2024 (leap year, not last)', '2024-02-28', 0, false);

console.log('F2  London time incl. daylight saving: entry on the bar closing at 16:00 London');
{
  let r = await lastTD('summer (BST) 31 Jul 2025', '2025-07-31', 60, true);
  check('  BST entry bar closes 15:00 UTC', r.signals[0]?.t === '2025-07-31T15:00', r.signals[0]?.t);
  r = await lastTD('BST starts Sun 30 Mar 2025, month-end Mon 31 Mar', '2025-03-31', 60, true);
  check('  entry bar closes 15:00 UTC', r.signals[0]?.t === '2025-03-31T15:00', r.signals[0]?.t);
  r = await lastTD('BST ends Sun 26 Oct 2025, month-end Fri 31 Oct (GMT)', '2025-10-31', 0, true);
  check('  entry bar closes 16:00 UTC', r.signals[0]?.t === '2025-10-31T16:00', r.signals[0]?.t);
  // a day built with the WRONG offset must not trade at the wrong hour: GMT-built bars in July shift the window by one hour
  r = await run(dayBars('2025-07-31', 0, mkPath(6, () => -6)));
  check('  push placed at 15:30-16:00 UTC in July (= 16:30-17:00 London) -> no trade: the rule follows London time, not UTC', r.signals.length === 0, JSON.stringify(r.signals));
}

console.log('F3  direction, levels, minimum move');
{
  let r = await run(dayBars('2025-01-31', 0, mkPath(6, () => -6)));
  const s = r.signals[0] || {};
  check('pushed UP 6 pips into the fix -> SELL', s.dir === -1, JSON.stringify(s));
  check('entry = 16:00 close, stop = entry + 20 pips, target = 15:30 price', near(s.entry, P0 + 6 * pip) && near(s.sl, P0 + 26 * pip) && near(s.tp, P0), JSON.stringify(s));
  r = await run(dayBars('2025-01-31', 0, mkPath(-8, () => 8)));
  check('pushed DOWN 8 pips -> BUY, stop 20 below, target = 15:30 price', r.signals.length === 1 && r.signals[0].dir === 1 && near(r.signals[0].sl, P0 - 28 * pip) && near(r.signals[0].tp, P0), JSON.stringify(r.signals));
  r = await run(dayBars('2025-01-31', 0, mkPath(2.5, () => -3)));
  check('move of 2.5 pips < 3 -> no trade', r.signals.length === 0, JSON.stringify(r.signals));
  r = await run(dayBars('2025-01-31', 0, mkPath(3, () => -3)));
  check('move of exactly 3.0 pips -> trade', r.signals.length === 1, JSON.stringify(r.signals));
}

console.log('F4  exits');
{
  // target: price gives back the 6 pips by 16:20 (16:15 bar reaches the 15:30 price)
  let r = await run(dayBars('2025-01-31', 0, mkPath(6, (lm) => (lm <= 975 ? -(lm - 960) * 0.4 : -6.5))));
  check('target hit -> exit kind 1, net = 6 - 1 cost = +5 pips', r.exits.length === 1 && r.exits[0].kind === 1 && near(r.exits[0].pips, 5, 1e-6), JSON.stringify(r.exits));
  // stop: price rallies 25 pips after the fix
  r = await run(dayBars('2025-01-31', 0, mkPath(6, (lm) => Math.min(25, (lm - 960) * 2))));
  check('stop hit -> exit kind -1, net = -20 - 1 = -21 pips', r.exits.length === 1 && r.exits[0].kind === -1 && near(r.exits[0].pips, -21, 1e-6), JSON.stringify(r.exits));
  // time exit: price drifts down 3 pips and stays (target not reached, stop not hit) -> exit at the 17:00 close
  r = await run(dayBars('2025-01-31', 0, mkPath(6, (lm) => Math.max(-3, -(lm - 960) * 0.2))));
  check('time exit at the bar closing 17:00 London: kind 2, net = +3 - 1 = +2 pips', r.exits.length === 1 && r.exits[0].kind === 2 && r.exits[0].t === '2025-01-31T17:00' && near(r.exits[0].pips, 2, 1e-6), JSON.stringify(r.exits));
  // both stop and target touched in one bar (16:10 bar wicks from 0.6500 to 0.6527) -> stop assumed first
  r = await run(dayBars('2025-01-31', 0, mkPath(6, () => 0), { wick: { 970: { h: 0.6527, l: 0.64995 } } }));
  check('stop and target in the same bar -> stop (kind -1)', r.exits.length === 1 && r.exits[0].kind === -1, JSON.stringify(r.exits));
  // target mode 'None': only time exit
  r = await run(dayBars('2025-01-31', 0, mkPath(6, (lm) => (lm <= 975 ? -(lm - 960) * 0.4 : -6.5))), { tgtMode: 'None - time exit only' });
  check('target mode None: no target, exits at 17:00 with +6.5 - 1 = +5.5 pips', r.signals[0] && Number.isNaN(r.signals[0].tp) && r.exits[0]?.kind === 2 && near(r.exits[0].pips, 5.5, 1e-6), JSON.stringify({ signals: r.signals, exits: r.exits }));
}

console.log('F5  day filter and timeframe guard');
{
  let r = await run(dayBars('2025-01-30', 0, mkPath(6, () => -6)), { dayMode: 'Every weekday (no edge - comparison only)' });
  check('"Every weekday" mode trades a non-month-end day', r.signals.length === 1, JSON.stringify(r.signals));
  r = await run(dayBars('2025-01-31', 0, mkPath(6, () => -6), { tf: 60 }), {}, '60');
  check('H1 chart -> guard blocks signals (cannot see 15:30)', r.signals.length === 0, JSON.stringify(r.signals));
  r = await run(dayBars('2025-01-31', 0, mkPath(6, () => -6), { tf: 15 }), {}, '15');
  check('M15 chart -> trades', r.signals.length === 1 && r.signals[0].t === '2025-01-31T16:00', JSON.stringify(r.signals));
  r = await run(dayBars('2025-01-31', 0, mkPath(6, () => -6), { tf: 30 }), {}, '30');
  check('M30 chart -> trades', r.signals.length === 1, JSON.stringify(r.signals));
  r = await run(dayBars('2025-01-31', 0, mkPath(6, () => -6), { tf: 1 }), {}, '1');
  check('M1 chart -> trades, entry on the 15:59 bar close', r.signals.length === 1 && r.signals[0].t === '2025-01-31T16:00', JSON.stringify(r.signals));
}

console.log('F6  alerts');
{
  const r = await run(dayBars('2025-01-31', 0, mkPath(6, () => -6)), { alertFmt: 'JSON' });
  const msgs = (r.ctx.alerts || []).filter((a) => a.type !== 'alertcondition').map((a) => a.message);
  const j = msgs.map((m) => { try { return JSON.parse(m); } catch { return null; } }).find(Boolean);
  check('15:30 heads-up alert and a JSON entry alert are sent', msgs.some((m) => m.includes('month-end fix day')) && j && j.action === 'sell' && near(j.entry, P0 + 6 * pip) && near(j.sl, P0 + 26 * pip) && near(j.tp, P0), JSON.stringify(msgs));
}
process.exit(summary() ? 1 : 0);
