import { sql } from '@vercel/postgres';

export async function GET(req) {
  try {
    // Optional: limit query parameter, e.g., ?limit=10
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit")) || 100; // default 100 records

    const records = await sql`
      SELECT * FROM zakat_logs
      ORDER BY created DESC
      LIMIT ${limit}
    `;

    return new Response(JSON.stringify({ records }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch records" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
