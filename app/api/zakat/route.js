import { sql } from '@vercel/postgres';

// --- Utility: safe number parsing ---
function safeNum(v) {
  return Number(String(v || '').replace(/[^0-9.-]+/g, '')) || 0;
}

// --- POST: Save new zakat calculation ---
export async function POST(req) {
  try {
    const body = await req.json();
    const totalAssets =
      safeNum(body.gold) +
      safeNum(body.silver) +
      safeNum(body.cash) +
      safeNum(body.bank) +
      safeNum(body.business) +
      safeNum(body.investments) +
      safeNum(body.property) +
      safeNum(body.other);

    const liabilities = safeNum(body.liabilities);
    const netAssets = Math.max(0, totalAssets - liabilities);
    const zakaat = +(netAssets * 0.025).toFixed(2);
    const created = new Date().toISOString();

    // ✅ Save sanitized values instead of raw body values
    await sql`
      INSERT INTO zakat_logs (
        gold, silver, cash, bank, business, investments, property, other,
        liabilities, total_assets, net_assets, zakaat, created
      )
      VALUES (
        ${safeNum(body.gold)}, ${safeNum(body.silver)}, ${safeNum(body.cash)}, ${safeNum(body.bank)},
        ${safeNum(body.business)}, ${safeNum(body.investments)}, ${safeNum(body.property)}, ${safeNum(body.other)},
        ${liabilities}, ${totalAssets}, ${netAssets}, ${zakaat}, ${created}
      )
    `;

    return Response.json({ totalAssets, liabilities, netAssets, zakaat, created });
  } catch (err) {
    console.error("POST /api/zakat error:", err);
    return Response.json({ error: "calculation_failed" }, { status: 500 });
  }
}

// --- GET: Fetch zakat records ---
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit")) || 100;

    const records = await sql`
      SELECT * FROM zakat_logs
      ORDER BY created DESC
      LIMIT ${limit}
    `;

    return Response.json({ records });
  } catch (err) {
    console.error("GET /api/zakat error:", err);
    return Response.json({ error: "failed_to_fetch_records" }, { status: 500 });
  }
}
