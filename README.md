# Jane Bot — Fixed Real Engine

Esta versión conserva la interfaz del Jane Bot y corrige dos problemas importantes del motor de señales:

- El motor solo analiza velas cerradas.
- Una señal binaria se valida contra el horizonte real de expiración. Si la expiración es menor de 1 minuto, el sistema muestra WAIT porque Twelve Data entrega OHLC desde 1 minuto; no inventa velas de segundos.
- El filtro histórico usa la misma regla sobre datos anteriores y exige una tasa mínima antes de emitir CALL/PUT o BUY/SELL.
- La lista de Forex fue ampliada a pares principales, cruces y varios pares de alta demanda.

## Importante
Una tasa histórica no es una garantía de ganancias futuras. No uses este bot para dinero real hasta probarlo con resultados suficientes y fuera de muestra.

## Vercel
Variable de entorno requerida: `TWELVEDATA_API_KEY`.
No pongas la clave dentro de `index.html`.
