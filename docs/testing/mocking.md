# Mocking Strategies

## Overview

Mocking allows us to isolate units of code by replacing dependencies with controlled implementations. This guide covers various mocking strategies for different scenarios.

## Philosophy

> "Mock what you don't control, test what you do."

### When to Mock

✅ **Mock:**
- External APIs
- Database connections
- Third-party libraries
- Browser APIs (localStorage, fetch)
- File system operations
- Random/time-based functions

❌ **Don't Mock:**
- Your own code (unless necessary for isolation)
- Simple utility functions
- React/React DOM

## Mocking Levels

### 1. Function Mocking

#### Jest Mocks

```typescript
// Basic mock
const mockFn = jest.fn();
mockFn.mockReturnValue('mocked');
expect(mockFn()).toBe('mocked');

// Mock with implementation
const mockFn = jest.fn((x) => x * 2);
expect(mockFn(5)).toBe(10);

// Mock resolved/rejected values
const asyncMock = jest.fn().mockResolvedValue('success');
const asyncMock = jest.fn().mockRejectedValue(new Error('fail'));
```

#### Spying

```typescript
// Spy on existing function
const spy = jest.spyOn(utils, 'formatDate');
spy.mockReturnValue('2024-01-01');

// Restore original
spy.mockRestore();
```

### 2. Module Mocking

#### Manual Mocks

```typescript
// __mocks__/axios.ts
export default {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
};
```

```typescript
// In test file
jest.mock('axios');
import axios from 'axios';

(axios.get as jest.Mock).mockResolvedValue({
  data: { deals: [] }
});
```

#### Inline Mocks

```typescript
// Mock entire module
jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
  trackPageView: jest.fn(),
  identifyUser: jest.fn(),
}));

// Mock with actual implementation
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  generateId: jest.fn(() => 'mock-id-123'),
}));
```

### 3. Component Mocking

#### Simple Component Mocks

```typescript
// Mock child components
jest.mock('@/components/charts/PortfolioChart', () => ({
  PortfolioChart: () => <div data-testid="portfolio-chart-mock" />
}));

// Mock with props
jest.mock('@/components/ui/Modal', () => ({
  Modal: ({ children, isOpen }: { children: ReactNode; isOpen: boolean }) => 
    isOpen ? <div data-testid="modal">{children}</div> : null
}));
```

#### Mocking Hooks

```typescript
// Mock custom hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock with different states per test
const mockUseAuth = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

beforeEach(() => {
  mockUseAuth.mockReturnValue({
    user: null,
    isAuthenticated: false,
  });
});

test('authenticated view', () => {
  mockUseAuth.mockReturnValue({
    user: { id: '1' },
    isAuthenticated: true,
  });
  // Test authenticated state
});
```

## API Mocking

### MSW (Mock Service Worker)

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // GET request
  rest.get('/api/deals', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          { id: '1', companyName: 'Test Co', stage: 'INBOUND' },
          { id: '2', companyName: 'Another Co', stage: 'NEGOTIATION' },
        ],
      })
    );
  }),

  // POST request with request body validation
  rest.post('/api/deals', async (req, res, ctx) => {
    const body = await req.json();
    
    if (!body.companyName) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Company name is required' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: { id: '3', ...body },
      })
    );
  }),

  // Dynamic route parameters
  rest.get('/api/deals/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    if (id === '999') {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Deal not found' })
      );
    }
    
    return res(
      ctx.json({
        success: true,
        data: { id, companyName: 'Test Co' },
      })
    );
  }),

  // Query parameters
  rest.get('/api/deals', (req, res, ctx) => {
    const stage = req.url.searchParams.get('stage');
    
    const deals = [
      { id: '1', companyName: 'Co 1', stage: 'INBOUND' },
      { id: '2', companyName: 'Co 2', stage: 'CLOSED' },
    ];
    
    const filtered = stage 
      ? deals.filter(d => d.stage === stage)
      : deals;
    
    return res(ctx.json({ success: true, data: filtered }));
  }),

  // Error responses
  rest.get('/api/deals/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal server error' })
    );
  }),

  // Network error
  rest.get('/api/deals/network-error', (req, res, ctx) => {
    return res.networkError('Failed to connect');
  }),
];
```

```typescript
// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// jest.setup.ts
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```typescript
// Test with MSW
import { server } from '@/mocks/server';
import { rest } from 'msw';

test('handles API error gracefully', async () => {
  server.use(
    rest.get('/api/deals', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  
  render(<DealList />);
  
  await waitFor(() => {
    expect(screen.getByText(/error loading deals/i)).toBeInTheDocument();
  });
});
```

### Fetch Mocking

```typescript
// Mock global fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('fetches deals', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: [{ id: '1', companyName: 'Test' }] }),
  });
  
  const result = await fetchDeals();
  
  expect(fetch).toHaveBeenCalledWith('/api/deals', expect.any(Object));
  expect(result).toHaveLength(1);
});
```

## Browser API Mocking

### localStorage

```typescript
// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Usage in tests
test('saves token to localStorage', () => {
  localStorageMock.getItem.mockReturnValue('test-token');
  
  const token = getToken();
  
  expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
  expect(token).toBe('test-token');
});
```

### matchMedia

```typescript
// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock specific breakpoints
test('mobile view', () => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === '(max-width: 768px)',
    // ... other properties
  }));
  
  // Test mobile behavior
});
```

### Intersection Observer

```typescript
// Mock Intersection Observer
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});
```

### Resize Observer

```typescript
// Mock Resize Observer
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});
```

## Third-Party Library Mocking

### Chart Libraries

```typescript
// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));
```

### Date Libraries

```typescript
// Mock date-fns
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn(() => 'Jan 1, 2024'),
  parseISO: jest.fn((date) => new Date(date)),
}));
```

### Animation Libraries

```typescript
// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));
```

## React Testing Library Mocking

### Mocking Router

```typescript
// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: { id: '123' },
    pathname: '/deals/[id]',
    asPath: '/deals/123',
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));
```

### Mocking Context

```typescript
// Create mock provider
const MockAuthProvider = ({ children, value = {} }) => (
  <AuthContext.Provider value={{
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    ...value,
  }}>
    {children}
  </AuthContext.Provider>
);

// Usage
test('authenticated component', () => {
  render(
    <MockAuthProvider value={{ user: { id: '1', name: 'John' } }}>
      <UserProfile />
    </MockAuthProvider>
  );
  
  expect(screen.getByText('John')).toBeInTheDocument();
});
```

## Time-Based Mocking

### Mocking Date

```typescript
// Freeze time
const mockDate = new Date('2024-03-15T10:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

// Or use modern approach
jest.useFakeTimers().setSystemTime(new Date('2024-03-15'));

// Restore
jest.useRealTimers();
```

### Mocking Timers

```typescript
jest.useFakeTimers();

test('debounced search', async () => {
  render(<SearchInput />);
  
  const input = screen.getByRole('searchbox');
  await userEvent.type(input, 'test');
  
  // Fast-forward timers
  act(() => {
    jest.advanceTimersByTime(500);
  });
  
  expect(mockSearch).toHaveBeenCalledWith('test');
});

afterEach(() => {
  jest.useRealTimers();
});
```

## Mock Factories

### Test Data Builders

```typescript
// builders/dealBuilder.ts
export function buildDeal(overrides = {}) {
  return {
    id: faker.string.uuid(),
    companyName: faker.company.name(),
    amount: faker.number.int({ min: 100000, max: 10000000 }),
    stage: faker.helpers.arrayElement(['INBOUND', 'NEGOTIATION', 'CLOSED']),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function buildDealList(count = 3, overrides = {}) {
  return Array.from({ length: count }, () => buildDeal(overrides));
}

// Usage
const deal = buildDeal({ stage: 'INBOUND' });
const deals = buildDealList(5, { stage: 'CLOSED' });
```

### Mock Response Builders

```typescript
// builders/apiResponseBuilder.ts
export function buildApiResponse(data, overrides = {}) {
  return {
    success: true,
    data,
    meta: {
      page: 1,
      limit: 20,
      total: data.length,
    },
    ...overrides,
  };
}

export function buildApiError(message, status = 400) {
  return {
    success: false,
    error: {
      message,
      status,
    },
  };
}
```

## Best Practices

### ✅ DO
- [ ] Reset mocks between tests (`mockClear`, `mockReset`)
- [ ] Use MSW for API mocking
- [ ] Mock at the lowest level necessary
- [ ] Keep mocks simple and focused
- [ ] Restore original implementations after tests
- [ ] Use factories for test data

### ❌ DON'T
- [ ] Mock implementation details
- [ ] Share mutable mock state between tests
- [ ] Mock everything (test real code when possible)
- [ ] Use complex logic in mocks
- [ ] Forget to clean up mocks

## Common Issues & Solutions

### Issue: Mock not being called

```typescript
// ❌ Wrong: Mocking after import
import { myFunction } from './module';
jest.mock('./module');

// ✅ Correct: Mock before import
jest.mock('./module');
import { myFunction } from './module';
```

### Issue: TypeScript errors with mocks

```typescript
// Use type assertions
const mockFn = jest.fn() as jest.MockedFunction<typeof myFunction>;

// Or use jest.Mocked
import { myService } from './service';
jest.mock('./service');
const mockedService = myService as jest.Mocked<typeof myService>;
```
