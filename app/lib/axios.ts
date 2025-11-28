import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/**
 * Request Interceptor
 * Adds authentication token to all requests
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add token to headers if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Dev logging
    if (process.env.NODE_ENV === "development") {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors and logs responses
 */
api.interceptors.response.use(
  (response) => {
    // Dev logging
    if (process.env.NODE_ENV === "development") {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Dev error logging
    if (process.env.NODE_ENV === "development") {
      console.error(`[API Error] ${error.response?.status} ${error.config?.url}`, error.response?.data);
    }

    return Promise.reject(error);
  }
);

/**
 * Set the Authorization header for all future requests.
 * Call this after storing token in localStorage so protected endpoints work.
 */
export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  } else {
    delete api.defaults.headers.common["Authorization"];
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }
}

export function clearAuthToken() {
  delete api.defaults.headers.common["Authorization"];
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
