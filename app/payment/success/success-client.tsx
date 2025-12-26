"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";

export default function SuccessClient() {
  const params = useSearchParams();
  const tx_ref = params.get("tx_ref");
  const redirectStatus = params.get("status");

  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!tx_ref) return;

    (async () => {
      try {
        const r = await axios.get(
          `/api/verify?tx_ref=${encodeURIComponent(tx_ref)}`
        );
        setVerifyStatus(r.data?.status || "unknown");
      } catch (err: unknown) {
        let message = "verification_failed";

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ error?: string }>;
          message = axiosErr.response?.data?.error || message;
        } else if (err instanceof Error) {
          message = err.message || message;
        } else if (typeof err === "string") {
          message = err;
        }

        console.error("Verification error:", message);
        setVerifyStatus(message);
      }
    })();
  }, [tx_ref]);

  let title = "Payment Status";
  let description = "";

  if (redirectStatus === "successful") {
    title = "✅ Payment Successful";
    description =
      "Your subscription will be activated after verification (webhook or manual check).";
  } else if (redirectStatus === "cancelled") {
    title = "⚠️ Payment Cancelled";
    description = "You cancelled the payment. No charges were made.";
  } else if (redirectStatus === "failed") {
    title = "❌ Payment Failed";
    description = "Something went wrong. Please try again.";
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='card p-8 max-w-lg text-center'>
        <h1 className='text-2xl font-bold mb-4'>{title}</h1>

        <p className='text-gray-300 mb-4'>
          Transaction reference: <code>{tx_ref}</code>
        </p>

        {verifyStatus && (
          <p className='mb-4'>
            Verification status: <strong>{verifyStatus}</strong>
          </p>
        )}

        <p className='text-sm text-gray-400'>{description}</p>
      </div>
    </div>
  );
}
