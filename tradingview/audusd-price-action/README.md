# AUDUSD Liquidity Sweep - pure price action (TradingView, Pine v6)

Two scripts that share one signal engine:

| File | Use it for |
|---|---|
| `AUDUSD_Liquidity_Sweep.pine` | **Indicator.** Buy/sell signals, stop/target boxes, alerts, and a dashboard that simulates every signal on your chart (win rate, profit factor, average R, max drawdown in R). |
| `AUDUSD_Liquidity_Sweep_Strategy.pine` | **Strategy.** Same signals plus orders, so TradingView's Strategy Tester (and Deep Backtesting) can report results on your own data. |

Install: TradingView > Pine Editor > paste the file > *Add to chart*. Use `FX:AUDUSD` or `OANDA:AUDUSD`.
Scalp: M5-M15, mode **Scalp** (default). Swing: M30-H4, mode **Swing**.

## No indicators

There is no moving average, oscillator, band or volatility indicator anywhere. Every rule is read from candles: swing points, highs, lows, closes, wicks.

## The setup

Stop orders cluster just beyond obvious levels. When a candle pokes through such a level and **closes back inside**, the break was a liquidity grab and not acceptance. The script trades the reversal, only with the higher-timeframe structure, and only after a candle confirms it.

1. **Bias** - higher-timeframe market structure (Auto: M5 -> H1, M15 -> H4, H1 -> D). Bullish after a close above the last swing high, bearish after a close below the last swing low. Non-repainting (`[1]` + lookahead).
2. **Sweep** - a candle wicks at least 1 pip beyond a level and closes back inside, with the close in the far 40% of its own range. Levels: swing highs/lows, previous-day high/low, Asian-session high/low, round numbers (x.xx00 / x.xx50). Each can be switched off; `Minimum confluence = 2` requires two different level types to be swept by the same candle (far fewer, "A+" trades).
3. **Confirmation** - within 3 candles, a close beyond the sweep candle's opposite extreme. (`Immediate` mode skips this.)
4. **Stop** beyond the sweep extreme + 1 pip. Trades with a stop outside 6-25 pips (Scalp) or 15-80 pips (Swing) are skipped, so costs stay a small share of R.
5. **Target** 1.5R (Scalp) / 2.5R (Swing), stop moved to break-even at 1R / 1.5R.
6. **Filters** - entry window 07:00-15:30 London (Scalp), open trades flattened after 17:00 London, max 3 trades per day, 6-bar cooldown, one trade at a time.

Signals are evaluated on closed candles only. Nothing repaints.

## What was and was not verified - read this

**Not verified: profitability.** I could not backtest on real AUDUSD candles: this session's network policy blocked every market-data host I tried, and I did not work around it. So there is **no backtest result, win rate or drawdown figure for real markets in this repo**, and nobody can honestly promise you one. Treat "high win rate, low drawdown" as something you measure, not something you are given. Reasoning for the setup (order clustering at round numbers and stop-loss placement in FX is documented in Osler's New York Fed / *Journal of Finance* papers, cited from memory) is a plausible mechanism, not evidence that this script makes money.

**Not verified: compilation inside TradingView.** No TradingView compiler was available. Both files parse with an independent Pine parser and run in a third-party Pine v6 runtime (PineTS), and I checked them by hand for v6 pitfalls (built-in name shadowing, bool/na rules, loops, scope). If TradingView reports a compile error, paste it back and it will be fixed quickly.

**Verified on synthetic candles (code mechanics only, says nothing about edge):**
- 76 hand-built scenario checks, each run as a sell and as a mirrored buy: swing / previous-day / Asian / round-number sweeps, confirmation, expiry, invalidation, stop, target, break-even, session-end exit, "stop first when stop and target share a candle", stop-size and rejection filters, entry-window edges, confluence, structure bias, max trades per day, cooldown, one trade at a time.
- No repainting: re-running on truncated data reproduces the identical earlier signals, bias and exits (3 datasets, 3 cut points each).
- The exit and statistics engine matches an independent re-simulation of every trade (128 trades on 3 datasets), including max drawdown.
- Strategy vs indicator: identical entries, exits and prices on 265 trades over 6 datasets (break-even off - the emulator cannot modify an exit order, so the strategy's break-even step is untested here; it is standard `strategy.cancel` + `strategy.exit`).
- The signal-engine block is byte-identical in both files.

## How to judge it yourself (do this before real money)

1. Add the **strategy** to M15 AUDUSD. Leave slippage at 5 ticks (0.5 pip on each market/stop fill) or enter your broker's real costs. Premium: run **Deep Backtesting** over years, not weeks.
2. Look at **profit factor, max drawdown and number of trades**, not win rate alone. Under ~100 trades the sample means little.
3. Split history with *Limit trading to a date range*: look at one period, settle on settings, then check a period you have never looked at, once. If results collapse out of sample, the settings were curve-fit.
4. Check different regimes (2022 trend, quiet ranges, high-volatility months) and that most of the profit is not from a handful of trades.
5. Forward test on a demo account for weeks. Then size small.

The indicator's dashboard is a quick look only: it covers just the candles loaded on your chart (a few weeks on M15 for lower plans) and uses a candle-based simulation.

## Win rate vs payoff

With a fixed R target, a higher win rate means a smaller target, not a better system: break-even win rate is about 1/(1+R) before costs (50% at 1R, 40% at 1.5R, 29% at 2.5R). To push toward more frequent wins use `Custom` mode with a 1.0R target, `Minimum confluence` 2 and `Max trades per day` 2; to push toward larger winners use Swing mode. Either way, compare profit factor and drawdown after costs.

## Limits

- No news filter (the script cannot see the calendar). Avoid RBA, Fed, NFP and CPI releases yourself.
- The stop is assumed hit first when a candle touches both stop and target; real fills, spread widening and gaps will differ.
- Position sizing in the strategy assumes a USD account on a USD-quoted pair.
- Change the session time zone if you trade another session; the defaults use London time.

## Alerts

`BUY signal`, `SELL signal`, `any signal`, simulated target and stop alerts are available as alert conditions. For messages that include entry, stop and target, create the alert on the indicator with condition *Any alert() function call* and *Once Per Bar Close*.

Not financial advice. Trading leveraged FX can lose more than you deposit.
