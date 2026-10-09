
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  const apiKey = process.env.TWELVEDATA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Falta configurar la clave de datos en Vercel"
    });
  }

  const symbol = String(req.query.symbol || "EUR/USD").toUpperCase();
  const interval = String(req.query.interval || "1min");

  // Solo pares de divisas; no se admiten OTC.
  const pairPattern = /^[A-Z]{3}\/[A-Z]{3}$/;
  const allowedIntervals = [
    "1min", "5min", "15min", "30min",
    "45min", "1h", "2h", "4h", "8h",
    "1day", "1week", "1month"
  ];

  if (!pairPattern.test(symbol)) {
    return res.status(400).json({
      error: "El activo debe ser un par de divisas válido"
    });
  }

  if (!allowedIntervals.includes(interval)) {
    return res.status(400).json({
      error: "Temporalidad no admitida por esta conexión",
      allowedIntervals
    });
  }

  try {
    const params = new URLSearchParams({
      symbol,
      interval,
      outputsize: "50",
      timezone: "UTC",
      apikey: apiKey
    });

    const response = await fetch(
      `https://api.twelvedata.com/time_series?${params}`
    );

    const data = await response.json();

    if (!response.ok || data.status === "error" || !data.values) {
      return res.status(502).json({
        error: "El proveedor no devolvió velas válidas",
        detail: data.message || data.code || "Error de datos"
      });
    }

    return res.status(200).json({
      source: "Twelve Data",
      symbol: data.meta?.symbol || symbol,
      interval: data.meta?.interval || interval,
      timezone: "UTC",
      values: data.values
    });
  } catch {
    return res.status(502).json({
      error: "No se pudo conectar con el proveedor de datos"
    });
  }
};
