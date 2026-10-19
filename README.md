# Jane Bot — Real Engine

- Real market data from Twelve Data through `/api/market`.
- Signal engine runs on the server from closed candles supplied by the app.
- Uses EMA 9/21/50, RSI, MACD, momentum, price structure, ATR and ADX.
- Historical validation is a quality filter, not a guarantee of profit.
- The quality gate is intentionally balanced so the app does not remain on WAIT indefinitely.
- Binary expirations below 1 minute are not falsely validated from 1-minute candles; they remain WAIT.
- Expanded list of major and commonly traded FX pairs.

This application does not guarantee profitable trades. Test with paper/demo trading before risking real money.
