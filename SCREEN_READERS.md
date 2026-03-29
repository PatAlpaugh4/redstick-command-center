# Screen Reader Testing Guide

## Overview

This guide covers screen reader testing for the Redstick Ventures application. Ensuring accessibility for users who rely on assistive technologies is critical for an inclusive user experience.

## Quick Start

### Prerequisites

1. **NVDA** (Windows) - Free, open source
2. **JAWS** (Windows) - Commercial software
3. **VoiceOver** (macOS/iOS) - Built into Apple devices
4. **ChromeVox** (Chrome Extension) - Free, browser-based

## Testing with NVDA (Windows)

### Setup

1. Download NVDA from [nvaccess.org](https://www.nvaccess.org/download/)
2. Install or run the portable version
3. Launch NVDA before testing

### Key Commands

| Command | Action |
|---------|--------|
| `Insert + Q` | Quit NVDA |
| `Insert + S` | Toggle speech on/off |
| `Tab` | Move to next focusable element |
| `Shift + Tab` | Move to previous focusable element |
| `H` | Navigate to next heading |
| `1-6` | Navigate to heading level 1-6 |
| `D` | Navigate to next landmark/region |
| `L` | Navigate to next list |
| `T` | Navigate to next table |
| `F` | Navigate to next form field |
| `B` | Navigate to next button |
| `Insert + F7` | Open Elements List |
| `Insert + Space` | Toggle focus/browse mode |

### Testing Checklist

- [ ] Skip link appears on Tab press
- [ ] Headings follow logical hierarchy (h1 → h2 → h3)
- [ ] Landmarks (banner, navigation, main, complementary, contentinfo) are announced
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced when forms submit
- [ ] Dynamic content changes are announced via live regions
- [ ] Button purposes are clear (especially icon-only buttons)
- [ ] Table headers are associated with data cells
- [ ] Modal dialogs trap focus and announce themselves

## Testing with JAWS (Windows)

### Setup

1. Ensure JAWS is installed and licensed
2. Launch JAWS before opening the browser
3. Use Chrome, Edge, or Firefox for best compatibility

### Key Commands

| Command | Action |
|---------|--------|
| `Insert + F4` | Quit JAWS |
| `Insert + S` | Toggle speech on/off |
| `Tab` | Move to next focusable element |
| `Shift + Tab` | Move to previous focusable element |
| `H` | Navigate to next heading |
| `1-6` | Navigate to heading level 1-6 |
| `R` | Navigate to next region/landmark |
| `L` | Navigate to next list |
| `T` | Navigate to next table |
| `F` | Navigate to next form control |
| `B` | Navigate to next button |
| `Insert + F3` | Open Elements List |
| `Insert + Z` | Toggle virtual cursor on/off |

### Testing Checklist

Same as NVDA checklist above.

## Testing with VoiceOver (macOS)

### Setup

1. Press `Cmd + F5` to enable VoiceOver
2. Use Safari for best compatibility
3. Use the VoiceOver rotor to navigate

### Key Commands

| Command | Action |
|---------|--------|
| `Cmd + F5` | Toggle VoiceOver on/off |
| `Ctrl + Option + Right/Left` | Navigate to next/previous element |
| `Tab` | Navigate to next focusable element |
| `Ctrl + Option + Cmd + H` | Navigate to next heading |
| `Ctrl + Option + Cmd + L` | Navigate to next link |
| `Ctrl + Option + Cmd + B` | Navigate to next button |
| `Ctrl + Option + Cmd + F` | Navigate to next form field |
| `Ctrl + Option + Cmd + T` | Navigate to next table |
| `Ctrl + Option + U` | Open Rotor |
| `Ctrl` | Pause speech |

### Touch Gestures (iOS)

| Gesture | Action |
|---------|--------|
| Single tap | Select item |
| Double tap | Activate selected item |
| Swipe right | Move to next element |
| Swipe left | Move to previous element |
| Three-finger swipe | Scroll |
| Two-finger scrub | Go back/gesture escape |
| Two-finger tap | Stop speech |

### Testing Checklist

Same as NVDA checklist above, plus:
- [ ] Touch targets are large enough (44x44pt minimum)
- [ ] Swipe navigation follows logical order
- [ ] Dynamic type (text size) is respected

## Common Issues and Fixes

### Issue: Live Regions Not Announcing

**Symptom:** Dynamic content updates are not announced to screen reader users.

**Fix:**
- Ensure live regions are present in the DOM on initial render
- Use `aria-live="polite"` for non-critical updates
- Use `aria-live="assertive"` for critical errors
- Include `aria-atomic="true"` for complete message announcement

```tsx
// Good - Live region exists on mount
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {message}
</div>

// Bad - Live region added dynamically
{showMessage && (
  <div aria-live="polite">{message}</div>
)}
```

### Issue: Icon-Only Buttons Not Accessible

**Symptom:** Screen reader users don't understand button purpose.

**Fix:**
- Add `aria-label` to describe the action
- Or use `VisuallyHidden` component for text

```tsx
// Good - Using aria-label
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

// Good - Using VisuallyHidden
<button>
  <X aria-hidden="true" />
  <VisuallyHidden>Close dialog</VisuallyHidden>
</button>
```

### Issue: Form Errors Not Announced

**Symptom:** Screen reader users don't hear validation errors.

**Fix:**
- Link error messages to inputs with `aria-describedby`
- Use `aria-invalid="true"` on invalid fields
- Use `role="alert"` or `aria-live="assertive"` for error summaries

```tsx
<input
  id="email"
  aria-describedby={error ? "email-error" : undefined}
  aria-invalid={error ? "true" : "false"}
/>
{error && (
  <span id="email-error" role="alert" className="text-red-500">
    {error}
  </span>
)}
```

### Issue: Missing Skip Links

**Symptom:** Keyboard users must tab through many navigation items to reach content.

**Fix:**
- Include a "Skip to main content" link as the first focusable element
- Ensure it becomes visible on focus

```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Page content */}
</main>
```

### Issue: Tables Without Proper Headers

**Symptom:** Screen reader users can't understand table structure.

**Fix:**
- Use `<th>` with `scope="col"` or `scope="row"`
- Add a `<caption>` for table description

```tsx
<table>
  <caption>Deal Pipeline Summary</caption>
  <thead>
    <tr>
      <th scope="col">Company</th>
      <th scope="col">Stage</th>
      <th scope="col">Amount</th>
    </tr>
  </thead>
  <tbody>
    {/* Data rows */}
  </tbody>
</table>
```

### Issue: Modal Focus Trap Not Working

**Symptom:** Focus can escape from modals, confusing screen reader users.

**Fix:**
- Trap focus within the modal
- Return focus to trigger element on close
- Use `aria-modal="true"` and `role="dialog"`

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">Dialog Title</h2>
  {/* Dialog content */}
</div>
```

## Automated Testing

### axe DevTools

Install axe DevTools browser extension for automated accessibility testing:

1. Chrome: Install from Chrome Web Store
2. Firefox: Install from Firefox Add-ons
3. Run tests on each page/component

### jest-axe (Unit Testing)

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Component from './Component';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### @testing-library/jest-dom

```tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('button has accessible name', () => {
  render(<Button aria-label="Close dialog">X</Button>);
  expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
});
```

## Best Practices

### ARIA Landmark Regions

Every page should have:
- **One** `banner` (header)
- **One** `main` (primary content)
- **Zero or more** `navigation` regions
- **Zero or one** `complementary` (aside)
- **Zero or one** `contentinfo` (footer)
- **Zero or one** `search` region

```tsx
<header role="banner">...</header>
<nav role="navigation" aria-label="Main">...</nav>
<main role="main" id="main-content">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
```

### Heading Hierarchy

- Only one `<h1>` per page
- Don't skip levels (h2 → h4 is bad)
- Headings should describe content sections

```tsx
<h1>Dashboard</h1>
  <h2>Portfolio Overview</h2>
    <h3>Performance Metrics</h3>
  <h2>Recent Activity</h2>
```

### Link Text

- Links should make sense out of context
- Avoid "click here" or "read more"

```tsx
// Bad
<a href="/deals">Click here</a> to view your deals.

// Good
<a href="/deals">View your deals</a>.
```

### Color Contrast

- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18pt+)
- Minimum 3:1 for UI components

Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.

### Focus Indicators

- Always visible focus indicators
- High contrast from background
- Minimum 2px outline or border

## Resources

- [WebAIM Screen Reader Survey](https://webaim.org/projects/screenreadersurvey/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [NVDA Documentation](https://www.nvaccess.org/documentation/)
- [JAWS Documentation](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver Guide](https://www.apple.com/voiceover/info/guide/)

## Support

For accessibility questions or issues:
- Create an issue in the project repository
- Tag with `accessibility` label
- Include screen reader and browser versions
