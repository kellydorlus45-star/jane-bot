// Compatibility endpoint. The browser currently performs the deterministic signal calculation
// from the same real Twelve Data candles shown in the chart.
module.exports=async function handler(req,res){
  res.statusCode=200;res.setHeader('Content-Type','application/json');
  res.end(JSON.stringify({ok:true,engine:'Jane Bot deterministic frontend engine',source:'Twelve Data',note:'Signal calculation is performed client-side from the returned real candles.'}));
};
