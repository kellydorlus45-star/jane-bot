# Jane Bot V10

Estructura del repositorio:

- `index.html`
- `vercel.json`
- `api/market.js`
- `api/signal.js`

Cambios de V10:
- Expiración binaria visible: 3s, 15s, 30s, 1m, 3m, 5m, 30m, 1h, 4h.
- 4 horas es el máximo.
- `+` y `−` cruzan correctamente entre segundos, minutos y horas.
- Forex no muestra expiración.
- Después de una señal no se puede generar otra hasta elegir WIN, LOSS u OMITIR.
- Animaciones más limpias y profesionales; sin partículas flotantes ni auroras constantes.
- Mantiene TWELVEDATA_API_KEY en las variables de entorno de Vercel.
