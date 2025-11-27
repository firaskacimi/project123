"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category, isPaginatedResponse } from "../utils/types";

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("http://localhost:4000/category");
  const data = await res.json();

  if (isPaginatedResponse<Category>(data)) {
    if (!res.ok || !data.success) throw new Error(data.message);
    return data.data;
  }

  if (!res.ok || !data.success) throw new Error(data.message);
  return Array.isArray(data.data) ? data.data : [];
}

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMinPrice = Number(searchParams.get("minPrice") || 0);
  const initialMaxPrice = Number(searchParams.get("maxPrice") || 3000); // default max
  const initialCategory = searchParams.get("category") || "";

  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  const updateFilters = (
    newMinPrice?: number,
    newMaxPrice?: number,
    newCategory?: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newMinPrice !== undefined)
      newMinPrice
        ? params.set("minPrice", String(newMinPrice))
        : params.delete("minPrice");
    if (newMaxPrice !== undefined)
      newMaxPrice
        ? params.set("maxPrice", String(newMaxPrice))
        : params.delete("maxPrice");
    if (newCategory !== undefined)
      newCategory
        ? params.set("category", newCategory)
        : params.delete("category");
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Debounce slider updates
  useEffect(() => {
    const timeout = setTimeout(
      () => updateFilters(minPrice, maxPrice, selectedCategory),
      300
    );
    return () => clearTimeout(timeout);
  }, [minPrice, maxPrice]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateFilters(minPrice, maxPrice, value);
  };

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(3000);
    setSelectedCategory("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("category");
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters =
    minPrice !== 0 || maxPrice !== 3000 || selectedCategory;

  return (
    <div className="w-full md:w-64 bg-[#111827] border border-cyan-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-cyan-400">Filtres</h3>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-xs bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 px-3 py-1 rounded transition-all"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Price Slider */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-300">
          Gamme de prix (€)
        </label>
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={0}
            max={1000}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          {/* Extremities */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>0€</span>
            <span>1000€</span>
          </div>
          <input
            type="range"
            min={0}
            max={3000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          {/* Extremities */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>0€</span>
            <span>3000€</span>
          </div>
          <div className="text-xs text-cyan-400 bg-cyan-900/20 p-1 rounded">
            {minPrice}€ - {maxPrice}€
          </div>
        </div>
      </div>

      {/* Categories as clickable buttons */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-300">Catégorie</label>
        {categoriesLoading ? (
          <div className="text-gray-400 text-sm">Chargement...</div>
        ) : (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto scrollbar-hide">
            <button
              className={`text-left p-3 rounded-lg transition-all ${
                selectedCategory === ""
                  ? "bg-cyan-700 text-white"
                  : "bg-[#0f172a] text-gray-300 hover:bg-cyan-800"
              }`}
              onClick={() => handleCategoryChange("")}
            >
              Toutes les catégories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`text-left p-3 rounded-lg transition-all ${
                  selectedCategory === cat._id
                    ? "bg-cyan-700 text-white"
                    : "bg-[#0f172a] text-gray-300 hover:bg-cyan-800"
                }`}
                onClick={() => handleCategoryChange(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-cyan-900/40">
          <p className="text-xs text-gray-400 mb-1">Filtres actifs :</p>
          <div className="flex flex-wrap gap-2">
            {minPrice !== 0 && (
              <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                Min: {minPrice}€
                <button
                  onClick={() => setMinPrice(0)}
                  className="hover:text-purple-200 ml-1"
                >
                  ✕
                </button>
              </span>
            )}
            {maxPrice !== 1000 && (
              <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                Max: {maxPrice}€
                <button
                  onClick={() => setMaxPrice(1000)}
                  className="hover:text-purple-200 ml-1"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="text-xs bg-cyan-600/30 text-cyan-300 px-2 py-1 rounded flex items-center gap-1">
                Cat:{" "}
                {categories.find((c) => c._id === selectedCategory)?.name ||
                  "Unknown"}
                <button
                  onClick={() => handleCategoryChange("")}
                  className="hover:text-cyan-200 ml-1"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
