# Common Hook Usage Patterns

## Data Fetching Patterns

### Dependent Queries

Fetch data that depends on another query's result:

```tsx
function DealDetail({ dealId }: { dealId: string }) {
  // First query: fetch deal
  const { data: deal, isLoading: dealLoading } = useDeal(dealId);
  
  // Second query: only fetch company when deal is loaded
  const { data: company, isLoading: companyLoading } = useCompany(
    deal?.companyId,
    { enabled: !!deal?.companyId }
  );

  if (dealLoading) return <Skeleton />;
  
  return (
    <div>
      <h1>{deal.name}</h1>
      {companyLoading ? (
        <Skeleton height={20} />
      ) : (
        <p>Company: {company?.name}</p>
      )}
    </div>
  );
}
```

### Infinite Scroll

Load more data as user scrolls:

```tsx
function DealsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDeals({
    limit: 20,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (isFetchingNextPage) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const deals = data?.pages.flatMap(page => page.deals) ?? [];

  return (
    <div>
      {deals.map((deal, index) => (
        <DealCard
          key={deal.id}
          ref={index === deals.length - 1 ? lastElementRef : undefined}
          deal={deal}
        />
      ))}
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}
```

### Optimistic Updates with Rollback

Update UI immediately, rollback on error:

```tsx
function DealList() {
  const queryClient = useQueryClient();
  
  const updateDeal = useMutation({
    mutationFn: updateDealApi,
    onMutate: async (newDeal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['deals'] });
      
      // Snapshot previous value
      const previousDeals = queryClient.getQueryData(['deals']);
      
      // Optimistically update
      queryClient.setQueryData(['deals'], (old: Deal[]) =>
        old.map(d => d.id === newDeal.id ? { ...d, ...newDeal } : d)
      );
      
      // Return context for rollback
      return { previousDeals };
    },
    onError: (err, newDeal, context) => {
      // Rollback on error
      queryClient.setQueryData(['deals'], context?.previousDeals);
      toast.error('Failed to update deal');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  return (
    <DealTable
      onUpdate={(deal) => updateDeal.mutate(deal)}
    />
  );
}
```

### Polling/Real-time Updates

Poll for updates or use WebSocket:

```tsx
function LivePortfolio() {
  // Polling approach
  const { data: portfolio } = usePortfolio({
    refetchInterval: 30000, // 30 seconds
  });

  // Or with WebSocket
  const { data: liveData } = useWebSocket('/ws/portfolio', {
    onMessage: (message) => {
      queryClient.setQueryData(['portfolio'], message.data);
    },
  });

  return <PortfolioMetrics data={portfolio} />;
}
```

## UI State Patterns

### Compound Component Pattern

Build complex UI with composed hooks:

```tsx
// useDataTable hook
function useDataTable<T>(items: T[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  
  const bulk = useBulkOperations({ items, getItemId: (i) => i.id });
  
  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;
    return [...items].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      return sortConfig.direction === 'asc' 
        ? aVal > bVal ? 1 : -1 
        : aVal < bVal ? 1 : -1;
    });
  }, [items, sortConfig]);

  return {
    items: sortedItems,
    sortConfig,
    setSortConfig,
    filters,
    setFilters,
    page,
    setPage,
    bulk,
  };
}

// Usage
function DealTable({ deals }: { deals: Deal[] }) {
  const table = useDataTable(deals);

  return (
    <>
      <TableToolbar
        selectedCount={table.bulk.selectedIds.length}
        onExport={() => exportDeals(table.bulk.selectedItems)}
      />
      <DataTable
        items={table.items}
        sortConfig={table.sortConfig}
        onSort={table.setSortConfig}
      />
      <Pagination
        page={table.page}
        onPageChange={table.setPage}
      />
    </>
  );
}
```

### Form Handling Pattern

Combine form state with validation:

```tsx
function useDealForm(initialValues?: Partial<DealFormData>) {
  const [values, setValues] = useState<DealFormData>({
    name: '',
    stage: 'PROSPECT',
    value: 0,
    ...initialValues,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validate = useCallback((fieldValues: DealFormData) => {
    const newErrors: FormErrors = {};
    
    if (!fieldValues.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (fieldValues.value < 0) {
      newErrors.value = 'Value must be positive';
    }
    
    return newErrors;
  }, []);

  const setFieldValue = useCallback((field: keyof DealFormData, value: unknown) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    
    // Validate on change if field was touched
    if (touched.has(field)) {
      setErrors(validate(newValues));
    }
  }, [values, touched, validate]);

  const setFieldTouched = useCallback((field: string) => {
    setTouched(prev => new Set(prev).add(field));
    setErrors(validate(values));
  }, [values, validate]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    setFieldValue,
    setFieldTouched,
    isValid,
  };
}

// Usage
function DealForm({ onSubmit }: { onSubmit: (data: DealFormData) => void }) {
  const form = useDealForm();
  const toast = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!form.isValid) {
      toast.error('Please fix form errors');
      return;
    }
    
    onSubmit(form.values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={form.values.name}
        onChange={(e) => form.setFieldValue('name', e.target.value)}
        onBlur={() => form.setFieldTouched('name')}
        error={form.errors.name}
      />
      {/* ... */}
    </form>
  );
}
```

### Debounced Search Pattern

Search with debouncing to avoid excessive API calls:

```tsx
function useDebounceSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchFn(query);
        setResults(data);
      } finally {
        setIsSearching(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay, searchFn]);

  return { query, setQuery, results, isSearching };
}

// Usage
function CompanySearch() {
  const search = useDebounceSearch(searchCompanies, 300);

  return (
    <div>
      <SearchInput
        value={search.query}
        onChange={(e) => search.setQuery(e.target.value)}
        loading={search.isSearching}
      />
      <SearchResults items={search.results} />
    </div>
  );
}
```

## Composition Patterns

### Hook Composition

Combine multiple hooks for complex behavior:

```tsx
function useDealWorkflow(dealId: string) {
  // Data fetching
  const dealQuery = useDeal(dealId);
  const stagesQuery = useDealStages();
  
  // UI state
  const modal = useModal();
  const toast = useToast();
  
  // Operations
  const updateMutation = useUpdateDeal();
  const deleteMutation = useDeleteDeal();

  const moveToStage = useCallback(async (stageId: string) => {
    await toast.promise(
      updateMutation.mutateAsync({ id: dealId, stageId }),
      {
        loading: 'Moving deal...',
        success: 'Deal moved successfully',
        error: 'Failed to move deal',
      }
    );
  }, [dealId, updateMutation, toast]);

  const deleteDeal = useCallback(async () => {
    await toast.promise(
      deleteMutation.mutateAsync(dealId),
      {
        loading: 'Deleting deal...',
        success: 'Deal deleted',
        error: 'Failed to delete deal',
      }
    );
    modal.close();
  }, [dealId, deleteMutation, toast, modal]);

  return {
    deal: dealQuery.data,
    isLoading: dealQuery.isLoading,
    stages: stagesQuery.data ?? [],
    moveToStage,
    deleteDeal,
    isDeleteModalOpen: modal.isOpen,
    openDeleteModal: modal.open,
    closeDeleteModal: modal.close,
  };
}
```

### Context + Hook Pattern

Provide global state with context and consume with hooks:

```tsx
// PortfolioContext.tsx
interface PortfolioContextValue {
  selectedFund: string | null;
  setSelectedFund: (fundId: string | null) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange);

  const value = useMemo(() => ({
    selectedFund,
    setSelectedFund,
    dateRange,
    setDateRange,
  }), [selectedFund, dateRange]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

// Custom hook for consuming
export function usePortfolioContext() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioContext must be used within PortfolioProvider');
  }
  return context;
}

// Hook with derived data
export function usePortfolioMetrics() {
  const { selectedFund, dateRange } = usePortfolioContext();
  
  return useQuery({
    queryKey: ['portfolio-metrics', selectedFund, dateRange],
    queryFn: () => fetchPortfolioMetrics({ fundId: selectedFund, dateRange }),
  });
}
```

## Performance Patterns

### Memoized Selectors

Extract and memoize derived data:

```tsx
function useDealStats(deals: Deal[]) {
  return useMemo(() => {
    const total = deals.reduce((sum, d) => sum + d.value, 0);
    const byStage = deals.reduce((acc, d) => {
      acc[d.stage] = (acc[d.stage] || 0) + d.value;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValue: total,
      dealCount: deals.length,
      averageValue: deals.length ? total / deals.length : 0,
      valueByStage: byStage,
    };
  }, [deals]);
}

// Usage - only recalculates when deals array changes
function DealDashboard({ deals }: { deals: Deal[] }) {
  const stats = useDealStats(deals);

  return (
    <div>
      <StatCard label="Total Value" value={formatCurrency(stats.totalValue)} />
      <StatCard label="Deal Count" value={stats.dealCount} />
    </div>
  );
}
```

### Virtual List Hook

Handle large lists efficiently:

```tsx
function useVirtualList<T>(items: T[], itemHeight: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => setContainerHeight(container.clientHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => 
      setScrollTop(e.currentTarget.scrollTop),
  };
}

// Usage
function LargeDealList({ deals }: { deals: Deal[] }) {
  const virtual = useVirtualList(deals, 60);

  return (
    <div
      ref={virtual.containerRef}
      onScroll={virtual.onScroll}
      style={{ height: '500px', overflow: 'auto' }}
    >
      <div style={{ height: virtual.totalHeight }}>
        <div style={{ transform: `translateY(${virtual.offsetY}px)` }}>
          {virtual.visibleItems.map(deal => (
            <DealRow key={deal.id} deal={deal} height={60} />
          ))}
        </div>
      </div>
    </div>
  );
}
```
