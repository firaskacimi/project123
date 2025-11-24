"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import ProductFilters from "../components/ProductFilter";
import { isPaginatedResponse, PaginationMeta, Product } from "../utils/types";

// --- Data Fetching Function ---
async function fetchProducts(
  params: URLSearchParams
): Promise<{ products: Product[]; pagination: PaginationMeta }> {
  const queryString = params.toString();
  const url = `http://localhost:4000/products${
    queryString ? `?${queryString}` : ""
  }`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json();

  if (!isPaginatedResponse<Product>(data)) {
    throw new Error(data.message || "Erreur lors du chargement des produits");
  }

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Erreur lors du chargement des produits");
  }

  return {
    products: data.data,
    pagination: data.pagination,
  };
}

// --- Component ---
export default function ProductsPage() {
  const searchParams = useSearchParams();

  // Get query parameters
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  // Build query params for API call
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (minPrice) queryParams.append("minPrice", minPrice);
  if (maxPrice) queryParams.append("maxPrice", maxPrice);
  if (category) queryParams.append("category", category);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  // Fetch products with current filters and pagination
  const { data, error, isLoading, isError } = useQuery<
    { products: Product[]; pagination: PaginationMeta },
    Error
  >({
    queryKey: ["products", search, minPrice, maxPrice, category, page, limit],
    queryFn: () => fetchProducts(queryParams),
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation when component mounts
    const timer = setTimeout(() => setFadeIn(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const products = data?.products || [];
  const pagination = data?.pagination;

  // --- Loading and Error States ---
  if (isLoading) return <div>Loading...</div>;

  if (isError)
    return (
      <div className="flex items-center justify-center h-screen text-red-400 text-2xl">
        <div className="text-center">
          <p className="mb-2">Erreur : {(error as Error).message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );

  // --- Render ---
  return (
    <div
      className={`min-h-screen  text-white pt-24 px-6 py-50 md:px-12 transition-all duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-4xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
        Nos Produits
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <ProductFilters />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar />
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 text-lg mb-4">
                  Aucun produit ne correspond à votre recherche.
                </p>
                {(search || minPrice || maxPrice || category) && (
                  <p className="text-gray-500 text-sm">
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product: Product) => (
                  <Link
                    href={`/products/${product._id}`}
                    key={product._id}
                    className="bg-[#111827] rounded-2xl shadow-lg border border-cyan-800 hover:border-purple-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 p-6 flex flex-col"
                  >
                    {product.image && (
                      // eslint-disable-next-line @next/next/no-img-element
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
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <Pagination
                  totalPages={pagination.totalPages}
                  totalResults={pagination.totalProducts}
                  limit={pagination.limit}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
