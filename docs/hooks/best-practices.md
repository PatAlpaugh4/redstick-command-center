# Hooks Best Practices

## Naming Conventions

### Prefix with `use`

All hooks must start with `use` to enable React's ESLint rules:

```tsx
// ✅ Good
function useDeals() { }
function useLocalStorage() { }

// ❌ Bad
function deals() { }
function getDeals() { }
```

### Descriptive Names

Use names that describe what the hook does:

```tsx
// ✅ Good
function useDealsWithFilters() { }
function useDebouncedValue() { }

// ❌ Bad
function useData() { }
function useThing() { }
```

### Action-Based Names for State Mutations

Name mutation functions as actions:

```tsx
// ✅ Good
const { createDeal, updateDeal, deleteDeal } = useDeals();

// ❌ Bad
const { create, update, remove } = useDeals();
```

## Rules of Hooks

### Only Call Hooks at the Top Level

Don't call hooks inside loops, conditions, or nested functions:

```tsx
// ✅ Good
function DealCard({ dealId }: { dealId: string }) {
  const { data } = useDeal(dealId);
  const [expanded, setExpanded] = useState(false);
  
  if (!data) return null;
  return <div>{data.name}</div>;
}

// ❌ Bad
function DealCard({ dealId }: { dealId?: string }) {
  if (dealId) {
    const { data } = useDeal(dealId); // Hook inside condition!
  }
  return <div />;
}
```

### Only Call Hooks from React Functions

Call hooks from components or custom hooks only:

```tsx
// ✅ Good
function useDeals() {
  return useQuery({ queryKey: ['deals'], queryFn: fetchDeals });
}

function DealList() {
  const { data } = useDeals();
  return <div>{/* ... */}</div>;
}

// ❌ Bad
function fetchDeals() {
  const queryClient = useQueryClient(); // Hook in regular function!
  // ...
}
```

## Hook Dependencies

### Include All Dependencies

Always include all values used in the hook in the dependency array:

```tsx
// ✅ Good
useEffect(() => {
  fetchDeals(filters, page);
}, [filters, page, fetchDeals]);

// ❌ Bad - missing dependencies
useEffect(() => {
  fetchDeals(filters, page);
}, []); // Missing filters, page, fetchDeals
```

### Use ESLint Rule

Enable `react-hooks/exhaustive-deps` to catch missing dependencies:

```json
// .eslintrc.json
{
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

### Stable References

Use `useCallback` and `useMemo` for stable references:

```tsx
// ✅ Good - stable callback
const handleSubmit = useCallback((data: DealFormData) => {
  createDeal.mutate(data);
}, [createDeal]);

// ❌ Bad - new function on every render
const handleSubmit = (data: DealFormData) => {
  createDeal.mutate(data);
};

useEffect(() => {
  // This runs on every render because handleSubmit is unstable
  registerSubmitHandler(handleSubmit);
}, [handleSubmit]);
```

## State Management

### Co-Locate Related State

Keep related state together:

```tsx
// ✅ Good - single state object
const [filters, setFilters] = useState({
  stage: 'ALL',
  sector: null,
  minValue: 0,
});

// ❌ Bad - scattered state
const [stage, setStage] = useState('ALL');
const [sector, setSector] = useState(null);
const [minValue, setMinValue] = useState(0);
```

### Prefer Derived State

Compute derived values instead of storing them:

```tsx
// ✅ Good - computed
const filteredDeals = useMemo(() => {
  return deals.filter(d => 
    filters.stage === 'ALL' || d.stage === filters.stage
  );
}, [deals, filters.stage]);

// ❌ Bad - stored and manually synced
const [filteredDeals, setFilteredDeals] = useState(deals);
useEffect(() => {
  setFilteredDeals(deals.filter(d => 
    filters.stage === 'ALL' || d.stage === filters.stage
  ));
}, [deals, filters]);
```

### Lazy Initialization

Use lazy initialization for expensive initial state:

```tsx
// ✅ Good - lazy initialization
const [state, setState] = useState(() => {
  return expensiveComputation();
});

// ❌ Bad - runs on every render
const [state, setState] = useState(expensiveComputation());
```

## Data Fetching

### Loading States

Distinguish between initial loading and background fetching:

```tsx
function DealList() {
  const { data, isLoading, isFetching } = useDeals();

  // Initial load - show skeleton
  if (isLoading) {
    return <Skeleton count={5} />;
  }

  return (
    <div>
      {/* Background fetch - show subtle indicator */}
      {isFetching && <InlineSpinner />}
      
      <DealTable deals={data} />
    </div>
  );
}
```

### Error Boundaries

Always handle errors gracefully:

```tsx
function DealDashboard() {
  const { data, error, isLoading } = useDeals();

  if (isLoading) return <Skeleton />;
  
  if (error) {
    return (
      <ErrorState
        title="Failed to load deals"
        message={error.message}
        retry={() => window.location.reload()}
      />
    );
  }

  return <DealList deals={data} />;
}
```

### Cache Configuration

Configure cache behavior appropriately:

```tsx
function useDeal(dealId: string) {
  return useQuery({
    queryKey: ['deals', dealId],
    queryFn: () => fetchDeal(dealId),
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 10 minutes after unmount
    cacheTime: 10 * 60 * 1000,
    // Retry failed requests 3 times
    retry: 3,
    // Don't refetch on window focus for this data
    refetchOnWindowFocus: false,
  });
}
```

## Performance Optimization

### Memoize Expensive Computations

Use `useMemo` for expensive calculations:

```tsx
function DealAnalytics({ deals }: { deals: Deal[] }) {
  // ✅ Good - only recalculates when deals change
  const metrics = useMemo(() => {
    return deals.reduce((acc, deal) => {
      acc.total += deal.value;
      acc.byStage[deal.stage] = (acc.byStage[deal.stage] || 0) + deal.value;
      return acc;
    }, { total: 0, byStage: {} });
  }, [deals]);

  return <MetricsDisplay data={metrics} />;
}
```

### Prevent Unnecessary Re-renders

Use `useCallback` and `React.memo` appropriately:

```tsx
// ✅ Good - stable callback prevents child re-renders
const DealList = React.memo(function DealList({ deals, onSelect }: Props) {
  return (
    <div>
      {deals.map(deal => (
        <DealCard
          key={deal.id}
          deal={deal}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
});

function DealDashboard() {
  const { data } = useDeals();
  
  // Without useCallback, DealList re-renders every time
  const handleSelect = useCallback((deal: Deal) => {
    setSelectedDeal(deal);
  }, []);

  return <DealList deals={data} onSelect={handleSelect} />;
}
```

### Split Large Hooks

Break down complex hooks into smaller ones:

```tsx
// ✅ Good - separate concerns
function useDealFilters() {
  const [filters, setFilters] = useState(defaultFilters);
  const updateFilter = useCallback((key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  return { filters, updateFilter };
}

function useDealSorting() {
  const [sort, setSort] = useState<SortConfig>({ key: 'name', dir: 'asc' });
  const toggleSort = useCallback((key: string) => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  }, []);
  return { sort, toggleSort };
}

function useDealTable(deals: Deal[]) {
  const filters = useDealFilters();
  const sorting = useDealSorting();
  
  const filteredDeals = useMemo(() => {
    return deals.filter(/* filter logic */);
  }, [deals, filters.filters]);

  const sortedDeals = useMemo(() => {
    return [...filteredDeals].sort(/* sort logic */);
  }, [filteredDeals, sorting.sort]);

  return {
    deals: sortedDeals,
    filters,
    sorting,
  };
}
```

## Testing Hooks

### Test Hook Logic

Use `@testing-library/react` to test hooks:

```tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeals } from './useDeals';

// Create wrapper with providers
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useDeals', () => {
  it('fetches deals on mount', async () => {
    const { result } = renderHook(() => useDeals(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.deals).toBeDefined();
  });

  it('applies filters correctly', async () => {
    const { result } = renderHook(
      () => useDeals({ stage: 'DUE_DILIGENCE' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.deals.forEach(deal => {
      expect(deal.stage).toBe('DUE_DILIGENCE');
    });
  });
});
```

### Mock External Dependencies

Mock API calls and external services:

```tsx
import { vi } from 'vitest';

// Mock the API module
vi.mock('@/api/deals', () => ({
  fetchDeals: vi.fn().mockResolvedValue([
    { id: '1', name: 'Deal 1' },
    { id: '2', name: 'Deal 2' },
  ]),
}));

// Mock browser APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
});
```

## Accessibility

### Focus Management

Manage focus for better UX:

```tsx
function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    ref.current?.focus();
  }, []);
  
  return ref;
}

// Usage in modal
function Modal({ isOpen, onClose, children }: ModalProps) {
  const initialFocusRef = useFocusOnMount<HTMLButtonElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Trap focus within modal
  useFocusTrap(isOpen, containerRef);

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      <button ref={initialFocusRef} onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  );
}
```

### Screen Reader Announcements

Announce important changes:

```tsx
function useSaveStatus() {
  const { announce } = useAnnouncer();
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const save = useCallback(async (data: DealFormData) => {
    setStatus('saving');
    announce('Saving changes...', 'polite');
    
    try {
      await saveDeal(data);
      setStatus('saved');
      announce('Changes saved successfully', 'polite');
    } catch {
      setStatus('idle');
      announce('Failed to save changes', 'assertive');
    }
  }, [announce]);

  return { status, save };
}
```

### Reduced Motion

Respect user preferences:

```tsx
function AnimatedCard({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

## Common Pitfalls

### Stale Closures

Be aware of stale closures in async operations:

```tsx
// ❌ Bad - stale closure
function DealCounter({ deals }: { deals: Deal[] }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // Always uses initial count value
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Missing dependency, but adding it causes infinite loop

  return <div>{count}</div>;
}

// ✅ Good - use functional update
function DealCounter({ deals }: { deals: Deal[] }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1); // Uses latest value
    }, 1000);
    return () => clearInterval(interval);
  }, []); // No dependency needed

  return <div>{count}</div>;
}
```

### Memory Leaks

Clean up subscriptions and listeners:

```tsx
// ✅ Good - cleanup properly
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

### Race Conditions

Handle race conditions in async operations:

```tsx
// ✅ Good - ignore stale responses
function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function search() {
      const data = await searchApi(query);
      if (!cancelled) {
        setResults(data);
      }
    }

    search();

    return () => { cancelled = true; };
  }, [query]);

  return results;
}

// Or use AbortController for fetch requests
function useSearch(query: string) {
  const { data } = useQuery({
    queryKey: ['search', query],
    queryFn: ({ signal }) => searchApi(query, { signal }),
  });
  return data;
}
```
