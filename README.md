# JANE BOT

Trading Signals dashboard using real Twelve Data market data.

## Included
- Real market candles/prices from Twelve Data
- Expanded major and commonly traded FX pairs
- Forex and Binary modes
- Binary expiry controls from 3 seconds to 4 hours
- Manual signal generation with outcome tracking
- Deterministic analysis from closed candles

## Important
The engine does not invent prices or guarantee profits. Historical validation is shown as supporting context rather than a hard blocker, so the bot does not remain on WAIT for long periods solely because a historical threshold was missed.

Binary expiries below 1 minute remain WAIT when the only available source is 1-minute OHLC, because second-level validation cannot be honestly inferred from minute candles.

Set `TWELVEDATA_API_KEY` in Vercel Environment Variables. Do not put the key in the frontend.
