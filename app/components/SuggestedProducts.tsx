"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCrad";
import { api } from "@/app/lib/axios";

export interface SuggestionProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface SuggestedProductsProps {
  excludeIds?: string[]; // IDs to exclude from suggestions
  limit?: number; // max number of suggestions
  category?: string; // optional category filter
}

export default function SuggestedProducts({
  excludeIds = [],
  limit = 4,
  category,
}: SuggestedProductsProps) {
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => setFadeIn(true), []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);

        const res = await api.get(`/products?${params.toString()}`);
        const data = res.data;

        if (data.success) {
          // Exclude products in excludeIds
          const filtered = data.data.filter(
            (p: SuggestionProduct) => !excludeIds.includes(p._id)
          );

          // Shuffle and take limited number
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          setSuggestions(shuffled.slice(0, limit));
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    fetchSuggestions();
  }, [excludeIds, limit, category]);

  if (suggestions.length === 0) return null;

  return (
    <div
      className={`max-w-7xl mx-auto mt-12 transition-opacity duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        Vous pourriez aussi aimer
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {suggestions.map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
