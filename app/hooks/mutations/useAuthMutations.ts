/**
 * Auth Mutation Hooks
 * Handles login, register, and logout
 */

import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { apiClient, setAuthToken, clearAuthToken } from "@/app/lib/api/client";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import { queryKeys } from "@/app/lib/api/queryKeys";
import { handleAxiosError } from "@/app/lib/api/errors";
import type { User, LoginRequest, LoginResponse, RegisterRequest } from "@/app/lib/api/types";

/**
 * Login mutation
 */
export function useLogin(): UseMutationResult<
  LoginResponse,
  Error,
  LoginRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginData: LoginRequest) => {
      try {
        const response = await apiClient.post(
          ENDPOINTS.AUTH.LOGIN,
          loginData
        );
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: (data) => {
      // Set token in localStorage and API headers
      setAuthToken(data.token);
      // Cache user data
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
    retry: 1,
  });
}

/**
 * Register mutation
 */
export function useRegister(): UseMutationResult<
  LoginResponse,
  Error,
  RegisterRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registerData: RegisterRequest) => {
      try {
        const response = await apiClient.post(
          ENDPOINTS.AUTH.REGISTER,
          registerData
        );
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: (data) => {
      // Set token in localStorage and API headers
      setAuthToken(data.token);
      // Cache user data
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
    retry: 1,
  });
}

/**
 * Logout mutation
 */
export function useLogout(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: () => {
      // Clear token
      clearAuthToken();
      // Clear cache
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      queryClient.removeQueries({ queryKey: queryKeys.users.all });
    },
  });
}

/**
 * Update user profile mutation
 */
export function useUpdateProfile(): UseMutationResult<
  User,
  Error,
  Partial<User>
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      try {
        const response = await apiClient.put(
          ENDPOINTS.USERS.UPDATE,
          profileData
        );
        return response.data.data;
      } catch (error) {
        throw handleAxiosError(error);
      }
    },
    onSuccess: (updatedUser) => {
      // Update cache
      queryClient.setQueryData(queryKeys.auth.me(), updatedUser);
      queryClient.setQueryData(
        queryKeys.users.detail(updatedUser._id),
        updatedUser
      );
    },
    retry: 1,
  });
}
