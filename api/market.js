export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const key=process.env.TWELVEDATA_API_KEY;
  if(!key) return res.status(500).json({error:'TWELVEDATA_API_KEY is not configured'});
  const symbol=String(req.query.symbol||'').trim().toUpperCase();
  const interval=String(req.query.interval||'1min').trim();
  const allowed=new Set(['1min','5min','15min','30min','1h','4h','1day','1week','1month']);
  if(!/^[A-Z]{3}\/[A-Z]{3}$/.test(symbol)) return res.status(400).json({error:'Invalid symbol'});
  if(!allowed.has(interval)) return res.status(400).json({error:'Invalid interval'});
  const n=Math.min(500,Math.max(30,Number(req.query.outputsize||500)));
  try{
    const u=new URL('https://api.twelvedata.com/time_series');
    u.searchParams.set('symbol',symbol);u.searchParams.set('interval',interval);u.searchParams.set('outputsize',String(n));u.searchParams.set('timezone','UTC');u.searchParams.set('apikey',key);
    const r=await fetch(u); const d=await r.json();
    if(!r.ok || d.status==='error' || !Array.isArray(d.values)) return res.status(502).json({error:d.message||d.code||'Twelve Data returned no candles'});
    const values=d.values.filter(v=>[v.datetime,v.open,v.high,v.low,v.close].every(x=>x!==undefined));
    let currentPrice=null;
    try{
      const p=new URL('https://api.twelvedata.com/price');p.searchParams.set('symbol',symbol);p.searchParams.set('apikey',key);
      const pr=await fetch(p);const pd=await pr.json();currentPrice=Number(pd.price);if(!Number.isFinite(currentPrice))currentPrice=null;
    }catch{}
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({symbol,interval,values,currentPrice,meta:d.meta||null});
  }catch(e){return res.status(500).json({error:e?.message||'Market request failed'});}
}
