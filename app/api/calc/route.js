function safeNum(v) {
  return Number(String(v || '').replace(/[^0-9.-]+/g, '')) || 0;
}

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

    return Response.json({ totalAssets, liabilities, netAssets, zakaat });
  } catch (err) {
    console.error("POST /api/calc error:", err);
    return Response.json({ error: "calc_failed" }, { status: 500 });
  }
}
