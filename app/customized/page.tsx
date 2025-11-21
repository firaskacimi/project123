"use client";

import { useState } from "react";
import { Cpu, HardDrive, Monitor, Zap, Settings } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import useCart from "@/app/hooks/useCart";

const CATEGORY_CONFIG = [
  { category: "Processor", categoryId: "691a59cda0fe008fd919143e", icon: Cpu },
  { category: "Graphics Card", categoryId: "690a3bcb26ebf05ce130b927", icon: Monitor },
  { category: "Memory", categoryId: "691a59a9a0fe008fd9191432", icon: HardDrive },
  { category: "Storage", categoryId: "691a59b0a0fe008fd9191435", icon: HardDrive },
  { category: "Motherboard", categoryId: "691a59a3a0fe008fd919142f", icon: Cpu },
  { category: "Cooling", categoryId: "691a59cda0fe008fd919143e", icon: Monitor },
  { category: "Power Supply", categoryId: "691a59b5a0fe008fd9191438", icon: HardDrive },
  { category: "PC Case", categoryId: "691a59c3a0fe008fd919143b", icon: HardDrive },
];

const CASE_PSU_PRICE = 200;

export default function PCCustomizer() {
  const { addToCart } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(CATEGORY_CONFIG.map(() => false));
  const [selections, setSelections] = useState<any[]>(CATEGORY_CONFIG.map(() => null));

  const queries = useQueries({
    queries: CATEGORY_CONFIG.map((cat) => ({
      queryKey: ["category-products", cat.categoryId],
      queryFn: async () => {
        const res = await api.get(`/categories/${cat.categoryId}/products`);
        return res.data?.data || [];
      },
    })),
  });

  const handleSelectProduct = (catIdx: number, product: any) => {
    setSelections((prev) => prev.map((sel, idx) => (idx === catIdx ? product : sel)));
    setDropdownOpen((prev) => prev.map((open, idx) => (idx === catIdx ? false : open)));
  };

  const handleToggleDropdown = (catIdx: number) => {
    setDropdownOpen((prev) => prev.map((open, idx) => (idx === catIdx ? !open : false)));
  };

  const totalPrice = selections.reduce((sum, p) => sum + (p?.price || 0), 0) + CASE_PSU_PRICE;
  const customPC = {
    _id: "custom-pc",
    name: "Custom Gaming PC",
    components: selections.map((prod, idx) => ({
      category: CATEGORY_CONFIG[idx].category,
      productId: prod?._id,
      name: prod?.name,
      price: prod?.price,
    })),
    price: totalPrice,
    quantity: 1,
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
            Build the perfect gaming machine tailored to your needs and budget
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Component Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Select Components</h3>
              <div className="inline-flex items-center px-3 py-1 border border-blue-500 text-blue-500 rounded-full text-sm">
                <Settings className="h-4 w-4 mr-1" />
                Performance Optimized
              </div>
            </div>

            {CATEGORY_CONFIG.map((cat, catIdx) => {
              const IconComponent = cat.icon;
              const selected = selections[catIdx];
              const { data: products = [], isLoading } = queries[catIdx];

              return (
                <div
                  key={cat.category}
                  className="border border-gray-700 rounded-xl bg-gray-800 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-700">
                        <IconComponent className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{cat.category}</h4>
                        <p className="text-gray-400">
                          {selected ? selected.name : "No selection"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right relative">
                      <div className="text-2xl font-bold">${selected?.price || 0}</div>
                      <button
                        className="mt-2 px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 text-sm"
                        onClick={() => handleToggleDropdown(catIdx)}
                      >
                        Change
                      </button>

                      {dropdownOpen[catIdx] && (
                        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                          {isLoading ? (
                            <div className="p-4 text-center text-gray-400">Loading...</div>
                          ) : products.length === 0 ? (
                            <div className="p-4 text-center text-gray-400">No products found.</div>
                          ) : (
                            <div className="max-h-64 overflow-y-auto">
                              {products.map((prod: any) => (
                                <button
                                  key={prod._id}
                                  className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-700 ${
                                    selected?._id === prod._id ? "bg-gray-700 font-bold" : ""
                                  }`}
                                  onClick={() => handleSelectProduct(catIdx, prod)}
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
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Build Summary */}
          <div className="space-y-6">
            <div className="border border-gray-700 rounded-xl bg-gray-800 p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-400" />
                Build Summary
              </h3>

              <div className="space-y-4 mb-6">
                {CATEGORY_CONFIG.map((cat, idx) => (
                  <div key={cat.category} className="flex justify-between text-sm">
                    <span className="text-gray-400">{cat.category}</span>
                    <span className="font-medium">${selections[idx]?.price || 0}</span>
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

              <div className="space-y-3">
                <button
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                  onClick={() => addToCart(customPC)}
                  disabled={queries.some((q) => q.isLoading) || selections.some((sel) => !sel)}
                >
                  Add to Cart
                </button>
                <button className="w-full px-4 py-3 border border-gray-600 rounded hover:bg-gray-700 transition">
                  Save Configuration
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Estimated Performance:</span>
                    <span className="px-2 py-0.5 bg-green-500 text-white rounded-full text-xs">
                      Excellent
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Perfect for 4K gaming, streaming, and content creation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
