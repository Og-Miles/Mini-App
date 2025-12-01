"use client";

import Flutterwave from "flutterwave-react-v3";
import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const params = useSearchParams();
  const chatId = params.get("chat_id"); // from Telegram WebApp initData

  const paymentData = {
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
    tx_ref: `tg_${chatId}_${Date.now()}`,
    amount: 10,
    currency: "USD",
    customer: {
      email: "user@email.com",
    },
    customizations: {
      title: "Subscription",
      description: "User subscription payment",
    },
  };

  return (
    <div>
      <Flutterwave
        {...paymentData}
        callback={(response: any) => {
          console.log("Payment response", response);
        }}
        onClose={() => console.log("Payment closed")}
      />
    </div>
  );
}
