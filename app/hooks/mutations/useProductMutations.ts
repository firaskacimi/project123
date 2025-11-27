/**
 * Product Mutation Hooks
 * Handles product creation, updates, and deletion
 */

import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api/client";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import { queryKeys } from "@/app/lib/api/queryKeys";
import { handleAxiosError } from "@/app/lib/api/errors";
import type { Product, ApiResponse } from "@/app/lib/api/types";

/**
 * Create a new product (Admin only)
 */
export function useCreateProduct(): UseMutationResult<
  Product,
  Error,
  Partial<Product>
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      try {
        const response = await apiClient.post(
          ENDPOINTS.PRODUCTS.LIST,
          productData
        );
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: (newProduct) => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      // Add to cache
      queryClient.setQueryData(
        queryKeys.products.detail(newProduct._id),
        newProduct
      );
    },
    retry: 1,
  });
}

/**
 * Update a product (Admin only)
 */
export function useUpdateProduct(
  productId: string
): UseMutationResult<Product, Error, Partial<Product>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      try {
        const response = await apiClient.put(
          ENDPOINTS.PRODUCTS.DETAIL(productId),
          productData
        );
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: (updatedProduct) => {
      // Update cache
      queryClient.setQueryData(
        queryKeys.products.detail(productId),
        updatedProduct
      );
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    retry: 1,
  });
}

/**
 * Delete a product (Admin only)
 */
export function useDeleteProduct(): UseMutationResult<
  void,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      try {
        await apiClient.delete(ENDPOINTS.PRODUCTS.DETAIL(productId));
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: (_, productId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(productId) });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    retry: 1,
  });
}
