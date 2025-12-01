import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const tx_ref = req.nextUrl.searchParams.get("tx_ref");
  if (!tx_ref) return NextResponse.json({ error: "missing_tx_ref" }, { status: 400 });

  const FLW_SECRET = process.env.FLW_SECRET;
  if (!FLW_SECRET) return NextResponse.json({ error: "server_misconfig" }, { status: 500 });

  const url = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(tx_ref)}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${FLW_SECRET}` } });
  const data = await r.json();

  // TODO: if verified and successful, mark subscription active in DB (tx_ref -> chat_id/plan)
  return NextResponse.json(data);
}
