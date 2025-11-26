"use client";

import { useUserOrders } from "../hooks/useOrders";
import { useState } from "react";

export default function OrdersPage() {
  const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

  const { data: orders, isLoading } = useUserOrders(user?._id);
  const [openOrder, setOpenOrder] = useState<any | null>(null);

  // Map status to badge color
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    processing: "bg-yellow-500",
    assembling: "bg-purple-500",
    shipped: "bg-indigo-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Please log in to view your orders.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading orders...</p>
      </div>
    );
  }

  // ✅ Sort by newest first
  const sortedOrders = orders
    ? [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <div className="min-h-screen mt-12 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>

        {sortedOrders.length === 0 ? (
          <p className="text-gray-400">You have no orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {sortedOrders.map((o: any) => (
              <li key={o._id} className="bg-[#0b0e17] p-4 rounded border border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">

                    {/* ID and Status badge inline */}
                    <div className="flex items-center gap-2 font-semibold">
                      <span>Order #{o._id}</span>
                      <span className={`text-white px-2 py-1 rounded ${statusColors[o.status]}`}>
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-400">
                      Placed: {new Date(o.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Total: {o.totalPrice} €</div>
                  </div>

                  <div>
                    <button
                      onClick={() => setOpenOrder(openOrder?._id === o._id ? null : o)}
                      className="bg-cyan-500 px-3 py-2 rounded text-black font-semibold"
                    >
                      {openOrder?._id === o._id ? "Hide Details" : "Details"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Smooth Popup */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity duration-300 ${
            openOrder ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`bg-gray-900 rounded-2xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative transform transition-all duration-300 ${
              openOrder ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {openOrder && (
              <>
                <button
                  onClick={() => setOpenOrder(null)}
                  className="absolute top-4 right-4 text-white text-xl font-bold hover:text-gray-300 transition"
                >
                  ×
                </button>

                <h2 className="text-2xl font-bold mb-4">Order #{openOrder._id}</h2>

                {/* Shipping Info */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Shipping Info</h3>
                  <p><span className="font-semibold">Name:</span> {openOrder.shipping.fullName}</p>
                  <p>
                    <span className="font-semibold">Address:</span> 
                    {openOrder.shipping.address}, {openOrder.shipping.city}, {openOrder.shipping.country}
                  </p>
                  {openOrder.shipping.postalCode && (
                    <p><span className="font-semibold">Postal Code:</span> {openOrder.shipping.postalCode}</p>
                  )}
                  <p><span className="font-semibold">Phone:</span> {openOrder.shipping.phone}</p>
                  <p><span className="font-semibold">Total:</span> {openOrder.totalPrice} €</p>
                  <p className="text-sm mt-2">
                    <span className={`text-white px-2 py-1 rounded ${statusColors[openOrder.status]}`}>
                      {openOrder.status.charAt(0).toUpperCase() + openOrder.status.slice(1)}
                    </span>
                  </p>
                </div>

                {/* Products */}
                <h3 className="font-semibold mb-2">Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {openOrder.products.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-800 p-3 rounded-lg flex flex-col items-center shadow hover:shadow-lg transition transform hover:scale-105"
                    >
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded mb-2"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-700 flex items-center justify-center rounded mb-2 text-gray-400 text-xs">
                          No Image
                        </div>
                      )}

                      <span className="text-sm font-semibold text-center">
                        {item.product?.name || "Unnamed"}
                      </span>
                      <span className="text-gray-400 text-xs">Qty: {item.quantity}</span>

                      {item.product?.stockQuantity !== undefined && (
                        <span
                          className={`text-xs mt-1 ${
                            item.product.stockQuantity <= 5 ? "text-red-500" : "text-gray-400"
                          }`}
                        >
                          Stock: {item.product.stockQuantity}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
