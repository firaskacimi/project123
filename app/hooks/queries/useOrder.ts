/**
 * Order Query Hooks
 * Handles all order-related data fetching
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import { queryKeys } from "@/app/lib/api/queryKeys";
import { handleAxiosError } from "@/app/lib/api/errors";
import type { Order, PaginatedApiResponse } from "@/app/lib/api/types";

/**
 * Fetch all user orders
 */
export function useGetOrders(
  page: number = 1,
  limit: number = 10
): UseQueryResult<PaginatedApiResponse<Order>, Error> {
  return useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: async () => {
      try {
        const response = await api.get(
          `${ENDPOINTS.ORDERS.LIST}?page=${page}&limit=${limit}`
        );
        return response.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  });
}

/**
 * Fetch a single order by ID
 */
export function useGetOrderById(
  orderId: string
): UseQueryResult<Order, Error> {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: async () => {
      try {
        const response = await api.get(ENDPOINTS.ORDERS.DETAIL(orderId));
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
