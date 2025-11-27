"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Query Client Configuration
 * Centralized setup for TanStack Query with sensible defaults
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * How long data is fresh before staleTime is applied per query
       * Individual queries can override this
       */
      staleTime: 1000 * 60 * 5, // 5 minutes

      /**
       * How long inactive queries remain in cache
       * Individual queries can override this
       */
      gcTime: 1000 * 60 * 10, // 10 minutes

      /**
       * Number of times to retry on error
       * Individual queries can override this
       */
      retry: 3,

      /**
       * Exponential backoff for retries
       */
      retryDelay: (attemptIndex) =>
        Math.min(1000 * Math.pow(2, attemptIndex), 30000),

      /**
       * Don't refetch when user returns to window
       * Individual queries can override this
       */
      refetchOnWindowFocus: false,

      /**
       * Don't refetch on mount if data is fresh
       */
      refetchOnMount: false,

      /**
       * Don't refetch on reconnect if data is fresh
       */
      refetchOnReconnect: false,
    },
    mutations: {
      /**
       * Number of times to retry failed mutations
       */
      retry: 1,

      /**
       * Exponential backoff for mutation retries
       */
      retryDelay: (attemptIndex) =>
        Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    },
  },
});

/**
 * Query Provider Component
 * Wraps your app with TanStack Query configuration and devtools
 */
interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;
export { queryClient };
