export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type Category = {
  _id: string;
  name: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  image?: string;
  category?: Category;
};

export function isPaginatedResponse<T>(
  response: unknown
): response is PaginatedResponse<T> {
  if (!response || typeof response !== "object") {
    return false;
  }

  const obj = response as Record<string, unknown>;
  const hasValidPagination =
    obj.pagination && typeof obj.pagination === "object";

  return (obj.success === true &&
    Array.isArray(obj.data) &&
    hasValidPagination) as boolean;
}

export function isApiError(response: unknown): response is ApiErrorResponse {
  if (!response || typeof response !== "object") {
    return false;
  }

  const obj = response as Record<string, unknown>;
  return obj.success === false && typeof obj.message === "string";
}