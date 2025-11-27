/**
 * API Types and Interfaces
 * Shared TypeScript types for API requests and responses
 */

/**
 * Generic API Response Format
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * Product Type
 */
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  image?: string;
  category?: Category;
  details?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Category Type
 */
export interface Category {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User Type
 */
export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Order Type
 */
export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Order Item Type
 */
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/**
 * Cart Item Type
 */
export interface CartItem {
  productId: string;
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/**
 * Login Request/Response
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * Query Filters
 */
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Type guard for PaginatedApiResponse
 */
export function isPaginatedResponse<T>(
  data: any
): data is PaginatedApiResponse<T> {
  return (
    data &&
    typeof data === "object" &&
    "pagination" in data &&
    "data" in data &&
    "success" in data
  );
}

/**
 * Type guard for ApiResponse
 */
export function isApiResponse<T>(data: any): data is ApiResponse<T> {
  return data && typeof data === "object" && "success" in data;
}
