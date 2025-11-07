"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useMemo } from "react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  image?: string;
  category?: {
    _id: string;
    name: string;
  };
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:4000/products");
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Erreur lors du chargement des produits");
  }

  return data.data;
}

export default function ProductsPage() {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // ✅ Hooks at top level
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 10;

  const products = data || [];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      const price = product.price || 0;
      const aboveMin = minPrice ? price >= parseFloat(minPrice) : true;
      const belowMax = maxPrice ? price <= parseFloat(maxPrice) : true;

      return matchesSearch && aboveMin && belowMax;
    });
  }, [products, search, minPrice, maxPrice]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // ✅ Conditional rendering comes after hooks
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

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white pt-24 px-6 py-50 md:px-12">
      <h1 className="text-4xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
        Nos Produits
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4 bg-[#111827] border border-cyan-900/40 rounded-2xl p-6 flex flex-col gap-6 shadow-lg">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-cyan-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="number"
            placeholder="Prix min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-cyan-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="number"
            placeholder="Prix max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-cyan-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProducts.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              Aucun produit ne correspond à votre recherche.
            </p>
          ) : (
            paginatedProducts.map((product) => (
              <Link
                href={`/products/${product._id}`}
                key={product._id}
                className="bg-[#111827] rounded-2xl shadow-lg border border-cyan-800 hover:border-purple-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 p-6 flex flex-col"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
                <h2 className="text-2xl font-semibold mb-3 text-cyan-400">
                  {product.name}
                </h2>
                <p className="text-gray-300 mb-4 grow">
                  {product.description || "Aucune description disponible."}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-purple-400">
                    {product.price} €
                  </span>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      product.stockQuantity > 0
                        ? "bg-green-600/30 text-green-400"
                        : "bg-red-600/30 text-red-400"
                    }`}
                  >
                    {product.stockQuantity > 0 ? "En stock" : "Rupture"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-[#111827] text-gray-300 border border-cyan-800 hover:bg-purple-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
