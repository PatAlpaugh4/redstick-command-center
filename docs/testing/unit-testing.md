# Unit Testing Guide

## Overview

Unit tests verify that individual units of code (functions, utilities, hooks) work correctly in isolation. They are fast, reliable, and form the foundation of our testing pyramid.

## Philosophy

> "Unit tests should be fast, isolated, and deterministic."

- **Fast**: Execute in milliseconds
- **Isolated**: No external dependencies
- **Deterministic**: Same input always produces same output

## Testing Utilities

### Pure Functions

Pure functions are the easiest to test:

```typescript
// lib/math.test.ts
import { calculateIRR, formatPercentage } from './math';

describe('calculateIRR', () => {
  it('calculates IRR for positive cash flows', () => {
    const cashFlows = [-1000, 300, 400, 400, 300];
    const result = calculateIRR(cashFlows);
    expect(result).toBeCloseTo(0.143, 3);
  });

  it('returns null for invalid cash flows', () => {
    const cashFlows = [100, 200]; // No initial investment
    const result = calculateIRR(cashFlows);
    expect(result).toBeNull();
  });

  it('handles empty array', () => {
    expect(calculateIRR([])).toBeNull();
  });
});

describe('formatPercentage', () => {
  it('formats decimal to percentage', () => {
    expect(formatPercentage(0.1567)).toBe('15.67%');
  });

  it('handles zero', () => {
    expect(formatPercentage(0)).toBe('0.00%');
  });

  it('handles negative values', () => {
    expect(formatPercentage(-0.05)).toBe('-5.00%');
  });
});
```

### Date Utilities

```typescript
// lib/date.test.ts
import { formatDate, getQuarter, addBusinessDays } from './date';

describe('formatDate', () => {
  it('formats ISO date to readable format', () => {
    expect(formatDate('2024-03-15')).toBe('Mar 15, 2024');
  });

  it('handles Date object', () => {
    expect(formatDate(new Date(2024, 2, 15))).toBe('Mar 15, 2024');
  });

  it('returns empty string for invalid date', () => {
    expect(formatDate('invalid')).toBe('');
  });
});

describe('getQuarter', () => {
  it.each([
    [0, 'Q1'],   // January
    [3, 'Q2'],   // April
    [6, 'Q3'],   // July
    [9, 'Q4'],   // October
  ])('month %i returns %s', (month, expected) => {
    expect(getQuarter(new Date(2024, month, 1))).toBe(expected);
  });
});
```

### String Utilities

```typescript
// lib/string.test.ts
import { slugify, truncate, capitalize } from './string';

describe('slugify', () => {
  it('converts to lowercase with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Hello @ World!')).toBe('hello-world');
  });

  it('handles multiple spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world');
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...');
  });

  it('does not truncate short strings', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });
});
```

## Testing Hooks

### Basic Hook Testing

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('initializes with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it('respects min and max bounds', () => {
    const { result } = renderHook(() => useCounter(0, { min: 0, max: 5 }));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(0);
  });
});
```

### Async Hooks

```typescript
// hooks/useDebounce.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'changed' });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('changed');
  });
});
```

### Hooks with Context

```typescript
// hooks/useAuth.test.ts
import { renderHook } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from './useAuth';

const wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('returns auth context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });
});
```

## Testing API Clients

```typescript
// lib/api/client.test.ts
import { apiClient } from './client';

// Mock fetch globally
global.fetch = jest.fn();

describe('apiClient', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('makes GET request', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    const result = await apiClient.get('/deals');
    
    expect(fetch).toHaveBeenCalledWith('/api/deals', {
      method: 'GET',
      headers: expect.any(Object),
    });
    expect(result).toEqual({ data: 'test' });
  });

  it('handles error responses', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    });

    await expect(apiClient.get('/deals/123')).rejects.toThrow('Not found');
  });

  it('includes auth token', async () => {
    localStorage.setItem('token', 'test-token');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await apiClient.get('/deals');
    
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });
});
```

## Testing State Management

### Redux/Redux Toolkit

```typescript
// store/slices/dealsSlice.test.ts
import dealsReducer, { 
  addDeal, 
  updateDeal, 
  deleteDeal,
  selectDealById 
} from './dealsSlice';

describe('dealsSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it('handles addDeal', () => {
    const deal = { id: '1', companyName: 'Test Co' };
    const state = dealsReducer(initialState, addDeal(deal));
    
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(deal);
  });

  it('handles updateDeal', () => {
    const state = {
      ...initialState,
      items: [{ id: '1', companyName: 'Old Name' }],
    };
    
    const newState = dealsReducer(
      state, 
      updateDeal({ id: '1', companyName: 'New Name' })
    );
    
    expect(newState.items[0].companyName).toBe('New Name');
  });
});
```

### Zustand

```typescript
// store/useDealStore.test.ts
import { useDealStore } from './useDealStore';

describe('useDealStore', () => {
  beforeEach(() => {
    useDealStore.setState({ deals: [], selectedDeal: null });
  });

  it('adds a deal', () => {
    const deal = { id: '1', companyName: 'Test Co' };
    
    useDealStore.getState().addDeal(deal);
    
    expect(useDealStore.getState().deals).toContainEqual(deal);
  });

  it('selects a deal', () => {
    const deal = { id: '1', companyName: 'Test Co' };
    
    useDealStore.getState().selectDeal(deal);
    
    expect(useDealStore.getState().selectedDeal).toEqual(deal);
  });
});
```

## Parameterized Tests

Use `it.each` for testing multiple scenarios:

```typescript
// lib/validation.test.ts
import { validateEmail, validateAmount } from './validation';

describe('validateEmail', () => {
  it.each([
    ['user@example.com', true],
    ['user.name@example.co.uk', true],
    ['invalid', false],
    ['@example.com', false],
    ['user@', false],
    ['', false],
  ])('validateEmail(%s) returns %s', (email, expected) => {
    expect(validateEmail(email)).toBe(expected);
  });
});

describe('validateAmount', () => {
  it.each([
    [1000000, true],
    [0, false],
    [-100, false],
    [1000000000, true],
  ])('validateAmount(%i) returns %s', (amount, expected) => {
    expect(validateAmount(amount)).toBe(expected);
  });
});
```

## Snapshot Testing

Use sparingly for complex data structures:

```typescript
// lib/transformers.test.ts
import { transformDeal } from './transformers';

describe('transformDeal', () => {
  it('transforms deal correctly', () => {
    const rawDeal = {
      id: '123',
      company_name: 'Test Company',
      deal_amount: 1000000,
      created_at: '2024-01-15T10:30:00Z',
    };

    const transformed = transformDeal(rawDeal);
    
    expect(transformed).toMatchSnapshot();
  });
});
```

## Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it('should do something', () => {
  // Arrange
  const input = { name: 'Test' };
  const expected = { name: 'Test', id: expect.any(String) };
  
  // Act
  const result = processInput(input);
  
  // Assert
  expect(result).toEqual(expected);
});
```

### 2. Test Edge Cases

```typescript
describe('divide', () => {
  it('divides positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('divides negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  it('throws on divide by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });

  it('handles floating point', () => {
    expect(divide(1, 3)).toBeCloseTo(0.333, 3);
  });
});
```

### 3. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => { });

// ✅ Good
it('returns user object when given valid user ID', () => { });
```

### 4. Keep Tests Independent

```typescript
// ❌ Bad
let counter = 0;
beforeEach(() => { counter = 0; });

// ✅ Good
// Each test creates its own fresh state
```

## Coverage Goals

Focus on testing:
- **Business logic**: Financial calculations, data transformations
- **Validation**: Input sanitization, schema validation
- **Edge cases**: Empty inputs, boundary values, error states

Minimum coverage targets:
- Utilities: 95%
- Hooks: 80%
- State management: 75%
