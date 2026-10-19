# Jane Bot — versión restaurada + motor de señales mejorado

Esta versión conserva la interfaz del proyecto restaurado y añade un motor de señales centralizado en `/api/signal`.

## Estructura
- `index.html`
- `api/market.js`
- `api/signal.js`

## Datos
- Los precios/velas proceden de Twelve Data mediante `/api/market`.
- No se generan precios ni velas ficticias.
- El motor usa las velas cerradas recibidas y responde de forma determinista para el mismo snapshot.

## Señales
- Confirma tendencia, EMA, RSI, MACD, momentum, estructura, vela, volatilidad y ADX.
- Añade validación histórica con horizonte ajustado al timeframe/expiración.
- Si la evidencia no es suficiente, devuelve `WAIT`.
- Para expiraciones binarias inferiores a 1 minuto, con una fuente de velas de 1 minuto, devuelve `WAIT` explicando la limitación en lugar de fingir una validación de segundos.

## Vercel
`TWELVEDATA_API_KEY` debe existir como Environment Variable.
