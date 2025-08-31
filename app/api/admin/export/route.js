import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Fetch logs from Postgres
    const { rows } = await sql`SELECT * FROM zakat_logs ORDER BY created DESC`;

    // Convert to CSV format
    const headers = [
      'id',
      'gold',
      'silver',
      'cash',
      'bank',
      'business',
      'investments',
      'property',
      'other',
      'liabilities',
      'total_assets',
      'net_assets',
      'zakaat',
      'created'
    ];

    const csvRows = [
      headers.join(','), // header row
      ...rows.map(r => headers.map(h => r[h] ?? '').join(','))
    ];

    const csv = csvRows.join('\n');

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="zakaat_logs.csv"',
      },
    });
  } catch (e) {
    console.error(e);
    return new Response('error generating csv', { status: 500 });
  }
}
