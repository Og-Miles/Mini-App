import React, { useState } from "react";

const plans = [
  { id: "1m", label: "1 Month", usd: 0.1 },
  { id: "3m", label: "3 Months", usd: 25 },
  { id: "6m", label: "6 Months", usd: 50 },
  { id: "1y", label: "1 Year", usd: 100 },
];

const NGN_RATE = 1470;

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [showNaira, setShowNaira] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Crypto Payment (NOWPayments)
  async function payCrypto() {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/pay/crypto`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan.id,
          usd: selectedPlan.usd,
        }),
      }
    );
    const { url } = await res.json();
    window.location.href = url;
  }

  // 🔹 NGN Payment (Kora)
  async function payKora() {
    setLoading(true);
    const ngnAmount = selectedPlan.usd * NGN_RATE;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pay/kora`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: selectedPlan.id,
        usd: selectedPlan.usd,
        ngn: ngnAmount,
      }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div className='flex flex-col items-center p-6 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>💎 Subscription Plans</h1>

      {/* Plan Buttons */}
      <div className='grid grid-cols-1 gap-3 w-full'>
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPlan(p)}
            className={`p-4 border rounded-lg ${
              selectedPlan.id === p.id
                ? "border-purple-600 bg-purple-100"
                : "border-gray-300"
            }`}
          >
            <p className='font-bold'>{p.label}</p>
            <p>${p.usd}</p>
          </button>
        ))}
      </div>

      <p className='mt-4 text-lg'>
        Selected: <strong>{selectedPlan.label}</strong> – ${selectedPlan.usd}
      </p>

      {/* Payment Options */}
      <div className='mt-6 flex flex-col gap-4 w-full'>
        <button
          onClick={payCrypto}
          disabled={loading}
          className='bg-purple-600 text-white px-6 py-3 rounded-lg'
        >
          💰 Pay with Crypto (NOWPayments)
        </button>

        <button
          onClick={() => setShowNaira(true)}
          disabled={loading}
          className='bg-green-600 text-white px-6 py-3 rounded-lg'
        >
          💳 Pay with Card / Bank / USSD (Kora)
        </button>
      </div>

      {/* NGN Modal */}
      {showNaira && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center'>
          <div className='bg-white rounded-xl p-6 max-w-sm text-center'>
            <h2 className='text-xl font-semibold mb-2'>Pay in Naira</h2>
            <p className='mb-4'>
              {selectedPlan.label} costs{" "}
              <strong>₦{(selectedPlan.usd * NGN_RATE).toLocaleString()}</strong>
            </p>
            <div className='flex justify-center gap-3'>
              <button
                onClick={() => setShowNaira(false)}
                className='bg-gray-400 px-4 py-2 rounded-lg text-white'
              >
                Cancel
              </button>
              <button
                onClick={payKora}
                className='bg-green-600 px-4 py-2 rounded-lg text-white'
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
