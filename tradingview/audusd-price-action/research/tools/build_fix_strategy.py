"""Builds the month-end fix fade Strategy Tester file from the indicator so the trading logic cannot drift apart."""
import re
import os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..") + os.sep
ind = open(D + "AUDUSD_MonthEnd_Fix_Fade.pine").read()

def between(text, start, end):
    i = text.index(start); j = text.index(end, i + len(start))
    return text[i:j]

rules_inputs = between(ind, 'G_RULE = "1. Rules (tested defaults)"', "costPips   = input.float")
rules_inputs = rules_inputs.replace('G_DISP = "2. Costs and display"\n', '')
calendar = between(ind, "// -----------------------------------------------------------------------------\n//  CLOCK AND CALENDAR", "// -----------------------------------------------------------------------------\n//  STATE")
engine = between(ind, "    // >>> FIX-ENGINE-BEGIN", "    // <<< FIX-ENGINE-END\n") + "    // <<< FIX-ENGINE-END\n"
plots_windows = between(ind, "bool inPre   = dayOK", 'plot(sigDir, "Signal (1 buy, -1 sell)"')

header = '''//@version=6
// =============================================================================
//  AUDUSD MONTH-END FIX FADE  |  STRATEGY (Strategy Tester version)
//  -----------------------------------------------------------------------------
//  Same rules as the "AUDUSD Month-End Fix Fade" indicator: the block between
//  FIX-ENGINE-BEGIN and FIX-ENGINE-END is byte-identical in both files.
//
//  RULES (London time): on the last trading day of the month, measure the move
//  from 15:30 to 16:00; if it is at least 3 pips, trade against it at 16:00
//  with a 20 pip stop, target = the 15:30 price, and close at 17:00 otherwise.
//
//  FILLS: signals are decided at the close of the bar that ends at 16:00; the
//  market order then fills at the NEXT bar's open (the first price after the
//  fix), like a trader acting on the alert. The 17:00 exit fills the same way.
//
//  COSTS: commission is set to 0.00005 USD per unit per order = 1 pip round
//  trip, the same cost used in the research (Oanda AUDUSD 1-minute data,
//  2005-2020, first-price-after-the-fix entries: 158 trades, 69% winners,
//  +2.9 pips average, profit factor 1.8).
//
//  TESTING: use a 5 or 15 minute AUDUSD chart. Month-ends are rare (about 10
//  trades a year), so the bars loaded on a normal plan show only a few trades;
//  Deep Backtesting (premium) covers more history.
//
//  NOT FINANCIAL ADVICE. Past results do not guarantee future results.
// =============================================================================
strategy("AUDUSD Month-End Fix Fade (Strategy)", shorttitle = "AUD ME Fix STR", overlay = true, initial_capital = 10000, currency = currency.USD, default_qty_type = strategy.fixed, default_qty_value = 1, pyramiding = 0, process_orders_on_close = false, calc_on_every_tick = false, slippage = 0, commission_type = strategy.commission.cash_per_contract, commission_value = 0.00005, margin_long = 1, margin_short = 1)

// -----------------------------------------------------------------------------
//  INPUTS
// -----------------------------------------------------------------------------
'''
risk_inputs = '''G_RISK = "2. Risk"
riskPct = input.float(1.0, "Risk per trade (% of equity)", minval = 0.1, maxval = 10.0, step = 0.1, group = G_RISK, tooltip = "Position size = risk amount / stop distance (USD account, USD-quoted pair).")
maxLev  = input.float(30.0, "Maximum leverage (position value / equity)", minval = 1.0, maxval = 500.0, group = G_RISK)
showWin = input.bool(true, "Shade the pre-fix window and the trade window", group = G_RISK)

'''
state = '''// -----------------------------------------------------------------------------
//  STATE
// -----------------------------------------------------------------------------
var float refPx   = na
var int   refDate = 0

var int   trDir   = 0
var float trEntry = na
var float trSL    = na
var float trTP    = na
var int   trBar   = 0
var int   trDate  = 0

int    sigDir   = 0
float  sigEntry = na
float  sigSL    = na
float  sigTP    = na
float  sigMove  = na
int    exitKind = 99
float  exitPips = na

// -----------------------------------------------------------------------------
//  ENGINE - runs once per CLOSED bar
// -----------------------------------------------------------------------------
if barstate.isconfirmed and tfOK
'''
orders = '''
    // ---- orders ----
    if exitKind == 2 and strategy.position_size != 0
        strategy.close_all(comment = "17:00 exit")
    if sigDir != 0
        float qty = math.max(1, math.floor(math.min(strategy.equity * riskPct / 100 / (stopPips * pip), strategy.equity * maxLev / sigEntry)))
        if sigDir == 1
            strategy.entry("L", strategy.long, qty = qty, comment = "BUY fix")
            strategy.exit("XL", from_entry = "L", stop = sigSL, limit = sigTP)
        else
            strategy.entry("S", strategy.short, qty = qty, comment = "SELL fix")
            strategy.exit("XS", from_entry = "S", stop = sigSL, limit = sigTP)

// -----------------------------------------------------------------------------
//  PLOTS
// -----------------------------------------------------------------------------
'''
out = header + rules_inputs + risk_inputs + calendar + state + engine + orders + plots_windows
open(D + "AUDUSD_MonthEnd_Fix_Fade_Strategy.pine", "w").write(out)
print("strategy written:", len(out.splitlines()), "lines")
