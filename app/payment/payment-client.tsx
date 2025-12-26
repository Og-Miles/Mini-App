"use client";

import { FlutterWaveButton } from "flutterwave-react-v3";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PaymentClientProps {
  publicKey: string;
}

// Define a Telegram user type
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  // Optional fields for Flutterwave
  email?: string;
  phone_number?: string;
}

export default function PaymentClient({ publicKey }: PaymentClientProps) {
  const params = useSearchParams();
  const chatId = params.get("chat_id");

  const [tgUser, setTgUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Wait for Telegram WebApp to be ready
    if (
      typeof window !== "undefined" &&
      window.Telegram?.WebApp?.initDataUnsafe?.user
    ) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      setTgUser({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        // You can add email/phone_number if you collect them via your bot
        email: undefined,
        phone_number: undefined,
      });
    }
  }, []);

  if (!tgUser) return <div>Loading...</div>; // Wait for Telegram user info

  const paymentData = {
    public_key: publicKey,
    tx_ref: `tg_${chatId}_${Date.now()}`,
    amount: 10,
    currency: "USD",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: tgUser.email || "guest@example.com",
      phone_number: tgUser.phone_number || "0000000000",
      name: `${tgUser.first_name} ${tgUser.last_name || ""}`,
    },
    customizations: {
      title: "Subscription",
      description: "User subscription payment",
      logo: "https://deriv-alert-sub.vercel.app/logo.png",
    },
    callback: (response: unknown) => {
      console.log("Payment response", response);
    },
    onClose: () => console.log("Payment closed"),
  };

  return <FlutterWaveButton {...paymentData} />;
}
