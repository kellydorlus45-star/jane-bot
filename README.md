# Jane Bot — fixed deployment package

## Files
- `index.html`
- `api/market.js`
- `api/signal.js`

## Vercel
Keep the existing `TWELVEDATA_API_KEY` environment variable. Do not create a new key and do not add `vercel.json`.

The market endpoint reads real Twelve Data candles server-side so the API key is not exposed in the browser.

## Deploy
Replace the project files in the existing `jane-bot` GitHub repository and let Vercel redeploy.
