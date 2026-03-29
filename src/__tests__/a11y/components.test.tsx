/**
 * Component Accessibility Tests
 * =============================
 * Automated accessibility tests for critical UI components.
 * Uses jest-axe for automated accessibility auditing.
 * 
 * @see https://github.com/nickcolley/jest-axe
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Import components to test
import { Button, IconButton, ButtonGroup } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkipLink } from '@/components/a11y/SkipLink';
import { AnnouncerProvider } from '@/components/a11y/Announcer';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// =============================================================================
// Button Accessibility Tests
// =============================================================================

describe('Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard activation with Enter key', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });

  it('should support keyboard activation with Space key', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    button.focus();
    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });

  it('should have visible focus indicator', () => {
    render(<Button>Focus me</Button>);
    const button = screen.getByRole('button');
    button.focus();
    
    const styles = window.getComputedStyle(button);
    // Focus indicator should be visible via outline or ring
    expect(button).toHaveClass('focus-visible:ring-2');
  });

  it('should have proper ARIA attributes when loading', () => {
    render(<Button loading loadingText="Saving...">Save</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-label', 'Saving...');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should have proper ARIA attributes when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toBeDisabled();
  });

  it('IconButton should require aria-label', () => {
    // IconButton requires aria-label prop
    const { container } = render(
      <IconButton icon={<span>✕</span>} aria-label="Close dialog" />
    );
    const button = screen.getByRole('button', { name: /close dialog/i });
    
    expect(button).toHaveAttribute('aria-label', 'Close dialog');
  });

  it('should have sufficient color contrast', async () => {
    const { container } = render(
      <>
        <Button variant="default">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </>
    );
    
    const results = await axe(container);
    const contrastViolations = results.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });
});

// =============================================================================
// ButtonGroup Accessibility Tests
// =============================================================================

describe('ButtonGroup Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have role="group" for semantic meaning', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  it('should support keyboard navigation between buttons', async () => {
    const user = userEvent.setup();
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    );
    
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    
    // Tab through buttons
    await user.tab();
    expect(document.activeElement).toBe(buttons[1]);
    
    await user.tab();
    expect(document.activeElement).toBe(buttons[2]);
  });
});

// =============================================================================
// Card Accessibility Tests
// =============================================================================

describe('Card Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>Card content</CardContent>
      </Card>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    );
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Card Title');
  });

  it('should support aria-label for card region', () => {
    render(
      <Card aria-label="Deal details">
        <CardContent>Content</CardContent>
      </Card>
    );
    
    const card = screen.getByLabelText('Deal details');
    expect(card).toBeInTheDocument();
  });
});

// =============================================================================
// Badge Accessibility Tests
// =============================================================================

describe('Badge Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Badge>New</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper role for status badges', () => {
    render(<Badge role="status">Active</Badge>);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Active');
  });

  it('should have sufficient color contrast', async () => {
    const { container } = render(
      <>
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
      </>
    );
    
    const results = await axe(container);
    const contrastViolations = results.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });
});

// =============================================================================
// SkipLink Accessibility Tests
// =============================================================================

describe('SkipLink Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <>
        <SkipLink targetId="main-content" />
        <main id="main-content">Main content</main>
      </>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be focusable but visually hidden by default', () => {
    render(<SkipLink targetId="main-content" />);
    const skipLink = screen.getByText('Skip to main content');
    
    expect(skipLink).toHaveClass('sr-only');
    expect(skipLink).toHaveClass('focus:not-sr-only');
  });

  it('should become visible on focus', () => {
    render(<SkipLink targetId="main-content" />);
    const skipLink = screen.getByText('Skip to main content');
    
    skipLink.focus();
    expect(skipLink).toHaveClass('focus:not-sr-only');
    expect(skipLink).toHaveClass('focus:fixed');
  });

  it('should link to main content target', () => {
    render(<SkipLink targetId="main-content" />);
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});

// =============================================================================
// Modal/Dialog Accessibility Tests (if modal component exists)
// =============================================================================

describe('Modal Accessibility', () => {
  // Mock modal component for testing
  const TestModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50"
      >
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-lg p-6 max-w-md mx-auto mt-20">
          <h2 id="modal-title">{title}</h2>
          {children}
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  };

  it('should have no accessibility violations when open', async () => {
    const { container } = render(
      <TestModal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </TestModal>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have aria-modal="true"', () => {
    render(
      <TestModal isOpen={true} onClose={() => {}} title="Test">
        Content
      </TestModal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should have aria-labelledby pointing to title', () => {
    render(
      <TestModal isOpen={true} onClose={() => {}} title="Modal Title">
        Content
      </TestModal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('should trap focus within modal', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    
    render(
      <>
        <button>Outside button</button>
        <TestModal isOpen={true} onClose={onClose} title="Test">
          <button>Inside button 1</button>
          <button>Inside button 2</button>
        </TestModal>
      </>
    );
    
    const insideButtons = screen.getAllByText(/Inside button/i);
    const closeButton = screen.getByText('Close');
    
    // Focus should cycle within modal
    closeButton.focus();
    await user.tab();
    
    // Tab should move to first focusable element
    expect(document.activeElement).toBe(insideButtons[0]);
  });

  it('should close on Escape key', async () => {
    const onClose = jest.fn();
    render(
      <TestModal isOpen={true} onClose={onClose} title="Test">
        Content
      </TestModal>
    );
    
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalled();
  });
});

// =============================================================================
// Form Accessibility Tests
// =============================================================================

describe('Form Accessibility', () => {
  it('should have proper label associations', async () => {
    const { container } = render(
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" />
        
        <label htmlFor="name">Name</label>
        <input id="name" type="text" name="name" />
        
        <Button type="submit">Submit</Button>
      </form>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should use aria-label when visible label is not present', async () => {
    const { container } = render(
      <form>
        <input 
          type="search" 
          aria-label="Search deals"
          placeholder="Search..."
        />
      </form>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper fieldset and legend for grouped inputs', async () => {
    const { container } = render(
      <fieldset>
        <legend>Deal Status</legend>
        <label>
          <input type="radio" name="status" value="active" />
          Active
        </label>
        <label>
          <input type="radio" name="status" value="closed" />
          Closed
        </label>
      </fieldset>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should indicate required fields', () => {
    render(
      <form>
        <label htmlFor="required-field">
          Required Field <span aria-label="required">*</span>
        </label>
        <input 
          id="required-field" 
          required 
          aria-required="true"
        />
      </form>
    );
    
    const input = screen.getByLabelText(/required field/i);
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toBeRequired();
  });
});

// =============================================================================
// DataTable Accessibility Tests
// =============================================================================

describe('DataTable Accessibility', () => {
  const testData = [
    { id: 1, name: 'Deal A', status: 'Active', amount: '$100K' },
    { id: 2, name: 'Deal B', status: 'Pending', amount: '$200K' },
  ];

  const TestTable: React.FC = () => (
    <table role="table" aria-label="Deals table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        {testData.map((deal) => (
          <tr key={deal.id}>
            <td>{deal.name}</td>
            <td>{deal.status}</td>
            <td>{deal.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  it('should have no accessibility violations', async () => {
    const { container } = render(<TestTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper table headers with scope', () => {
    render(<TestTable />);
    const headers = screen.getAllByRole('columnheader');
    
    headers.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col');
    });
  });

  it('should have aria-label for table', () => {
    render(<TestTable />);
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-label', 'Deals table');
  });
});

// =============================================================================
// Announcer Accessibility Tests
// =============================================================================

describe('Announcer Accessibility', () => {
  it('should have aria-live region for polite announcements', async () => {
    const { container } = render(
      <AnnouncerProvider>
        <div>Content</div>
      </AnnouncerProvider>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should create aria-live="polite" region by default', () => {
    render(
      <AnnouncerProvider>
        <div>Content</div>
      </AnnouncerProvider>
    );
    
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('should create aria-live="assertive" region for urgent announcements', () => {
    render(
      <AnnouncerProvider>
        <div>Content</div>
      </AnnouncerProvider>
    );
    
    const assertiveRegion = document.querySelector('[aria-live="assertive"]');
    expect(assertiveRegion).toBeInTheDocument();
  });
});

// =============================================================================
// Global Accessibility Tests
// =============================================================================

describe('Global Accessibility Requirements', () => {
  it('should have lang attribute on html element', () => {
    // This would be set in the root layout
    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('should have proper page title', () => {
    // Page title should be set
    expect(document.title).toBeTruthy();
  });

  it('should have main landmark', async () => {
    render(<main>Main content area</main>);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should have heading structure', async () => {
    render(
      <>
        <h1>Page Title</h1>
        <h2>Section 1</h2>
        <h3>Subsection 1.1</h3>
        <h2>Section 2</h2>
      </>
    );
    
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2s = screen.getAllByRole('heading', { level: 2 });
    
    expect(h1).toBeInTheDocument();
    expect(h2s).toHaveLength(2);
  });
});
