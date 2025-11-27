"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import useCart from "@/app/hooks/useCart";
import { api } from "../lib/api";

type Category = {
  _id: string;
  name: string;
};

export default function PCCustomizer() {
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<any[][]>([]);
  const [selections, setSelections] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  // Price for fixed case + PSU
  const CASE_PSU_PRICE = 200;

  /** Fetch categories + products */
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        // Fetch categories
        const res = await api.get("/category"); 
        let cats: Category[] = res.data?.data || [];

        // Remove "Ordinateurs Complets" category
        cats = cats.filter((c) => c.name !== "Ordinateurs Complets");

        setCategories(cats);
        setSelections(Array(cats.length).fill(null));
        setDropdownOpen(Array(cats.length).fill(false));

        // Fetch products for each category
        const productGroups = await Promise.all(
          cats.map(async (cat) => {
            const r = await api.get(`/products?category=${cat._id}`); // <- hidden URL
            return r.data?.data || [];
          })
        );

        setProductsByCategory(productGroups);
      } catch (error) {
        console.error("❌ Error loading categories/products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, []);

  /** Toggle dropdown */
  const handleToggleDropdown = (catIdx: number) => {
    setDropdownOpen((prev) =>
      prev.map((open, idx) => (idx === catIdx ? !open : false))
    );
  };

  /** Select product */
  const handleSelectProduct = (catIdx: number, product: any) => {
    setSelections((prev) =>
      prev.map((sel, idx) => (idx === catIdx ? product : sel))
    );
    setDropdownOpen((prev) =>
      prev.map((open, idx) => (idx === catIdx ? false : open))
    );
  };

  /** Total price calculation */
  const totalPrice =
    selections.reduce((sum, item) => sum + (item?.price || 0), 0) +
    CASE_PSU_PRICE;

  /** Custom PC object for cart */
  const customPC = {
    _id: `custom-pc-${Date.now()}`,
    name: "Custom Gaming PC",
    image: "https://cdn-icons-png.flaticon.com/512/1048/1048942.png",
    components: selections.map((prod, idx) => ({
      category: categories[idx]?.name || "Unknown",
      productId: prod?._id || "none",
      name: prod?.name || "None selected",
      price: prod?.price || 0,
    })),
    price: totalPrice,
    quantity: 1,
    isCustom: true,
  };

  /** Add to cart */
  const handleAddToCart = () => {
    if (selections.some((sel) => !sel)) {
      alert("⚠️ Select a product for every category!");
      return;
    }

    addToCart(customPC);
    alert("✅ Custom PC added to cart!");
  };

  return (
    <section className="py-20 text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Customize Your{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-500 to-pink-500">
              Dream PC
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Build the perfect gaming machine tailored to your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Selector */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <p className="text-gray-400 text-center">
                Loading categories and products...
              </p>
            ) : (
              categories.map((cat, idx) => {
                const selected = selections[idx];
                const products = productsByCategory[idx] || [];

                return (
                  <div
                    key={cat._id}
                    className="border border-gray-700 rounded-xl bg-gray-800 p-6 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{cat.name}</h4>
                        <p className="text-gray-400">
                          {selected ? selected.name : "No selection"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          ${selected?.price || 0}
                        </div>
                        <button
                          className="mt-2 px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 text-sm"
                          onClick={() => handleToggleDropdown(idx)}
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    {/* Dropdown */}
                    {dropdownOpen[idx] && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
                        {products.length === 0 ? (
                          <div className="p-4 text-center text-gray-400">
                            No products found.
                          </div>
                        ) : (
                          products.map((prod: any) => (
                            <button
                              key={prod._id}
                              className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-700 ${
                                selected?._id === prod._id
                                  ? "bg-gray-700 font-bold"
                                  : ""
                              }`}
                              onClick={() => handleSelectProduct(idx, prod)}
                            >
                              {prod.image && (
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-10 h-10 object-cover rounded mr-2"
                                />
                              )}
                              <span className="flex-1">{prod.name}</span>
                              <span className="font-medium">${prod.price}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="border border-gray-700 rounded-xl bg-gray-800 p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-400" />
                Build Summary
              </h3>

              <div className="space-y-4 mb-6">
                {categories.map((cat, idx) => (
                  <div key={cat._id} className="flex justify-between text-sm">
                    <span className="text-gray-400">{cat.name}</span>
                    <span className="font-medium">
                      ${selections[idx]?.price || 0}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Case & PSU</span>
                  <span className="font-medium">${CASE_PSU_PRICE}</span>
                </div>

                <hr className="border-gray-700" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-400">${totalPrice}</span>
                </div>
              </div>

              <button
                className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={loading || selections.some((sel) => !sel)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
