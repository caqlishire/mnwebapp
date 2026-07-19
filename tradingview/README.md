# AUDUSD Trend-Pullback — TradingView Strategy (Pine v6)

A trend-following pullback strategy for **AUDUSD** (and other USD-quoted majors),
built for M5/M15 scalping and H1 swing trading. It ships as a `strategy()` script —
not just an indicator — so you can verify every claim yourself in TradingView's
Strategy Tester before risking a cent.

File: [`AUDUSD_Trend_Pullback_Strategy.pine`](./AUDUSD_Trend_Pullback_Strategy.pine)

---

## Why this design

There is no indicator with a guaranteed high win rate — anyone selling one is lying.
What *does* survive decades of published research and broker data is a small set of
boring, durable edges. This script stacks all of them and nothing else:

| Component | Edge it captures |
|---|---|
| HTF 200-EMA filter (non-repainting) | Trading with the higher-timeframe trend is the single most persistent FX edge |
| Pullback entry (EMA touch + RSI reset/turn) | Buying dips in an uptrend beats chasing breakouts on spread-sensitive timeframes |
| ADX ≥ 20 + ATR floor/ceiling | Skips ranging chop and news-spike chaos, where pullback systems bleed |
| Session filter (London → NY default) | AUDUSD spreads tighten and follow-through improves in liquid hours |
| ATR stop + fixed-fractional sizing | Constant % risk per trade — the main driver of low drawdown |
| 50% off at 1R + breakeven + ATR trail | Banks frequent small wins (win rate) while leaving a runner for trends (expectancy) |
| Daily loss circuit-breaker + weekend flat | Caps bad days; avoids Sunday-open gap risk that ATR stops can't protect against |

The exit scheme is what shapes the equity curve you asked for: taking half at 1R and
jumping to breakeven converts many would-be losers into scratches, which raises win
rate and flattens drawdown, while the ATR-trailed runner keeps the average win large
enough for positive expectancy.

## Honest engineering details

- **No repainting / no lookahead.** The HTF EMA uses the `[1]` + `lookahead_on`
  idiom, so the backtest only ever sees the last *completed* higher-timeframe bar —
  exactly what you'd see live.
- **Spread is paid in the backtest.** `slippage=5` ticks = 0.5 pip per fill on a
  5-digit feed ≈ 1 pip round trip. Raise it if your broker is worse. (If your feed
  is 4-digit, 5 ticks = 5 pips — lower it.)
- **Realistic fills.** Signals compute on bar close; entries fill on the next bar's
  open. Stops/limits execute intrabar.
- **Risk-based sizing.** Quantity is derived from stop distance so a stop-out costs
  exactly `Risk %` of equity. This works precisely on USD-quoted pairs (AUDUSD ✓)
  with a USD account.

## Setup

1. TradingView → Pine Editor → paste the script → **Add to chart** on
   `AUDUSD` (use your own broker's feed, e.g. `OANDA:AUDUSD`, `PEPPERSTONE:AUDUSD`).
2. Chart timeframe: **M5 or M15** (scalp) or **H1** (swing). The HTF filter adapts
   automatically (M5/M15 → 1H, H1 → 4H, higher → Daily).
3. Strategy Tester tab → check the report. On Premium+, also enable
   **Properties → "Use bar magnifier"** for more accurate intrabar stop/TP fills.
4. Alerts: create an alert on the strategy with the built-in
   *Long entry signal* / *Short entry signal* conditions — it works as a signal
   indicator even if you execute manually.

### Suggested settings

| Setting | M5/M15 scalp | H1 swing |
|---|---|---|
| Risk per trade | 0.25–0.5% | 0.5–1% |
| Stop (ATR ×) | 1.5 | 1.5–2.0 |
| TP1 / Runner | 1R / 3R | 1R / 3–4R |
| ADX threshold | 20 | 18–20 |
| Session filter | ON (0800–1700 London) | ON, or OFF for pure swing |
| Weekend flat | ON | ON |

For the AUD-specific Asia session, enable **Session 2** and set the timezone to
`Australia/Sydney` — but test it separately; spreads are wider and the edge is thinner.

## How to backtest it *properly* (this is the "proven" part — you prove it)

1. **Deep history.** Use Deep Backtesting to cover several years and multiple
   regimes (trend years and chop years).
2. **Walk-forward.** Tune inputs on e.g. 2019–2023 only, then run 2024→today
   untouched. If out-of-sample performance collapses, you curve-fit — revert
   toward defaults.
3. **Read the right numbers.** TradingView counts each partial exit as its own
   closed trade, so the reported win rate is inflated by TP1 hits. Judge the
   system on **profit factor (> 1.3 after costs), max drawdown, and net profit**,
   not the win-rate headline.
4. **Match your broker.** Set `slippage` to your real spread+slippage; backtest on
   your broker's data feed, not a generic one.
5. **Forward-test on demo for at least a month** before any live money, and start
   at minimum size when you go live.

## Risk disclaimer

This is a research/education tool, not financial advice. Past performance —
including any backtest — does not guarantee future results. Forex trading with
leverage can lose more than your deposit. Trade only risk capital.
