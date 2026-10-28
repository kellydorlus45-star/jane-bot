export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const key=process.env.TWELVEDATA_API_KEY;
  if(!key) return res.status(500).json({error:'TWELVEDATA_API_KEY no está configurada en Vercel.'});
  const symbol=String(req.query.symbol||'').toUpperCase();
  const interval=String(req.query.interval||'15min');
  const allowed=['1min','5min','15min','30min','1h','4h','1day','1week','1month'];
  if(!/^[A-Z]{3}\/[A-Z]{3}$/.test(symbol)) return res.status(400).json({error:'Par no válido.'});
  if(!allowed.includes(interval)) return res.status(400).json({error:'Time frame no soportado.'});
  const outputsize=Math.min(1800,Math.max(100,Number(req.query.outputsize)||1200));
  const base='https://api.twelvedata.com';
  try{
    const [ts,px]=await Promise.all([
      fetch(`${base}/time_series?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&outputsize=${outputsize}&order=asc&apikey=${encodeURIComponent(key)}`),
      fetch(`${base}/price?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(key)}`)
    ]);
    const td=await ts.json(); const pd=await px.json();
    if(!ts.ok || td.status==='error') return res.status(502).json({error:td.message||'Twelve Data no pudo entregar las velas.'});
    const values=Array.isArray(td.values)?td.values:[];
    if(!values.length) return res.status(502).json({error:'Twelve Data no devolvió velas para este par/time frame.'});
    const currentPrice=Number(pd.price);
    return res.status(200).json({values,currentPrice:Number.isFinite(currentPrice)?currentPrice:Number(values.at(-1).close),symbol,interval,source:'Twelve Data',receivedAt:new Date().toISOString()});
  }catch(e){return res.status(502).json({error:'No se pudo conectar con Twelve Data.'});}
}
