// ICT Silver Bullet, mechanical version. Signal on chart bars (M5 by default), orders filled and managed on 1-minute bars.
// Window (New York time): first fair value gap (FVG) whose three candles lie inside the window.
//   bullish FVG: low[i] > high[i-2] by >= minGap pips; bearish: high[i] < low[i-2].
//   optional liquidity raid: before the FVG, the window traded beyond the previous hour's low (for longs) / high (for shorts).
// Entry: limit at the gap edge (first touch) or its midpoint, valid until the window ends.
// Stop: 1 pip beyond the low/high of the first two FVG candles. Target: tpR x risk. Time stop: window end + 60 minutes.
import { localMinOfDay } from './data.mjs';

export const SB_WINDOWS = { LO: [180, 240], AM: [600, 660], PM: [840, 900] }; // minutes of the New York day

export const SB_DEFAULTS = { win: 'AM', minGap: 1.0, sweep: false, entryAt: 'edge', tpR: 2, slBuf: 1.0, minStop: 3, maxStop: 25, holdAfter: 60, costPips: 1.0, preBars: 12 };

export function runSilverBullet(ctx, params = {}) {
  const P = { ...SB_DEFAULTS, ...params };
  const { n, O, H, L, C, m1 } = ctx;
  const pip = 0.0001;
  const [ws, we] = SB_WINDOWS[P.win];
  const M1O = ctx.m1O ||= Float64Array.from(m1.o, (v) => v / 1e5);
  const M1H = ctx.m1H, M1L = ctx.m1L, M1T = m1.t;
  const firstM1AtOrAfter = (T) => { let lo = 0, hi = m1.n; while (lo < hi) { const mid = (lo + hi) >> 1; if (M1T[mid] < T) lo = mid + 1; else hi = mid; } return lo; };
  const trades = [];
  let day = -1, inWin = false, done = false, preHi = NaN, preLo = NaN, winHi = -Infinity, winLo = Infinity, winStartT = 0;
  for (let i = 0; i < n; i++) {
    const ny = ctx.nyMin[i];
    const isIn = ny >= ws && ny < we;
    const dk = ctx.dayIdx[i];
    if (isIn && (!inWin || dk !== day)) {
      // window opens: liquidity reference = previous hour (preBars bars)
      day = dk; done = false; winHi = -Infinity; winLo = Infinity;
      winStartT = ctx.t[i] - (ny - ws);
      preHi = -Infinity; preLo = Infinity;
      for (let k = Math.max(0, i - P.preBars); k < i; k++) { preHi = Math.max(preHi, H[k]); preLo = Math.min(preLo, L[k]); }
    }
    inWin = isIn;
    if (!isIn || done) { if (isIn) { winHi = Math.max(winHi, H[i]); winLo = Math.min(winLo, L[i]); } continue; }
    // FVG with all three candles inside the window
    if (i >= 2 && ctx.nyMin[i - 2] >= ws && ctx.dayIdx[i - 2] === dk) {
      const raidedLow = winLo < preLo, raidedHigh = winHi > preHi; // window bars before the FVG candle i (winHi/winLo exclude bar i)
      let dir = 0, edge = NaN, far = NaN, sl = NaN;
      if (L[i] - H[i - 2] >= P.minGap * pip - 1e-10 && (!P.sweep || raidedLow)) { dir = 1; edge = L[i]; far = H[i - 2]; sl = Math.min(L[i - 2], L[i - 1]) - P.slBuf * pip; }
      else if (L[i - 2] - H[i] >= P.minGap * pip - 1e-10 && (!P.sweep || raidedHigh)) { dir = -1; edge = H[i]; far = L[i - 2]; sl = Math.max(H[i - 2], H[i - 1]) + P.slBuf * pip; }
      if (dir !== 0) {
        done = true; // first FVG of the window only
        const entry = P.entryAt === 'edge' ? edge : (edge + far) / 2;
        const risk = Math.abs(entry - sl), rp = risk / pip;
        if (rp >= P.minStop && rp <= P.maxStop) {
          const tp = entry + dir * P.tpR * risk;
          const tWinEnd = winStartT + (we - ws), tExit = tWinEnd + P.holdAfter;
          // fill on 1-minute bars after the FVG candle closes, until the window ends
          let j = ctx.m1Last[i] + 1, fillJ = -1, fillPx = NaN;
          for (; j < m1.n && M1T[j] < tWinEnd; j++) {
            if (dir === 1 ? M1L[j] <= entry : M1H[j] >= entry) { fillJ = j; fillPx = dir === 1 ? Math.min(entry, M1O[j]) : Math.max(entry, M1O[j]); break; }
          }
          if (fillJ >= 0) {
            let exitPx = NaN, kind = 'time';
            // fill bar: only the stop can be confirmed after the fill (conservative)
            if (dir === 1 ? M1L[fillJ] <= sl : M1H[fillJ] >= sl) { exitPx = sl; kind = 'stop'; }
            else {
              const jEnd = firstM1AtOrAfter(tExit);
              for (let k = fillJ + 1; k < m1.n && k < jEnd; k++) {
                if (dir === 1 ? M1L[k] <= sl : M1H[k] >= sl) { exitPx = sl; kind = 'stop'; break; }
                if (dir === 1 ? M1H[k] >= tp : M1L[k] <= tp) { exitPx = tp; kind = 'target'; break; }
              }
              if (Number.isNaN(exitPx)) exitPx = jEnd < m1.n ? M1O[jEnd] : M1O[m1.n - 1];
            }
            const netR = (dir * (exitPx - fillPx) - P.costPips * pip) / Math.abs(fillPx - sl);
            trades.push({ entryBar: i, dir, kind, netR, risk: Math.abs(fillPx - sl), gap: (edge - far) * dir / pip, win: P.win });
          }
        }
      }
    }
    winHi = Math.max(winHi, H[i]); winLo = Math.min(winLo, L[i]);
  }
  return trades;
}
