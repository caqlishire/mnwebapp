// AUDUSD research data: Oanda 1-minute MID candles (UTC), 2005-01 .. 2020-05.
// Prices are kept as integer points (1 point = 0.00001) and converted to floats with p / 1e5,
// which is bit-identical to parseFloat of the 5-decimal CSV text.
import fs from 'fs';
import path from 'path';

// Folder that holds the Oanda per-instrument CSV folders (see research/README.md for how to fetch them).
const BASE = process.env.FX_DATA_DIR || path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../../financial-data/pyfinancialdata/data/currencies/oanda');

export function loadM1(instr = 'AUD_USD') {
  const ROOT = path.join(BASE, instr);
  const CACHE = path.join(path.dirname(new URL(import.meta.url).pathname), instr === 'AUD_USD' ? 'audusd_m1.bin' : `${instr.toLowerCase()}_m1.bin`);
  if (fs.existsSync(CACHE)) {
    const buf = fs.readFileSync(CACHE);
    const n = buf.readInt32LE(0);
    const arr = new Int32Array(buf.buffer, buf.byteOffset + 4, n * 6);
    const pick = (k) => arr.slice(k * n, (k + 1) * n);
    return { n, t: pick(0), o: pick(1), h: pick(2), l: pick(3), c: pick(4), v: pick(5) };
  }
  const files = [];
  for (const y of fs.readdirSync(ROOT).sort()) {
    for (const f of fs.readdirSync(path.join(ROOT, y))) {
      const m = f.match(/-(\d{4})-(\d{1,2})\.csv$/);
      files.push({ y: +m[1], m: +m[2], p: path.join(ROOT, y, f) });
    }
  }
  files.sort((a, b) => a.y - b.y || a.m - b.m);
  const T = [], O = [], H = [], L = [], C = [], V = [];
  let dup = 0, unsorted = 0, last = -Infinity;
  const px = (s) => Math.round(parseFloat(s) * 1e5);
  for (const f of files) {
    const lines = fs.readFileSync(f.p, 'utf8').split('\n');
    for (let k = 1; k < lines.length; k++) {
      const ln = lines[k];
      if (ln.length < 20) continue;
      // time,close,high,low,open,volume
      const parts = ln.split(',');
      const s = parts[0];
      const tMin = Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10), +s.slice(11, 13), +s.slice(14, 16)) / 60000;
      if (tMin === last) { dup++; continue; }
      if (tMin < last) { unsorted++; continue; }
      last = tMin;
      T.push(tMin); C.push(px(parts[1])); H.push(px(parts[2])); L.push(px(parts[3])); O.push(px(parts[4])); V.push(parseInt(parts[5]) || 0);
    }
  }
  const n = T.length;
  const out = new Int32Array(n * 6);
  [T, O, H, L, C, V].forEach((a, k) => out.set(a, k * n));
  const hdr = Buffer.alloc(4); hdr.writeInt32LE(n, 0);
  fs.writeFileSync(CACHE, Buffer.concat([hdr, Buffer.from(out.buffer)]));
  console.error(`loadM1 ${instr}: ${n} rows, ${dup} duplicates dropped, ${unsorted} out-of-order dropped`);
  return loadM1(instr);
}

// ---------- time zones (cached per UTC hour) ----------
const fmts = {};
const offCache = {};
export function tzOffsetMin(tz, tMin) {
  const hk = Math.floor(tMin / 60);
  const key = tz + hk;
  const hit = offCache[key];
  if (hit !== undefined) return hit;
  const f = (fmts[tz] ||= new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }));
  const p = {};
  for (const x of f.formatToParts(new Date(hk * 3600000))) p[x.type] = x.value;
  const local = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) / 60000;
  const off = local - hk * 60;
  offCache[key] = off;
  return off;
}
export const localMinOfDay = (tz, tMin) => { const m = (tMin + tzOffsetMin(tz, tMin)) % 1440; return m < 0 ? m + 1440 : m; };

// FX trading day starts 17:00 New York (TradingView daily candles for FX)
export function nySessionStart(tMin) {
  const off = tzOffsetMin('America/New_York', tMin);
  const local = tMin + off;
  return Math.floor((local - 1020) / 1440) * 1440 + 1020 - off;
}
export function fxWeekStart(tMin) {
  const ds = nySessionStart(tMin);
  const off = tzOffsetMin('America/New_York', ds);
  const label = new Date((ds + off + 420) * 60000).getUTCDay(); // calendar day the session is named after (Mon=1..Fri=5)
  const k = label === 0 ? 6 : label - 1;
  return ds - k * 1440;
}

// Drop quotes outside the FX week (Friday 17:00 to Sunday 17:00 New York): TradingView shows no bars there.
export function tradingWeekOnly(m1) {
  const keep = new Uint8Array(m1.n);
  let kept = 0;
  for (let i = 0; i < m1.n; i++) {
    const ds = nySessionStart(m1.t[i]);
    const off = tzOffsetMin('America/New_York', ds);
    const label = new Date((ds + off + 420) * 60000).getUTCDay();
    if (label >= 1 && label <= 5) { keep[i] = 1; kept++; }
  }
  const out = { n: kept };
  for (const k of ['t', 'o', 'h', 'l', 'c', 'v']) {
    const a = new Int32Array(kept);
    let j = 0;
    for (let i = 0; i < m1.n; i++) if (keep[i]) a[j++] = m1[k][i];
    out[k] = a;
  }
  return out;
}

// bucket start (minutes) of the bar of timeframe `tf` that contains minute tMin
export function bucketStart(tf, tMin) {
  if (tf === 'D') return nySessionStart(tMin);
  if (tf === 'W') return fxWeekStart(tMin);
  if (tf === 240) { const ds = nySessionStart(tMin); return ds + Math.floor((tMin - ds) / 240) * 240; }
  return Math.floor(tMin / tf) * tf;
}

export function aggregate(m1, tf) {
  const n = m1.n;
  const t = new Int32Array(n), o = new Int32Array(n), h = new Int32Array(n), l = new Int32Array(n), c = new Int32Array(n), first = new Int32Array(n), last = new Int32Array(n);
  let k = -1, cur = null;
  for (let i = 0; i < n; i++) {
    const b = bucketStart(tf, m1.t[i]);
    if (b !== cur) {
      k++; cur = b; t[k] = b; o[k] = m1.o[i]; h[k] = m1.h[i]; l[k] = m1.l[i]; c[k] = m1.c[i]; first[k] = i; last[k] = i;
    } else {
      if (m1.h[i] > h[k]) h[k] = m1.h[i];
      if (m1.l[i] < l[k]) l[k] = m1.l[i];
      c[k] = m1.c[i]; last[k] = i;
    }
  }
  const N = k + 1;
  return { tf, n: N, t: t.slice(0, N), o: o.slice(0, N), h: h.slice(0, N), l: l.slice(0, N), c: c.slice(0, N), m1First: first.slice(0, N), m1Last: last.slice(0, N) };
}

// index of the bar in `htf` that contains time tMin (htf.t sorted); -1 if before the first
export function makeLocator(htf) {
  let j = 0;
  return (tMin) => { // monotone calls only
    while (j + 1 < htf.n && htf.t[j + 1] <= tMin) j++;
    return htf.t[j] <= tMin ? j : -1;
  };
}

export const iso = (tMin) => new Date(tMin * 60000).toISOString().slice(0, 16).replace('T', ' ');
