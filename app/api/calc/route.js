import { sql } from '@vercel/postgres';

function safeNum(v){ 
  return Number(String(v||'').replace(/[^0-9.-]+/g,'')) || 0; 
}

export async function POST(req){
  try {
    const body = await req.json();
    const totalAssets = safeNum(body.gold) + safeNum(body.silver) + safeNum(body.cash) + safeNum(body.bank) + safeNum(body.business) + safeNum(body.investments) + safeNum(body.property) + safeNum(body.other);
    const liabilities = safeNum(body.liabilities);
    const netAssets = Math.max(0, totalAssets - liabilities);
    const zakaat = +(netAssets * 0.025).toFixed(2);
    const created = new Date().toISOString();

    // save record to Postgres
    await sql`
      INSERT INTO zakat_logs (gold, silver, cash, bank, business, investments, property, other, liabilities, total_assets, net_assets, zakaat, created)
      VALUES (${body.gold}, ${body.silver}, ${body.cash}, ${body.bank}, ${body.business}, ${body.investments}, ${body.property}, ${body.other}, ${liabilities}, ${totalAssets}, ${netAssets}, ${zakaat}, ${created})
    `;

    return new Response(JSON.stringify({ totalAssets, liabilities, netAssets, zakaat, created }), { status: 200 });
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error:'calculation_failed' }), { status:500 });
  }
}
