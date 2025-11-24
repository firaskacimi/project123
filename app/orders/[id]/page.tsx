"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";

export default function OrderDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!order) return <div className="p-6 text-white">Order not found</div>;

  return (
    <div className="min-h-screen p-6  text-white">
      <div className="max-w-3xl mx-auto  p-6 rounded border border-gray-800">
        <h1 className="text-xl font-bold mb-3">Order #{order._id}</h1>
        <div className="text-sm text-gray-400 mb-2">Status: <span className="font-semibold">{order.status}</span></div>
        <div className="mb-4">Payment status: <span className="font-semibold">{order.paymentStatus}</span></div>

        <h2 className="font-semibold mb-2">Products</h2>
        <ul className="space-y-2 mb-4">
          {order.products.map((p: any) => (
            <li key={p.product._id} className="flex justify-between">
              <div>
                <div className="font-medium">{p.product.name}</div>
                <div className="text-sm text-gray-400">qty: {p.quantity}</div>
              </div>
              <div className="font-semibold">{(p.product.price * p.quantity).toFixed(2)} €</div>
            </li>
          ))}
        </ul>

        <div className="text-right font-bold">Total: {order.totalPrice} €</div>
      </div>
    </div>
  );
}
