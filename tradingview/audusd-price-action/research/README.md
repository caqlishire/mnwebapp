# Research and verification code

Everything here runs on Node 18+ and uses the Oanda 1-minute mid-price CSVs (2005 to May 2020) from the public `FutureSharks/financial-data` repository. The scripts print the tables quoted in `../README.md`.

## 1. Get the data (about 280 MB per pair)

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/FutureSharks/financial-data
cd financial-data
git sparse-checkout set --no-cone '/pyfinancialdata/data/currencies/oanda/AUD_USD/'
# optional, for the cross-pair check:
git sparse-checkout add '/pyfinancialdata/data/currencies/oanda/EUR_USD/' '/pyfinancialdata/data/currencies/oanda/GBP_USD/' '/pyfinancialdata/data/currencies/oanda/USD_CAD/'
```

Then point the scripts at it. Without `FX_DATA_DIR` they look for a `financial-data` clone next to this repository's folder:

```bash
export FX_DATA_DIR=/path/to/financial-data/pyfinancialdata/data/currencies/oanda
cd research && npm install        # installs PineTS 0.10.0, used to run the real Pine code
```

The first run parses the CSVs and writes a binary cache (`*_m1.bin`, git-ignored).

## 2. Periods

`research.mjs` defines 2005-2012 (exploration), 2013-2016 (confirmation) and 2017-May 2020 (out of sample). Scripts refuse to print the last period unless `OPEN_OOS=1` is set, which is how it was kept closed until the final test.

## 3. Scripts

| Script | What it shows |
|---|---|
| `qa_data.mjs` | Data quality, gaps, time-zone and bar-alignment checks |
| **Month-end fix fade** | |
| `fix_study.mjs` | First test of the 4pm fix reversal (all days vs month-end) |
| `fix_deep.mjs` | Path by exit time, pre-fix window, threshold, excursions, by year |
| `flow_events.mjs` | Same idea on other days (Fridays, first/second-last day, quarter-end, Tokyo fix) |
| `mefix.mjs` | The minute-precise simulator of the rules |
| `mefix_is_val.mjs` | Stop/target/exit variants, 2005-2012 and 2013-2016 |
| `mefix_pairs.mjs` | Same rule on EURUSD, GBPUSD, USDCAD |
| `oos_final.mjs` | The single out-of-sample run (`OPEN_OOS=1`) |
| `mefix_stress.mjs`, `mefix_realistic.mjs`, `mefix_final_stats.mjs` | Costs, entry delay, bar size, outliers, realistic fills, final table |
| `parity_fix.mjs`, `parity_fix_strategy.mjs` | The real Pine indicator and strategy, run in PineTS on real bars, compared trade by trade with the simulator |
| **Liquidity sweep (v2) and other ideas** | |
| `engine.mjs`, `parity_real.mjs` | Fast port of the sweep logic; trade-for-trade parity with the Pine script in PineTS |
| `baseline.mjs`, `diag.mjs`, `candidates.mjs`, `robustness.mjs` | Sweep presets, diagnostics, candidate fixes, neighbourhood grid |
| `event_study.mjs`, `event_study2.mjs`, `pd_study.mjs` | Drift after sweeps/breakouts, spikes, weekly levels, weekend gaps, previous-day failures |
| `momentum_study.mjs`, `hourly.mjs`, `rollover.mjs`, `daily_scan.mjs` | Momentum, session predictability, hour-of-day profile, the 17:00 New York rollover, daily candle patterns |
| `bnr.mjs`, `bnr_grid.mjs` | Support/resistance break-and-retest engine and its 48-variant grid |
| `ict.mjs`, `ict_grid.mjs`, `ict_val.mjs`, `ict_lock.mjs` | ICT 2022 model, Judas Swing, OTE, order blocks and Silver Bullet v2; 74-variant grid, 2013-2016 check, locked rule and its single 2017-2020 run |
| `silver_bullet.mjs`, `sb_grid.mjs`, `sb_lo_check.mjs` | ICT Silver Bullet engine (1-minute fills), 36-variant grid, London-open robustness and 2013-2016 check |
| `daily_flow_scan.mjs`, `ecb_fix_deep.mjs`, `daily_fade.mjs` | Daily scalps at 12 scheduled flow times (96 variants); deep dive and realistic simulation of the best one (13:15 London fade), which fails after costs |
| **Tests on synthetic candles** (`tests/`) | |
| `scen_fix.mjs` | 31 edge cases for the month-end scripts (month/year ends, weekends, daylight saving, exits, alerts) |
| `scen_ind.mjs`, `scen_v2.mjs`, `verify_ind.mjs`, `cmp_strat3.mjs` | Sweep indicator scenarios, repaint checks, strategy parity |

## 4. Builders

`tools/build_fix_strategy.py` and `tools/build_sweep_strategy.py` generate each strategy file from its indicator, so the trading logic (the block between the `ENGINE-BEGIN` and `ENGINE-END` markers) stays byte-identical. Edit the indicator, then rerun the builder.

## 5. PineTS differences found along the way

These affect only running Pine code outside TradingView; the scripts behave as intended on TradingView.

- `request.security(..., f(x)[1], lookahead = barmerge.lookahead_on)` returns `f(x)` of the current higher-timeframe bar, which gives up to one bar of look-ahead. TradingView applies the `[1]`.
- `timeframe.change("D")` rolls at UTC midnight; TradingView rolls FX days at 17:00 New York.
- `process_orders_on_close` is ignored: market orders fill at the next bar's open.
- Floats are compared with a 1e-10 tolerance (as TradingView does), so the engine does the same.
- Candle `closeTime` must be the exact close (open + duration) for `time_close` to work.
