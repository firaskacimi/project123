/**
 * Custom Error Types and Handlers
 * Provides structured error handling across the application
 */

/**
 * Custom API Error Class
 */
export class ApiError extends Error {
  public statusCode: number;
  public data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Network Error Class
 */
export class NetworkError extends Error {
  constructor(message: string = "Network error occurred") {
    super(message);
    this.name = "NetworkError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}

/**
 * Timeout Error Class
 */
export class TimeoutError extends Error {
  constructor(message: string = "Request timeout") {
    super(message);
    this.name = "TimeoutError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError);
    }
  }
}

/**
 * Validation Error Class
 */
export class ValidationError extends Error {
  public errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string> = {}) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    return "Network connection error. Please check your internet connection.";
  }

  if (error instanceof TimeoutError) {
    return "Request took too long. Please try again.";
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Handle axios error and convert to custom error
 */
export function handleAxiosError(error: any): ApiError | NetworkError | TimeoutError {
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return new TimeoutError("Request timeout after 30 seconds");
    }
    return new NetworkError(error.message);
  }

  const { status, data } = error.response;
  const message = data?.message || error.message || "An error occurred";

  return new ApiError(message, status, data);
}
