# Jane Bot — Final build

Esta versión conserva el dashboard y corrige el flujo de señal.

- Datos de mercado mediante Twelve Data; no se generan precios ficticios.
- La X del panel de señal usa eventos `pointerdown`/`touchstart` en captura para cerrar el panel y volver a Configuración.
- WIN / LOSS / OMITIR bloquean una nueva señal cuando existe una señal accionable pendiente.
- El análisis local exige más confirmaciones antes de producir BUY/SELL o CALL/PUT; si no hay suficiente confluencia devuelve WAIT.
- Forex muestra Entry, Stop Loss y Take Profit.
- Binarias usan CALL/PUT/WAIT. Las expiraciones en segundos siguen dependiendo de datos de velas disponibles; no se inventan velas de segundos.
- No hay garantía de ganancias. Una señal basada en datos reales no equivale a una señal segura para invertir dinero real.

Estructura:

```
index.html
api/market.js
api/signal.js
README.md
```

No requiere `vercel.json`.
