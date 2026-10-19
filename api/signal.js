function ema(a,n){const k=2/(n+1);let e=a[0];for(let i=1;i<a.length;i++)e=a[i]*k+e*(1-k);return e}
function rsi(a,n=14){if(a.length<=n)return 50;let g=0,l=0;for(let i=1;i<=n;i++){const d=a[i]-a[i-1];if(d>=0)g+=d;else l-=d}g/=n;l/=n;for(let i=n+1;i<a.length;i++){const d=a[i]-a[i-1];g=(g*(n-1)+Math.max(d,0))/n;l=(l*(n-1)+Math.max(-d,0))/n}return l===0?100:100-100/(1+g/l)}
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const c=Array.isArray(req.body?.candles)?req.body.candles:[];
  if(c.length<30)return res.status(400).json({direction:'WAIT',reason:'Not enough candles'});
  const closes=c.map(x=>Number(x.close)).filter(Number.isFinite);const last=c[c.length-1],prev=c[c.length-2];
  const fast=ema(closes.slice(-60),9),slow=ema(closes.slice(-60),21),rv=rsi(closes,14);let score=0,reasons=[];
  if(fast>slow){score++;reasons.push('EMA +')}else{score--;reasons.push('EMA -')}
  if(rv>55){score++;reasons.push('RSI +')}else if(rv<45){score--;reasons.push('RSI -')}
  if(Number(last.close)>Number(prev.close)){score++;reasons.push('Momentum +')}else if(Number(last.close)<Number(prev.close)){score--;reasons.push('Momentum -')}
  const direction=score>=2?'BUY':score<=-2?'SELL':'WAIT';
  return res.status(200).json({direction,score,reasons,price:Number(last.close),candleTime:last.time||last.datetime||null});
}
