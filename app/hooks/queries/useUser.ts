/**
 * User Query Hooks
 * Handles user profile and authentication-related queries
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api/client";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import { queryKeys } from "@/app/lib/api/queryKeys";
import { handleAxiosError } from "@/app/lib/api/errors";
import type { User } from "@/app/lib/api/types";

/**
 * Fetch current user profile
 */
export function useGetCurrentUser(): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.USERS.PROFILE);
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch user profile by ID
 */
export function useGetUserById(
  userId: string
): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.USERS.DETAIL(userId));
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
}
