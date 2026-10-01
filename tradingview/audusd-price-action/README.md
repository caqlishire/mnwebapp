# AUDUSD TradingView scripts (Pine v6) - tested on 15 years of real minute data

**Short version**

- **AUDUSD Month-End Fix Fade** (scalp, new): the only setup, out of about 300 tested variants, that made money after costs in three separate periods of real AUDUSD data, including a 2017-2020 period that was kept untouched until a single final test. The edge is real but small: about **+3 pips per trade, about 10 trades a year**.
- **AUDUSD Liquidity Sweep** (v2, earlier): on the same real data it has **no edge**. The default scalp settings lost about 0.1R per trade after costs in every period. Do not trade its signals.
- **No daily scalper survived.** Every daily setup tested, including 96 fades/follow-ups at scheduled daily flow times, lost its edge to a realistic 1 pip cost (see section 3).

| File | What it is |
|---|---|
| `AUDUSD_MonthEnd_Fix_Fade.pine` | Indicator: month-end setup, entry/stop/target, alerts (text or JSON), dashboard. |
| `AUDUSD_MonthEnd_Fix_Fade_Strategy.pine` | Same rules with orders, for the Strategy Tester (1 pip round-trip cost built in as commission). |
| `AUDUSD_Liquidity_Sweep.pine`, `..._Strategy.pine` | The earlier sweep scripts (v2), kept for reference. See section 2. |
| `research/` | The data pipeline, backtests and tests behind every number here. See `research/README.md`. |

Install: TradingView > Pine Editor > paste a file > *Add to chart*.

---

## 1. AUDUSD Month-End Fix Fade

### Why it works

On the last trading day of every month, pension funds, asset managers and hedgers rebalance and re-hedge their currency exposure, and much of that volume is executed at the WM/Reuters London 4pm fix. It pushes price in the half hour before 16:00 London. Once the fix is done the pressure stops and price tends to give part of the move back. This month-end fix pattern is documented in academic work (for example Melvin & Prins, 2015, and Evans, 2018, cited from memory). Australian super funds re-hedging their large foreign holdings are a plausible reason it is strongest in AUD. That is a hypothesis; the data only shows that AUDUSD is the pair where it held up.

### Rules (London time; the script handles daylight saving)

1. **Day:** the last trading day (Monday-Friday) of the month.
2. **Measure:** the move from 15:30 to 16:00. Skip the month if it is smaller than 3 pips.
3. **Entry:** at 16:00, trade **against** that move (pushed up into the fix = SELL).
4. **Stop:** 20 pips from the 16:00 price.
5. **Target:** the 15:30 price (the move fully given back).
6. **Exit:** if neither is hit, close at 17:00.

### Results (Oanda AUDUSD 1-minute data, 1 pip round-trip cost)

Entries at the first price after 16:00 and time exits at the first price after 17:00, which is what you get when you act on the alert. The rules were chosen on 2005-2012, confirmed on 2013-2016, and run **once** on 2017-May 2020 without any change afterwards.

| Period | Trades | Win rate | Avg net pips | t-stat | Profit factor | Net pips | Max drawdown |
|---|---|---|---|---|---|---|---|
| 2005-2012 (rules found here) | 87 | 68% | +2.0 | 1.4 | 1.46 | +172 | 62 pips |
| 2013-2016 (confirmation) | 36 | 72% | +5.4 | 3.1 | 3.30 | +194 | 26 pips |
| 2017-May 2020 (unseen, tested once) | 35 | 71% | +2.9 | 1.8 | 2.25 | +103 | 32 pips |
| **All 2005-May 2020** | **158** | **70%** | **+3.0** | **3.1** | **1.86** | **+468** | **62 pips** |

- 13 of 16 years were positive (2006 -4, 2012 -13 and 2018 -24 pips were the losers). The longest losing streak was 3 trades. The worst trade was -25.6 pips (a gap through the stop in September 2008).
- **Costs:** still profitable at 2 pips round trip (+2.0 pips per trade, PF 1.5); close to break-even at 3 pips.
- **Speed:** most of the reversal happens in the first minutes after the fix. Entering a full minute late cut the average by about 0.8 pips.
- **Robustness:** the post-fix reversal was positive in both 2005-2012 and 2013-2016 for every pre-fix window (from 15:00, 15:30 or 15:45), every exit time from 16:05 to 18:00 and every minimum move from 0 to 12 pips. Simulating on 5-minute or 15-minute bars gives the same result as 1-minute data. Removing the 10 best trades still leaves +1.4 pips per trade (PF 1.4).
- **Other pairs:** the identical rule on EURUSD, GBPUSD and USDCAD worked in 2013-2016 but **not** in 2017-2020 (and GBPUSD lost clearly in 2005-2012). Use it on AUDUSD only.
- **Only the month-end works:** the same fade on ordinary days, Fridays, the day before month-end, the first day of the month and the Tokyo fix showed nothing usable.

### What to expect in money

About +0.15R per trade and about 10 trades a year, so roughly **+1.5R a year**. At 1% risk per trade that is about +1.5% a year, with a worst drawdown of about 3% (62 pips = 3R) in the test. This is a small, steady edge, not a way to get rich. If you size up, the drawdowns scale up with it.

### How to trade it

1. Add the indicator to an **AUDUSD 1-15 minute** chart (OANDA:AUDUSD or FX:AUDUSD). Your chart's time zone does not matter.
2. Create an alert on the indicator with condition *Any alert() function call*, *Once Per Bar Close*. You get a heads-up at 15:30 London on month-end days and the entry message (side, entry, stop, target) at 16:00. Switch *alert() message format* to JSON for a webhook bridge.
3. Enter immediately, place the stop and target shown, and close by 17:00 London.
4. Check results with the strategy file in the Strategy Tester. It fills at the next bar's open, like a real order sent on the alert. Month-ends are rare, so a normal chart history only holds a handful of trades. The 15-year table above is the real evidence.

### Limits

- About 10 trades a year, so even a real edge takes years to show up reliably in your own account.
- The edge depends on how big funds execute at the fix. Changes in that practice can shrink or end it, as already happened for EUR, GBP and CAD in 2017-2020.
- A month-end that coincides with major news can move far past the stop.
- Spreads at 16:00 London are normally tight. Check your broker's spread at that time, because the result depends on costs staying near 1 pip.

---

## 2. Liquidity Sweep indicator (v2): verdict on real data

The same 15 years of Oanda AUDUSD minute data, 1 pip cost, stop-and-target order resolved with minute data. R = initial risk.

| Configuration | 2005-2012 | 2013-2016 | 2017-May 2020 |
|---|---|---|---|
| v2 default: Scalp, M15 | -0.11R per trade (PF 0.80, 1,697 trades) | -0.06R (PF 0.88) | -0.08R (PF 0.85) |
| Scalp, M5 | -0.12R (PF 0.78) | -0.13R (PF 0.77) | not run |
| Swing, H1 | -0.04R (PF 0.92) | +0.00R (PF 1.00) | not run |
| Swing, H4 | +0.02R (PF 1.04) | -0.01R (PF 0.99) | not run |
| Best in-sample variant: Swing H4, no round numbers | +0.03R (PF 1.06) | +0.06R (PF 1.12) | **-0.18R (PF 0.68)** |

What the data says:

- **Before costs the sweep reversal has roughly zero edge** (about -0.04R on M15, -0.01R on H1, +0.01R on H4). Costs then turn it negative, most of all on small timeframes where 1 pip is 6-8% of each R.
- Trend alignment, level type, confluence, entry mode, session hour, stop buffer and targets did not change that in any repeatable way. The best-looking variant failed on the unseen 2017-2020 data.
- Round-number sweeps (most of the signals) were not followed by reversals at all.
- **Correction to the previous README:** the earlier EURUSD figures were produced in PineTS, which (as found here) evaluates `request.security(..., f(x)[1], lookahead_on)` without the `[1]`. That gives the bias filter up to one higher-timeframe bar of look-ahead, so those figures were slightly too optimistic. **On TradingView itself the script is correct and does not repaint.**

---

## 3. How the research was done

- **Data:** Oanda AUD_USD 1-minute mid-price candles, Jan 2005 to May 2020 (5.39 million bars), from the public [FutureSharks/financial-data](https://github.com/FutureSharks/financial-data) repository. Weekend quotes were removed. The FX day starts at 17:00 New York, as on TradingView.
- **Periods:** 2005-2012 for exploration, 2013-2016 to confirm, 2017-May 2020 kept closed and run once at the end on the locked rules.
- **Costs and accuracy:** 1 pip round trip on every trade. When a candle hits both the stop and the target, minute data decides which came first. The mid-price drop at the 17:00 New York rollover (the interest-rate carry that a real swap offsets) was identified and excluded as a source of fake profit.
- **Code checked against the real scripts:** the fast backtester reproduces the Pine scripts trade for trade when the real Pine code runs in PineTS on the same bars. That covers 1,626 sweep trades and all 158 month-end trades. The strategy file matches on 157 of 158; on the other, one 15-minute bar touched both levels and the minute data agrees with the strategy's result.
- **Everything that was tried** (about 300 variants, disclosed because testing many ideas produces false positives):
  - sweep presets, diagnostics, 14 candidate fixes and a 26-variant neighbourhood grid;
  - drift after sweeps and breakouts of the previous-day high/low, the Asian range and round numbers, by session (24 events, 5 horizons);
  - previous-day failure trades;
  - time-series momentum (6 lookbacks, 3 holding periods);
  - session-to-session predictability and the hour-of-day profile;
  - 13 daily candle patterns;
  - price spikes, previous-week levels and weekend gaps;
  - the 4pm fix on several kinds of day, and the Tokyo fix on gotobi days (Japanese settlement days);
  - 96 daily scalps at scheduled flow times (Tokyo open and fix, Chinese and Australian data, Frankfurt and London opens, ECB fix, US 8:30 data, New York open and 10:00 cut, London fix), each fading or following the previous 30 minutes. The best one, fading the move into 13:15 London and holding 30 minutes, is positive before costs (+1.7 / +1.4 pips per trade in 2005-2012 / 2013-2016) but not after a realistic 1 pip cost: +0.6 and +0.3 pips with t-stats of 1.2 and 0.5, negative in 2013-2016 with any stop or at 1.5 pips cost, and drawdowns of several hundred pips because it holds through the 13:30 US data releases. It was rejected before the out-of-sample test.

  Only the month-end fix fade held up in both earlier periods and then again on the unseen data.

To reproduce any number, see `research/README.md`.

Not financial advice. Leveraged FX can lose more than you deposit; forward test on a demo account first.
