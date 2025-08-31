import { sql } from "@vercel/postgres";

// Create table if not exists
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      created TIMESTAMP DEFAULT NOW(),
      netAssets BIGINT NOT NULL,
      zakaat BIGINT NOT NULL
    )
  `;
}

export async function POST(req) {
  try {
    const { netAssets, zakaat } = await req.json();
    await ensureTable();
    await sql`
      INSERT INTO logs (netAssets, zakaat)
      VALUES (${netAssets}, ${zakaat})
    `;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureTable();
    const { rows } = await sql`SELECT * FROM logs ORDER BY created DESC`;
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
