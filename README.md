# Jane Bot — Real Market Balanced

- Frontend restaurado con la interfaz estable de Jane Bot.
- Datos reales mediante Twelve Data y `TWELVEDATA_API_KEY` en Vercel.
- Lista ampliada de pares Forex importantes.
- Motor balanceado: requiere 3 confirmaciones y una diferencia mínima de 2 puntos para emitir BUY/SELL o CALL/PUT; si el mercado realmente está en conflicto, muestra WAIT.
- No usa precios inventados.
- No conecta credenciales de Pocket Option/MT5.

## Vercel
No agregues `vercel.json`. Sube `index.html` y la carpeta `api/` al repositorio y mantén `TWELVEDATA_API_KEY` en Environment Variables.
