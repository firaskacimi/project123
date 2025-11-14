"use client";

import { useState } from "react";

interface Props {
  onToken: (token: string) => void;
}

// This component is a safe placeholder for payment tokenization.
// It MUST NOT store raw card details anywhere. Instead it simulates
// tokenization and returns a payment token via `onToken`.
export default function PaymentPlaceholder({ onToken }: Props) {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [loading, setLoading] = useState(false);

  const createToken = () => {
    // Validate minimal fields (no real validation or storage)
    if (!name || cardNumber.length < 12) {
      alert("Please enter valid name and card number (test data only)");
      return;
    }

    setLoading(true);
    // Simulate token creation: use last4 and timestamp to create a pseudo-token
    const last4 = cardNumber.slice(-4);
    const token = btoa(`${last4}:${Date.now()}`);

    // DO NOT store cardNumber / cvc / expiry anywhere. Clear them immediately.
    setCardNumber("");
    setExpiry("");
    setCvc("");

    // Simulate async token return
    setTimeout(() => {
      setLoading(false);
      onToken(token);
    }, 600);
  };

  return (
    <div className="bg-neutral-900 p-4 rounded mt-3 border border-gray-800">
      <h3 className="font-semibold mb-2">Card payment (simulated)</h3>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name on card" className="w-full p-2 mb-2 rounded bg-neutral-800" />
      <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card number (test)" className="w-full p-2 mb-2 rounded bg-neutral-800" />
      <div className="flex gap-2">
        <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="p-2 rounded bg-neutral-800 flex-1" />
        <input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" className="p-2 rounded bg-neutral-800 w-24" />
      </div>

      <div className="mt-3 flex items-center justify-end">
        <button onClick={createToken} disabled={loading} className="bg-cyan-500 px-3 py-1 rounded font-semibold text-black">
          {loading ? "Tokenizing..." : "Create payment token"}
        </button>
      </div>
    </div>
  );
}
