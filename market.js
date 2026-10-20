const ALLOWED=new Set(['1min','5min','15min','30min','1h','4h','1day','1week','1month']);
const SYMBOL=/^[A-Z]{3}\/[A-Z]{3}$/;
function json(res,status,body){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));}
module.exports=async function handler(req,res){
  if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
  const key=process.env.TWELVEDATA_API_KEY;if(!key)return json(res,500,{error:'TWELVEDATA_API_KEY no está configurada'});
  const symbol=String(req.query?.symbol||'EUR/USD').toUpperCase();
  const interval=String(req.query?.interval||'1min');
  const outputsize=Math.min(500,Math.max(40,Number(req.query?.outputsize||200)));
  if(!SYMBOL.test(symbol))return json(res,400,{error:'Símbolo forex inválido'});
  if(!ALLOWED.has(interval))return json(res,400,{error:'Intervalo no soportado'});
  try{
    const base='https://api.twelvedata.com';
    const qs=new URLSearchParams({symbol,interval,outputsize:String(outputsize),apikey:key,format:'JSON'});
    const [candleResp,priceResp]=await Promise.all([
      fetch(`${base}/time_series?${qs}`),
      fetch(`${base}/price?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(key)}`)
    ]);
    const candles=await candleResp.json(); const price=await priceResp.json();
    if(!candleResp.ok || candles.status==='error')return json(res,502,{error:candles.message||'Twelve Data no devolvió velas'});
    if(!Array.isArray(candles.values))return json(res,502,{error:'Twelve Data no devolvió valores'});
    const values=candles.values.map(v=>({datetime:v.datetime,open:Number(v.open),high:Number(v.high),low:Number(v.low),close:Number(v.close)})).filter(v=>[v.open,v.high,v.low,v.close].every(Number.isFinite));
    if(values.length<40)return json(res,502,{error:'No hay suficientes velas reales'});
    return json(res,200,{values,currentPrice:Number(price?.price),symbol,interval,source:'Twelve Data',receivedAt:new Date().toISOString()});
  }catch(e){return json(res,502,{error:e.message||'Error consultando Twelve Data'});}
};
