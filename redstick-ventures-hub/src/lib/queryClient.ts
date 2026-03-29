import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Utility functions for cache management
export function invalidateQueries(queryKey: string[]) {
  return queryClient.invalidateQueries({ queryKey });
}

export function prefetchQuery(queryKey: string[], queryFn: () => Promise<any>) {
  return queryClient.prefetchQuery({ queryKey, queryFn });
}

export function clearCache() {
  return queryClient.clear();
}

export function setQueryData<T>(queryKey: string[], data: T) {
  return queryClient.setQueryData(queryKey, data);
}
