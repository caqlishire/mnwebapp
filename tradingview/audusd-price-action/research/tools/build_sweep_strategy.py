"""Builds the Strategy Tester file from the indicator file so the signal logic can never drift apart."""
import re, sys
import os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..") + os.sep
ind = open(D + "AUDUSD_Liquidity_Sweep.pine").read()

def between(text, start, end, incl_start=True):
    i = text.index(start); j = text.index(end, i + len(start))
    return text[i if incl_start else i + len(start): j]

# ---- shared blocks, taken verbatim from the indicator ------------------------------------------------
inputs_block = between(ind, "G_MODE = ", "float minStopPips")               # input declarations
presets_block = between(ind, "float minStopPips", "// -----------------------------------------------------------------------------\n//  MARKET CONSTANTS")
market_block = between(ind, "// -----------------------------------------------------------------------------\n//  MARKET CONSTANTS", "// -----------------------------------------------------------------------------\n//  STATE")
core = between(ind, "    // >>> SIGNAL-ENGINE-BEGIN", "    // <<< SIGNAL-ENGINE-END\n") + "    // <<< SIGNAL-ENGINE-END\n"
state_shared = between(ind, "var array<float> shP", "var int    trDir")
plots_levels = between(ind, 'plot(showLevels and usePDHL and dailyOK ? pdh', 'plot(sigDir, "Signal (1 buy, -1 sell)"')

# ---- strategy-specific edits to the shared input block ------------------------------------------------
def drop_line(block, name):
    pat = re.compile(r"^" + name + r"\s*=.*\n", re.M)
    assert pat.search(block), name
    return pat.sub("", block, count=1)

for n in ["costPips", "showTrade", "showDash", "showDiag", "dashPos", "dynAlerts", "alertFmt"]:
    inputs_block = drop_line(inputs_block, n)
inputs_block = inputs_block.replace('"5. Costs and display"', '"5. Risk and display"')
_new_inputs = '''riskPct    = input.float(0.5, "Risk per trade (% of equity)", minval = 0.1, maxval = 10.0, step = 0.1, group = G_CST, tooltip = "Position size = risk amount / stop distance. Sized for a USD account on a USD-quoted pair (AUDUSD).")
maxLev     = input.float(30.0, "Maximum leverage (position value / equity)", minval = 1.0, maxval = 500.0, group = G_CST, tooltip = "Caps the position size on very tight stops.")
useDates   = input.bool(false, "Limit trading to a date range", group = G_CST, tooltip = "Use it to keep an out-of-sample period untouched: optimise or judge on one range, then check the other.")
dStart     = input.time(timestamp("01 Jan 2023 00:00 +0000"), "Range start", group = G_CST)
dEnd       = input.time(timestamp("01 Jan 2100 00:00 +0000"), "Range end", group = G_CST)
showLevels = input.bool(true, "Show PDH/PDL, Asian range and swept levels", group = G_CST)
'''
_pat = re.compile(r"^showLevels\s*=\s*input\.bool\(.*\n", re.M)
assert _pat.search(inputs_block)
inputs_block = _pat.sub(lambda m: _new_inputs, inputs_block, count=1)
assert "riskPct" in inputs_block

header = '''//@version=6
// =============================================================================
//  AUDUSD LIQUIDITY SWEEP - PURE PRICE ACTION  |  STRATEGY (Strategy Tester version)
//  -----------------------------------------------------------------------------
//  Same signal engine as the "AUDUSD Liquidity Sweep" indicator, byte for byte
//  (the block between SIGNAL-ENGINE-BEGIN and SIGNAL-ENGINE-END). This file adds
//  order execution so TradingView's Strategy Tester can report the results.
//
//  HOW TO TEST IT PROPERLY
//    1. Chart: FX:AUDUSD or OANDA:AUDUSD, M15 (scalp) or H1 (set mode = Swing).
//    2. Strategy Tester > Properties: leave slippage at 5 ticks (0.5 pip on every
//       market or stop fill) or set your broker's real spread + commission.
//    3. Judge the profit factor, the drawdown and the number of trades - not the
//       win rate alone. Fewer than ~100 trades is not a statistically useful sample.
//    4. Use "Limit trading to a date range" to keep an out-of-sample period you
//       have never looked at, then check that period once.
//    5. Premium plans: Deep Backtesting (Strategy Tester > "..." menu) tests the
//       whole history instead of only the bars loaded on the chart.
//
//  Orders are placed at the CLOSE of the signal candle (process_orders_on_close),
//  stop and target are attached immediately, and the stop moves to the real fill
//  price once the break-even trigger is reached. Default risk is 0.5% of equity per
//  trade: with a profit factor near 1 the drawdown in % is roughly the drawdown in R
//  times the risk per trade, so size small until the Strategy Tester agrees.
//
//  NOT FINANCIAL ADVICE. No strategy is guaranteed to be profitable and past
//  results do not predict future results.
// =============================================================================
strategy("AUDUSD Liquidity Sweep - Pure Price Action (Strategy)", shorttitle = "AUD PA Sweep STR", overlay = true, initial_capital = 10000, currency = currency.USD, default_qty_type = strategy.fixed, default_qty_value = 1, pyramiding = 0, process_orders_on_close = true, calc_on_every_tick = false, slippage = 5, margin_long = 1, margin_short = 1, max_bars_back = 500, max_labels_count = 500, max_lines_count = 500, max_boxes_count = 500)

// -----------------------------------------------------------------------------
//  INPUTS
// -----------------------------------------------------------------------------
'''

market_extra = "bool inRange = not useDates or (time >= dStart and time <= dEnd)\n\n"

state = '''// -----------------------------------------------------------------------------
//  STATE
// -----------------------------------------------------------------------------
''' + state_shared + '''var int   stDir    = 0
var float stTP     = na
var float stRisk   = na
var bool  beDone   = false
var float lastNet  = 0.0
var float riskCash = na

int    sigDir   = 0
float  sigEntry = na
float  sigSL    = na
float  sigTP    = na
string sigTxt   = ""

// -----------------------------------------------------------------------------
//  ENGINE - runs once per CLOSED candle
// -----------------------------------------------------------------------------
if barstate.isconfirmed
    if newDay
        tradesToday := 0
        lossesToday := 0

    // ---- circuit breaker bookkeeping: a closed trade of -0.5R or worse counts as a loss ----
    float dNet = strategy.netprofit - lastNet
    if dNet != 0
        lastNet := strategy.netprofit
        if not na(riskCash) and dNet / riskCash <= -0.5
            lossesToday += 1

    // ---- manage the open position (the entry candle is skipped: orders fill at its close) ----
    if strategy.position_size != 0
        if flatEOD and not holdOK
            strategy.close_all(comment = "Session end")
        else if beR > 0 and not beDone and (stDir == 1 ? high >= strategy.position_avg_price + beR * stRisk : low <= strategy.position_avg_price - beR * stRisk)
            beDone := true
            strategy.cancel("X")
            strategy.exit("XB", from_entry = stDir == 1 ? "L" : "S", stop = strategy.position_avg_price, limit = stTP)

    bool flat = strategy.position_size == 0 and inRange

''' + core + '''
    // ---- place the order ----
    if sigDir != 0
        float riskD = math.abs(sigEntry - sigSL)
        float qty   = math.max(1, math.floor(math.min(strategy.equity * riskPct / 100 / riskD, strategy.equity * maxLev / sigEntry)))
        stDir  := sigDir
        stTP   := sigTP
        stRisk := riskD
        beDone := false
        riskCash := qty * riskD
        if sigDir == 1
            strategy.entry("L", strategy.long, qty = qty, comment = "BUY")
            strategy.exit("X", from_entry = "L", stop = sigSL, limit = sigTP)
        else
            strategy.entry("S", strategy.short, qty = qty, comment = "SELL")
            strategy.exit("X", from_entry = "S", stop = sigSL, limit = sigTP)

// -----------------------------------------------------------------------------
//  PLOTS
// -----------------------------------------------------------------------------
''' + plots_levels

out = header + inputs_block + presets_block + market_block.rstrip("\n") + "\n" + market_extra + state
open(D + "AUDUSD_Liquidity_Sweep_Strategy.pine", "w").write(out)
print("strategy written:", len(out.splitlines()), "lines")
