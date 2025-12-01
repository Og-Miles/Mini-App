import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const flwHash = process.env.FLW_WEBHOOK_SECRET;
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== flwHash) {
    return NextResponse.json({ status: "invalid signature" }, { status: 401 });
  }

  const data = await req.json();

  if (data.status !== "successful") {
    return NextResponse.json({ status: "ignored" });
  }

  const txRef = data.tx_ref; // e.g. "tg_123456_171234567"
  const amount = data.amount;

  const chatId = Number(txRef.split("_")[1]);
  
let plan = "monthly";
let days = 30;

if (amount === 25) {
  plan = "3months";
  days = 90;
} else if (amount === 50) {
  plan = "6months";
  days = 180;
} else if (amount === 100) {
  plan = "1year";
  days = 365;
}

  // Tell the Telegram bot to activate subscription
  await fetch(process.env.BOT_INTERNAL_API!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, plan, days }),
  });

  return NextResponse.json({ status: "ok" });
}
