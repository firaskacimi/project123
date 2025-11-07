"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  details?: string;
  image?: string; // Added image field
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:4000/products");
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Erreur lors du chargement des produits");
  }

  return data.data;
}

export default function ProductDetails() {
  const pathname = usePathname();
  const productId = pathname.split("/").pop();
  const [added, setAdded] = useState(false);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Chargement des produits...
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-screen text-red-400 text-2xl">
        Erreur : {(error as Error).message}
      </div>
    );

  const product = data?.find((p) => p._id === productId);

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400 text-2xl">
        Produit introuvable
        <Link
          href="/products"
          className="mt-4 text-cyan-400 hover:text-purple-400 transition-colors"
        >
          ← Retour aux produits
        </Link>
      </div>
    );

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated")); // Notify navbar
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white pt-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto bg-[#111827] rounded-2xl shadow-lg border border-cyan-800 p-8 flex flex-col md:flex-row gap-8">
        {/* Left: Image */}
        {product.image && (
          <div className="shrink-0 w-full md:w-1/3">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-xl object-cover shadow-lg"
            />
          </div>
        )}

        {/* Right: Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-cyan-400">
              {product.name}
            </h1>

            <p className="text-gray-300 mb-4">
              {product.description || "Aucune description disponible."}
            </p>

            {product.details && (
              <div className="bg-[#0f172a] border border-cyan-900/40 rounded-xl p-5 mb-6">
                <h2 className="text-xl font-semibold text-purple-400 mb-2">
                  Détails du produit
                </h2>
                <p className="text-gray-300 leading-relaxed">{product.details}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-2xl font-bold text-purple-400">
              {product.price} €
            </span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                product.stockQuantity > 0
                  ? "bg-green-600/30 text-green-400"
                  : "bg-red-600/30 text-red-400"
              }`}
            >
              {product.stockQuantity > 0 ? "En stock" : "Rupture de stock"}
            </span>
            <button
              onClick={addToCart}
              disabled={product.stockQuantity <= 0}
              className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                product.stockQuantity > 0
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-600 cursor-not-allowed text-gray-400"
              }`}
            >
              {added ? "✅ Ajouté !" : "Ajouter au panier"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
