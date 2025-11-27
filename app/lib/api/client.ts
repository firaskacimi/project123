"use client";

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * API Client Configuration
 * Handles base URL, interceptors, retry logic, and authentication
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Create and configure the Axios instance
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/**
 * Request Interceptor
 * Adds authentication token to all requests
 */
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
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
 * Set Authorization Token
 * Call after login to add token to all requests
 */
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }
}

/**
 * Clear Authorization Token
 * Call on logout
 */
export function clearAuthToken() {
  delete apiClient.defaults.headers.common["Authorization"];
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export default apiClient;
