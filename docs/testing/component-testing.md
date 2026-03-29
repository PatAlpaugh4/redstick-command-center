# Component Testing Guide

## Overview

Component tests verify that UI components render correctly and respond to user interactions. We use React Testing Library with a focus on testing behavior rather than implementation details.

## Philosophy

> "The more your tests resemble the way your software is used, the more confidence they can give you."
> — Kent C. Dodds

### Guiding Principles

1. **Test behavior, not implementation**
2. **Query elements like users would find them**
3. **Avoid testing third-party library internals**
4. **Test accessibility by default**

## Testing Setup

### Custom Render

Create a custom render that includes providers:

```typescript
// test-utils.tsx
import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = createTestQueryClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { render };
```

### Import Pattern

```typescript
// In your tests, use:
import { render, screen, fireEvent, waitFor } from '@/test-utils';

// Instead of:
// import { render, screen } from '@testing-library/react';
```

## Query Priority

Follow this priority order for queries:

```typescript
// 1. Queries accessible to everyone
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email address/i);

// 2. Semantic queries
screen.getByPlaceholderText(/search/i);
screen.getByText(/loading/i);

// 3. Test IDs (last resort)
screen.getByTestId('user-menu');
```

## Testing Basic Components

### Button

```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  it('is accessible with aria-label', () => {
    render(
      <Button aria-label="Close modal">
        <CloseIcon />
      </Button>
    );
    expect(screen.getByLabelText(/close modal/i)).toBeInTheDocument();
  });
});
```

### Input

```typescript
// components/ui/Input.test.tsx
import { render, screen, fireEvent } from '@/test-utils';
import { Input } from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('accepts user input', () => {
    render(<Input name="email" />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(input).toHaveValue('test@example.com');
  });

  it('displays error message', () => {
    render(<Input name="email" error="Invalid email" />);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('can be disabled', () => {
    render(<Input name="email" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('supports different types', () => {
    const { rerender } = render(<Input name="email" type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input name="password" type="password" />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
  });
});
```

## Testing Complex Components

### Form Components

```typescript
// components/forms/DealForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { DealForm } from './DealForm';
import userEvent from '@testing-library/user-event';

describe('DealForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<DealForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stage/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<DealForm onSubmit={mockSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/company name/i), 'Test Company');
    await userEvent.type(screen.getByLabelText(/amount/i), '1000000');
    await userEvent.selectOptions(
      screen.getByLabelText(/stage/i), 
      'INBOUND'
    );
    
    fireEvent.click(screen.getByRole('button', { name: /create deal/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        companyName: 'Test Company',
        amount: 1000000,
        stage: 'INBOUND',
      });
    });
  });

  it('shows validation errors for empty fields', async () => {
    render(<DealForm onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /create deal/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('formats amount input', async () => {
    render(<DealForm onSubmit={mockSubmit} />);
    
    const amountInput = screen.getByLabelText(/amount/i);
    await userEvent.type(amountInput, '1000000');
    
    // Should format as currency while typing
    expect(amountInput).toHaveValue('$1,000,000');
  });
});
```

### Modal/Dialog

```typescript
// components/ui/Modal.test.tsx
import { render, screen, fireEvent, waitFor } from '@/testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  const mockClose = jest.fn();

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen onClose={mockClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/modal content/i)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    render(
      <Modal isOpen onClose={mockClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockClose).toHaveBeenCalled();
  });

  it('closes on overlay click', () => {
    render(
      <Modal isOpen onClose={mockClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(mockClose).toHaveBeenCalled();
  });

  it('traps focus within modal', () => {
    render(
      <Modal isOpen onClose={mockClose} title="Test">
        <button>First</button>
        <button>Second</button>
        <button>Third</button>
      </Modal>
    );
    
    const firstButton = screen.getByText('First');
    const lastButton = screen.getByText('Third');
    
    // Focus should cycle within modal
    lastButton.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(firstButton);
  });

  it('has correct ARIA attributes', () => {
    render(
      <Modal isOpen onClose={mockClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });
});
```

### Table

```typescript
// components/ui/DataTable.test.tsx
import { render, screen, fireEvent, within } from '@/test-utils';
import { DataTable } from './DataTable';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'amount', header: 'Amount' },
  { key: 'stage', header: 'Stage' },
];

const data = [
  { id: '1', name: 'Deal 1', amount: 1000000, stage: 'INBOUND' },
  { id: '2', name: 'Deal 2', amount: 2000000, stage: 'NEGOTIATION' },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /amount/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /stage/i })).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<DataTable columns={columns} data={data} />);
    
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // Header + 2 data rows
    
    expect(screen.getByRole('cell', { name: 'Deal 1' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Deal 2' })).toBeInTheDocument();
  });

  it('handles row selection', () => {
    const onSelect = jest.fn();
    render(<DataTable columns={columns} data={data} onSelect={onSelect} />);
    
    const firstRow = screen.getByRole('row', { name: /deal 1/i });
    fireEvent.click(firstRow);
    
    expect(onSelect).toHaveBeenCalledWith(data[0]);
  });

  it('supports sorting', () => {
    const onSort = jest.fn();
    render(<DataTable columns={columns} data={data} onSort={onSort} />);
    
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith('name', 'asc');
    
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('shows empty state when no data', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });
});
```

## Testing Components with Async Data

```typescript
// components/DealList.test.tsx
import { render, screen, waitFor } from '@/test-utils';
import { DealList } from './DealList';
import { rest } from 'msw';
import { server } from '@/mocks/server';

describe('DealList', () => {
  it('shows loading state initially', () => {
    render(<DealList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders deals after loading', async () => {
    render(<DealList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
    
    expect(screen.getAllByRole('row')).toHaveLength(4); // Header + 3 deals
  });

  it('shows error state on fetch failure', async () => {
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

  it('refreshes data on button click', async () => {
    render(<DealList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

## Testing User Interactions

### Using user-event

Prefer `user-event` over `fireEvent` for user interactions:

```typescript
import userEvent from '@testing-library/user-event';

describe('SearchInput', () => {
  it('handles search input', async () => {
    const onSearch = jest.fn();
    render(<SearchInput onSearch={onSearch} />);
    
    const input = screen.getByRole('searchbox');
    
    // Type like a real user
    await userEvent.type(input, 'test query');
    await userEvent.keyboard('{Enter}');
    
    expect(onSearch).toHaveBeenCalledWith('test query');
  });

  it('handles clearing search', async () => {
    render(<SearchInput onSearch={jest.fn()} />);
    
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'test');
    await userEvent.clear(input);
    
    expect(input).toHaveValue('');
  });
});
```

### Complex Interactions

```typescript
describe('DealKanban', () => {
  it('handles drag and drop', async () => {
    render(<DealKanban deals={mockDeals} />);
    
    const deal = screen.getByText('Deal 1');
    const dropZone = screen.getByTestId('drop-zone-negotiation');
    
    // Simulate drag start
    fireEvent.dragStart(deal);
    fireEvent.dragEnter(dropZone);
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone);
    
    await waitFor(() => {
      expect(screen.getByText(/deal moved/i)).toBeInTheDocument();
    });
  });
});
```

## Snapshot Testing

Use for complex component structures:

```typescript
describe('Card', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Card title="Test" amount={1000000} stage="INBOUND" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with actions', () => {
    const { container } = render(
      <Card 
        title="Test" 
        amount={1000000} 
        stage="INBOUND"
        actions={<button>Edit</button>}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

## Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('Button has no violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Form has no violations', async () => {
    const { container } = render(
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Best Practices Checklist

### ✅ DO
- [ ] Use semantic queries (getByRole, getByLabelText)
- [ ] Test from user perspective
- [ ] Test accessibility attributes
- [ ] Use `user-event` for interactions
- [ ] Mock external dependencies
- [ ] Test loading and error states
- [ ] Test empty states
- [ ] Keep tests deterministic

### ❌ DON'T
- [ ] Query by implementation details (class names, IDs)
- [ ] Test third-party library internals
- [ ] Test CSS styles directly
- [ ] Use `getByTestId` as first choice
- [ ] Test multiple components in isolation test
- [ ] Skip error handling tests
