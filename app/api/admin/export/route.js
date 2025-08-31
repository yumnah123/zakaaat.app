import { stringify } from 'papaparse';

export async function GET(){
  try {
    const logs = globalThis.kindlewayLogs || [];
    const rows = logs.map(l => ({
      created: l.created,
      totalAssets: l.totalAssets,
      liabilities: l.liabilities,
      netAssets: l.netAssets,
      zakaat: l.zakaat
    }));
    const csv = stringify(rows, { header: true });
    return new Response(csv, { status:200, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="zakaat_logs.csv"' } });
  } catch(e){
    return new Response('created,totalAssets,liabilities,netAssets,zakaat\n', { status:200, headers: { 'Content-Type': 'text/csv' } });
  }
}
