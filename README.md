# Jane Bot — Real Market Signals

Dashboard responsive para Forex y binarias REAL usando Twelve Data.

## Archivos
- `index.html` — interfaz completa.
- `api/market.js` — datos reales de Twelve Data.
- `api/signal.js` — motor determinista de señales.

## Vercel
1. Importa este proyecto desde GitHub.
2. En **Settings → Environment Variables**, agrega `TWELVEDATA_API_KEY` en Production, Preview y Development si vas a usar esos entornos.
3. Redeploy.

No se generan precios ficticios. Para expiraciones de segundos, el feed de velas de 1 minuto no permite validar honestamente una operación de 3–30 s; Jane Bot no inventa velas de segundos.
