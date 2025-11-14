"use client";

import { useEffect } from "react";
import useCart from "../hooks/useCart";
import { useUserOrders } from "../hooks/useOrders";
import Link from "next/link";

export default function OrdersPage() {
  const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

  const { data: orders, isLoading } = useUserOrders(user?._id);

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

  return (
    <div className="min-h-screen p-6 bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order history</h1>

        {(!orders || orders.length === 0) ? (
          <p className="text-gray-400">You have no orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((o: any) => (
              <li key={o._id} className="bg-[#0b0e17] p-4 rounded border border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Order #{o._id}</div>
                    <div className="text-sm text-gray-400">Placed: {new Date(o.createdAt).toLocaleString()}</div>
                    <div className="text-sm">Status: <span className="font-semibold">{o.status}</span></div>
                    <div className="text-sm text-gray-400">Total: {o.totalPrice} €</div>
                  </div>
                  <div>
                    <Link href={`/orders/${o._id}`} className="bg-cyan-500 px-3 py-2 rounded text-black font-semibold">Details</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

