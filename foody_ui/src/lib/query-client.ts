import { QueryClient } from "@tanstack/react-query";
import { StaleTime } from "../utils/constants";

// Create a new QueryClient instance with custom configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long to cache data before considering it stale
      staleTime: StaleTime.Medium, // 5 minutes

      // How long to keep data in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)

      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,

      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});
