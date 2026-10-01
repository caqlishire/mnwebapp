# AUDUSD Liquidity Sweep - pure price action (TradingView, Pine v6) - v2

Two scripts that share one signal engine:

| File | Use it for |
|---|---|
| `AUDUSD_Liquidity_Sweep.pine` | **Indicator.** Buy/sell signals, stop/target boxes, pending-setup line, alerts, a dashboard that simulates every signal on your chart, and an **edge-diagnostics table**. |
| `AUDUSD_Liquidity_Sweep_Strategy.pine` | **Strategy.** Same signals plus orders, so TradingView's Strategy Tester (and Deep Backtesting) can report results on your own data. |

Install: TradingView > Pine Editor > paste the file > *Add to chart*. Use `FX:AUDUSD` or `OANDA:AUDUSD`.
Scalp: M5-M15, mode **Scalp** (default). Swing: M30-H4, mode **Swing**.

## No indicators

There is no moving average, oscillator, band or volatility indicator anywhere. Every rule is read from candles: swing points, highs, lows, closes, wicks.

## The setup

Stop orders cluster just beyond obvious levels. When a candle pokes through such a level and **closes back inside**, the break was a liquidity grab and not acceptance. The script trades the reversal, only with the higher-timeframe structure, and only after a candle confirms it.

1. **Bias** - higher-timeframe market structure (Auto: M5 -> H1, M15 -> H4, H1 -> D). Bullish after a close above the last swing high, bearish after a close below the last swing low. Non-repainting (`[1]` + lookahead).
2. **Sweep** - a candle wicks at least 1 pip beyond a level and closes back inside, with the close in the far 40% of its own range. Levels: swing highs/lows, previous-day high/low, Asian-session high/low, round numbers (x.xx00 / x.xx50). `Minimum confluence = 2` requires two different level types to be swept by one candle.
3. **Confirmation** - within 3 candles, a close beyond the sweep candle's opposite extreme. A dotted line shows the level while a setup is pending. (`Immediate` mode skips this.)
4. **Stop** beyond the sweep extreme + 1 pip. Stops outside 6-25 pips (Scalp) or 15-80 pips (Swing) are skipped so costs stay a small share of R.
5. **Target** 1.5R (Scalp) / 2R (Swing), stop moved to break-even at 1R.
6. **Filters** - entry window 07:00-15:30 London (Scalp), open trades flattened after 17:00 London, max 3 trades per day, **stop for the day after 2 losing trades**, 6-bar cooldown, one trade at a time.

Signals are evaluated on closed candles only. Nothing repaints.

## What changed in v2

- **Daily circuit breaker** - after 2 losing trades (a loss = -0.5R or worse) no new trades that day. Break-even exits do not count. `0` turns it off.
- **Edge-diagnostics table** - average R with a 95% interval, a plain verdict (*too few trades / no edge proven / edge likely / negative*), the two halves of the sample, how much of the profit the best 3 trades make up, and results by liquidity type, buys and sells.
- **Swing target 2.5R -> 2R, break-even 1.5R -> 1R** (see the real-data test below: the 2.5R-3R targets were reached less often than a coin flip would give).
- Pending-setup trigger line, JSON alert format for webhook bridges, fixed-decimal price formatting, strategy default risk **1% -> 0.5%**.

## Does it have an edge? What I could and could not test

**Real AUDUSD data: none.** This session's network blocked every market-data host I tried (Yahoo, Dukascopy, Stooq, HistData, FRED, ECB, Hugging Face and others) and I did not work around that. The only real FX candles I could legitimately obtain were two sample files shipped inside PyPI packages (`gym-anytrading`, `backtesting`): **EURUSD hourly, 2017 - Feb 2018** (6,225 and 5,000 bars; the two overlap, so they are not independent). That is a different pair, one year, and one strong uptrend. I ran the real script on it in a third-party Pine runtime (PineTS):

| Swing preset, EURUSD H1, after 1 pip cost | trades | avg R | profit factor | max drawdown | worst day |
|---|---|---|---|---|---|
| v1 (2.5R target, no breaker) | 131 / 109 | -0.02 / -0.03 | 0.96 / 0.95 | 17.7R / 22.6R | -2.1R |
| v2 (2R target, breaker) | 153 / 132 | -0.02 / -0.02 | 0.97 / 0.97 | 13.9R / 17.3R | -2.1R |
| v2 without the breaker | 156 / 134 | -0.01 / -0.02 | 0.98 / 0.96 | 15.0R / 18.4R | -3.2R |

(first number: 2017 dataset, second: Apr 2017 - Feb 2018 dataset.)

What this says, honestly:

- **No edge was detectable.** Average R is about -0.02 with a 95% interval of roughly -0.23 to +0.20, so the data cannot tell this system from a coin flip. The script's own verdict on both datasets is *"no edge proven (CI spans 0)"*.
- An excursion study agrees: the chance of a signal reaching +1R / 1.5R / 2R before -1R was 45-50% / 37-43% / 30-34% across the variants I tried, essentially the random-walk values (50 / 40 / 33). At 2.5R-3R it was clearly *below* chance (22-25% vs 29%, 17-21% vs 25%): sweep reversals tend to stall, which is why the Swing target came down to 2R.
- What v2 **did** improve is risk, not expectancy: the breaker caps the worst day near -2.1R (without it -3.2R) and on its own trimmed max drawdown by about 1R; together with the lower target, v2's max drawdown is 4-5R below v1's. Average R stayed at about -0.02.
- Buys beat sells in this sample (+0.04/+0.10R vs -0.18/-0.40R). That is almost certainly 2017 being a strong EURUSD uptrend; I did not tune anything to it.
- The Scalp preset is for M5-M15; on H1 candles it is outside its design range and should be ignored there. I had no intraday data to test it.

So: **treat AUDUSD performance as unknown.** Do not trade this live on the strength of this repo. The diagnostics table exists so that *your* data, not a promise, decides.

## Verified by tests (code mechanics, synthetic candles)

- 76 + 26 hand-built scenario checks, run as sells and as mirrored buys: every level type, confirmation, expiry, invalidation, stop, target, break-even, session-end exit, "stop first when stop and target share a candle", stop-size and rejection filters, entry-window edges, confluence, structure bias, max trades per day, cooldown, one trade at a time, the circuit breaker (including rollover and break-even not counting), the pending line, JSON alerts, and the diagnostics table cross-checked against independent calculations (interval, halves, concentration, per-type counts).
- No repainting: re-running on truncated data reproduces the identical earlier signals, bias and exits.
- The exit and statistics engine matches an independent re-simulation of every trade.
- Strategy vs indicator: identical entries, exits and prices on 734 trades over 6 datasets, with the breaker at 0, 1 and 2, and no signal ever appears after the daily loss limit (break-even is switched off in this comparison because the emulator cannot modify exit orders, so the strategy's break-even step is untested here).
- The signal-engine block is byte-identical in both files.

**Not verified:** compilation in TradingView itself (no compiler was available; both files parse with an independent Pine parser and run in PineTS, and were reviewed by hand for v6 pitfalls). If TradingView shows an error, paste it back.

## How to judge it yourself (do this before real money)

1. Add the **strategy** to M15 AUDUSD. Keep the 0.5-pip slippage on each market/stop fill or enter your broker's real costs. Premium: run **Deep Backtesting** over years.
2. Open the indicator's **diagnostics table** next to it. Believe the verdict, not the equity curve. Fewer than ~100 trades means "too few"; a result is only interesting when the interval's lower end is above 0 *and* both halves of the sample agree.
3. Split history with *Limit trading to a date range*: settle on settings with one period, then check a period you have never looked at, once.
4. Check different regimes and that a handful of trades do not make up the whole profit (the "best 3 trades" row).
5. Forward test on a demo account for weeks. Then size small (default risk is 0.5% per trade; with a profit factor near 1, drawdown in % is roughly the drawdown in R times the risk).

## Win rate vs payoff

With a fixed R target, a higher win rate means a smaller target, not a better system: the coin-flip win rate is 1/(1+R) (50% at 1R, 40% at 1.5R, 33% at 2R). The dashboard prints it next to your win rate. A system is only good if it beats that number after costs.

## Limits

- No news filter (the script cannot see the calendar). Avoid RBA, Fed, NFP and CPI releases yourself.
- The stop is assumed hit first when a candle touches both stop and target; real fills, spread widening and gaps will differ.
- The dashboard covers only the candles loaded on your chart (a few weeks on M15 for lower plans) and uses a candle-based simulation.
- Strategy position sizing assumes a USD account on a USD-quoted pair.
- Defaults use London time for the entry window; change the session time zone if you trade another session.

## Alerts

`BUY signal`, `SELL signal`, `any signal`, simulated target and stop alerts are available as alert conditions. For messages with entry, stop and target, create the alert on the indicator with condition *Any alert() function call* and *Once Per Bar Close*; set *alert() message format* to `JSON` for webhook bridges (`{"symbol":"AUDUSD","action":"buy","entry":...,"sl":...,"tp":...}`).

Not financial advice. Trading leveraged FX can lose more than you deposit.
