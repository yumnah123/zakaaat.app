import fs from 'fs';
import path from 'path';

function safeNum(v){ return Number(String(v||'').replace(/[^0-9.-]+/g,'')) || 0; }

export async function POST(req){
  try {
    const body = await req.json();
    const totalAssets = safeNum(body.gold) + safeNum(body.silver) + safeNum(body.cash) + safeNum(body.bank) + safeNum(body.business) + safeNum(body.investments) + safeNum(body.property) + safeNum(body.other);
    const liabilities = safeNum(body.liabilities);
    const netAssets = Math.max(0, totalAssets - liabilities);
    const zakaat = +(netAssets * 0.025).toFixed(2);
    const record = { ...body, totalAssets, liabilities, netAssets, zakaat, created: body.created || new Date().toISOString() };

    // store in-memory (works on Vercel serverless)
    if(!globalThis.kindlewayLogs) globalThis.kindlewayLogs = [];
    globalThis.kindlewayLogs.push(record);

    // best-effort persist to content file when the environment allows it (local dev)
    try {
      const file = path.join(process.cwd(),'content','calculations.json');
      const arr = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf-8')) : [];
      arr.push(record);
      fs.writeFileSync(file, JSON.stringify(arr,null,2), 'utf-8');
    } catch(e){ /* ignore persistence errors on Vercel */ }

    return new Response(JSON.stringify({ totalAssets, liabilities, netAssets, zakaat, record }), { status: 200 });
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error:'calculation_failed' }), { status:500 });
  }
}
