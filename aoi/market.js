export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const key = process.env.TWELVEDATA_API_KEY;
  if (!key) return res.status(500).json({ error: 'TWELVEDATA_API_KEY no está configurada en Vercel.' });

  const symbol = String(req.query?.symbol || '').toUpperCase();
  const interval = String(req.query?.interval || '1min');
  const outputsize = Math.max(40, Math.min(5000, Number(req.query?.outputsize || 1800)));
  const allowed = new Set(['1min','5min','15min','30min','1h','4h','1day','1week','1month']);
  if (!/^[A-Z]{3}\/[A-Z]{3}$/.test(symbol)) return res.status(400).json({ error: 'Símbolo inválido.' });
  if (!allowed.has(interval)) return res.status(400).json({ error: 'Intervalo no soportado.' });

  const base = 'https://api.twelvedata.com';
  const qs = new URLSearchParams({ symbol, interval, outputsize: String(outputsize), timezone: 'UTC', apikey: key });
  const priceQs = new URLSearchParams({ symbol, apikey: key });
  try {
    const [seriesRes, priceRes] = await Promise.all([
      fetch(`${base}/time_series?${qs}`),
      fetch(`${base}/price?${priceQs}`)
    ]);
    const series = await seriesRes.json();
    const price = await priceRes.json();
    if (!seriesRes.ok || series.status === 'error') {
      return res.status(502).json({ error: series.message || 'Twelve Data no devolvió velas.' });
    }
    const values = Array.isArray(series.values) ? series.values : [];
    if (!values.length) return res.status(502).json({ error: 'Twelve Data no devolvió velas.' });
    const currentPrice = Number(price?.price);
    return res.status(200).json({
      values,
      currentPrice: Number.isFinite(currentPrice) ? currentPrice : Number(values[0].close),
      symbol,
      interval,
      source: 'Twelve Data',
      receivedAt: new Date().toISOString()
    });
  } catch (err) {
    return res.status(502).json({ error: 'No se pudo consultar Twelve Data.', detail: err?.message || String(err) });
  }
}
