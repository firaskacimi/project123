"use client";

import { useEffect } from "react";
import { useUserOrders } from "../hooks/useOrders";

export default function OrdersPage() {
  const userId = "672b3e20"; // Replace with logged-in user ID
  const { data: orders, isLoading } = useUserOrders(userId);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  if (isLoading) return <p className="text-center">Loading orders...</p>;

  return (
    <section className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">My Orders</h1>

      <div className="grid gap-6">
        {orders?.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-5 shadow-md hover:shadow-lg transition"
          >
            <p className="text-sm text-gray-500">
              Order ID: <span className="font-medium">{order._id}</span>
            </p>
            <p>Status: {order.status}</p>
            <p>Payment: {order.paymentStatus}</p>
            <p className="font-semibold">
              Total: ${order.totalPrice?.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
