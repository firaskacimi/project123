"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(items);
  }, []);

  // ✅ Update quantity
  const updateQuantity = (index: number, newQty: number) => {
    const updatedCart = [...cart];
    if (newQty <= 0) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].quantity = newQty;
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ✅ Total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white pt-28 px-6 md:px-20">
      <h1 className="text-4xl font-bold text-cyan-400 mb-10 text-center"> Votre Panier</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-400 text-xl">
          Votre panier est vide 😕
          <div className="mt-6">
            <Link
              href="/products"
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
            >
              ← Retour aux produits
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-[#111827] border border-cyan-700/40 rounded-2xl shadow-xl p-8">
          <ul className="space-y-4 mb-8">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b border-gray-700/50 pb-4"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-200">{item.name}</span>
                  <span className="text-sm text-gray-400">{item.price} €</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="bg-gray-700 hover:bg-gray-600 px-2 rounded text-white"
                  >
                    -
                  </button>
                  <span className="text-cyan-400 font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="bg-gray-700 hover:bg-gray-600 px-2 rounded text-white"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-right text-xl font-semibold text-purple-400 mb-8">
            Total : {totalPrice.toFixed(2)} €
          </div>

          <div className="flex justify-between">
            <Link
              href="/products"
              className="bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded-lg transition font-semibold"
            >
            Continuer mes achats
            </Link>

            <button
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition"
              onClick={() => alert("Fonction de paiement à venir 💳")}
            >
              Procéder au paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
