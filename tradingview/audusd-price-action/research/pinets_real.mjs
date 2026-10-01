// Run the real Pine source in PineTS on aggregated Oanda AUDUSD bars (same bars the fast engine sees).
import { PineTS } from 'pinets';
import { aggregate } from './data.mjs';

const toCandles = (a, durMin = 0) => {
  const out = new Array(a.n);
  for (let k = 0; k < a.n; k++) {
    const ot = a.t[k] * 60000, ct = durMin ? ot + durMin * 60000 : (k + 1 < a.n ? a.t[k + 1] * 60000 : ot + 60000) - 1;
    out[k] = { openTime: ot, closeTime: ct, open: a.o[k] / 1e5, high: a.h[k] / 1e5, low: a.l[k] / 1e5, close: a.c[k] / 1e5, volume: 1,
      quoteAssetVolume: 0, numberOfTrades: 0, takerBuyBaseAssetVolume: 0, takerBuyQuoteAssetVolume: 0, ignore: 0 };
  }
  return out;
};

const norm = (tf) => { const s = String(tf).toUpperCase(); return s === '1D' || s === 'D' ? 'D' : s === '1W' || s === 'W' ? 'W' : Number(s); };

export function makeProvider(m1, chartTF) {
  const cache = {};
  const get = (tf) => (cache[tf] ||= toCandles(aggregate(m1, tf), tf === norm(chartTF) && typeof tf === 'number' ? tf : 0));
  return {
    configure() {},
    async getMarketData(tickerId, timeframe, limit, sDate, eDate) {
      const tf = norm(timeframe);
      let d = get(tf);
      if (tf === norm(chartTF)) {
        if (sDate) d = d.filter((k) => k.openTime >= sDate);
        if (eDate) d = d.filter((k) => k.openTime <= eDate);
        if (limit && d.length > limit) d = d.slice(d.length - limit);
      }
      return d;
    },
    async getSymbolInfo() {
      return { current_contract: '', description: 'Australian Dollar / U.S. Dollar', isin: '', main_tickerid: 'OANDA:AUDUSD', prefix: 'OANDA', root: 'AUDUSD',
        ticker: 'AUDUSD', tickerid: 'OANDA:AUDUSD', type: 'forex', basecurrency: 'AUD', country: '', currency: 'USD', timezone: 'Etc/UTC',
        employees: 0, industry: '', sector: '', shareholders: 0, shares_outstanding_float: 0, shares_outstanding_total: 0, expiration_date: 0,
        session: '24x7', volumetype: 'tick', mincontract: 0, minmove: 1, mintick: 0.00001, pointvalue: 1, pricescale: 100000,
        recommendations_buy: 0, recommendations_buy_strong: 0, recommendations_date: 0, recommendations_hold: 0, recommendations_sell: 0,
        recommendations_sell_strong: 0, recommendations_total: 0, target_price_average: 0, target_price_date: 0, target_price_estimates: 0,
        target_price_high: 0, target_price_low: 0, target_price_median: 0 };
    },
  };
}

export async function runPineReal(src, m1, chartTF) {
  const nBars = aggregate(m1, norm(chartTF)).n;
  const pine = new PineTS(makeProvider(m1, chartTF), 'OANDA:AUDUSD', String(chartTF), nBars);
  return pine.run(src);
}

export const series = (ctx, name) => ctx.plots[name].data.map((x) => x.value);

export function sliceM1(m1, fromISO, toISO) {
  const a = Date.parse(fromISO) / 60000, b = Date.parse(toISO) / 60000;
  let i0 = 0, i1 = m1.n;
  while (i0 < m1.n && m1.t[i0] < a) i0++;
  i1 = i0; while (i1 < m1.n && m1.t[i1] < b) i1++;
  const out = { n: i1 - i0 };
  for (const k of ['t', 'o', 'h', 'l', 'c', 'v']) out[k] = m1[k].slice(i0, i1);
  return out;
}
