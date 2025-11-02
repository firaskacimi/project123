"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
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

  const products = data || [];

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white pt-24 px-6 py-4 md:px-12">
      <h1 className="text-4xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
        Nos Produits
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-400">
          Aucun produit disponible pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              href={`/products/${product._id}`}
              key={product._id}
              className="bg-[#111827] rounded-2xl shadow-lg border border-cyan-800 hover:border-purple-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 p-6 flex flex-col"
            >
              <h2 className="text-2xl font-semibold mb-3 text-cyan-400">
                {product.name}
              </h2>
              <p className="text-gray-300 mb-4 grow">
                {product.description || "Aucune description disponible."}
              </p>
              <div className="flex items-center justify-between">
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
      )}
    </div>
  );
}
