# Accessibility Guide

This document outlines the accessibility features, patterns, and testing procedures for the application.

## Overview

This application is designed to meet **WCAG 2.1 AA** compliance standards. We follow inclusive design principles to ensure all users can access and use our features regardless of how they interact with technology.

## WCAG 2.1 AA Compliance Status

### Perceivable
- ✅ **1.1.1 Non-text Content** - All images have alt text, icons have aria-hidden or aria-label
- ✅ **1.2.1-1.2.5 Time-based Media** - Captions and transcripts provided where applicable
- ✅ **1.3.1 Info and Relationships** - Proper heading hierarchy, semantic HTML, ARIA landmarks
- ✅ **1.3.2 Meaningful Sequence** - Content order is logical and meaningful
- ✅ **1.3.3 Sensory Characteristics** - Instructions don't rely solely on color/shape
- ✅ **1.3.4 Orientation** - Content works in both portrait and landscape
- ✅ **1.3.5 Identify Input Purpose** - Form inputs have autocomplete attributes
- ✅ **1.4.1 Use of Color** - Information not conveyed by color alone
- ✅ **1.4.2 Audio Control** - Audio can be paused/stopped
- ✅ **1.4.3 Contrast (Minimum)** - 4.5:1 contrast ratio for normal text, 3:1 for large text
- ✅ **1.4.4 Resize Text** - Text can be resized to 200% without loss of content
- ✅ **1.4.5 Images of Text** - Text used instead of images where possible
- ✅ **1.4.10 Reflow** - Content reflows at 320px viewport without horizontal scroll
- ✅ **1.4.11 Non-text Contrast** - UI components have 3:1 contrast ratio
- ✅ **1.4.12 Text Spacing** - Content remains visible with increased spacing
- ✅ **1.4.13 Content on Hover/Focus** - Hover content is dismissible, hoverable, and persistent

### Operable
- ✅ **2.1.1 Keyboard** - All functionality available via keyboard
- ✅ **2.1.2 No Keyboard Trap** - Users can navigate away from all elements
- ✅ **2.1.4 Character Key Shortcuts** - Single-key shortcuts can be turned off/remapped
- ✅ **2.2.1 Timing Adjustable** - Time limits can be extended or turned off
- ✅ **2.2.2 Pause, Stop, Hide** - Moving/blinking content can be controlled
- ✅ **2.3.1 Three Flashes** - No content flashes more than 3 times per second
- ✅ **2.4.1 Bypass Blocks** - Skip links provided to bypass navigation
- ✅ **2.4.2 Page Titled** - Pages have descriptive titles
- ✅ **2.4.3 Focus Order** - Focus moves in logical sequence
- ✅ **2.4.4 Link Purpose** - Link text describes destination
- ✅ **2.4.5 Multiple Ways** - Multiple ways to find pages (nav, search, sitemap)
- ✅ **2.4.6 Headings and Labels** - Descriptive headings and labels
- ✅ **2.4.7 Focus Visible** - Focus indicator is clearly visible
- ✅ **2.5.1 Pointer Gestures** - No multi-point or path-based gestures required
- ✅ **2.5.2 Pointer Cancellation** - Actions on mouse up, not mouse down
- ✅ **2.5.3 Label in Name** - Accessible name contains visible text
- ✅ **2.5.4 Motion Actuation** - Motion can be disabled, alternative provided

### Understandable
- ✅ **3.1.1 Language of Page** - HTML lang attribute set
- ✅ **3.1.2 Language of Parts** - Language changes marked
- ✅ **3.2.1 On Focus** - Focus doesn't trigger context change
- ✅ **3.2.2 On Input** - Input doesn't automatically submit/change context
- ✅ **3.2.3 Consistent Navigation** - Navigation consistent across pages
- ✅ **3.2.4 Consistent Identification** - Components identified consistently
- ✅ **3.3.1 Error Identification** - Errors clearly identified
- ✅ **3.3.2 Labels or Instructions** - Labels and instructions provided
- ✅ **3.3.3 Error Suggestion** - Suggestions for error correction provided
- ✅ **3.3.4 Error Prevention** - Review/correction for important submissions

### Robust
- ✅ **4.1.1 Parsing** - Valid HTML with no duplicate IDs
- ✅ **4.1.2 Name, Role, Value** - Components have proper name, role, value
- ✅ **4.1.3 Status Messages** - Status messages announced to screen readers

## Component Accessibility

### Button Component
```typescript
// Icon-only buttons require aria-label
<IconButton 
  icon={<Trash2 aria-hidden="true" />} 
  aria-label="Delete deal" 
/>

// Loading state announces to screen readers
<Button loading loadingText="Saving changes...">
  Save
</Button>
```

**ARIA Attributes:**
- `aria-label` - Descriptive label for icon-only buttons
- `aria-disabled` - When button is disabled
- `aria-busy` - When button is in loading state
- `aria-describedby` - Links to description text

### Card Component
```typescript
// Interactive cards
<Card 
  interactive 
  onClick={handleClick}
  aria-label="View deal details for Acme Corp"
>
  {/* content */}
</Card>
```

**ARIA Attributes:**
- `role="button"` - When card is interactive
- `tabIndex={0}` - Makes card focusable
- `aria-label` - Describes card purpose

### DataTable Component
```typescript
<DataTable
  data={deals}
  columns={columns}
  rowKey="id"
  // Selection announced via aria-live
/>
```

**ARIA Attributes:**
- `role="table"` - Implicit on table element
- `scope="col"` / `scope="row"` - On header cells
- `aria-sort` - On sortable column headers
- `aria-selected` - On selected rows
- `aria-label` - On action buttons

### SkipLink Component
```typescript
// Place at top of page
<SkipLink targetId="main-content" />

// Main content area
<main id="main-content" tabIndex={-1}>
  {/* page content */}
</main>
```

**Features:**
- Visible on keyboard focus
- Hidden visually but available to screen readers
- Smooth scroll to target
- Sets focus on target element

### Announcer/LiveRegion Component
```typescript
// Hook usage
const { announce } = useAnnouncer();
announce('Deal saved successfully', 'polite');

// Component usage
<Announcer 
  message={statusMessage} 
  priority="polite" 
/>
```

**Priority Levels:**
- `polite` - Non-interrupting, waits for current speech
- `assertive` - Interrupts immediately for urgent info
- `off` - Not announced

### Badge Component
```typescript
// Status badges include visual indicator
<StatusBadge status="active" />
// Renders: [●] Active with screen reader text
```

**ARIA Attributes:**
- Visual dot is `aria-hidden`
- Text content announced to screen readers

### Form Components
```typescript
// Always associate labels with inputs
<label htmlFor="email">Email Address</label>
<input 
  id="email" 
  type="email" 
  aria-required="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  {errorMessage}
</span>
```

**ARIA Attributes:**
- `aria-required` - Required field indicator
- `aria-invalid` - Validation error state
- `aria-describedby` - Links to error message
- `autocomplete` - For password managers

### Chart Components
```typescript
<ActivityChart 
  data={data}
  aria-label="Activity chart showing deals by month"
/>
```

**Accessibility Features:**
- Charts have aria-label describing content
- Data available in table format for screen readers
- Keyboard navigation between data points

## Testing Accessibility

### Automated Testing

Run the accessibility audit:

```typescript
import { runAccessibilityAudit, runQuickAudit } from '@/lib/a11y/audit';

// Full audit
const report = runAccessibilityAudit();
console.log(report.summary);
console.log(report.violations);

// Quick audit (critical checks only)
const quick = runQuickAudit();
console.log(quick.passed); // boolean
```

### Individual Checks

```typescript
import { 
  checkHeadingHierarchy,
  checkAriaLabels,
  checkContrast,
  checkFocusVisible,
  checkFormLabels 
} from '@/lib/a11y/checks';

// Check heading structure
const headingCheck = checkHeadingHierarchy();

// Check contrast of specific element
const contrast = checkContrast(document.getElementById('button'));

// Check form labels
const formCheck = checkFormLabels();
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through entire page - all interactive elements reachable
- [ ] Tab order is logical and follows visual order
- [ ] Focus indicator is clearly visible (2px outline minimum)
- [ ] Can activate all buttons/links with Enter/Space
- [ ] Can navigate dropdowns with arrow keys
- [ ] Esc key closes modals, dropdowns, and menus
- [ ] No keyboard traps - can Tab away from all elements

#### Screen Reader Testing
- [ ] Page title is descriptive and unique
- [ ] Headings are properly nested (h1 → h2 → h3)
- [ ] All images have meaningful alt text
- [ ] Form labels are properly associated
- [ ] Error messages are announced
- [ ] Status updates are announced via live regions
- [ ] Skip link allows bypassing navigation
- [ ] ARIA landmarks are present (main, nav, etc.)

#### Visual Testing
- [ ] Text remains readable at 200% zoom
- [ ] Content reflows without horizontal scroll at 320px width
- [ ] Color is not the only way to convey information
- [ ] Contrast ratios meet requirements
- [ ] Focus indicators are visible on all interactive elements
- [ ] Text spacing can be increased without loss of content

### Browser DevTools

#### Chrome/Lighthouse
1. Open DevTools → Lighthouse
2. Select "Accessibility" category
3. Run audit

#### Firefox Accessibility Inspector
1. Open DevTools → Accessibility
2. Check for contrast issues
3. Simulate keyboard navigation

#### axe DevTools Extension
1. Install axe DevTools browser extension
2. Run scan on each page
3. Address all critical and serious issues

### Screen Reader Testing

#### NVDA (Windows - Free)
- Download: https://www.nvaccess.org/
- Test with Firefox or Chrome
- Common shortcuts:
  - `H` - Next heading
  - `T` - Next table
  - `F` - Next form field
  - `Insert + F7` - Elements list

#### VoiceOver (macOS - Built-in)
- Enable: Cmd + F5
- Test with Safari
- Common shortcuts:
  - `Cmd + Option + Right/Left` - Next/previous element
  - `Cmd + Option + H` - Next heading
  - `Cmd + Option + T` - Next table
  - `Cmd + Option + U` - Rotor (elements list)

#### JAWS (Windows - Paid)
- Industry standard for Windows
- Test with Chrome or Edge

### Accessibility Statement

```
Redstick Ventures is committed to ensuring digital accessibility for people with disabilities. 
We are continually improving the user experience for everyone, and applying the relevant 
accessibility standards.

Conformance Status
We aim to conform to WCAG 2.1 level AA.

Feedback
We welcome your feedback on the accessibility of our application. Please let us know if you 
encounter accessibility barriers:

E-mail: accessibility@redstick.example.com
We try to respond to feedback within 5 business days.
```

## Common Issues and Fixes

### Issue: Missing Alt Text
```typescript
// ❌ Bad
<img src="logo.png" />

// ✅ Good
<img src="logo.png" alt="Redstick Ventures" />

// ✅ Decorative image
<img src="decoration.png" alt="" />
```

### Issue: Icon-Only Buttons
```typescript
// ❌ Bad
<button onClick={delete}>
  <Trash2 />
</button>

// ✅ Good
<button onClick={delete} aria-label="Delete deal">
  <Trash2 aria-hidden="true" />
</button>
```

### Issue: Poor Contrast
```typescript
// ❌ Bad (insufficient contrast)
<p className="text-gray-400">Important text</p>

// ✅ Good (4.5:1 or better)
<p className="text-gray-300">Important text</p>
```

### Issue: Missing Form Labels
```typescript
// ❌ Bad
<input type="email" placeholder="Email" />

// ✅ Good
<label htmlFor="email">Email Address</label>
<input 
  id="email" 
  type="email" 
  placeholder="you@example.com"
/>
```

### Issue: Broken Heading Hierarchy
```html
<!-- ❌ Bad -->
<h1>Title</h1>
<h3>Section</h3>

<!-- ✅ Good -->
<h1>Title</h1>
<h2>Section</h2>
```

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Evaluation Tool](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Training
- [Web Accessibility by Google (Udacity)](https://www.udacity.com/course/web-accessibility--ud891)
- [Accessibility Developer Guide](https://www.accessibility-developer-guide.com/)

## Contact

For accessibility questions or to report issues:
- Email: accessibility@redstick.example.com
- Internal Slack: #accessibility
