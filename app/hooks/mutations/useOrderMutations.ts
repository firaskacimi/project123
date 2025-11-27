/**
 * Order Mutation Hooks
 * Handles order creation, updates, and deletion
 */

import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api/client";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import { queryKeys } from "@/app/lib/api/queryKeys";
import { handleAxiosError } from "@/app/lib/api/errors";
import type { Order } from "@/app/lib/api/types";

/**
 * Create a new order
 */
export function useCreateOrder(): UseMutationResult<
  Order,
  Error,
  Partial<Order>
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      try {
        const response = await apiClient.post(ENDPOINTS.ORDERS.CREATE, orderData);
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: (newOrder) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      // Add to cache
      queryClient.setQueryData(
        queryKeys.orders.detail(newOrder._id),
        newOrder
      );
    },
    retry: 1,
  });
}

/**
 * Update an order
 */
export function useUpdateOrder(
  orderId: string
): UseMutationResult<Order, Error, Partial<Order>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      try {
        const response = await apiClient.put(
          ENDPOINTS.ORDERS.UPDATE(orderId),
          orderData
        );
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: (updatedOrder) => {
      // Update cache
      queryClient.setQueryData(
        queryKeys.orders.detail(orderId),
        updatedOrder
      );
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    retry: 1,
  });
}

/**
 * Delete an order
 */
export function useDeleteOrder(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      try {
        await apiClient.delete(ENDPOINTS.ORDERS.DELETE(orderId));
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: (_, orderId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.orders.detail(orderId) });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    retry: 1,
  });
}
