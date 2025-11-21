"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCart from "../hooks/useCart";
import type { CartItem } from "@/app/state/cartSlice";
import { useCreateOrder } from "../hooks/useOrders";
import { toast } from "sonner";
import PaymentPlaceholder from "@/app/components/PaymentPlaceholder";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const createOrder = useCreateOrder();

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  // paymentToken is a tokenized representation of card details (simulated)
  const [paymentToken, setPaymentToken] = useState<string | null>(null);

  const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

  const products = (cart || []).map((item: CartItem) => ({ productId: item._id, quantity: item.quantity }));

  const total = (cart || []).reduce((acc: number, i: CartItem) => acc + (i.price || 0) * i.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    if (products.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Client-side validation for shipping fields
    const requiredFields: Array<{ key: keyof typeof shipping; label: string }> = [
      { key: "fullName", label: "Full name" },
      { key: "address", label: "Address" },
      { key: "city", label: "City" },
      { key: "postalCode", label: "Postal code" },
      { key: "country", label: "Country" },
      { key: "phone", label: "Phone" },
    ];

    const missing = requiredFields.filter((f) => !shipping[f.key] || shipping[f.key].trim() === "");
    if (missing.length > 0) {
      toast.error(`Please fill: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }

    const payload: any = {
      products,
      shipping,
      paymentMethod,
      user: user._id,
    };

    // If paying by card, include the tokenized payment token (never include raw card data)
    if (paymentMethod === "card") {
      if (!paymentToken) {
        toast.error("Please create a payment token before placing the order.");
        return;
      }
      payload.paymentToken = paymentToken;
    }

    createOrder.mutate(payload, {
      onSuccess: (order) => {
        toast.success("Order created successfully.");
        clearCart();
        // redirect to orders history (or detail if you prefer)
        router.push(`/orders`);
      },
      onError: (err: any) => {
        // try to show server message if available
        const msg = err?.response?.data?.message || err?.message || "Failed to create order";
        toast.error(msg);
      },
    });
  };

  // react-query mutation may not expose consistent typed helpers across versions;
  // compute a stable boolean for UI disabled/text
  const isPlacing = (createOrder as any)?.isLoading || (createOrder as any)?.status === "loading";

  return (
    <div className="min-h-screen p-6 flex items-start justify-center bg-neutral-950 text-white">
      <div className="w-full max-w-3xl bg-[#0b0e17] rounded-xl p-6 border border-gray-800">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Shipping</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="fullName" value={shipping.fullName} onChange={handleChange} placeholder="Full name" className="w-full p-3 rounded bg-neutral-900" />
            <input name="address" value={shipping.address} onChange={handleChange} placeholder="Address" className="w-full p-3 rounded bg-neutral-900" />
            <div className="grid grid-cols-2 gap-2">
              <input name="city" value={shipping.city} onChange={handleChange} placeholder="City" className="p-3 rounded bg-neutral-900" />
              <input name="postalCode" value={shipping.postalCode} onChange={handleChange} placeholder="Postal code" className="p-3 rounded bg-neutral-900" />
            </div>
            <input name="country" value={shipping.country} onChange={handleChange} placeholder="Country" className="w-full p-3 rounded bg-neutral-900" />
            <input name="phone" value={shipping.phone} onChange={handleChange} placeholder="Phone" className="w-full p-3 rounded bg-neutral-900" />

            <div>
              <h3 className="font-semibold">Payment</h3>
              <label className="inline-flex items-center mr-4 mt-2">
                <input type="radio" name="payment" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                <span className="ml-2">Cash</span>
              </label>
              <label className="inline-flex items-center mr-4 mt-2">
                <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                <span className="ml-2">Card (simulated)</span>
              </label>

              {paymentMethod === "card" && (
                <PaymentPlaceholder
                  onToken={(t) => {
                    setPaymentToken(t);
                    toast.success("Payment token created (simulated)");
                  }}
                />
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Subtotal</div>
                <div className="font-semibold">{total.toFixed(2)} €</div>
              </div>
              <button type="submit" disabled={!!isPlacing} className="bg-cyan-500 px-5 py-2 rounded font-semibold text-black">
                {isPlacing ? "Placing order..." : "Place order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
