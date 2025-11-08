"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
}

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async () => {
    if (cart.length === 0) return;

    // Simple validation for shipping fields
    for (const key in shipping) {
      if (!shipping[key as keyof ShippingInfo]) {
        alert(`Veuillez remplir le champ ${key}`);
        return;
      }
    }

    setLoading(true);
    try {
      // Replace with the token from your logged-in user
      const token = "690e3694705b25865de282d5";

      const res = await fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // IMPORTANT
        },
        body: JSON.stringify({
          products: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity || 1,
          })),
          shipping,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Merci pour votre commande !");
        setOrderStatus(data.data.status); // usually "pending"
        setCart([]);
        localStorage.removeItem("cart");
      } else {
        alert(data.message || "Erreur lors de la création de la commande");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la commande");
    } finally {
      setLoading(false);
    }
  };

  // Success page
  if (successMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white px-6">
        <h1 className="text-3xl text-purple-400 font-bold mb-4">
          {successMessage}
        </h1>
        <p className="text-gray-300 mb-4">État de votre commande : {orderStatus}</p>
        <Link
          href="/products"
          className="text-cyan-400 hover:text-purple-400 transition"
        >
          ← Continuer vos achats
        </Link>
      </div>
    );
  }

  // Checkout form
  return (
    <div className="min-h-screen text-white pt-24 px-6 md:px-12">
      <h1 className="text-3xl text-purple-400 font-bold mb-8">Finaliser la commande</h1>
      <div className="max-w-4xl mx-auto bg-[#111827] p-8 rounded-xl border border-cyan-800 flex flex-col md:flex-row gap-8">
        {/* Shipping Form */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Adresse de livraison</h2>
          {Object.entries(shipping).map(([key, value]) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value}
              onChange={handleInputChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-cyan-900/40 text-white"
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/2 bg-[#0f172a] p-6 rounded-xl border border-cyan-900/40 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-purple-400 mb-4">Résumé de la commande</h2>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>{((item.price || 0) * (item.quantity || 1)).toFixed(2)} €</span>
            </div>
          ))}
          <div className="border-t border-cyan-800 mt-2 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <button
            onClick={handleOrderSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-lg font-semibold mt-4"
          >
            {loading ? "Création de la commande..." : "Passer la commande"}
          </button>
        </div>
      </div>
    </div>
  );
}
