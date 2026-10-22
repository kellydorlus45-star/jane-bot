# JANE BOT — REAL MARKET SIGNALS

Version with a broader list of commonly traded FX pairs and a more responsive signal engine.

- Real market data through Twelve Data.
- No simulated prices.
- Actionable signals require directional agreement; WAIT remains for genuinely mixed/extreme conditions.
- Binary expiries below 1 minute remain WAIT because the available source is 1-minute OHLC and cannot honestly validate sub-minute outcomes.
- Do not treat any signal as a guarantee of profit. Validate with paper/small-risk testing before using meaningful funds.

Required Vercel environment variable: `TWELVEDATA_API_KEY`.
