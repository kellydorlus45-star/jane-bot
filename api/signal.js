function ema(a, n) {
  if (!Array.isArray(a) || a.length < n) return null;
  const k = 2 / (n + 1); let e = a[0];
  for (let i = 1; i < a.length; i++) e = a[i] * k + e * (1 - k);
  return e;
}
function rsi(a, n = 14) {
  if (!Array.isArray(a) || a.length <= n) return null;
  let g = 0, l = 0;
  for (let i = 1; i <= n; i++) { const d = a[i] - a[i - 1]; g += Math.max(d, 0); l += Math.max(-d, 0); }
  g /= n; l /= n;
  for (let i = n + 1; i < a.length; i++) { const d = a[i] - a[i - 1]; g = (g * (n - 1) + Math.max(d, 0)) / n; l = (l * (n - 1) + Math.max(-d, 0)) / n; }
  return l === 0 ? (g === 0 ? 50 : 100) : 100 - (100 / (1 + g / l));
}
function atr(rows, n = 14) {
  if (rows.length < n + 1) return null;
  const tr = [];
  for (let i = 1; i < rows.length; i++) {
    const c = rows[i], p = rows[i - 1];
    tr.push(Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close)));
  }
  return tr.slice(-n).reduce((a, b) => a + b, 0) / n;
}
function stdev(a) {
  if (!a.length) return 0;
  const m = a.reduce((x, y) => x + y, 0) / a.length;
  return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length);
}
function adx(rows, n = 14) {
  if (rows.length < n * 2 + 2) return null;
  let tr = [], plus = [], minus = [];
  for (let i = 1; i < rows.length; i++) {
    const c = rows[i], p = rows[i - 1];
    tr.push(Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close)));
    const up = c.high - p.high, down = p.low - c.low;
    plus.push(up > down && up > 0 ? up : 0);
    minus.push(down > up && down > 0 ? down : 0);
  }
  const dx = [];
  for (let i = n; i < tr.length; i++) {
    const atrv = tr.slice(i - n + 1, i + 1).reduce((a,b)=>a+b,0) / n;
    const pdi = atrv ? 100 * (plus.slice(i - n + 1, i + 1).reduce((a,b)=>a+b,0)/n) / atrv : 0;
    const mdi = atrv ? 100 * (minus.slice(i - n + 1, i + 1).reduce((a,b)=>a+b,0)/n) / atrv : 0;
    dx.push((pdi + mdi) ? 100 * Math.abs(pdi - mdi) / (pdi + mdi) : 0);
  }
  return dx.length ? dx.slice(-n).reduce((a,b)=>a+b,0)/Math.min(n,dx.length) : null;
}
function normalizeRows(candles) {
  return candles.map(x => ({
    time: Number(x.time ?? x.datetime ?? x.t),
    open: Number(x.open), high: Number(x.high), low: Number(x.low), close: Number(x.close)
  })).filter(x => Number.isFinite(x.time) && [x.open,x.high,x.low,x.close].every(Number.isFinite)).sort((a,b)=>a.time-b.time);
}
function minutesForInterval(interval) {
  const m = { '1min':1,'2min':2,'3min':3,'5min':5,'10min':10,'15min':15,'30min':30,'1h':60,'4h':240,'5h':300,'1day':1440,'1week':10080,'1month':43200 };
  return m[interval] ?? null;
}
function evaluateRule(c) {
  const close = c.map(x=>x.close);
  const e9=ema(close.slice(-120),9), e21=ema(close.slice(-120),21), e50=ema(close.slice(-180),50);
  const rv=rsi(close,14), a=atr(c,14), ad=adx(c,14);
  const e12=ema(close.slice(-120),12), e26=ema(close.slice(-120),26);
  const macd=e12-e26;
  const prev12=ema(close.slice(-121,-1),12), prev26=ema(close.slice(-121,-1),26);
  const prevMacd=(prev12??0)-(prev26??0);
  const momentum=close.at(-1)-close.at(-5);
  const last=c.at(-1), prev=c.at(-2);
  const range=Math.max(last.high-last.low,1e-12), body=Math.abs(last.close-last.open), bodyRatio=body/range;
  const recent=c.slice(-8), prior=c.slice(-16,-8);
  const recentHigh=Math.max(...recent.map(x=>x.high)), recentLow=Math.min(...recent.map(x=>x.low));
  const priorHigh=Math.max(...prior.map(x=>x.high)), priorLow=Math.min(...prior.map(x=>x.low));
  let bull=0,bear=0; const reasons=[];
  if(e9>e21){bull++;reasons.push('EMA 9/21 alcistas')}else if(e9<e21){bear++;reasons.push('EMA 9/21 bajistas')}
  if(e21>e50){bull++;reasons.push('Tendencia sobre EMA 50')}else if(e21<e50){bear++;reasons.push('Tendencia bajo EMA 50')}
  if(rv>=52&&rv<=68){bull++;reasons.push('RSI favorable a compras')} else if(rv<=48&&rv>=32){bear++;reasons.push('RSI favorable a ventas')}
  if(macd>prevMacd && macd>=0){bull++;reasons.push('MACD confirma impulso')} else if(macd<prevMacd && macd<=0){bear++;reasons.push('MACD confirma impulso')}
  if(momentum>0){bull++;} else if(momentum<0){bear++;}
  if(recentHigh>priorHigh && recentLow>=priorLow){bull++;reasons.push('Estructura alcista')} else if(recentLow<priorLow && recentHigh<=priorHigh){bear++;reasons.push('Estructura bajista')}
  if(bodyRatio>=0.45){ if(last.close>last.open) bull++; else if(last.close<last.open) bear++; }
  const trendStrength = Number.isFinite(ad) && ad >= 18;
  if(trendStrength) reasons.push(`ADX ${ad.toFixed(0)} fuerza`); else { bull = Math.max(0,bull-0.25); bear = Math.max(0,bear-0.25); }
  const atrSeries=[];
  for(let i=1;i<c.length;i++){const x=c[i],p=c[i-1];atrSeries.push(Math.max(x.high-x.low,Math.abs(x.high-p.close),Math.abs(x.low-p.close)));}
  const atrNow=a||0, atrBase=atrSeries.slice(-42,-14), avgBase=atrBase.length?atrBase.reduce((x,y)=>x+y,0)/atrBase.length:atrNow;
  const volatilityHealthy=atrNow>0 && (!avgBase || (atrNow>=avgBase*0.55 && atrNow<=avgBase*1.9));
  const diff=bull-bear;
  let dir='WAIT';
  if(volatilityHealthy && Math.max(bull,bear)>=4 && Math.abs(diff)>=2.5) dir=bull>bear?'UP':'DOWN';
  return {dir,bull,bear,diff,reasons,rv,atr:a,adx:ad,last,bodyRatio};
}
function historicalScore(rows,horizon) {
  const start=Math.max(90, rows.length - 260);
  let wins=0, samples=0;
  for(let i=start;i<=rows.length-horizon-1;i+=2){
    const sample=rows.slice(0,i+1);
    if(sample.length<80) continue;
    const r=evaluateRule(sample);
    if(r.dir==='WAIT') continue;
    const base=sample.at(-1).close;
    const future=rows[i+horizon].close-base;
    if(!Number.isFinite(future)||future===0) continue;
    samples++;
    if((r.dir==='UP'&&future>0)||(r.dir==='DOWN'&&future<0)) wins++;
  }
  return {rate:samples?wins/samples:null,samples,wins};
}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const body=req.body||{};
  const candles=normalizeRows(Array.isArray(body.candles)?body.candles:[]);
  const mode=body.mode==='binary'?'binary':'forex';
  const symbol=String(body.symbol||'').toUpperCase();
  const interval=String(body.interval||'1min');
  if(!/^[A-Z]{3}\/[A-Z]{3}$/.test(symbol)) return res.status(400).json({ok:false,error:'Par de divisas inválido.'});
  if(candles.length<100) return res.status(400).json({ok:false,error:'No hay suficientes velas cerradas para un análisis fiable.'});
  const m=minutesForInterval(interval);
  if(!m) return res.status(400).json({ok:false,error:'Este Time Frame necesita datos que la fuente actual no entrega directamente.'});
  const expiry=body.expiry||{};
  const expiryUnit=String(expiry.unit||'minutes');
  const expiryValue=Math.max(1,Number(expiry.value||1));
  const expiryMinutes=expiryUnit==='seconds'?expiryValue/60:expiryUnit==='hours'?expiryValue*60:expiryUnit==='days'?expiryValue*1440:expiryValue;
  if(mode==='binary' && expiryUnit==='seconds' && expiryValue<60){
    return res.status(200).json({ok:true,mode,symbol,interval,signal:'WAIT',confidence:0,price:candles.at(-1).close,entry:candles.at(-1).close,stopLoss:null,takeProfit:null,candleTime:candles.at(-1).time,reasons:['La fuente actual entrega velas de 1 minuto; no puede validar honestamente una expiración inferior a 1 minuto.'],analysis:{historicalSamples:0,historicalRate:null}});
  }
  const horizon=Math.max(1,Math.round(expiryMinutes/m));
  const current=evaluateRule(candles);
  let signal='WAIT';
  if(current.dir!=='WAIT'){
    const hist=historicalScore(candles,horizon);
    const histReady=hist.samples>=20 && hist.rate!=null;
    // Historical validation is advisory, not a hard gate. A hard historical gate was
    // causing long stretches of WAIT even when the live confluence was clear.
    signal=mode==='binary'?(current.dir==='UP'?'CALL':'PUT'):(current.dir==='UP'?'BUY':'SELL');
    if(histReady) current.reasons.push(`Validación histórica ${Math.round(hist.rate*100)}% (${hist.samples} casos)`);
    else current.reasons.push('Validación histórica limitada; manda la confluencia actual');
    current.hist=hist;
  } else current.hist={rate:null,samples:0,wins:0};
  const last=current.last, digits=symbol.endsWith('/JPY')?3:5, round=n=>Number(n.toFixed(digits));
  let stopLoss=null,takeProfit=null;
  if(mode==='forex'&&signal!=='WAIT'){
    const look=candles.slice(-20),lo=Math.min(...look.map(x=>x.low)),hi=Math.max(...look.map(x=>x.high)),a=current.atr||0;
    if(signal==='BUY'){stopLoss=round(Math.min(lo,last.close-a*0.15));takeProfit=round(last.close+(last.close-stopLoss)*1.8)}
    else {stopLoss=round(Math.max(hi,last.close+a*0.15));takeProfit=round(last.close-(stopLoss-last.close)*1.8)}
  }
  const confidence=signal==='WAIT'?Math.round(Math.min(62,48+Math.abs(current.diff)*4)):
    Math.round(Math.min(88,58+Math.max(0,current.diff===0?0:Math.abs(current.diff))*5+(current.adx||18)*0.15));
  return res.status(200).json({ok:true,mode,symbol,interval,signal,confidence,score:current.diff,price:Number(last.close),entry:Number(last.close),stopLoss,takeProfit,candleTime:last.time,source:'Twelve Data',reasons:current.reasons.slice(0,8),analysis:{bull:current.bull,bear:current.bear,adx:current.adx,atr:current.atr,historicalRate:current.hist?.rate??null,historicalSamples:current.hist?.samples??0,historicalWins:current.hist?.wins??0,horizon}});
}
