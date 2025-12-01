import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Define payload structure
interface FlutterwaveWebhookMeta {
  plan_id?: string;
  chat_id?: string;
  [key: string]: unknown;
}

interface FlutterwaveWebhookData {
  status?: string;
  tx_ref?: string;
  meta?: FlutterwaveWebhookMeta;
  [key: string]: unknown;
}

interface FlutterwaveWebhookPayload {
  event?: string;
  data?: FlutterwaveWebhookData;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature =
    req.headers.get("verif-hash") ||
    req.headers.get("flutterwave-signature") ||
    "";

  const secret = process.env.FLW_WEBHOOK_SECRET ?? "";

  if (!secret) {
    console.warn("No FLW_WEBHOOK_SECRET configured");
    return NextResponse.json({ received: false }, { status: 500 });
  }

  const hash = crypto.createHmac("sha256", secret).update(raw).digest("base64");

  if (!signature || signature !== hash) {
    console.warn("Invalid webhook signature");
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let payload: FlutterwaveWebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch (_error) {
    console.error("Invalid JSON payload", _error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const data = payload.data;
  if (data?.status === "successful") {
    const tx_ref = data.tx_ref;
    const meta = data.meta ?? {};
    const plan_id = meta.plan_id;
    const chat_id = meta.chat_id;

    console.log("Payment success webhook for", tx_ref, plan_id, chat_id);
    // TODO: update DB, notify Telegram, etc.
  }

  return NextResponse.json({ received: true });
}
