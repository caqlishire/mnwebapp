// Scenario-test helpers: hand-built candle sequences with exact expected outcomes.
import fs from 'fs';
import { runPine, series, MIN } from './harness.mjs';

export const q = (x) => Math.round(x * 1e5) / 1e5;
export const B = (o, h, l, c) => [q(o), q(h), q(l), q(c)];

// monotonic ramp from -> to over n bars (highs/lows strictly monotonic => no swing points inside)
export function ramp(from, to, n, wick = 0.00005) {
  const out = [];
  for (let k = 0; k < n; k++) {
    const o = from + ((to - from) * k) / n, c = from + ((to - from) * (k + 1)) / n;
    out.push(B(o, Math.max(o, c) + wick, Math.min(o, c) - wick, c));
  }
  return out;
}
export const mirror = (bars, m) => bars.map(([o, h, l, c]) => B(2 * m - o, 2 * m - l, 2 * m - h, 2 * m - c));

export function toCandles(bars, startISO, tfMin = 15) {
  const t0 = Date.parse(startISO);
  return bars.map(([o, h, l, c], i) => ({
    openTime: t0 + i * tfMin * MIN, closeTime: t0 + (i + 1) * tfMin * MIN - 1, open: o, high: h, low: l, close: c, volume: 100,
    quoteAssetVolume: 0, numberOfTrades: 0, takerBuyBaseAssetVolume: 0, takerBuyQuoteAssetVolume: 0, ignore: 0,
  }));
}

// override the default (first argument) of `name = input.xxx(...)`
export function patchInputs(src, ov) {
  let s = src;
  for (const [name, val] of Object.entries(ov)) {
    const re = new RegExp(`^(\\s*${name}\\s*=\\s*input\\.[a-z]+\\()([^,]+?)(\\s*,)`, 'm');
    if (!re.test(s)) throw new Error('input not found: ' + name);
    const lit = typeof val === 'string' ? JSON.stringify(val) : String(val);
    s = s.replace(re, `$1${lit}$3`);
  }
  return s;
}

export const BASE_OFF = { useBias: false, usePDHL: false, useAsia: false, useRound: false }; // isolate swing-level logic

export async function run(srcFile, bars, startISO, overrides = {}, opts = {}) {
  const src = patchInputs(fs.readFileSync(srcFile, 'utf8'), overrides);
  const candles = toCandles(bars, startISO);
  const ctx = await runPine(src, candles, opts);
  const g = (n) => series(ctx, n);
  const sig = g('Signal (1 buy, -1 sell)'), ent = g('Signal entry'), sl = g('Signal stop'), tp = g('Signal target');
  const ek = g('Exit kind (1 TP, -1 SL, 0 BE, 2 EOD, 99 none)'), er = g('Exit net R'), tr = g('HTF trend');
  const signals = [], exits = [];
  for (let i = 0; i < sig.length; i++) {
    if (sig[i] === 1 || sig[i] === -1) signals.push({ bar: i, dir: sig[i], entry: ent[i], sl: sl[i], tp: tp[i] });
    if (ek[i] !== 99 && Number.isFinite(ek[i])) exits.push({ bar: i, kind: ek[i], r: er[i] });
  }
  return { ctx, candles, signals, exits, trend: tr, g };
}

let pass = 0, fail = 0;
export function check(name, cond, detail = '') { if (cond) { pass++; console.log('  PASS', name); } else { fail++; console.log('  FAIL', name, detail); } }
export const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
export function summary() { console.log(`\n${pass} passed, ${fail} failed`); return fail; }
