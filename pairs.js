const SYMBOL_RE=/^[A-Z]{3}\/[A-Z]{3}$/;

module.exports=async(req,res)=>{
  try{
    if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
    const key=process.env.TWELVEDATA_API_KEY;
    if(!key) return res.status(500).json({error:'TWELVEDATA_API_KEY no está configurada en Vercel.'});

    const all=[];
    const seen=new Set();
    let expected=0;
    const pageSize=500;

    // Twelve Data documents /forex_pairs as the comprehensive, daily-updated
    // physical-Forex catalog. Fetch pages instead of assuming one small page.
    for(let page=1;page<=20;page++){
      const u=new URL('https://api.twelvedata.com/forex_pairs');
      u.searchParams.set('page',String(page));
      u.searchParams.set('outputsize',String(pageSize));
      u.searchParams.set('format','JSON');
      u.searchParams.set('apikey',key);

      const r=await fetch(u,{cache:'no-store'});
      const text=await r.text();
      let d;
      try{d=JSON.parse(text)}catch{return res.status(502).json({error:'Respuesta inválida del catálogo Forex.'})}
      if(!r.ok||d.status==='error'||d.code){
        return res.status(r.status||502).json({error:d.message||'No se pudo obtener el catálogo Forex.'});
      }

      expected=Number(d.count)||expected;
      const rows=Array.isArray(d.data)?d.data:[];
      if(!rows.length)break;

      for(const x of rows){
        const symbol=String(x.symbol||'').trim().toUpperCase();
        if(!SYMBOL_RE.test(symbol)||seen.has(symbol))continue;
        seen.add(symbol);
        all.push({
          symbol,
          base:x.currency_base||null,
          quote:x.currency_quote||null,
          group:x.currency_group||null
        });
      }

      if((expected>0&&all.length>=expected)||rows.length<pageSize)break;
    }

    all.sort((a,b)=>a.symbol.localeCompare(b.symbol));
    if(!all.length)return res.status(502).json({error:'Twelve Data no devolvió pares Forex.'});

    res.setHeader('Cache-Control','s-maxage=86400, stale-while-revalidate=3600');
    return res.status(200).json({pairs:all,count:all.length,providerCount:expected});
  }catch(e){
    return res.status(500).json({error:e?.message||'Error interno del catálogo Forex.'});
  }
};
