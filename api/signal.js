function ema(a, n) {
  if (!Array.isArray(a) || a.length < n) return null;
  const k = 2 / (n + 1); let e = a[0];
  for (let i = 1; i < a.length; i++) e = a[i] * k + e * (1 - k);
  return e;
}
function rsi(a, n=14) {
  if (!Array.isArray(a) || a.length <= n) return null;
  let g=0,l=0;
  for(let i=1;i<=n;i++){const d=a[i]-a[i-1];g+=Math.max(d,0);l+=Math.max(-d,0)}
  g/=n;l/=n;
  for(let i=n+1;i<a.length;i++){const d=a[i]-a[i-1];g=(g*(n-1)+Math.max(d,0))/n;l=(l*(n-1)+Math.max(-d,0))/n}
  return l===0?100:100-(100/(1+g/l));
}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const body=req.body||{}; const candles=Array.isArray(body.candles)?body.candles:[];
  const mode=body.mode==='binary'?'binary':'forex'; const symbol=String(body.symbol||''); const interval=String(body.interval||'');
  if(candles.length<80) return res.status(400).json({error:'No hay suficientes velas cerradas.'});
  const c=candles.slice(-500), closes=c.map(x=>Number(x.close));
  const e9=ema(closes.slice(-120),9),e21=ema(closes.slice(-120),21),e50=ema(closes.slice(-180),50),rv=rsi(closes,14);
  const e12=ema(closes.slice(-120),12),e26=ema(closes.slice(-120),26);
  const macd=(e12??0)-(e26??0), prev12=ema(closes.slice(-121,-1),12),prev26=ema(closes.slice(-121,-1),26),prevMacd=(prev12??0)-(prev26??0);
  const momentum=closes.at(-1)-closes.at(-4); let bull=0,bear=0,reasons=[];
  if(e9>e21){bull++;reasons.push('EMA alcista')}else if(e9<e21){bear++;reasons.push('EMA bajista')}
  if(e21>e50)bull++;else if(e21<e50)bear++;
  if(rv>=53&&rv<=70){bull++;reasons.push('RSI comprador')}else if(rv<=47&&rv>=30){bear++;reasons.push('RSI vendedor')}
  if(macd>prevMacd){bull++;reasons.push('MACD mejorando')}else if(macd<prevMacd){bear++;reasons.push('MACD debilitándose')}
  if(momentum>0)bull++;else if(momentum<0)bear++;
  const diff=bull-bear,strength=Math.max(bull,bear);
  let signal='WAIT'; if(strength>=4&&Math.abs(diff)>=2)signal=bull>bear?(mode==='binary'?'CALL':'BUY'):(mode==='binary'?'PUT':'SELL');
  const last=c.at(-1); const digits=symbol.endsWith('/JPY')?3:5; const round=n=>Number(n.toFixed(digits));
  let stopLoss=null,takeProfit=null;
  if(mode==='forex'&&signal!=='WAIT'){const look=c.slice(-18),lo=Math.min(...look.map(x=>Number(x.low))),hi=Math.max(...look.map(x=>Number(x.high)));if(signal==='BUY'){stopLoss=round(Math.min(lo,last.close));takeProfit=round(last.close+(last.close-stopLoss)*1.8)}else{stopLoss=round(Math.max(hi,last.close));takeProfit=round(last.close-(stopLoss-last.close)*1.8)}}
  return res.status(200).json({ok:true,mode,symbol,interval,signal,score:diff,confidence:signal==='WAIT'?50:Math.min(90,55+strength*5+Math.abs(diff)*4),reasons,price:Number(last.close),entry:Number(last.close),stopLoss,takeProfit,candleTime:last.time,source:'Twelve Data candles'});
}
