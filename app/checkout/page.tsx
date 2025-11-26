"use client";

import { useState, useEffect } from "react";
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
  const [paymentToken, setPaymentToken] = useState<string | null>(null);

  // NEW
  const [deliveryType, setDeliveryType] = useState<"domicile" | "bureau" | "shop">("domicile");
  const [wilaya, setWilaya] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);

  const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

  const products = (cart || []).map((item: CartItem) => ({
    productId: item._id,
    quantity: item.quantity
  }));

  const subtotal = (cart || []).reduce(
    (acc: number, i: CartItem) => acc + (i.price || 0) * i.quantity,
    0
  );

  const total = subtotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  /** 🔥 Fetch delivery fee from backend */
  const fetchDeliveryFee = async () => {
    if (!wilaya || !deliveryType) return;

    try {
      const res = await fetch("/api/delivery-fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wilaya, deliveryType })
      });

      const data = await res.json();
      if (data.success) setDeliveryFee(data.fee);
      else setDeliveryFee(0);
    } catch (err) {
      console.error(err);
      setDeliveryFee(0);
    }
  };

  // Update fee when wilaya or deliveryType changes
  useEffect(() => {
    fetchDeliveryFee();
  }, [wilaya, deliveryType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    if (products.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    if (deliveryType !== "shop" && !wilaya) {
      toast.error("Please select your wilaya.");
      return;
    }

    const payload: any = {
      products,
      shipping,
      paymentMethod,
      user: user._id,
      deliveryType,
      wilaya,
    };

    if (paymentMethod === "card" && !paymentToken) {
      toast.error("Create payment token first.");
      return;
    }

    if (paymentMethod === "card") {
      payload.paymentToken = paymentToken;
    }

    createOrder.mutate(payload, {
      onSuccess: () => {
        toast.success("Order created successfully.");
        clearCart();
        router.push(`/orders`);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Order failed";
        toast.error(msg);
      },
    });
  };

  const isPlacing =
    (createOrder as any)?.isLoading ||
    (createOrder as any)?.status === "loading";

  return (
    <div className="min-h-screen p-6 flex items-start justify-center bg-neutral-950 text-white">
      <div className="w-full max-w-3xl bg-[#0b0e17] rounded-xl p-6 border border-gray-800">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SHIPPING */}
          <h2 className="font-semibold mb-2">Shipping</h2>
          <input name="fullName" value={shipping.fullName} onChange={handleChange} placeholder="Full name" className="w-full p-3 rounded bg-neutral-900" />
          <input name="address" value={shipping.address} onChange={handleChange} placeholder="Address" className="w-full p-3 rounded bg-neutral-900" />
          <div className="grid grid-cols-2 gap-2">
            <input name="city" value={shipping.city} onChange={handleChange} placeholder="City" className="p-3 rounded bg-neutral-900" />
            <input name="postalCode" value={shipping.postalCode} onChange={handleChange} placeholder="Postal code" className="p-3 rounded bg-neutral-900" />
          </div>
          <input name="country" value={shipping.country} onChange={handleChange} placeholder="Country" className="w-full p-3 rounded bg-neutral-900" />
          <input name="phone" value={shipping.phone} onChange={handleChange} placeholder="Phone" className="w-full p-3 rounded bg-neutral-900" />

          {/* DELIVERY TYPE */}
          <h3 className="font-semibold mt-4">Delivery Type</h3>
          <select
            className="w-full p-3 bg-neutral-900 rounded"
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value as any)}
          >
            <option value="domicile">Home Delivery</option>
            <option value="bureau">Office Delivery</option>
            <option value="shop">Pickup (Free)</option>
          </select>

          {/* WILAYA */}
          {deliveryType !== "shop" && (
            <>
              <h3 className="font-semibold">Wilaya</h3>
              <select
                className="w-full p-3 bg-neutral-900 rounded"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
              >
                <option value="">Select wilaya...</option>
                {Array.from({ length: 58 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Wilaya {i + 1}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* PAYMENT */}
          <h3 className="font-semibold mt-4">Payment</h3>
          <label className="inline-flex items-center mr-4 mt-2">
            <input type="radio" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
            <span className="ml-2">Cash</span>
          </label>
          <label className="inline-flex items-center mr-4 mt-2">
            <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
            <span className="ml-2">Card (simulated)</span>
          </label>

          {paymentMethod === "card" && (
            <PaymentPlaceholder onToken={(t) => setPaymentToken(t)} />
          )}

          {/* TOTAL */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Subtotal</div>
              <div className="font-semibold">{subtotal.toFixed(2)} DA</div>

              <div className="text-sm text-gray-400 mt-2">Delivery Fee</div>
              <div className="font-semibold">{deliveryFee} DA</div>

              <div className="text-sm text-gray-400 mt-2">Total</div>
              <div className="font-semibold text-lg">{total} DA</div>
            </div>

            <button type="submit" disabled={!!isPlacing} className="bg-cyan-500 px-5 py-2 rounded font-semibold text-black">
              {isPlacing ? "Placing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
