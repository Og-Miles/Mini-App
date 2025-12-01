"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  title: string;
  price: number;
  priceLabel: string;
  buttonLabel: string;
  popular: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "1m",
    title: "1 Month",
    price: 100,
    priceLabel: "₦100",
    buttonLabel: "Subscribe Now",
    popular: false,
    features: ["Duration: 1 month", "Unlimited Alerts", "Email Support"],
  },
  {
    id: "3m",
    title: "3 Months",
    price: 2500,
    priceLabel: "₦2,500",
    buttonLabel: "Subscribe Now",
    popular: true,
    features: [
      "Duration: 3 months",
      "Unlimited Alerts",
      "Priority Email Support",
    ],
  },
  {
    id: "6m",
    title: "6 Months",
    price: 5000,
    priceLabel: "₦5,000",
    buttonLabel: "Subscribe Now",
    popular: false,
    features: [
      "Duration: 6 months",
      "Unlimited Alerts",
      "Priority Email Support",
    ],
  },
  {
    id: "12m",
    title: "1 Year",
    price: 10000,
    priceLabel: "₦10,000",
    buttonLabel: "Subscribe Now",
    popular: false,
    features: ["Duration: 12 months", "Unlimited Alerts", "Dedicated Support"],
  },
];

export default function Page() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const router = useRouter();

  return (
    <div className='min-h-screen bg-[#0B0D12] text-white flex flex-col items-center px-6 pt-12 pb-24 overflow-y-auto'>
      {/* Header */}
      <div className='text-center max-w-2xl mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold mb-4'>
          Stay Ahead of the Market with Deriv Alerts
        </h1>
        <p className='text-gray-400'>
          Unlock the power of precision. Get real-time trading alerts that help
          you catch every opportunity and make smarter moves with confidence and
          speed.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className='flex items-center gap-3 mb-12 bg-[#13151C] border border-gray-800 rounded-full px-2 py-2'>
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-6 py-2 rounded-full font-medium ${
            billingCycle === "monthly"
              ? "bg-indigo-600 text-white"
              : "text-gray-400"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("annual")}
          className={`px-6 py-2 rounded-full font-medium flex items-center gap-2 ${
            billingCycle === "annual"
              ? "bg-indigo-600 text-white"
              : "text-gray-400"
          }`}
        >
          Annually{" "}
          <span className='text-xs text-indigo-300 bg-indigo-900 px-2 py-0.5 rounded-full'>
            Save 20%
          </span>
        </button>
      </div>

      {/* Pricing Cards */}
      <div className='w-full max-w-7xl'>
        {/* Desktop */}
        <div className='hidden md:grid grid-cols-2 lg:grid lg:grid-cols-4 gap-6'>
          {PLANS.map((plan) => {
            const isDisabled = billingCycle === "annual" && plan.id !== "12m";

            return (
              <div
                key={plan.id}
                className={`relative bg-[#13151C] border border-gray-800 rounded-2xl p-8 flex flex-col justify-between transition-all ${
                  plan.popular ? "ring-2 ring-indigo-600" : ""
                } ${
                  isDisabled
                    ? "opacity-40 pointer-events-none"
                    : "hover:border-indigo-500"
                }`}
              >
                {plan.popular && (
                  <span className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md'>
                    Popular
                  </span>
                )}

                <div>
                  <h2 className='text-xl font-semibold mb-3 text-center'>
                    {plan.title}
                  </h2>
                  <p className='text-3xl font-bold mb-6 text-center'>
                    {plan.priceLabel}
                  </p>
                  <ul className='text-gray-400 text-sm space-y-2'>
                    {plan.features.map((f, i) => (
                      <li key={i} className='flex items-start gap-2'>
                        <Check className='w-4 h-4 text-indigo-400 mt-0.5 shrink-0' />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isDisabled}
                  onClick={() => router.push(`/checkout/${plan.id}`)}
                  className={`w-full mt-8 py-3 rounded-lg font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-400 text-white"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  } ${isDisabled ? "cursor-not-allowed" : ""}`}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile */}
        <div className='md:hidden flex overflow-x-auto overflow-y-visible space-x-4 snap-x snap-mandatory px-2 py-8'>
          {PLANS.map((plan) => {
            const isDisabled = billingCycle === "annual" && plan.id !== "12m";

            return (
              <div
                key={plan.id}
                className={`relative bg-[#13151C] border border-gray-800 rounded-2xl p-8 flex flex-col justify-between min-w-[85%] snap-center transition-all ${
                  plan.popular ? "ring-2 ring-indigo-600" : ""
                } ${
                  isDisabled
                    ? "opacity-40 pointer-events-none"
                    : "hover:border-indigo-500"
                }`}
              >
                {plan.popular && (
                  <span className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md'>
                    Popular
                  </span>
                )}

                <div>
                  <h2 className='text-xl font-semibold mb-3 text-center'>
                    {plan.title}
                  </h2>
                  <p className='text-3xl font-bold mb-6 text-center'>
                    {plan.priceLabel}
                  </p>
                  <ul className='text-gray-400 text-sm space-y-2'>
                    {plan.features.map((f, i) => (
                      <li key={i} className='flex items-start gap-2'>
                        <Check className='w-4 h-4 text-indigo-400 mt-0.5 shrink-0' />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isDisabled}
                  onClick={() => router.push(`/checkout/${plan.id}`)}
                  className={`w-full mt-8 py-3 rounded-lg font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-400 text-white"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  } ${isDisabled ? "cursor-not-allowed" : ""}`}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
