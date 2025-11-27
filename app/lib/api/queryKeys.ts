/**
 * Query Keys Factory
 * Centralized management of React Query cache keys
 * Ensures consistent cache invalidation and prevents cache misses
 */

export const queryKeys = {
  /**
   * Products queries
   */
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    byCategory: (categoryId: string) =>
      [...queryKeys.products.lists(), { category: categoryId }] as const,
    search: (query: string) =>
      [...queryKeys.products.lists(), { search: query }] as const,
  },

  /**
   * Categories queries
   */
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: () => [...queryKeys.categories.lists()] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  /**
   * Orders queries
   */
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: () => [...queryKeys.orders.lists()] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },

  /**
   * Users queries
   */
  users: {
    all: ["users"] as const,
    profile: () => [...queryKeys.users.all, "profile"] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  /**
   * Auth queries
   */
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  /**
   * Cart queries
   */
  cart: {
    all: ["cart"] as const,
    detail: () => [...queryKeys.cart.all, "detail"] as const,
  },
} as const;

export default queryKeys;
