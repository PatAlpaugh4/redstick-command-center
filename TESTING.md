# Testing Guide

## Overview

We use a multi-layered testing approach:
- **Unit Tests**: Utilities, hooks, pure functions
- **Component Tests**: UI components in isolation
- **Integration Tests**: Page-level functionality
- **E2E Tests**: Critical user flows
- **Accessibility Tests**: Automated a11y checks

## Testing Stack

- **Framework**: Jest
- **Component Testing**: React Testing Library
- **E2E**: Playwright
- **Accessibility**: jest-axe
- **Coverage**: Built-in Jest coverage

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### With Coverage

```bash
npm run test:coverage
```

### Specific File

```bash
npm test -- Button.test.tsx
```

## Unit Testing

### Utilities

```typescript
// lib/utils.test.ts
import { formatAmount, cn } from './utils';

describe('formatAmount', () => {
  it('formats millions correctly', () => {
    expect(formatAmount(5000000)).toBe('$5.0M');
  });
  
  it('formats thousands correctly', () => {
    expect(formatAmount(500000)).toBe('$500K');
  });
});
```

### Hooks

```typescript
// hooks/useDeals.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useDeals } from './useDeals';

describe('useDeals', () => {
  it('fetches deals', async () => {
    const { result } = renderHook(() => useDeals());
    
    await waitFor(() => {
      expect(result.current.deals).toBeDefined();
    });
  });
});
```

## Component Testing

### Button Component

```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('handles click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
  
  it('is disabled when loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  it('has correct aria-label', () => {
    render(
      <Button aria-label="Close dialog">
        <XIcon />
      </Button>
    );
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });
});
```

### Modal Component

```typescript
// components/ui/Modal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('closes on Escape key', () => {
    const onClose = jest.fn();
    render(<Modal isOpen onClose={onClose} title="Test" />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
  
  it('traps focus', () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Test">
        <button>First</button>
        <button>Second</button>
      </Modal>
    );
    
    const firstButton = screen.getByText('First');
    firstButton.focus();
    
    // Tab should cycle within modal
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).not.toBe(firstButton);
  });
});
```

## Integration Testing

### Page Tests

```typescript
// app/app/dashboard/page.test.tsx
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';

describe('DashboardPage', () => {
  it('renders stats cards', () => {
    render(<DashboardPage />);
    
    expect(screen.getByText('Portfolio Value')).toBeInTheDocument();
    expect(screen.getByText('Active Deals')).toBeInTheDocument();
  });
  
  it('renders charts', () => {
    render(<DashboardPage />);
    
    expect(screen.getByText('Portfolio Performance')).toBeInTheDocument();
  });
});
```

## E2E Testing

### Setup

```bash
npm install -D @playwright/test
npx playwright install
```

### Example Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/app/dashboard');
});

test('user can create a deal', async ({ page }) => {
  await page.goto('/app/pipeline');
  
  await page.click('text=Add Deal');
  await page.fill('[name="companyName"]', 'Test Company');
  await page.selectOption('[name="stage"]', 'INBOUND');
  await page.click('text=Create');
  
  await expect(page.locator('text=Test Company')).toBeVisible();
});
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run specific test
npx playwright test auth.spec.ts
```

## Accessibility Testing

### Automated Tests

```typescript
// __tests__/a11y/components.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/ui/Button';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('Button has no violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Testing Checklist

See A11Y_TESTING_CHECKLIST.md for manual testing procedures.

## Mocking

### API Mocking

```typescript
// __mocks__/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/deals', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          { id: '1', companyName: 'Test Co', stage: 'INBOUND' }
        ]
      })
    );
  }),
];
```

### Component Mocking

```typescript
jest.mock('@/components/charts/PortfolioChart', () => ({
  PortfolioChart: () => <div data-testid="portfolio-chart" />
}));
```

## Test Utilities

### Custom Render

```typescript
// test-utils.tsx
import { render as rtlRender } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

function render(ui, options = {}) {
  return rtlRender(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>,
    options
  );
}

export { render };
```

### Test Data Builders

```typescript
// builders/dealBuilder.ts
export function buildDeal(overrides = {}) {
  return {
    id: 'deal-1',
    companyName: 'Test Company',
    stage: 'INBOUND',
    amount: 1000000,
    ...overrides
  };
}
```

## Coverage Goals

| Category | Target |
|----------|--------|
| Statements | 80% |
| Branches | 75% |
| Functions | 80% |
| Lines | 80% |

## Best Practices

### DO

- Test behavior, not implementation
- Use user-centric queries (getByRole, getByLabelText)
- Test accessibility
- Keep tests focused and isolated
- Use meaningful test descriptions

### DON'T

- Test implementation details
- Use getByTestId excessively
- Test third-party libraries
- Write brittle tests
- Skip error cases

## Debugging Tests

### Failed Test Output

```bash
# Verbose output
npm test -- --verbose

# Show console logs
npm test -- --detectOpenHandles
```

### VS Code Debugging

Use Debug panel with Jest configuration.

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Merge to main
- Nightly builds

See `.github/workflows/test.yml` for configuration.
