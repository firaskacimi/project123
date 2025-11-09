"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Order } from "@/.next/types/order";
import { api } from "../lib/api";


// 🟢 Get all orders
export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/api/orders");
      return data.data;
    },
  });
};

// 🟢 Get orders for specific user
export const useUserOrders = (userId: string) => {
  return useQuery<Order[]>({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/orders/user/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
};

// 🟢 Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: Order) => {
      const { data } = await api.post("/api/orders", orderData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// 🟢 Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "processing" | "shipped" | "delivered";
    }) => {
      const { data } = await api.put(`/api/orders/${id}`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
