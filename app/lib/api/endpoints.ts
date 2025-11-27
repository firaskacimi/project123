/**
 * API Endpoints Constants
 * Centralized endpoint definitions for all API routes
 */

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },

  // Products endpoints
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: "/products/search",
  },

  // Categories endpoints
  CATEGORIES: {
    LIST: "/category",
    DETAIL: (id: string) => `/category/${id}`,
  },

  // Orders endpoints
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: "/orders",
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
  },

  // User endpoints
  USERS: {
    PROFILE: "/users/profile",
    UPDATE: "/users/profile",
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
  },

  // Cart endpoints
  CART: {
    GET: "/cart",
    ADD: "/cart",
    REMOVE: "/cart/:itemId",
    UPDATE: "/cart/:itemId",
    CLEAR: "/cart",
  },

  // Payment endpoints
  PAYMENT: {
    PROCESS: "/payment",
    WEBHOOK: "/payment/webhook",
  },
} as const;

export default ENDPOINTS;
