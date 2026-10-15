# Jane Bot — reparación del flujo de señales

Esta versión conserva el dashboard V8 y corrige únicamente el bloqueo de GENERAR SEÑAL.

Cambios:
- GENERAR SEÑAL tiene un límite de 12 segundos para la llamada al servidor.
- Si `/api/signal` no responde, Jane Bot analiza las mismas velas reales ya cargadas en el navegador usando el motor local existente, en vez de quedarse en ANALIZANDO.
- Los datos del mercado siguen viniendo de Twelve Data.
- No se generan precios ni velas ficticias.
- Se eliminó `vercel.json` para evitar el error de funciones serverless que había aparecido anteriormente.
- Se conserva `TWELVEDATA_API_KEY` en Vercel.


## Expiración Binary corregida
- Rango: 3 segundos a 4 horas.
- `+` y `−` recorren valores completos: 3s…59s → 1m…59m → 1h…4h.
- Transiciones: 59s → 1m y 1m → 59s; 59m → 1h y 1h → 59m.
- Nunca muestra combinaciones como 1m 59s.
- Accesos rápidos: 3s, 15s, 30s, 1m, 3m, 5m, 30m, 1h, 4h.
