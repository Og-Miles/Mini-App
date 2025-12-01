"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";

type Plan = {
  id: string;
  title: string;
  amount: number;
  priceLabel: string;
};

type PaymentModalProps = {
  plan: Plan;
  onClose: () => void;
};

export default function PaymentModal({ plan, onClose }: PaymentModalProps) {
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    try {
      setLoading(true);
      setError("");

      // Apply a simple demo discount logic
      let finalAmount = plan.amount;
      if (discount.trim().toLowerCase() === "alert10") {
        finalAmount = plan.amount * 0.9; // 10% off
      }

      const chatId =
        new URLSearchParams(window.location.search).get("chat_id") || undefined;

      const resp = await axios.post("/api/create-payment", {
        planId: plan.id,
        chatId,
        amount: finalAmount,
      });

      const link: string | undefined = resp.data?.payment_link;
      if (!link) throw new Error("No payment link returned");
      window.location.href = link;
    } catch (err: unknown) {
      // Type-safe error extraction
      let message = "Payment initiation failed";
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ error?: string }>;
        message =
          axiosErr.response?.data?.error ||
          axiosErr.message ||
          "Payment initiation failed";
      } else if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
      <div className='bg-[#13151C] p-8 rounded-2xl max-w-md w-full text-center relative border border-gray-700'>
        <button
          className='absolute top-4 right-4 text-gray-400 hover:text-white'
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className='text-2xl font-bold mb-2'>{plan.title}</h2>
        <p className='text-gray-400 mb-4'>
          You’re subscribing for <strong>{plan.title}</strong> at{" "}
          <span className='text-indigo-400'>{plan.priceLabel}</span>
        </p>

        <input
          type='text'
          placeholder='Enter discount code (optional)'
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className='w-full mb-4 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500'
        />

        {error && <p className='text-red-400 text-sm mb-3'>{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-indigo-400"
          }`}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
