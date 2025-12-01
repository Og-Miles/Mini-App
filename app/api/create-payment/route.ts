import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface Plan {
  amount: number;
  label: string;
}

interface RequestBody {
  planId?: string;
  chatId?: string;
  amount?: number;
}

interface FlutterwaveResponse {
  status: string;
  message: string;
  data?: {
    link?: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await req.json();
    const planId = body?.planId;
    const chatId = body?.chatId;
    const clientAmount = Number(body?.amount);

    const PLANS: Record<string, Plan> = {
      "1m": { amount: 1000, label: "1 Month" },
      "3m": { amount: 2500, label: "3 Months" },
      "6m": { amount: 5000, label: "6 Months" },
      "12m": { amount: 10000, label: "12 Months" },
    };

    const plan = planId ? PLANS[planId] : undefined;
    if (!plan) {
      return NextResponse.json({ error: "Invalid planId" }, { status: 400 });
    }

    const FLW_SECRET = process.env.FLW_SECRET;
    const APP_DOMAIN = process.env.APP_DOMAIN || "http://localhost:3000";

    if (!FLW_SECRET) {
      return NextResponse.json(
        { error: "Server misconfigured: missing FLW_SECRET" },
        { status: 500 }
      );
    }

    const txRef = `sub_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const finalAmount =
      clientAmount && clientAmount > 0 ? clientAmount : plan.amount;

    const payload = {
      tx_ref: txRef,
      amount: finalAmount,
      currency: "NGN",
      redirect_url: `${APP_DOMAIN}/payment/success?tx_ref=${txRef}`,
      customer: {
        email: "customer@example.com",
        phonenumber: "0000000000",
        name: chatId ? `tg_${chatId}` : "Unknown",
      },
      meta: {
        plan_id: planId,
        chat_id: chatId,
        discounted: finalAmount !== plan.amount,
      },
      payment_options: "card,banktransfer,ussd,mobilemoney",
    };

    const r = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FLW_SECRET}`,
      },
      body: JSON.stringify(payload),
    });

    const data: FlutterwaveResponse = await r.json();

    if (!r.ok) {
      console.error("Flutterwave create failed:", data);
      return NextResponse.json(
        { error: "flutterwave_error", details: data },
        { status: 502 }
      );
    }

    const payment_link = data?.data?.link ?? null;
    return NextResponse.json({ payment_link, txRef });
  } catch (err) {
    console.error("Internal error:", err);
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred";
    return NextResponse.json({ error: "internal", message }, { status: 500 });
  }
}
