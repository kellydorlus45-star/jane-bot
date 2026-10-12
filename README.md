# Jane Bot V14

Stable build. Market data uses Twelve Data through `/api/market`; signals use `/api/signal`.

- No boot/loading animation.
- No fake market values.
- Smaller market requests for faster startup.
- Upstream market calls timeout instead of hanging indefinitely.
- Forex has no expiration control.
- Binary expiration remains 3s to 4h.
- A new signal remains locked until WIN, LOSS, or OMITIR.

Vercel environment variable required: `TWELVEDATA_API_KEY`.


V15: restaura correctamente una señal pendiente guardada y muestra WIN/LOSS/OMITIR al volver a abrir la app; elimina animaciones de fondo que se ejecutaban continuamente.
