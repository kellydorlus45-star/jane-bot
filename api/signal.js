export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  return res.status(200).json({signal:'WAIT',confidence:0,reason:'El motor principal de Jane Bot analiza las velas en el frontend. Este endpoint queda como compatibilidad.'});
}
