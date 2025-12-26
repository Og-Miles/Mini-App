"use client";

import { FlutterWaveButton } from "flutterwave-react-v3";
import { useSearchParams } from "next/navigation";

export default function PaymentClient() {
  const params = useSearchParams();
  const chatId = params.get("chat_id");

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
    callback: (response: unknown) => {
      console.log("Payment response", response);
    },
    onClose: () => console.log("Payment closed"),
  };

  return <FlutterWaveButton {...paymentData} />;
}
