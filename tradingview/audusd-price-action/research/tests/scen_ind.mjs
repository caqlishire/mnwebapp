import fs from 'fs';
import { B, q, ramp, mirror, run, check, near, summary, BASE_OFF } from './scen_lib.mjs';
import { START, M, costR, sellLead, S, C, tail, both } from './scen_common.mjs';
const FILE = process.argv[2] || new URL('../../', import.meta.url).pathname + 'AUDUSD_Liquidity_Sweep.pine';
const R = (bars, start, ov) => run(FILE, bars, start, ov);
const EXP = { entry: 0.6420, sl: 0.6435, tp: 0.63975 };

await both('S1  swing sweep -> confirmation entry -> TP (break-even armed on the way)', R,
  () => [...sellLead(), S, C, B(0.6420, 0.6421, 0.6408, 0.6410), B(0.6410, 0.6412, 0.6398, 0.6402), B(0.6402, 0.6404, 0.6396, 0.6398), ...tail(6)], START, { ...BASE_OFF },
  (r, P, D) => {
    check('exactly one signal', r.signals.length === 1, JSON.stringify(r.signals));
    const s = r.signals[0] || {};
    check('on confirmation bar 38 in the right direction', s.bar === 38 && s.dir === (D === -1 ? -1 : 1), JSON.stringify(s));
    check('entry = confirmation close', near(s.entry, P(EXP.entry)), String(s.entry));
    check('stop = sweep extreme + 1 pip', near(s.sl, P(EXP.sl)), String(s.sl));
    check('target = entry -/+ 1.5R', near(s.tp, P(EXP.tp)), String(s.tp));
    check('one exit: TP on bar 41', r.exits.length === 1 && r.exits[0].bar === 41 && r.exits[0].kind === 1, JSON.stringify(r.exits));
    check('net R = 1.5 - cost/risk', r.exits[0] && near(r.exits[0].r, 1.5 - costR, 1e-4), String(r.exits[0]?.r));
  });

await both('S3  -> stop loss', R,
  () => [...sellLead(), S, C, B(0.6420, 0.6436, 0.6418, 0.6430), ...tail(6, 0.6430)], START, { ...BASE_OFF },
  (r) => {
    check('one signal on 38', r.signals.length === 1 && r.signals[0].bar === 38, JSON.stringify(r.signals));
    check('exit SL on bar 39', r.exits.length === 1 && r.exits[0].kind === -1 && r.exits[0].bar === 39, JSON.stringify(r.exits));
    check('net R = -1 - cost/risk', r.exits[0] && near(r.exits[0].r, -1 - costR, 1e-4), String(r.exits[0]?.r));
  });

await both('S4  -> +1R reached, then back to entry => break-even exit', R,
  () => [...sellLead(), S, C, B(0.6420, 0.6421, 0.6404, 0.6406), B(0.6406, 0.6421, 0.6405, 0.6415), ...tail(6, 0.6415)], START, { ...BASE_OFF },
  (r) => {
    check('exit kind BE (0) on bar 40', r.exits.length === 1 && r.exits[0].kind === 0 && r.exits[0].bar === 40, JSON.stringify(r.exits));
    check('net R = -cost/risk', r.exits[0] && near(r.exits[0].r, -costR, 1e-4), String(r.exits[0]?.r));
  });

await both('S4b same candle touches both stop and target => stop assumed first', R,
  () => [...sellLead(), S, C, B(0.6420, 0.6436, 0.6396, 0.6410), ...tail(6, 0.6410)], START, { ...BASE_OFF },
  (r) => check('exit is SL (-1)', r.exits.length === 1 && r.exits[0].kind === -1, JSON.stringify(r.exits)));

await both('S5  no confirmation within 3 bars => no trade', R,
  () => { const nb = (o, c) => B(o, Math.max(o, c) + 0.00005, Math.min(o, c) - 0.00003, c);
    return [...sellLead(), S, nb(0.6425, 0.6427), nb(0.6427, 0.6426), nb(0.6426, 0.6427), B(0.6427, 0.6428, 0.6417, 0.6418), ...tail(6, 0.6418)]; }, START, { ...BASE_OFF },
  (r) => check('no signal', r.signals.length === 0, JSON.stringify(r.signals)));

await both('S6  price trades through the stop before confirming => setup cancelled', R,
  () => [...sellLead(), S, B(0.6425, 0.64355, 0.6423, 0.6430), B(0.6430, 0.6431, 0.6418, 0.6419), ...tail(6, 0.6419)], START, { ...BASE_OFF },
  (r) => check('no signal', r.signals.length === 0, JSON.stringify(r.signals)));

await both('S7  Immediate entry mode => enter on the sweep candle close', R,
  () => [...sellLead(), S, ...tail(8, 0.6425)], START, { ...BASE_OFF, entryMode: 'Immediate' },
  (r, P) => { const s = r.signals[0] || {};
    check('one signal on bar 37', r.signals.length === 1 && s.bar === 37, JSON.stringify(r.signals));
    check('entry 0.6425 / stop 0.6435 / target 0.6410', near(s.entry, P(0.6425)) && near(s.sl, P(0.6435)) && near(s.tp, P(0.6410)), JSON.stringify(s)); });

await both('S8a stop too small (< 6 pips) => rejected', R,
  () => [...sellLead(), B(0.6429, 0.64315, 0.6428, 0.64285), B(0.64285, 0.6429, 0.6426, 0.64275), ...tail(8, 0.6427)], START, { ...BASE_OFF },
  (r) => check('no signal', r.signals.length === 0, JSON.stringify(r.signals)));

await both('S8b stop too large (> 25 pips) => rejected', R,
  () => [...sellLead(), B(0.6428, 0.6446, 0.6424, 0.6425), C, ...tail(8, 0.6420)], START, { ...BASE_OFF },
  (r) => check('no signal', r.signals.length === 0, JSON.stringify(r.signals)));

await both('S8c weak rejection (close only mid-candle) => no setup', R,
  () => [...sellLead(), B(0.6428, 0.6434, 0.6424, 0.6429), C, ...tail(8, 0.6420)], START, { ...BASE_OFF },
  (r) => check('no signal', r.signals.length === 0, JSON.stringify(r.signals)));

await both('S9  entry-window edges', R, () => [...sellLead(), S, C, ...tail(8, 0.6420)], '2025-01-08T05:45:00Z', { ...BASE_OFF },
  (r) => check('bar opening 15:15 (inside 07:00-15:30) => signal', r.signals.length === 1, JSON.stringify(r.signals)));
await both('S9b bar opening exactly 15:30 => outside', R, () => [...sellLead(), S, C, ...tail(8, 0.6420)], '2025-01-08T06:00:00Z', { ...BASE_OFF },
  (r) => check('no signal', r.signals.length === 0, JSON.stringify(r.signals)));
await both('S9c bar opening 23:30 => outside', R, () => [...sellLead(), S, C, ...tail(8, 0.6420)], '2025-01-08T14:00:00Z', { ...BASE_OFF },
  (r) => check('no signal', r.signals.length === 0, JSON.stringify(r.signals)));

await both('S10 open trade flattened by the hold-until window (17:00) at that bar close', R,
  () => { const hover = []; for (let k = 0; k < 10; k++) hover.push(B(0.6420 - k * 0.00002, 0.6421 - k * 0.00002, 0.6419 - k * 0.00002 - 0.00003, 0.6420 - (k + 1) * 0.00002));
    return [...sellLead(), S, C, ...hover]; }, '2025-01-08T05:45:00Z', { ...BASE_OFF },
  (r, P, D) => {
    check('one signal', r.signals.length === 1);
    check('EOD exit (kind 2) on the bar opening 17:00 (bar 45)', r.exits.length === 1 && r.exits[0].kind === 2 && r.exits[0].bar === 45, JSON.stringify(r.exits));
    const c45 = r.candles[45].close, e = P(0.6420);
    const expR = (D === -1 ? (e - c45) : (c45 - e)) / 0.0015 - costR;
    check('EOD net R uses that close', r.exits[0] && near(r.exits[0].r, expR, 1e-4), `${r.exits[0]?.r} vs ${expR}`);
  });

await both('S11 previous-day high/low sweep (swing/Asia/round off)', R,
  () => { const d1 = ramp(0.6400, 0.64395, 96, 0.00005); d1[95] = B(d1[95][0], 0.6440, d1[95][2], d1[95][3]);
    return [...d1, ...ramp(0.6438, 0.6425, 40), ...ramp(0.6425, 0.6437, 8), B(0.6437, 0.6442, 0.6432, 0.6434), B(0.6434, 0.6435, 0.6428, 0.6430), ...ramp(0.6430, 0.6398, 12)]; },
  START, { ...BASE_OFF, usePDHL: true, useSwing: false },
  (r, P, D) => { check('one signal on day-2 bar 49', r.signals.length === 1 && r.signals[0].bar === 96 + 49 && r.signals[0].dir === (D === -1 ? -1 : 1), JSON.stringify(r.signals));
    check('stop = sweep extreme + 1 pip', r.signals[0] && near(r.signals[0].sl, P(0.6443)), JSON.stringify(r.signals[0])); });

await both('S12 round-number sweep (0.6450 / mirrored 0.6400)', R,
  () => [...ramp(0.6410, 0.6448, 30), B(0.6447, 0.6453, 0.6444, 0.6446), B(0.6446, 0.6447, 0.6438, 0.6440), ...ramp(0.6440, 0.6410, 12)],
  '2025-01-08T07:00:00Z', { ...BASE_OFF, useRound: true, useSwing: false },
  (r, P, D) => check('one signal at bar 31', r.signals.length === 1 && r.signals[0].bar === 31 && r.signals[0].dir === (D === -1 ? -1 : 1), JSON.stringify(r.signals)));

await both('S13 Asian-range sweep (swing/PDH/round off)', R,
  () => [...ramp(0.6420, 0.6434, 14), B(0.6434, 0.6435, 0.6431, 0.6432), ...ramp(0.6432, 0.6422, 13), ...ramp(0.6422, 0.6432, 8), B(0.6432, 0.6438, 0.6428, 0.6430), B(0.6430, 0.6431, 0.6422, 0.6424), ...ramp(0.6424, 0.6392, 12)],
  START, { ...BASE_OFF, useAsia: true, useSwing: false },
  (r, P, D) => check('one signal on bar 37', r.signals.length === 1 && r.signals[0].bar === 37 && r.signals[0].dir === (D === -1 ? -1 : 1), JSON.stringify(r.signals)));

await both('S14 confluence: minConf=2 blocks a swing-only sweep', R, () => [...sellLead(), S, C, ...tail(8, 0.6420)], START, { ...BASE_OFF, minConf: 2, useAsia: false },
  (r) => check('no signal', r.signals.length === 0, JSON.stringify(r.signals)));
await both('S14b minConf=2 allows swing + Asian extreme swept together', R, () => [...sellLead(), S, C, ...tail(8, 0.6420)], START, { ...BASE_OFF, minConf: 2, useAsia: true },
  (r) => check('one signal', r.signals.length === 1, JSON.stringify(r.signals)));

// ---- bias filter (structure computed on the chart timeframe: bias TF "15") ----
const biasOv = { ...BASE_OFF, useBias: true, biasTFin: '15' };
const bearPrefix = () => [...ramp(0.6500, 0.6440, 20), B(0.6440, 0.6441, 0.6436, 0.6438), ...ramp(0.6438, 0.6450, 4), ...ramp(0.6450, 0.6400, 10)];
const bullPrefix = () => [...ramp(0.6300, 0.6360, 20), B(0.6360, 0.6364, 0.6359, 0.6361), ...ramp(0.6361, 0.6350, 4), ...ramp(0.6350, 0.6400, 10)];
{
  console.log('S16 bias filter (structure of the chart timeframe)');
  let bars = [...bearPrefix(), ...sellLead(), S, C, ...tail(6)]; let off = bearPrefix().length;
  let r = await R(bars, '2025-01-07T00:00:00Z', { ...biasOv, entryMode: 'Confirmed' });
  // prefix (34 bars) + 38 => confirmation candle opens at 00:00 + 72*15min = 18:00 -> outside the entry window; widen the window
  r = await R(bars, '2025-01-07T00:00:00Z', { ...biasOv, mode: 'Custom', cSess: false });
  check('bearish structure => SELL allowed', r.signals.length === 1 && r.signals[0].dir === -1, JSON.stringify(r.signals));
  check('HTF trend plot is -1 on the entry bar', r.signals[0] && r.trend[r.signals[0].bar] === -1, String(r.trend[r.signals[0]?.bar]));
  bars = [...bullPrefix(), ...sellLead(), S, C, ...tail(6)];
  r = await R(bars, '2025-01-07T00:00:00Z', { ...biasOv, mode: 'Custom', cSess: false });
  check('bullish structure => SELL blocked', r.signals.length === 0 && r.trend[bullPrefix().length + 38] === 1, JSON.stringify(r.signals) + ' trend=' + r.trend[bullPrefix().length + 38]);
  bars = [...sellLead(), S, C, ...tail(6)];
  r = await R(bars, START, { ...biasOv });
  check('neutral structure => SELL blocked', r.signals.length === 0 && r.trend[38] === 0, JSON.stringify(r.signals) + ' trend=' + r.trend[38]);
  // mirrored: bullish structure allows BUY
  bars = mirror([...bearPrefix(), ...sellLead(), S, C, ...tail(6)], M);
  r = await R(bars, '2025-01-07T00:00:00Z', { ...biasOv, mode: 'Custom', cSess: false });
  check('mirrored: bullish structure => BUY allowed', r.signals.length === 1 && r.signals[0].dir === 1 && r.trend[r.signals[0].bar] === 1, JSON.stringify(r.signals));
}

// ---- compact pattern (swingLen 2) for frequency limits ----
const pat = (p) => [
  ...ramp(p, p + 0.0015, 3), B(p + 0.0015, p + 0.0020, p + 0.0013, p + 0.0014), ...ramp(p + 0.0014, p + 0.0004, 3), ...ramp(p + 0.0004, p + 0.0016, 4),
  B(p + 0.0016, p + 0.0024, p + 0.0012, p + 0.0013), B(p + 0.0013, p + 0.0014, p + 0.0006, p + 0.0008), ...ramp(p + 0.0008, p - 0.0020, 3)];
const patLen = pat(0.64).length; // 15 bars
const customOv = { ...BASE_OFF, mode: 'Custom', cSess: false, swingLen: 2 };
{
  console.log('S17 max trades per day / cooldown');
  const four = () => { let b = [], p = 0.6500; for (let k = 0; k < 4; k++) { b.push(...pat(p)); p = p - 0.0020; } return b; };
  let r = await R(four(), '2025-01-08T00:00:00Z', { ...customOv, maxPerDay: 3, cooldown: 0 });
  check(`4 valid setups same day, maxPerDay=3 => 3 signals (pattern length ${patLen})`, r.signals.length === 3, JSON.stringify(r.signals.map((s) => s.bar)));
  r = await R(four(), '2025-01-08T00:00:00Z', { ...customOv, maxPerDay: 20, cooldown: 0 });
  check('maxPerDay=20 => all 4 signals', r.signals.length === 4, JSON.stringify(r.signals.map((s) => s.bar)));
  r = await R(four(), '2025-01-08T00:00:00Z', { ...customOv, maxPerDay: 20, cooldown: 40 });
  check('cooldown=40 bars => only signals >= 40 bars apart survive', r.signals.length >= 1 && r.signals.every((s, i, a) => i === 0 || s.bar - a[i - 1].bar >= 40), JSON.stringify(r.signals.map((s) => s.bar)));
  // two patterns straddling midnight, maxPerDay=1: the day rolls over so the second is allowed
  const two = () => [...pat(0.6500), ...pat(0.6480)];
  r = await R(two(), '2025-01-08T20:00:00Z', { ...customOv, maxPerDay: 1, cooldown: 0 });
  const t0 = Date.parse('2025-01-08T20:00:00Z');
  const days = r.signals.map((s) => new Date(t0 + s.bar * 15 * 60000).toISOString().slice(0, 10));
  check('day rollover resets the counter (signals on different days)', r.signals.length === 2 && days[0] !== days[1], JSON.stringify(days));
  r = await R(two(), '2025-01-08T00:00:00Z', { ...customOv, maxPerDay: 1, cooldown: 0 });
  check('same day + maxPerDay=1 => only 1 signal', r.signals.length === 1, JSON.stringify(r.signals.map((s) => s.bar)));
}

{
  console.log('S18 one trade at a time: a valid second setup while a trade is open is ignored');
  const p = 0.6500;
  // trade 1: same compact pattern but WITHOUT the final drop, so the trade stays open (entry p+0.0008, stop p+0.0025, target p-0.00175)
  const first = pat(p).slice(0, patLen - 3);
  const drift = ramp(p + 0.0008, p + 0.0000, 3);
  const p2 = p - 0.0004;
  const second = [...ramp(p2, p2 + 0.0015, 3), B(p2 + 0.0015, p2 + 0.0020, p2 + 0.0013, p2 + 0.0014), ...ramp(p2 + 0.0014, p2 + 0.0004, 3), ...ramp(p2 + 0.0004, p2 + 0.0016, 4),
    B(p2 + 0.0016, p2 + 0.0024, p2 + 0.0012, p2 + 0.0013), B(p2 + 0.0013, p2 + 0.0014, p2 + 0.0006, p2 + 0.0008)];
  const fin = ramp(p2 + 0.0008, p - 0.0030, 4);
  const r = await R([...first, ...drift, ...second, ...fin], '2025-01-08T00:00:00Z', { ...customOv, maxPerDay: 20, cooldown: 0 });
  check('exactly one signal despite the second valid setup', r.signals.length === 1, JSON.stringify(r.signals.map((s) => s.bar)));
  check('exactly one exit', r.exits.length === 1, JSON.stringify(r.exits));
}

process.exit(summary() ? 1 : 0);
