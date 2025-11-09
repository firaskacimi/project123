"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "../hooks/useOrders";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingForm {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  paymentMethod: "cash" | "card";
}

export default function CheckoutPage() {
  const router = useRouter();
  const createOrder = useCreateOrder();

  // Load cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(updatedCart);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const [formData, setFormData] = useState<ShippingForm>({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    paymentMethod: "cash",
  });

  // Update form input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Total cart price
  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  // Submit order
  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      const orderData = {
        products: cart.map((c) => ({
          productId: c.productId,
          quantity: c.quantity,
        })),
        shipping: formData,
        paymentMethod: formData.paymentMethod,
        user: localStorage.getItem("userId") || "", // or your logged-in user ID
      };

      const res = await createOrder.mutateAsync(orderData);
      toast.success("Order placed successfully!");

      // Clear cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      // Redirect to order details page
      router.push(`/order/${res.data._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    }
  };

  // If cart empty
  if (cart.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty 🛒</h1>
        <a
          href="/products"
          className="text-cyan-400 hover:text-purple-400 transition"
        >
          ← Continue Shopping
        </a>
      </div>
    );

  return (
    <section className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Cart items */}
        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 bg-[#0f172a] p-4 rounded-lg border border-cyan-800"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-purple-400">
                  {item.name}
                </h2>
                <p className="text-gray-300">
                  {item.quantity} × {item.price.toFixed(2)} €
                </p>
              </div>
              <p className="font-semibold text-white">
                {(item.quantity * item.price).toFixed(2)} €
              </p>
            </div>
          ))}

          <div className="mt-4 text-right text-xl font-bold text-purple-400">
            Total: {total.toFixed(2)} €
          </div>
        </div>

        {/* Right: Shipping & payment */}
        <div className="flex flex-col gap-4">
          {[
            "fullName",
            "address",
            "city",
            "postalCode",
            "country",
            "phone",
          ].map((field) => (
            <input
              key={field}
              name={field}
              value={formData[field as keyof ShippingForm]}
              onChange={handleChange}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              className="w-full border p-3 rounded-lg bg-[#111827] text-white placeholder-gray-400"
            />
          ))}

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg bg-[#111827] text-white"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={createOrder.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {createOrder.isPending ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </section>
  );
}
