import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM logs ORDER BY created DESC`;

    const header = "Date,Net Assets,Zakaat\n";
    const csv = rows
      .map(
        (r) =>
          `${new Date(r.created).toISOString()},${r.netassets},${r.zakaat}`
      )
      .join("\n");

    return new Response(header + csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=logs.csv",
      },
    });
  } catch (err) {
    return new Response("Error generating CSV", { status: 500 });
  }
}
