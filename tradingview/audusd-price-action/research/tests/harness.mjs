// Test harness: runs real Pine v6 source in PineTS against synthetic AUDUSD-like candles.
// Synthetic data validates CODE MECHANICS ONLY - it says nothing about real-market profitability.
import { PineTS } from 'pinets';

export const MIN = 60000;

// Deterministic PRNG
export function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}
function gauss(r) { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

// Weekday-only 15m candles, 5-decimal AUDUSD-like prices, London/NY-heavy intraday vol
export function genCandles({ days = 60, seed = 11, start = Date.UTC(2025, 0, 6, 0, 0), tfMin = 15, p0 = 0.65, baseVolPips = 3.2 } = {}) {
  const r = rng(seed); const out = []; let p = p0; const perDay = 1440 / tfMin;
  for (let d = 0; d < days; d++) {
    const day = new Date(start + d * 86400000); const dow = day.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    for (let i = 0; i < perDay; i++) {
      const t = start + d * 86400000 + i * tfMin * MIN; const hr = i * tfMin / 60;
      const seas = hr >= 7 && hr < 12 ? 1.5 : hr >= 12 && hr < 17 ? 1.3 : hr < 7 ? 0.8 : 0.6;
      const sd = baseVolPips * 1e-4 * seas * Math.sqrt(tfMin / 15);
      const o = p; const c = o + gauss(r) * sd;
      const wick = () => Math.abs(gauss(r)) * sd * 0.55;
      const h = Math.max(o, c) + wick(); const l = Math.min(o, c) - wick();
      const q = (x) => Math.round(x * 1e5) / 1e5;
      out.push({ openTime: t, closeTime: t + tfMin * MIN, open: q(o), high: q(h), low: q(l), close: q(c), volume: 100,
        quoteAssetVolume: 0, numberOfTrades: 0, takerBuyBaseAssetVolume: 0, takerBuyQuoteAssetVolume: 0, ignore: 0 });
      p = q(c);
    }
  }
  return out;
}

const TF_MIN = { '1': 1, '5': 5, '15': 15, '30': 30, '60': 60, '120': 120, '240': 240, 'D': 1440, '1D': 1440 };
function aggregate(base, baseMin, tf) {
  const m = TF_MIN[tf]; if (!m) throw new Error('unsupported tf ' + tf);
  if (m === baseMin) return base;
  const span = m * MIN; const out = []; let cur = null;
  for (const k of base) {
    const bucket = Math.floor(k.openTime / span) * span;
    if (!cur || cur.openTime !== bucket) {
      if (cur) out.push(cur);
      cur = { ...k, openTime: bucket, closeTime: bucket + span - 1 };
    } else {
      cur.high = Math.max(cur.high, k.high); cur.low = Math.min(cur.low, k.low); cur.close = k.close; cur.volume += k.volume;
    }
  }
  if (cur) out.push(cur);
  return out;
}

export function makeProvider(base, baseMin = 15) {
  return {
    configure() {},
    async getMarketData(tickerId, timeframe, limit, sDate, eDate) {
      let d = aggregate(base, baseMin, String(timeframe));
      if (sDate) d = d.filter((k) => k.openTime >= sDate);
      if (eDate) d = d.filter((k) => k.openTime <= eDate);
      if (limit && d.length > limit) d = d.slice(d.length - limit);
      return d;
    },
    async getSymbolInfo(tickerId) {
      return {
        current_contract: '', description: 'Australian Dollar / U.S. Dollar', isin: '', main_tickerid: 'FX:AUDUSD', prefix: 'FX', root: 'AUDUSD',
        ticker: 'AUDUSD', tickerid: 'FX:AUDUSD', type: 'forex', basecurrency: 'AUD', country: '', currency: 'USD', timezone: 'Etc/UTC',
        employees: 0, industry: '', sector: '', shareholders: 0, shares_outstanding_float: 0, shares_outstanding_total: 0, expiration_date: 0,
        session: '24x7', volumetype: 'tick', mincontract: 0, minmove: 1, mintick: 0.00001, pointvalue: 1, pricescale: 100000,
        recommendations_buy: 0, recommendations_buy_strong: 0, recommendations_date: 0, recommendations_hold: 0, recommendations_sell: 0,
        recommendations_sell_strong: 0, recommendations_total: 0, target_price_average: 0, target_price_date: 0, target_price_estimates: 0,
        target_price_high: 0, target_price_low: 0, target_price_median: 0,
      };
    },
  };
}

export async function runPine(src, candles, { tf = '15', symbol = 'FX:AUDUSD', alertAll = false } = {}) {
  const pine = new PineTS(makeProvider(candles, Number(tf)), symbol, tf, candles.length);
  if (alertAll) pine.setAlertMode('all');
  return pine.run(src);
}

export function series(ctx, name) { return ctx.plots[name].data.map((x) => x.value); }
