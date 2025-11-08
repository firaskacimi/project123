"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(items);
  }, []);

  // ✅ Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // ✅ Calculate total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Remove item
  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
  };

  // ✅ Clear cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white pt-24 px-6 md:px-12">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8 border-b border-cyan-700/50 pb-3">
        Votre panier
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p>Votre panier est vide 🛒</p>
          <Link
            href="/products"
            className="mt-6 inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2 px-6 rounded-lg transition"
          >
            Parcourir les produits
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left side: Items */}
          <div className="md:col-span-2 bg-[#111827] p-6 rounded-2xl border border-cyan-700/40 shadow-lg">
            <ul className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-700/40 pb-3"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {item.price} € × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition text-sm font-semibold"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side: Summary */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-cyan-700/40 shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-cyan-400 mb-4">
                Résumé
              </h2>
              <div className="flex justify-between text-gray-300 mb-3">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-300 mb-3">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <div className="border-t border-cyan-700/50 mt-3 pt-3 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={clearCart}
                className="w-full bg-red-500 hover:bg-red-400 text-white py-2 rounded-lg transition"
              >
                Vider le panier
              </button>
              <Link
                href="/checkout"
                className="w-full text-center bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2 rounded-lg transition"
              >
                Procéder au paiement
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
