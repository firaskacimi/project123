/**
 * API Module Exports
 * Centralizes all API-related exports for easy importing
 */

export { api, api as default, setAuthToken, clearAuthToken } from "@/app/lib/axios";
export { ENDPOINTS } from "./endpoints";
export type {
  ApiResponse,
  PaginatedApiResponse,
  Product,
  Category,
  User,
  Order,
  OrderItem,
  CartItem,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ProductFilters,
} from "./types";
export { isPaginatedResponse, isApiResponse } from "./types";
export { queryKeys } from "./queryKeys";
export {
  ApiError,
  NetworkError,
  TimeoutError,
  ValidationError,
  getErrorMessage,
  isApiError,
  handleAxiosError,
} from "./errors";
