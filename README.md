# Jane Bot — restored working build

This build restores the fuller Jane Bot interface from the working dashboard version.

## Included
- `index.html` — restored dashboard UI, responsive phone/laptop layout, signal overlay, chart controls, history and outcome prompt.
- `api/market.js` — real Twelve Data market candles and current price.
- `api/signal.js` — deterministic signal endpoint using supplied real candles.

## Vercel
Keep the existing `TWELVEDATA_API_KEY` environment variable. Do not put the key in the browser code.

No `vercel.json` is required.
