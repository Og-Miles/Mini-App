import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("verif-hash") || req.headers.get("flutterwave-signature") || "";
  const secret = process.env.FLW_WEBHOOK_SECRET || "";

  if (!secret) {
    console.warn("No FLW_WEBHOOK_SECRET configured");
    return NextResponse.json({ received: false }, { status: 500 });
  }

  // compute HMAC-SHA256 and base64 encode
  const hash = crypto.createHmac("sha256", secret).update(raw).digest("base64");

  if (!signature || signature !== hash) {
    console.warn("Invalid webhook signature");
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // signature valid — process payload
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Example: payload.data.status may be "successful"
  const { data } = payload;
  if (data?.status === "successful") {
    const tx_ref = data?.tx_ref;
    const meta = data?.meta || {};
    const plan_id = meta?.plan_id;
    const chat_id = meta?.chat_id;

    // TODO: activate subscription in DB using tx_ref -> plan_id / chat_id
    // Optionally call your Telegram bot to notify the user: call https://api.telegram.org/bot<token>/sendMessage?chat_id=...&text=...

    console.log("Payment success webhook for", tx_ref, plan_id, chat_id);
  }

  return NextResponse.json({ received: true });
}
