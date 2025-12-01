"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  CreditCard,
  Apple,
  Globe,
  Wallet,
  Banknote,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PLANS: Record<string, { title: string; price: number; label?: string }> =
  {
    "1m": { title: "1 Month", price: 100, label: "1 Month" },
    "3m": { title: "3 months", price: 2500, label: "3 Months" },
    "6m": { title: "6 Months", price: 5000, label: "6 Months" },
    "12m": { title: "1 Year", price: 10000, label: "12 Months" },
  };

function formatCurrency(n: number) {
  return `₦${Number(n).toLocaleString()}`;
}

export default function CheckoutPage() {
  const { planId } = useParams();
  const plan = PLANS[planId as keyof typeof PLANS];
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [applyMsg, setApplyMsg] = useState<string | null>(null);

  if (!plan) {
    return (
      <div className='min-h-screen bg-[#070521] flex items-center justify-center text-gray-300'>
        <div>Invalid plan selected.</div>
      </div>
    );
  }

  const total = Math.max(Math.round(plan.price - discount), 0);

  const applyCode = async () => {
    if (!code.trim()) {
      setApplyMsg("Enter a code");
      return;
    }
    try {
      const res = await axios.post("/api/validate-code", {
        code,
        amount: plan.price,
      });
      const data = res.data;
      if (!data.valid) {
        setApplyMsg(data.message);
        setDiscount(0);
        return;
      }
      setDiscount(plan.price - data.newAmount);
      setApplyMsg(data.message);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : JSON.stringify(err);
      console.error("applyCode error:", message);
      setApplyMsg("Error validating code");
    }
  };

  const handleFlutterPay = async () => {
    setLoading(true);
    try {
      const chatId =
        new URLSearchParams(window.location.search).get("chat_id") || undefined;

      const resp = await axios.post("/api/create-payment", {
        planId,
        chatId,
        amount: total,
      });

      const link =
        resp.data?.payment_link || resp.data?.paymentLink || resp.data?.link;

      if (!link) throw new Error("No payment link returned");

      window.location.href = link;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : JSON.stringify(err);
      console.error("create-payment error:", message);
      alert("Failed to start payment. Check console.");
      setLoading(false);
    }
  };

  const methods = [
    {
      key: "flutterwave",
      title: "International Cards",
      icon: <CreditCard className='w-6 h-6' />,
      active: true,
    },
    {
      key: "apple",
      title: "Apple Pay",
      icon: <Apple className='w-6 h-6' />,
      active: false,
    },
    {
      key: "local",
      title: "Local Cards",
      icon: <Globe className='w-6 h-6' />,
      active: false,
    },
    {
      key: "paypal",
      title: "PayPal",
      icon: <Wallet className='w-6 h-6' />,
      active: false,
    },
    {
      key: "verve",
      title: "Verve",
      icon: <Activity className='w-6 h-6' />,
      active: false,
    },
    {
      key: "crypto",
      title: "Crypto",
      icon: <Banknote className='w-6 h-6' />,
      active: false,
    },
    {
      key: "bank",
      title: "Bank Transfer",
      icon: <Banknote className='w-6 h-6' />,
      active: false,
    },
    {
      key: "gpay",
      title: "Google Pay",
      icon: <Activity className='w-6 h-6' />,
      active: false,
    },
    {
      key: "skrill",
      title: "Skrill",
      icon: <Wallet className='w-6 h-6' />,
      active: false,
    },
  ];

  return (
    <div className='min-h-screen bg-[#0b0830] py-10 px-6 flex justify-center'>
      <div className='bg-white rounded-2xl p-6 md:p-8 h-fit'>
        <div className='flex flex-col md:flex-row gap-6 md:gap-8'>
          {/* LEFT - purple summary card */}
          <div className='md:w-[420px] flex-shrink-0'>
            <div className='bg-gradient-to-b from-purple-500 to-indigo-500 text-white rounded-2xl p-6 h-full flex flex-col justify-between shadow-lg'>
              <div>
                <div className='text-sm opacity-90 mb-2 text-center'>
                  Total Amount to be Paid
                </div>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={total}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                    className='text-5xl font-extrabold text-center mb-4'
                  >
                    {formatCurrency(total)}
                  </motion.div>
                </AnimatePresence>

                <div className='border-t border-white/20 pt-4 space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='opacity-90'>Plan</span>
                    <span className='font-medium'>{plan.title}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='opacity-90'>Platform</span>
                    <span className='font-medium'>Deriv Synthetics</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='opacity-90'>Server</span>
                    <span className='font-medium'>Realtime</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='opacity-90'>Account Type</span>
                    <span className='font-medium'>Alerts</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='opacity-90'>Price</span>
                    <span className='font-medium'>
                      {formatCurrency(plan.price)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='opacity-90'>Discount</span>
                    <span className='font-medium'>
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                  <div className='flex justify-between pt-2 border-t border-white/20 mt-1'>
                    <span className='opacity-90'>Total Amount</span>
                    <span className='font-extrabold'>
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <label htmlFor='promo-input' className='sr-only'>
                  Promo
                </label>
                <div className='flex  flex-col  lg:flex-row gap-2'>
                  <input
                    id='promo-input'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder='Discount code (optional)'
                    className='flex-1 rounded-lg px-3 py-2 bg-white/10 placeholder-white/70 text-white outline-none'
                  />
                  <button
                    onClick={applyCode}
                    className='px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm'
                  >
                    Apply
                  </button>
                </div>
                {applyMsg && (
                  <div className='text-xs mt-2 text-white/90'>{applyMsg}</div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - white payment method area */}
          <div className='flex-1'>
            <div className='text-lg font-semibold mb-4 text-black'>
              Select a payment method
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {methods.map((m) => {
                const isActive = m.key === "flutterwave";
                return (
                  <button
                    key={m.key}
                    onClick={isActive ? handleFlutterPay : undefined}
                    disabled={!isActive || loading}
                    className={
                      "flex flex-col items-center justify-center rounded-xl p-4 text-sm font-medium shadow-sm transition " +
                      (isActive
                        ? loading
                          ? "bg-indigo-50 border-2 border-indigo-400 text-indigo-700"
                          : "bg-indigo-600 text-white border-2 border-indigo-600"
                        : "bg-white text-gray-500 border border-gray-200 cursor-not-allowed")
                    }
                  >
                    <div
                      className={
                        (isActive ? "text-white" : "text-gray-400") + " mb-2"
                      }
                    >
                      <div className='w-8 h-8 flex items-center justify-center rounded-md bg-white/0'>
                        {m.icon}
                      </div>
                    </div>
                    <div className='text-sm'>{m.title}</div>
                    {!isActive && (
                      <div className='text-xs text-gray-400 mt-2'>
                        +3% Provider Fees
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <ul className='mt-6 text-xs text-gray-600 space-y-2'>
              <li>
                This charge will appear as “Deriv Alert” on your statement.
              </li>
              <li>
                For assistance, email{" "}
                <span className='text-gray-800 font-medium'>
                  milescreative.a@gmail.com
                </span>
              </li>
              <li>Payment is processed securely via Flutterwave.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
