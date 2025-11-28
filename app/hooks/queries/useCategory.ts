/**
 * Category Query Hooks
 * Handles all category-related data fetching
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import { queryKeys } from "@/app/lib/api/queryKeys";
import { handleAxiosError } from "@/app/lib/api/errors";
import type { Category } from "@/app/lib/api/types";

/**
 * Fetch all categories
 */
export function useGetCategories(): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      try {
        const response = await api.get(ENDPOINTS.CATEGORIES.LIST);
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch a single category by ID
 */
export function useGetCategoryById(
  categoryId: string
): UseQueryResult<Category, Error> {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId),
    queryFn: async () => {
      try {
        const response = await api.get(ENDPOINTS.CATEGORIES.DETAIL(categoryId));
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
}
