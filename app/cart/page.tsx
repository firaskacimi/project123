"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useCart from "../hooks/useCart";
import type { CartItem } from "@/app/state/cartSlice";

interface SuggestionProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const [fadeIn, setFadeIn] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/products");
        const data = await res.json();

        if (res.ok && data.success) {
          const filtered = data.data.filter(
            (p: SuggestionProduct) => !cart.some((c) => c.productId === p._id)
          );

          const shuffled = filtered.sort(() => 0.5 - Math.random());
          setSuggestions(shuffled.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    fetchProducts();
  }, [cart]);

  const total = (cart || []).reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  if (!cart || cart.length === 0)
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 md:px-12">
        <h1 className="text-3xl font-bold text-gray-300 mb-4">
          Votre panier est vide 🛒
        </h1>
        <Link
          href="/products"
          className="text-cyan-400 hover:text-purple-400 transition"
        >
          ← Continuer vos achats
        </Link>
      </div>
    );

  return (
    <div
      className={`min-h-screen py-20 text-white pt-24 px-6 md:px-12 transition-all duration-2000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* MAIN CART CONTENT */}
      <div className="max-w-6xl mx-auto bg-[#111827] border border-cyan-800 rounded-2xl p-8 shadow-lg flex flex-col md:flex-row gap-8">
        
        {/* CART ITEMS */}
        <div className="flex-1 flex flex-col gap-6">
          {cart.map((item: CartItem) => (
            <div
              key={item.productId}
              className="flex flex-col md:flex-row items-center md:items-start justify-between bg-[#0f172a] border border-cyan-900/40 p-5 rounded-xl gap-4 md:gap-6"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full md:w-24 h-24 md:h-24 rounded-lg object-cover"
                />
              )}

              <div className="flex-1 flex flex-col md:flex-row items-start justify-between w-full">
                <div>
                  <h2 className="text-xl font-semibold text-purple-400">
                    {item.name}
                  </h2>
                  <p className="text-gray-300 mt-1">{item.price} €</p>
                </div>

                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <button
                    onClick={() => addToCart({ ...item, quantity: -1 })}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    −
                  </button>

                  <span className="font-semibold text-lg">{item.quantity}</span>

                  <button
                    onClick={() => addToCart({ ...item, quantity: 1 })}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-4 text-red-400 hover:text-red-500 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="w-full md:w-1/3 bg-[#0f172a] border border-cyan-900/40 rounded-xl p-6 flex flex-col gap-6 sticky top-24 h-max">
          <h2 className="text-2xl font-bold text-purple-400">Résumé</h2>

          <p className="text-gray-300 text-lg">
            Total : <span className="font-semibold">{total.toFixed(2)} €</span>
          </p>

          <Link
            href="/checkout"
            className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-lg font-semibold text-center"
          >
            Procéder au paiement
          </Link>

          <button
            onClick={clearCart}
            className="bg-red-600 hover:bg-red-500 transition px-6 py-3 rounded-lg font-semibold text-center"
          >
            Vider le panier
          </button>

          <Link
            href="/products"
            className="text-cyan-400 hover:text-purple-400 transition mt-auto text-center"
          >
            ← Continuer vos achats
          </Link>
        </div>
      </div>

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            Vous pourriez aussi aimer
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {suggestions.map((item) => (
              <Link
                key={item._id}
                href={`/products/${item._id}`}
                className="bg-[#111827] border border-cyan-800 rounded-xl p-4 flex flex-col items-center gap-3 hover:shadow-lg hover:scale-105 transition-transform"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                <h3 className="text-lg font-semibold text-purple-400 text-center">
                  {item.name}
                </h3>
                <p className="text-gray-300">{item.price} €</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
