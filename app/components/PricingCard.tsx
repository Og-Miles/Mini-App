"use client";
import React from "react";

type Feature = { title: string; value: string };
type Plan = {
  id: string;
  title: string;
  amount: number;
  priceLabel: string;
  fee: string;
  features: Feature[];
};

export default function PricingCard({
  plan,
  onGetPlan,
}: {
  plan: Plan;
  onGetPlan: (id: string) => void;
}) {
  return (
    <div className='card p-6 rounded-2xl'>
      <div className='text-center'>
        <div className='text-sm uppercase text-gray-300'>{plan.title}</div>
        <div className='text-4xl font-extrabold mt-2 mb-4'>
          ${plan.priceLabel}
        </div>
        <button
          onClick={() => onGetPlan(plan.id)}
          className='w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-lg'
        >
          Get Plan
        </button>
        <div className='text-sm text-gray-300 mt-3'>Fee: ${plan.fee}</div>
      </div>

      <div className='mt-6 space-y-3'>
        {plan.features.map((f, idx) => (
          <div key={idx} className='flex items-start gap-3'>
            <div className='min-w-[38px] text-center text-indigo-300'>i</div>
            <div>
              <div className='font-medium'>{f.title}</div>
              <div className='text-sm text-gray-300'>{f.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
