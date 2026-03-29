# Custom Hooks

## Overview

Our custom hooks provide reusable logic for data fetching, UI interactions, and accessibility. All hooks are fully typed with TypeScript.

---

## Data Fetching Hooks

### useDeals

Fetch and manage deals data with caching.

**Signature:**

```typescript
function useDeals(options?: {
  filters?: DealFilters;
  page?: number;
  limit?: number;
}): UseDealsReturn

interface UseDealsReturn {
  deals: Deal[];
  isLoading: boolean;
  error: Error | null;
  createDeal: UseMutationResult<Deal, Error, CreateDealInput>;
  updateDeal: UseMutationResult<Deal, Error, UpdateDealInput>;
  deleteDeal: UseMutationResult<void, Error, string>;
  refetch: () => void;
}
```

**Example:**

```tsx
const { deals, isLoading, createDeal } = useDeals({
  filters: { stage: 'DUE_DILIGENCE' },
  page: 1,
  limit: 20,
});

// Create a deal
const handleCreate = async (data) => {
  await createDeal.mutateAsync(data);
};
```

---

### useCompanies

Manage company data.

**Signature:**

```typescript
function useCompanies(options?: CompanyFilters): UseCompaniesReturn
```

**Example:**

```tsx
const { companies, isLoading } = useCompanies({
  sector: 'AgTech',
});
```

---

### useAgents

Manage AI agents and their execution.

**Signature:**

```typescript
function useAgents(): UseAgentsReturn

interface UseAgentsReturn {
  agents: Agent[];
  runAgent: (id: string) => Promise<AgentRunResult>;
  toggleAgent: (id: string) => void;
  updateConfig: (id: string, config: AgentConfig) => void;
}
```

**Example:**

```tsx
const { agents, runAgent, toggleAgent } = useAgents();

// Run an agent
await runAgent('agent-123');

// Toggle agent status
toggleAgent('agent-123');
```

---

### usePortfolio

Access portfolio metrics and performance.

**Example:**

```tsx
const { data: portfolio, isLoading } = usePortfolio();

// Access metrics
const { totalValue, multiple, irr } = portfolio;
```

---

## UI Hooks

### useToast

Display toast notifications.

**Signature:**

```typescript
function useToast(): {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  loading: (title: string, message?: string) => string;
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => Promise<T>;
}
```

**Examples:**

```tsx
const toast = useToast();

// Simple toast
toast.success('Deal saved successfully');

// With message
toast.error('Export failed', 'Please try again later');

// Promise tracking
await toast.promise(
  exportDeals(),
  {
    loading: 'Exporting deals...',
    success: 'Export complete!',
    error: 'Export failed',
  }
);

// Loading with ID for updates
const toastId = toast.loading('Processing...');
// Later...
toast.update(toastId, { type: 'success', title: 'Done!' });
```

---

### useModal

Manage modal state.

**Signature:**

```typescript
function useModal(): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
```

**Example:**

```tsx
const { isOpen, open, close } = useModal();

<Modal isOpen={isOpen} onClose={close}>
  <DealForm onClose={close} />
</Modal>
```

---

### useExport

Export data with progress tracking.

**Example:**

```tsx
const { exportCSV, isExporting, progress } = useExport({
  data: deals,
  filename: 'deals-export',
});

// Export to CSV
exportCSV();
```

---

### useBulkOperations

Manage bulk selection and operations.

**Signature:**

```typescript
function useBulkOperations<T>(options: {
  items: T[];
  getItemId: (item: T) => string;
}): UseBulkOperationsReturn<T>

interface UseBulkOperationsReturn<T> {
  selectedIds: string[];
  selectedItems: T[];
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}
```

**Example:**

```tsx
const { selectedIds, selectedItems, toggleSelection, selectAll } =
  useBulkOperations({
    items: deals,
    getItemId: (deal) => deal.id,
  });

// Toggle selection
<button onClick={() => toggleSelection(deal.id)}>
  {isSelected(deal.id) ? 'Selected' : 'Select'}
</button>
```

---

## Keyboard Hooks

### useKeyboardShortcut

Register global keyboard shortcuts.

**Example:**

```tsx
useKeyboardShortcut('k', () => openSearch(), { ctrl: true });
useKeyboardShortcut('Escape', () => closeModal());
```

---

### useFocusTrap

Trap focus within a container.

**Example:**

```tsx
const containerRef = useRef<HTMLDivElement>(null);
useFocusTrap(isOpen, containerRef);

<div ref={containerRef}>
  {/* Modal content */}
</div>
```

---

## Touch/Gesture Hooks

### useSwipe

Detect swipe gestures.

**Example:**

```tsx
const { swipeProps, direction } = useSwipe({
  onSwipeLeft: () => nextSlide(),
  onSwipeRight: () => prevSlide(),
});

<div {...swipeProps}>Swipeable content</div>
```

---

### useHaptic

Trigger haptic feedback.

**Example:**

```tsx
const haptic = useHaptic();

<button onClick={() => haptic.success()}>
  Save
</button>
```

---

## Accessibility Hooks

### useReducedMotion

Detect reduced motion preference.

**Example:**

```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
>
```

---

### useAnnouncer

Announce to screen readers.

**Example:**

```tsx
const { announce } = useAnnouncer();

announce('Deal created successfully', 'polite');
```

---

## Best Practices

### Error Handling

All data fetching hooks handle errors:

```tsx
const { data, error, isLoading } = useDeals();

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
```

---

### Loading States

Use `isLoading` for initial load, `isFetching` for background updates:

```tsx
const { data, isLoading, isFetching } = useDeals();

{isFetching && <Spinner />} // Background update indicator
```

---

### Optimistic Updates

Mutations support optimistic updates:

```tsx
const updateDeal = useUpdateDeal();

updateDeal.mutate(data, {
  onSuccess: () => toast.success('Updated'),
  onError: () => toast.error('Failed'),
});
```

---

## All Hooks

| Hook | Category | Description |
|------|----------|-------------|
| `useDeals` | Data | Manage deals data |
| `useCompanies` | Data | Manage companies data |
| `useAgents` | Data | Manage AI agents |
| `usePortfolio` | Data | Portfolio metrics |
| `useToast` | UI | Toast notifications |
| `useModal` | UI | Modal state |
| `useExport` | UI | Data export |
| `useBulkOperations` | UI | Bulk selection |
| `useKeyboardShortcut` | Keyboard | Global shortcuts |
| `useFocusTrap` | Keyboard | Focus management |
| `useSwipe` | Touch | Swipe detection |
| `useHaptic` | Touch | Haptic feedback |
| `useReducedMotion` | A11y | Motion preference |
| `useAnnouncer` | A11y | Screen reader |

See `docs/hooks/patterns.md` and `docs/hooks/best-practices.md` for more detailed patterns and best practices.
