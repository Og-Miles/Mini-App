// pages/api/pay/crypto.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { plan, usd } = req.body;

  const resp = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: usd,
      price_currency: "usd",
      pay_currency: "usdt", // or leave empty to let user choose crypto
      order_id: plan,
      order_description: `Subscription ${plan}`,
    }),
  });

  const data = await resp.json();
  res.status(200).json({ url: data.invoice_url });
}
