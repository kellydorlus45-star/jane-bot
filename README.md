# Jane Bot V8

1. Sube el contenido de esta carpeta a la raíz del repositorio.
2. Conserva TWELVEDATA_API_KEY en Vercel.
3. No pongas la API key dentro de index.html.
4. Forex no usa expiración; la expiración solo aparece en Binarias.
5. El precio LIVE usa el endpoint /price de Twelve Data; la entrada de una señal usa la última vela cerrada.
6. Las velas de 3-59 segundos no se inventan: Twelve Data ofrece intradía desde 1 minuto.
