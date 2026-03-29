# Keyboard Navigation Guide

A comprehensive guide to keyboard navigation in the Redstick Ventures Dashboard.

## Table of Contents

- [Overview](#overview)
- [Global Shortcuts](#global-shortcuts)
- [Page-Specific Shortcuts](#page-specific-shortcuts)
- [Component-Specific Shortcuts](#component-specific-shortcuts)
- [Hooks Reference](#hooks-reference)
- [Accessibility Patterns](#accessibility-patterns)

---

## Overview

All keyboard shortcuts follow these conventions:

- `Ctrl` = Windows/Linux Control key / macOS Command key
- `Shift` = Shift key
- `Alt` = Alt key / Option key
- `Enter` = Return/Enter key
- `Esc` = Escape key
- Arrow keys = Navigation

### Enabling Keyboard Navigation

Keyboard navigation is enabled by default. Press `?` (Shift + /) from anywhere in the application to see available shortcuts.

---

## Global Shortcuts

These shortcuts work throughout the entire application:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + K` | Open Search | Opens the global search modal |
| `Shift + ?` | Show Help | Displays keyboard shortcuts help |
| `Esc` | Close/Cancel | Closes modals, cancels actions, deselects |
| `Ctrl + N` | New Item | Creates a new item (context-dependent) |
| `Ctrl + S` | Save | Saves current form or changes |
| `Tab` | Next Focus | Moves focus to next focusable element |
| `Shift + Tab` | Previous Focus | Moves focus to previous focusable element |

---

## Page-Specific Shortcuts

### Dashboard

| Shortcut | Action |
|----------|--------|
| `1-9` | Navigate to dashboard widgets |
| `R` | Refresh data |
| `F` | Toggle fullscreen mode |

### Pipeline (Kanban Board)

| Shortcut | Action |
|----------|--------|
| `↑ ↓ ← →` | Navigate between cards |
| `Space` | Grab/Drop card |
| `Esc` | Cancel grab |
| `Ctrl + N` | Add new deal to first column |
| `Enter` | Open card details |
| `Delete` | Delete selected card |

### Deals Table

| Shortcut | Action |
|----------|--------|
| `↑ ↓` | Navigate rows |
| `← →` | Navigate cells |
| `Enter` | Edit row / Open details |
| `Space` | Select/deselect row |
| `Ctrl + A` | Select all visible rows |
| `Ctrl + E` | Export to CSV |
| `Ctrl + F` | Focus search input |
| `Delete` | Delete selected rows |

### Portfolio

| Shortcut | Action |
|----------|--------|
| `V` | Switch view (Grid/List) |
| `Ctrl + F` | Filter companies |
| `S` | Sort by current column |

### Settings

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save settings |
| `Tab` | Navigate between settings sections |

---

## Component-Specific Shortcuts

### Modal/Dialog

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modal |
| `Enter` | Confirm action (when button focused) |
| `Tab` | Navigate through focusable elements |
| `Shift + Tab` | Navigate backwards |

Focus behavior:
- First focusable element is focused on open
- Focus is trapped within the modal
- Focus returns to trigger element on close

### Dropdown/Select

| Shortcut | Action |
|----------|--------|
| `Enter` / `Space` | Open dropdown |
| `↑` / `↓` | Navigate options |
| `Enter` | Select option |
| `Esc` | Close dropdown |
| `Home` | Go to first option |
| `End` | Go to last option |
| Type letters | Jump to matching option |

### Tabs

| Shortcut | Action |
|----------|--------|
| `←` / `→` | Switch tabs (horizontal) |
| `↑` / `↓` | Switch tabs (vertical) |
| `Home` | Go to first tab |
| `End` | Go to last tab |

### Data Table

| Shortcut | Action |
|----------|--------|
| `↑` | Previous row |
| `↓` | Next row |
| `←` | Previous cell |
| `→` | Next cell |
| `Enter` | Edit/Activate cell |
| `Space` | Select row |
| `Ctrl + A` | Select all |
| `Page Up` | Previous page |
| `Page Down` | Next page |
| `Home` | First row |
| `End` | Last row |

### Kanban Cards

| Shortcut | Action |
|----------|--------|
| `↑` | Move up in column |
| `↓` | Move down in column |
| `←` | Move to previous column |
| `→` | Move to next column |
| `Space` | Grab/Drop card |
| `Esc` | Cancel grab |

When grabbing a card:
- Arrow keys move the card between columns and positions
- Space drops the card at current position
- Escape cancels the grab operation

---

## Hooks Reference

### useFocusTrap

Traps focus within a container element for modals, dialogs, and dropdowns.

```typescript
import { useFocusTrap } from "@/hooks/useFocusTrap";

function Modal({ isOpen, onClose }) {
  const { containerRef } = useFocusTrap({
    isActive: isOpen,
    onEscape: onClose,
    focusFirstOnActivate: true,
  });

  return (
    <div ref={containerRef} role="dialog">
      {/* Modal content */}
    </div>
  );
}
```

**Options:**
- `isActive`: Whether the focus trap is active
- `onEscape`: Callback when Escape key is pressed
- `focusFirstOnActivate`: Focus first element when activated
- `returnFocusTo`: Element to return focus to on deactivation

### useArrowKeyNavigation

Provides arrow key navigation for lists, grids, and menus.

```typescript
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";

function Dropdown({ items }) {
  const { focusedIndex, getItemProps } = useArrowKeyNavigation({
    items,
    orientation: "vertical",
    onSelect: (item, index) => console.log("Selected:", item),
  });

  return (
    <div role="menu">
      {items.map((item, index) => (
        <button {...getItemProps(index)} key={item.id}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
```

**Options:**
- `items`: Array of items to navigate
- `orientation`: "horizontal" | "vertical" | "grid" | "both"
- `columns`: Number of columns for grid layout
- `onSelect`: Callback when item is selected
- `loop`: Whether to loop around when reaching the end

### useTabNavigation

Manages tab order within a container.

```typescript
import { useTabNavigation } from "@/hooks/useTabNavigation";

function Form() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { focusNext, focusPrevious } = useTabNavigation({
    containerRef,
    wrap: true,
  });

  return <div ref={containerRef}>{/* Form fields */}</div>;
}
```

### useKeyboardShortcut

Registers global keyboard shortcuts.

```typescript
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

function App() {
  useKeyboardShortcut("k", () => {
    openSearch();
  }, { ctrl: true });

  useKeyboardShortcut("Escape", () => {
    closeModal();
  });
}
```

**Options:**
- `key`: Key to listen for (or array of keys)
- `callback`: Function to call when shortcut triggered
- `ctrl`, `shift`, `alt`, `meta`: Require modifier keys
- `preventDefault`: Prevent default browser behavior
- `allowInInput`: Allow when user is typing in input

---

## Accessibility Patterns

### Focus Management

1. **Focus Indicators**: All interactive elements have visible focus indicators
   ```css
   :focus-visible {
     outline: 2px solid #e94560;
     outline-offset: 2px;
   }
   ```

2. **Focus Trap**: Modals and dropdowns trap focus within their containers

3. **Focus Restoration**: When closing modals, focus returns to the trigger element

### Keyboard Navigation Patterns

#### Escape to Close

```typescript
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  if (isOpen) document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [isOpen, onClose]);
```

#### Arrow Key Navigation

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setFocusedIndex(i => Math.min(items.length - 1, i + 1));
      break;
    case 'ArrowUp':
      e.preventDefault();
      setFocusedIndex(i => Math.max(0, i - 1));
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      onSelect(items[focusedIndex]);
      break;
  }
};
```

### ARIA Attributes

Components implement proper ARIA attributes for accessibility:

```tsx
// Modal
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">

// Tabs
<div role="tablist" aria-orientation="horizontal">
  <button role="tab" aria-selected={isActive} aria-controls="panel-id">

// Dropdown
<div role="menu" aria-orientation="vertical">
  <button role="menuitem" tabIndex={isFocused ? 0 : -1}>

// Kanban
<div role="region" aria-label="Pipeline board">
  <div role="list" aria-label="Stage: Inbound">
    <div role="listitem" tabIndex={0} aria-grabbed={isGrabbed}>
```

### Screen Reader Support

- All interactive elements have accessible labels
- Dynamic content changes are announced via ARIA live regions
- Skip links are provided for keyboard users
- Focus management ensures logical navigation order

---

## Best Practices

1. **Always provide keyboard alternatives** for mouse/touch interactions
2. **Maintain visible focus indicators** at all times
3. **Trap focus in modals** to prevent navigation outside
4. **Return focus** to the triggering element when closing
5. **Support standard shortcuts** (Ctrl+S, Esc, etc.)
6. **Document shortcuts** with the KeyboardHelp component
7. **Test with keyboard only** during development
8. **Respect reduced motion** preferences
9. **Ensure sufficient color contrast** for focus indicators

---

## Browser Support

Keyboard navigation is supported in all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Chrome Android 90+
- Safari iOS 14+

For older browsers, basic keyboard navigation still works but some advanced features may be limited.
