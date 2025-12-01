"use client";

import { FlutterWaveButton } from "flutterwave-react-v3";
import type { FlutterWaveResponse } from "flutterwave-react-v3/dist/types"; // ✅ import the real type
import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const params = useSearchParams();
  const chatId = params.get("chat_id") ?? "unknown";

  const paymentData = {
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
    tx_ref: `tg_${chatId}_${Date.now()}`,
    amount: 10,
    currency: "USD",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "user@email.com",
      phone_number: "1234567890",
      name: "John Doe",
    },
    customizations: {
      title: "Subscription",
      description: "User subscription payment",
      logo: "https://yourdomain.com/logo.png",
    },
    callback: (response: FlutterWaveResponse) => {
      console.log("Payment response", response);
    },
    onClose: () => console.log("Payment closed"),
  };

  return (
    <div>
      <FlutterWaveButton {...paymentData} />
    </div>
  );
}
