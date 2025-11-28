"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetailsCard from "@/app/components/ProductDetailsCard";
import SuggestedProducts from "@/app/components/SuggestedProducts";
import { Product } from "@/app/utils/types";
import { api } from "@/app/lib/axios";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;
  const [added, setAdded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => setFadeIn(true), []);

  // Fetch product
  const { data: product, error, isLoading, isError } = useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID missing");

      const res = await api.get(`/products/${productId}`);
      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Erreur lors du chargement du produit");
      }
      return data.data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60, // 1 minute
  });

  // Add to cart
  const addToCart = () => {
    if (!product) return;

    const normalizedId = product._id;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item._id === normalizedId);

    if (existing) existing.quantity += 1;
    else cart.push({ ...product, _id: normalizedId, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Loading state
  if (isLoading)
    return (
      <div
        className={`flex items-center justify-center h-screen text-white text-2xl transition-all duration-1000 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        Chargement du produit...
      </div>
    );

  // Error state
  if (isError)
    return (
      <div className="flex items-center justify-center h-screen text-red-400 text-2xl">
        Erreur : {error?.message}
      </div>
    );

  // Product not found
  if (!product)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400 text-2xl">
        Produit introuvable
        <button
          onClick={() => router.push("/products")}
          className="mt-4 text-cyan-400 hover:text-purple-400 transition-colors"
        >
          ← Retour aux produits
        </button>
      </div>
    );

  return (
    <div
      className={`min-h-screen text-white pt-24 px-6 md:px-12 transition-all duration-2000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Main Product */}
      <ProductDetailsCard
        name={product.name!}
        description={product.description}
        {...("details" in product ? { details: (product as any).details } : {})}
        price={product.price!}
        stockQuantity={product.stockQuantity ?? 0}
        image={product.image}
        onAddToCart={addToCart}
        added={added}
      />

      {/* Suggested Products */}
      <SuggestedProducts
        excludeIds={(() => {
          try {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            return Array.isArray(cart) ? cart.map((item: any) => item._id) : [];
          } catch {
            return [];
          }
        })()}
        limit={4}
      />
    </div>
  );
}
