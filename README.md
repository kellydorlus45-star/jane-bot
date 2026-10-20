# Jane Bot — WAIT + Popular Pairs Fix

- Preserves the existing frontend and chart UI.
- Expands the forex selector to 45 commonly traded/important pairs.
- Reduces the overly strict signal gate: 3 confirming factors with a 1-point directional edge can produce BUY/SELL or CALL/PUT.
- Keeps WAIT when the evidence is genuinely balanced.
- Uses Twelve Data real candles only.
- No OTC and no invented prices.
- `TWELVEDATA_API_KEY` stays in Vercel Environment Variables.

Important: more signals does not mean more winning trades. Test the behavior before using meaningful real money.
