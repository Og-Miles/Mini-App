import { NextRequest, NextResponse } from "next/server";

type Discount = { type: "percent" | "flat"; value: number };

const DISCOUNTS: Record<string, Discount> = {
  gdsf10: { type: "percent", value: 10 },
  justme99: { type: "percent", value: 99 },
  pdsf50: { type: "flat", value: 50 },
  freesh100: { type: "percent", value: 100 },
};

export async function POST(req: NextRequest) {
  const { code, amount } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, message: "Missing or invalid code" });
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return NextResponse.json({ valid: false, message: "Invalid amount" });
  }

  const discount = DISCOUNTS[code.toLowerCase()];
  if (!discount) {
    return NextResponse.json({ valid: false, message: "Invalid code" });
  }

  const newAmount =
    discount.type === "percent"
      ? Math.max(Math.round(numericAmount * (1 - discount.value / 100)), 0)
      : Math.max(numericAmount - discount.value, 0);

  return NextResponse.json({
    valid: true,
    discount,
    newAmount,
    message:
      discount.type === "percent"
        ? `${discount.value}% discount applied`
        : `₦${discount.value} off`,
  });
}
