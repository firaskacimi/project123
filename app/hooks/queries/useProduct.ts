/**
 * Product Query Hooks
 * Handles all product-related data fetching with TanStack Query
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api/client";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import { queryKeys } from "@/app/lib/api/queryKeys";
import { handleAxiosError } from "@/app/lib/api/errors";
import type { Product, PaginatedApiResponse, ProductFilters } from "@/app/lib/api/types";

/**
 * Fetch all products with optional filters and pagination
 */
export function useGetProducts(
  filters?: ProductFilters
): UseQueryResult<PaginatedApiResponse<Product>, Error> {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.search) params.append("search", filters.search);
        if (filters?.category) params.append("category", filters.category);
        if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
        if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));
        if (filters?.page) params.append("page", String(filters.page));
        if (filters?.limit) params.append("limit", String(filters.limit));
        if (filters?.sortBy) params.append("sortBy", filters.sortBy);
        if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

        const response = await apiClient.get(
          `${ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`
        );
        return response.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch a single product by ID
 */
export function useGetProductById(
  productId: string
): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.PRODUCTS.DETAIL(productId));
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}

/**
 * Fetch products by category
 */
export function useGetProductsByCategory(
  categoryId: string,
  limit: number = 12
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: queryKeys.products.byCategory(categoryId),
    queryFn: async () => {
      try {
        const response = await apiClient.get(
          `${ENDPOINTS.PRODUCTS.LIST}?category=${categoryId}&limit=${limit}`
        );
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

/**
 * Search products by query
 */
export function useSearchProducts(
  query: string,
  limit: number = 20
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: async () => {
      try {
        const response = await apiClient.get(
          `${ENDPOINTS.PRODUCTS.LIST}?search=${encodeURIComponent(query)}&limit=${limit}`
        );
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 3,
    retry: 2,
  });
}
