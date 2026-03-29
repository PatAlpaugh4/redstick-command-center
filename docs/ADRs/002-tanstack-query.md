# ADR 002: TanStack Query for Server State

## Status
Accepted

## Context
We need a solution for managing server state (data from API/database) that provides:
- Caching and cache invalidation
- Background refetching
- Optimistic updates
- Request deduplication
- Loading/error states

## Decision
We chose TanStack Query (React Query) for server state management.

## Consequences

### Positive
- Automatic caching with configurable stale time
- Background refetching keeps data fresh
- Optimistic updates for better UX
- DevTools for debugging
- Excellent TypeScript support

### Negative
- Additional dependency
- Learning curve for advanced features
- Need to understand cache keys

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Redux Toolkit Query | RTK integration, code generation | More complex setup |
| SWR | Lightweight, similar features | Smaller ecosystem |
| Apollo Client | Great for GraphQL | Overkill for REST |
| Zustand + fetch | Simple, minimal | Manual caching |
| React Context | Built-in | Poor for server state |

## Usage Pattern

```tsx
function useDeals(filters) {
  return useQuery({
    queryKey: ['deals', filters],
    queryFn: () => fetchDeals(filters),
    staleTime: 5 * 60 * 1000,
  });
}
```

## References
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query vs Redux](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state)
