# ADR 002: TanStack Query for Server State Management

## Status

**Accepted**

## Context

The Redstick Ventures Command Center needs robust state management for:

- Fetching and caching data from the database
- Synchronizing server state with the UI
- Handling loading, error, and success states
- Optimistic updates for better user experience
- Background refetching and cache invalidation

We need to decide how to manage server state and whether to use a dedicated library or built-in React patterns.

## Decision

We will use **TanStack Query (React Query)** for server state management.

## Consequences

### Positive

- **Automatic Caching**: Intelligent caching with configurable stale time and garbage collection
- **Background Updates**: Refetches data in background when window regains focus or network reconnects
- **Request Deduplication**: Identical concurrent requests are automatically merged
- **Optimistic Updates**: UI updates immediately while request is in flight
- **Pagination & Infinite Scroll**: Built-in support for complex list operations
- **Devtools**: Excellent browser extension for debugging cache and queries
- **TypeScript**: First-class TypeScript support with type inference
- **Small Bundle**: ~12kb gzipped, tree-shakeable

### Negative

- **Learning Curve**: New concepts (query keys, stale time, gc time) to learn
- **Additional Dependency**: Adds to bundle size and project complexity
- **Query Key Management**: Requires discipline to maintain consistent query keys
- **Overkill for Simple Cases**: Might be unnecessary for apps with minimal server state

### Neutral

- **API Style**: Hook-based API fits well with React patterns
- **Server Component Integration**: Works alongside React Server Components (for client components)

## Alternatives Considered

### 1. React Context + useEffect + useState

**Pros:**
- No additional dependencies
- Full control over implementation
- Built into React

**Cons:**
- Manual caching implementation
- No background refetching
- No automatic deduplication
- More boilerplate code
- Easy to introduce bugs (race conditions, memory leaks)

**Verdict**: Rejected - Reinventing the wheel when TanStack Query solves these problems expertly.

### 2. Redux Toolkit + RTK Query

**Pros:**
- Mature ecosystem
- Centralized state management
- RTK Query provides similar caching features
- Excellent DevTools

**Cons:**
- More boilerplate than TanStack Query
- Redux adds complexity for primarily server state
- Larger bundle size
- Overkill for our use case (no complex client state)

**Verdict**: Rejected - Redux is better suited for complex client state; TanStack Query is purpose-built for server state.

### 3. SWR (stale-while-revalidate)

**Pros:**
- Similar feature set to TanStack Query
- Smaller bundle size (~6kb)
- Created by Vercel, good Next.js integration
- Simpler API

**Cons:**
- Less feature-rich (no mutation caching, limited optimistic updates)
- Smaller community
- Fewer plugins and integrations
- Less active development

**Verdict**: Rejected - TanStack Query's feature set and ecosystem are more comprehensive.

### 4. Apollo Client

**Pros:**
- Excellent GraphQL support
- Caching and state management combined
- Rich ecosystem

**Cons:**
- Requires GraphQL (we're using REST/Server Actions)
- Large bundle size (~30kb+)
- Overkill for non-GraphQL APIs
- Complex cache configuration

**Verdict**: Rejected - We are not using GraphQL, making Apollo unnecessary.

### 5. Zustand + Async Logic

**Pros:**
- Lightweight state management
- Simple API
- Good for client state

**Cons:**
- No built-in server state features
- Would need to implement caching, deduplication manually
- Better suited for client state only

**Verdict**: Rejected - Zustand is great for client state but doesn't solve server state problems.

## Implementation Notes

### Provider Setup

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Query Key Strategy

```ts
// Consistent query key hierarchy
const queryKeys = {
  deals: ['deals'] as const,
  deal: (id: string) => ['deals', id] as const,
  dealsByStage: (stage: string) => ['deals', { stage }] as const,
  portfolio: (fundId?: string) => ['portfolio', fundId] as const,
  lpReports: (lpId: string) => ['lp', lpId, 'reports'] as const,
};
```

### Usage Pattern

```tsx
// hooks/use-deals.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeals(filters?: DealFilters) {
  return useQuery({
    queryKey: ['deals', filters],
    queryFn: () => fetchDeals(filters),
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateDeal,
    onSuccess: (data, variables) => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: ['deals', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
    // Optimistic update
    onMutate: async (newDeal) => {
      await queryClient.cancelQueries({ queryKey: ['deals', newDeal.id] });
      const previousDeal = queryClient.getQueryData(['deals', newDeal.id]);
      queryClient.setQueryData(['deals', newDeal.id], newDeal);
      return { previousDeal };
    },
    onError: (err, newDeal, context) => {
      queryClient.setQueryData(['deals', newDeal.id], context?.previousDeal);
    },
  });
}
```

### Prefetching Pattern

```tsx
// Prefetch on server or hover
const queryClient = getQueryClient();

// In Server Component
await queryClient.prefetchQuery({
  queryKey: ['deals'],
  queryFn: fetchDeals,
});

// Or on user interaction
<button
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: ['deal', id],
      queryFn: () => fetchDeal(id),
    });
  }}
>
  View Deal
</button>
```

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query vs Redux](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state)
- [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)

## Date

2024-01-15

## Authors

- Architecture Team
