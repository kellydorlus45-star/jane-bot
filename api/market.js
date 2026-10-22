export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const key=process.env.TWELVEDATA_API_KEY;
  if(!key) return res.status(500).json({error:'TWELVEDATA_API_KEY no está configurada en Vercel'});
  const symbol=String(req.query.symbol||'').trim().toUpperCase();
  const interval=String(req.query.interval||'1min').trim();
  const outputsize=Math.min(1800,Math.max(40,Number(req.query.outputsize||500)));
  if(!/^[A-Z]{3}\/[A-Z]{3}$/.test(symbol)) return res.status(400).json({error:'Símbolo de forex inválido'});
  const allowed=['1min','5min','15min','30min','45min','1h','2h','4h','8h','1day','1week','1month'];
  if(!allowed.includes(interval)) return res.status(400).json({error:'Intervalo no soportado'});
  try{
    const base='https://api.twelvedata.com';
    const u=new URL(base+'/time_series');
    u.searchParams.set('symbol',symbol);u.searchParams.set('interval',interval);u.searchParams.set('outputsize',String(outputsize));u.searchParams.set('timezone','UTC');u.searchParams.set('apikey',key);
    const r=await fetch(u);const d=await r.json();
    if(!r.ok||d.status==='error'||d.code) return res.status(r.status||400).json({error:d.message||'Twelve Data rechazó la solicitud'});
    const p=new URL(base+'/price');p.searchParams.set('symbol',symbol);p.searchParams.set('apikey',key);p.searchParams.set('dp','8');
    const pr=await fetch(p);const pd=await pr.json();
    const values=Array.isArray(d.values)?d.values:[];
    if(!values.length) return res.status(502).json({error:'Twelve Data no devolvió velas para '+symbol});
    return res.status(200).json({values,currentPrice:Number(pd.price),symbol,interval,source:'Twelve Data',receivedAt:new Date().toISOString()});
  }catch(e){return res.status(502).json({error:'No se pudo consultar Twelve Data'});}
}
