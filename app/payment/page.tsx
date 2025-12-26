import { Suspense } from "react";
import PaymentClient from "./payment-client";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment…</div>}>
      <PaymentClient publicKey={process.env.FLW_PUBLIC!} />
    </Suspense>
  );
}
