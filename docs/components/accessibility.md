# Component Accessibility Guide

Accessibility features and implementation details for each component in the library.

---

## Overview

All components in our library are designed to meet **WCAG 2.1 AA** standards. This document provides detailed accessibility information for each component.

### Universal Features

Every component includes:
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader compatibility
- ✅ Reduced motion support (`prefers-reduced-motion`)
- ✅ High contrast mode support (`forced-colors`)
- ✅ Proper color contrast ratios (4.5:1 minimum)

---

## Button Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Enter` | Activate button |
| `Space` | Activate button |
| `Tab` | Focus next button |
| `Shift + Tab` | Focus previous button |

### ARIA Attributes

```tsx
// Default button
<button 
  type="button"
  role="button"
>
  Click me
</button>

// Disabled button
<button 
  aria-disabled="true"
  disabled
>
  Disabled
</button>

// Loading button
<button 
  aria-busy="true"
  aria-label="Saving, please wait"
>
  <Spinner />
  Saving...
</button>

// Icon-only button (CRITICAL)
<button 
  aria-label="Delete item"
>
  <TrashIcon aria-hidden="true" />
</button>
```

### Implementation Notes

- **Icon-only buttons MUST have `aria-label`**
- Loading state announces to screen readers via `aria-busy`
- Disabled buttons use `disabled` attribute (not just styling)
- Focus indicator: 2px solid outline with 2px offset

### Common Mistakes

```tsx
// ❌ BAD: Icon-only without label
<button><TrashIcon /></button>

// ✅ GOOD: Icon-only with aria-label
<button aria-label="Delete deal"><TrashIcon aria-hidden="true" /></button>

// ❌ BAD: Color alone for state
<button className="bg-red-500">Delete</button>

// ✅ GOOD: Clear text label
<button className="bg-red-500" variant="danger">Delete</button>
```

---

## Card Accessibility

### Interactive Cards

```tsx
// ❌ BAD: Clickable div
<div onClick={handleClick}>Card content</div>

// ✅ GOOD: Proper interactive card
<button 
  className="card"
  onClick={handleClick}
  aria-label="View deal details for Acme Corp"
>
  Card content
</button>

// OR using role
<div 
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  aria-label="View deal details"
>
  Card content
</div>
```

### Keyboard Support

Interactive cards respond to:
- `Enter` - Activate
- `Space` - Activate
- Focus moves to card when tabbed

### Screen Reader Support

```tsx
<article aria-labelledby="card-title">
  <h3 id="card-title">Deal Name</h3>
  <p>Deal description</p>
  <footer>
    <time dateTime="2024-01-15">Jan 15, 2024</time>
  </footer>
</article>
```

---

## Badge Accessibility

### Status Badges

Never rely on color alone for status:

```tsx
// ❌ BAD: Color only
<Badge color="red">Error</Badge>

// ✅ GOOD: Text with semantic color
<Badge variant="error">Error</Badge>

// ✅ GOOD: With icon for extra clarity
<Badge variant="error">
  <XCircleIcon aria-hidden="true" className="mr-1" />
  Error
</Badge>
```

### ARIA Attributes

```tsx
// Status indicator with hidden visual dot
<span className="badge">
  <span aria-hidden="true" className="dot success" />
  <span>Active</span>
</span>

// For live status updates
<span role="status" aria-live="polite" className="badge">
  {status}
</span>
```

---

## DataTable Accessibility

### Table Structure

```tsx
<table role="table" aria-label="Deals list">
  <thead>
    <tr>
      {/* Checkbox for selection */}
      <th scope="col">
        <input 
          type="checkbox" 
          aria-label="Select all rows"
        />
      </th>
      <th scope="col" aria-sort="ascending">
        <button aria-label="Sort by company name">
          Company
          <ArrowUpIcon aria-hidden="true" />
        </button>
      </th>
      <th scope="col">Stage</th>
    </tr>
  </thead>
  <tbody>
    <tr aria-selected="false">
      <td>
        <input 
          type="checkbox" 
          aria-label="Select Acme Corp"
        />
      </td>
      <td>Acme Corp</td>
      <td>Closed</td>
    </tr>
  </tbody>
</table>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move to next cell |
| `Shift + Tab` | Move to previous cell |
| `Enter` | Activate row/button in cell |
| `Space` | Toggle checkbox selection |
| Arrow Keys | Navigate cells (when in grid mode) |

### ARIA Attributes

```tsx
// Sortable column
<th 
  scope="col" 
  aria-sort="ascending" // or "descending", "none"
>
  <button>Company Name</button>
</th>

// Selected row
<tr aria-selected="true">

// Select all checkbox
<input 
  type="checkbox" 
  aria-label="Select all deals"
  aria-checked="mixed" // or "true", "false"
/>

// Loading state
<table aria-busy="true" aria-label="Loading deals">
```

### Screen Reader Announcements

```tsx
// Announce selection changes
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {selectedCount} items selected
</div>

// Announce sort changes
<div aria-live="polite" className="sr-only">
  Sorted by {sortColumn} in {sortDirection} order
</div>
```

---

## Modal/Dialog Accessibility

### Focus Management

- Focus moves to modal when opened
- Focus trap keeps focus within modal
- Focus returns to trigger when closed
- Initial focus on first focusable element or title

### ARIA Structure

```tsx
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Delete</h2>
  <p id="modal-description">
    This action cannot be undone.
  </p>
  {/* Focus trap wrapper */}
  <div ref={focusTrapRef}>
    <button>Cancel</button>
    <button>Delete</button>
  </div>
</div>
```

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Cycle through focusable elements |
| `Shift + Tab` | Reverse cycle |
| `Escape` | Close modal |
| `Enter` | Activate focused button |

### Implementation

```tsx
function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      // Focus first focusable element or title
      const focusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable as HTMLElement)?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      previousFocus.current?.focus();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    // Focus trap logic...
  };

  return isOpen ? (
    <div 
      role="presentation"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  ) : null;
}
```

---

## Toast/Notification Accessibility

### Live Regions

```tsx
// Toast container with live region
<div 
  role="region"
  aria-label="Notifications"
  aria-live="polite"
  aria-atomic="true"
>
  {toasts.map(toast => (
    <div 
      key={toast.id}
      role="alert"
      aria-label={`${toast.type}: ${toast.message}`}
    >
      {toast.message}
    </div>
  ))}
</div>
```

### Priority Levels

| Type | ARIA Live | Use Case |
|------|-----------|----------|
| Success | `polite` | Non-urgent confirmations |
| Info | `polite` | General information |
| Warning | `polite` | Cautionary messages |
| Error | `assertive` | Critical errors requiring attention |

### Keyboard Support

- Toasts are not focusable by default
- Action buttons within toasts are focusable
- `Escape` dismisses visible toasts

### Screen Reader Behavior

```tsx
// Success (polite, waits for current speech)
toast.success('Changes saved');
// Announced after current speech completes

// Error (assertive, interrupts)
toast.error('Failed to save');
// Announced immediately, interrupts current speech
```

---

## Form Components Accessibility

### Input/TextField

```tsx
<div>
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? 'email-error' : undefined}
    autoComplete="email"
  />
  {hasError && (
    <span id="email-error" role="alert">
      Please enter a valid email
    </span>
  )}
</div>
```

### Select/Dropdown

```tsx
<div>
  <label id="stage-label">Deal Stage</label>
  <button
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-labelledby="stage-label stage-value"
    aria-controls="stage-listbox"
  >
    <span id="stage-value">{selectedLabel}</span>
    <ChevronDownIcon aria-hidden="true" />
  </button>
  
  {isOpen && (
    <ul
      id="stage-listbox"
      role="listbox"
      aria-labelledby="stage-label"
    >
      {options.map(option => (
        <li
          key={option.value}
          role="option"
          aria-selected={option.value === selectedValue}
        >
          {option.label}
        </li>
      ))}
    </ul>
  )}
</div>
```

### Keyboard Support for Select

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open/close dropdown |
| `ArrowDown` | Next option |
| `ArrowUp` | Previous option |
| `Home` | First option |
| `End` | Last option |
| `Escape` | Close dropdown |
| Letter keys | Jump to matching option |

### Switch/Toggle

```tsx
<button
  role="switch"
  aria-checked={isChecked}
  aria-labelledby="switch-label"
  onClick={toggle}
>
  <span className="sr-only">Enable notifications</span>
  <span aria-hidden="true" className="track">
    <span className="thumb" />
  </span>
</button>
<span id="switch-label">Enable notifications</span>
```

---

## Tabs Accessibility

### ARIA Structure

```tsx
<div>
  {/* Tab list */}
  <div role="tablist" aria-label="Deal sections">
    <button
      role="tab"
      aria-selected={activeTab === 'overview'}
      aria-controls="overview-panel"
      id="overview-tab"
      tabIndex={activeTab === 'overview' ? 0 : -1}
    >
      Overview
    </button>
    <button
      role="tab"
      aria-selected={activeTab === 'metrics'}
      aria-controls="metrics-panel"
      id="metrics-tab"
      tabIndex={activeTab === 'metrics' ? 0 : -1}
    >
      Metrics
    </button>
  </div>
  
  {/* Tab panels */}
  <div
    role="tabpanel"
    id="overview-panel"
    aria-labelledby="overview-tab"
    hidden={activeTab !== 'overview'}
  >
    Overview content
  </div>
  <div
    role="tabpanel"
    id="metrics-panel"
    aria-labelledby="metrics-tab"
    hidden={activeTab !== 'metrics'}
  >
    Metrics content
  </div>
</div>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus into/out of tab list |
| `ArrowLeft` / `ArrowRight` | Previous/Next tab |
| `Home` | First tab |
| `End` | Last tab |
| `Enter` / `Space` | Activate focused tab |

---

## Tooltip Accessibility

### Implementation

```tsx
// Trigger element with aria-describedby
<button 
  aria-describedby="tooltip-1"
  onFocus={showTooltip}
  onBlur={hideTooltip}
  onMouseEnter={showTooltip}
  onMouseLeave={hideTooltip}
>
  Delete
</button>

// Tooltip (hidden by default, shown on hover/focus)
<div
  id="tooltip-1"
  role="tooltip"
  className={isVisible ? 'visible' : 'hidden'}
>
  Permanently delete this item
</div>
```

### Important Notes

- Tooltip content is in `aria-describedby`
- Tooltips appear on BOTH hover AND focus
- Tooltips disappear on blur or Escape key
- Never put interactive content in tooltips

---

## Progress/Loading Accessibility

### Linear Progress

```tsx
// Determinate
<div
  role="progressbar"
  aria-valuenow={75}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Upload progress"
>
  <div style={{ width: '75%' }} />
</div>

// Indeterminate
<div
  role="progressbar"
  aria-valuetext="Loading..."
  aria-busy="true"
  aria-label="Loading data"
>
  <div className="animated-bar" />
</div>
```

### Skeleton Loading

```tsx
// Announce loading state
<div aria-busy="true" aria-label="Loading deals">
  <Skeleton count={5} />
</div>
```

---

## Avatar Accessibility

### With Image

```tsx
<img
  src="/avatar.jpg"
  alt="John Doe's profile picture"
  role="img"
/>
```

### With Initials (No Image)

```tsx
<div
  role="img"
  aria-label="John Doe"
  title="John Doe"
>
  JD
</div>
```

### Status Indicator

```tsx
<div className="avatar-wrapper">
  <img src="/avatar.jpg" alt="John Doe" />
  <span 
    className="status-dot online"
    aria-label="Online"
    title="Online"
  />
</div>
```

---

## Reduced Motion Support

### Implementation

```tsx
// CSS approach
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
    transition: none;
  }
}

// React approach with hook
function Component() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
    />
  );
}
```

### Components with Reduced Motion

| Component | Reduced Motion Behavior |
|-----------|------------------------|
| FadeIn | Immediate visibility, no animation |
| Modal | No scale/opacity transition |
| Toast | No slide-in animation |
| Skeleton | Static pulse or no animation |
| Accordion | Instant open/close |
| Progress | No animated stripes |

---

## High Contrast Mode

### Windows High Contrast (`forced-colors`)

```css
@media (forced-colors: active) {
  .button {
    border: 2px solid ButtonText;
  }
  
  .button:focus {
    outline: 2px solid Highlight;
  }
  
  .card {
    border: 1px solid CanvasText;
  }
}
```

### macOS High Contrast (`prefers-contrast`)

```css
@media (prefers-contrast: high) {
  .button {
    border-width: 2px;
  }
  
  .focus-ring {
    outline-width: 3px;
  }
}
```

---

## Testing Checklist

### Per Component

- [ ] Keyboard navigation works
- [ ] Focus indicator is visible
- [ ] Screen reader announces properly
- [ ] Color is not sole means of conveying info
- [ ] Reduced motion is respected
- [ ] High contrast mode works

### Screen Reader Testing

Test with:
- NVDA (Windows)
- JAWS (Windows)  
- VoiceOver (macOS)
- TalkBack (Android)
- VoiceOver (iOS)

### Automated Testing

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)
- [WebAIM Articles](https://webaim.org/articles/)
