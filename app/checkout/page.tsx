"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCart from "../hooks/useCart";
import type { CartItem } from "@/app/state/cartSlice";
import { useCreateOrder } from "../hooks/useOrders";
import { toast } from "sonner";
import PaymentPlaceholder from "@/app/components/PaymentPlaceholder";

// Extended type for custom PC items
type CustomCartItem = CartItem & {
  isCustom: true;
  components: {
    category: string;
    productId: string;
    name: string;
    price: number;
  }[];
};

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

  const userRaw =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

  // Regular products (non-custom)
  const products = (cart || [])
    .filter((item: CartItem | CustomCartItem) => !("isCustom" in item && item.isCustom))
    .map((item: CartItem) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

  // Custom PC payload
  const customCartItem = (cart || []).find(
    (i: CartItem | CustomCartItem) => "isCustom" in i && i.isCustom
  ) as CustomCartItem | undefined;

  const customPCPayload = customCartItem
    ? {
        name: customCartItem.name || "Custom PC",
        components: customCartItem.components.map((c) => ({
          category: c.category,
          product: c.productId,
          name: c.name,
          price: Number(c.price),
        })),
        price: Number(customCartItem.price),
      }
    : null;

  // Totals
  const subtotal = (cart || []).reduce(
    (acc: number, i: CartItem | CustomCartItem) => acc + (i.price || 0) * i.quantity,
    0
  );
  const total = subtotal; // Add shipping or taxes if needed

  // Handle shipping input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    if (products.length === 0 && !customPCPayload) {
      toast.error("Cart is empty.");
      return;
    }

    const payload: any = {
      products,
      shipping,
      paymentMethod,
      user: user._id,
    };

    if (customPCPayload) payload.customPC = customPCPayload;

    if (paymentMethod === "card") {
      if (!paymentToken) {
        toast.error("Create payment token first.");
        return;
      }
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
    (createOrder as any)?.isLoading || (createOrder as any)?.status === "loading";

  return (
    <div className="min-h-screen p-6 flex items-start justify-center bg-neutral-950 text-white">
      <div className="w-full max-w-3xl bg-[#0b0e17] rounded-xl p-6 border border-gray-800">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SHIPPING */}
          <h2 className="font-semibold mb-2">Shipping</h2>
          <input
            name="fullName"
            value={shipping.fullName}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full p-3 rounded bg-neutral-900"
          />
          <input
            name="address"
            value={shipping.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-3 rounded bg-neutral-900"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="city"
              value={shipping.city}
              onChange={handleChange}
              placeholder="City"
              className="p-3 rounded bg-neutral-900"
            />
            <input
              name="postalCode"
              value={shipping.postalCode}
              onChange={handleChange}
              placeholder="Postal code"
              className="p-3 rounded bg-neutral-900"
            />
          </div>
          <input
            name="country"
            value={shipping.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full p-3 rounded bg-neutral-900"
          />
          <input
            name="phone"
            value={shipping.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-3 rounded bg-neutral-900"
          />

          {/* PAYMENT */}
          <h3 className="font-semibold mt-4">Payment</h3>
          <label className="inline-flex items-center mr-4 mt-2">
            <input
              type="radio"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            <span className="ml-2">Cash</span>
          </label>
          <label className="inline-flex items-center mr-4 mt-2">
            <input
              type="radio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
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

              <div className="text-sm text-gray-400 mt-2">Total</div>
              <div className="font-semibold text-lg">{total.toFixed(2)} DA</div>
            </div>

            <button
              type="submit"
              disabled={!!isPlacing}
              className="bg-cyan-500 px-5 py-2 rounded font-semibold text-black"
            >
              {isPlacing ? "Placing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
