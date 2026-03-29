# Accessibility Testing Checklist

> Pre-release accessibility testing checklist for Redstick Ventures Dashboard.

## Overview

This checklist ensures WCAG 2.1 AA compliance before each release. All items must be verified by QA before deployment.

---

## Pre-Release Checklist

### Keyboard Navigation

- [ ] **All interactive elements reachable by Tab**
  - Buttons
  - Links
  - Form inputs
  - Custom controls (sliders, toggles, etc.)
  - Menu items
  - Dialog triggers

- [ ] **Focus order is logical**
  - Follows visual reading order (left-to-right, top-to-bottom)
  - No unexpected jumps
  - Modal focus moves to first focusable element
  - Focus returns to trigger when modal closes

- [ ] **Focus indicator visible**
  - Minimum 3:1 contrast ratio
  - Minimum 2px thickness
  - Not obscured by other elements
  - Visible in all themes (light/dark)

- [ ] **Escape closes modals and dropdowns**
  - All modal dialogs close with Escape
  - All dropdown menus close with Escape
  - Focus returns to trigger element

- [ ] **Enter activates buttons/links**
  - All buttons respond to Enter key
  - All links respond to Enter key
  - No unexpected page refreshes

- [ ] **Space activates buttons/checkboxes**
  - Buttons respond to Space key
  - Checkboxes toggle with Space key

- [ ] **Arrow keys work in custom components**
  - Dropdown menus
  - Radio button groups
  - Tabs
  - Sliders
  - Kanban board cards

- [ ] **Home/End/Page keys work**
  - In lists and grids
  - In text inputs

- [ ] **No keyboard traps**
  - Can Tab out of all components
  - Modal focus cycles within modal
  - No infinite loops

---

### Screen Reader Testing

#### Page Structure

- [ ] **Page title announced on load**
  - `<title>` element present and descriptive
  - Title changes on route navigation
  - Format: "Page Name | Redstick Ventures"

- [ ] **Language attribute set**
  - `<html lang="en">` (or appropriate language)
  - Language changes for non-English content

- [ ] **Headings navigable (H key)**
  - Only one H1 per page
  - Heading levels don't skip (no H1 to H3)
  - Headings describe content accurately

- [ ] **Landmarks navigable (D key in NVDA, ; in JAWS)**
  - `<main>` element present
  - `<nav>` for navigation
  - `<aside>` for sidebars
  - `<search>` for search regions
  - Landmark labels are descriptive

- [ ] **Skip link present and functional**
  - Visible on focus
  - Jumps to main content
  - First focusable element on page

#### Content

- [ ] **Images have alt text**
  - Meaningful images have descriptive alt
  - Decorative images have `alt=""`
  - Complex images have extended descriptions

- [ ] **Form labels read correctly**
  - All inputs have associated labels
  - Labels are descriptive
  - Required fields announced
  - Error messages linked with `aria-describedby`

- [ ] **Links have meaningful text**
  - No "click here" or "read more"
  - Link text describes destination
  - External links indicated

- [ ] **Tables read with headers**
  - Column headers with `scope="col"`
  - Row headers with `scope="row"` (if applicable)
  - Table caption or summary
  - Not used for layout

- [ ] **Lists announced correctly**
  - Proper list markup (`<ul>`, `<ol>`, `<li>`)
  - Number of items announced

#### Dynamic Content

- [ ] **Status messages announced**
  - Form submission success/error
  - Data updates
  - Loading states
  - Empty states

- [ ] **Live regions work**
  - `aria-live="polite"` for non-urgent updates
  - `aria-live="assertive"` for urgent updates
  - No excessive announcements

- [ ] **Modal dialogs announced**
  - Role="dialog" present
  - `aria-modal="true"` set
  - `aria-labelledby` or `aria-label` present
  - Focus moves into modal when opened

#### Navigation

- [ ] **Current location indicated**
  - `aria-current="page"` on current nav item
  - Breadcrumbs present and labeled

- [ ] **Menu items work**
  - Submenu toggle buttons labeled
  - Expanded/collapsed state announced
  - Menu can be operated with arrow keys

---

### Visual Testing

#### Color & Contrast

- [ ] **Contrast ratios pass AA**
  - Normal text (4.5:1 minimum)
  - Large text (3:1 minimum)
  - UI components (3:1 minimum)
  - Focus indicators (3:1 minimum)

- [ ] **Color not sole indicator**
  - Errors have icons + text, not just red color
  - Status indicators use icons/shapes + color
  - Links underlined or otherwise distinct

- [ ] **Charts accessible without color**
  - Patterns or labels distinguish data
  - Data table provided as alternative

#### Text & Layout

- [ ] **Text readable at 200% zoom**
  - No horizontal scroll at 1280px viewport
  - Content not cut off
  - Functionality preserved

- [ ] **Layout works at 320px width**
  - Mobile viewport (320px) functional
  - No horizontal scroll
  - Content reflows properly

- [ ] **Text spacing supports**
  - Line height: 1.5x
  - Paragraph spacing: 2x font size
  - Letter spacing: 0.12x font size
  - Word spacing: 0.16x font size
  - No content loss

#### Motion & Animation

- [ ] **Reduced motion supported**
  - Animations disabled when `prefers-reduced-motion: reduce`
  - Essential animations complete quickly (< 5s)
  - No auto-playing content without pause control

- [ ] **No flashing content**
  - Nothing flashes more than 3 times per second
  - No seizure-inducing content

---

### Mobile Accessibility

#### Touch & Gestures

- [ ] **Touch targets 44x44px minimum**
  - Buttons
  - Links
  - Form controls
  - Menu items

- [ ] **No horizontal scroll**
  - Content fits viewport width
  - Tables scroll horizontally if needed

- [ ] **Pinch zoom works**
  - User can zoom to 200%
  - Viewport meta tag allows zooming

#### Screen Reader (Mobile)

- [ ] **Screen reader works on mobile**
  - VoiceOver (iOS) compatible
  - TalkBack (Android) compatible
  - Touch gestures functional

- [ ] **Touch exploration works**
  - All elements discoverable by touch
  - Element descriptions accurate
  - Grouping makes sense

---

### Cognitive Accessibility

- [ ] **Consistent navigation**
  - Navigation in same location on all pages
  - Same labels used for same functions

- [ ] **Error prevention**
  - Confirmations for destructive actions
  - Reversible actions
  - Clear error messages

- [ ] **Input assistance**
  - Form validation clear
  - Error suggestions provided
  - Example formats shown

- [ ] **Sufficient time**
  - No time limits (or extendable)
  - Session timeouts announced

---

## Component-Specific Testing

### Buttons

- [ ] Native `<button>` element used (or `role="button"`)
- [ ] Focusable and clickable
- [ ] Activates with Enter and Space
- [ ] Disabled state indicated
- [ ] Loading state indicated
- [ ] Icon-only buttons have `aria-label`

### Links

- [ ] Native `<a>` element used for navigation
- [ ] `href` attribute present
- [ ] Descriptive link text
- [ ] External links indicated
- [ ] Skip link functional

### Forms

- [ ] Labels associated with inputs (`for` attribute)
- [ ] Required fields indicated visually and programmatically
- [ ] Error messages linked with `aria-describedby`
- [ ] Input types appropriate (email, tel, etc.)
- [ ] Autocomplete attributes where applicable
- [ ] Error summary at top of form

### Tables

- [ ] Headers marked with `scope`
- [ ] Caption or `aria-label` present
- [ ] Responsive (horizontal scroll on mobile if needed)
- [ ] Sortable columns indicate sort state

### Modals/Dialogs

- [ ] `role="dialog"` present
- [ ] `aria-modal="true"` set
- [ ] Focus trapped within modal
- [ ] Escape closes modal
- [ ] Focus returns to trigger on close
- [ ] Click outside closes (optional)

### Dropdowns/Menus

- [ ] `role="menu"` or `role="listbox"` present
- [ ] Arrow key navigation
- [ ] Escape closes
- [ ] Selection announced
- [ ] Current item indicated

### Tabs

- [ ] `role="tablist"`, `role="tab"`, `role="tabpanel"` used
- [ ] Arrow keys navigate tabs
- [ ] Tab panel labeled with `aria-labelledby`
- [ ] Selected tab indicated with `aria-selected`

### Charts

- [ ] Data table provided as alternative
- [ ] Summary text describes key insights
- [ ] Interactive elements keyboard accessible
- [ ] Color patterns distinguish data

### Kanban Board

- [ ] Cards keyboard navigable
- [ ] Move operations have keyboard alternative
- [ ] Drop zones labeled
- [ ] Status changes announced

---

## Testing Environment

### Browsers

Test in these browser/screen reader combinations:

| Browser | Screen Reader | Priority |
|---------|---------------|----------|
| Chrome | NVDA | Required |
| Firefox | NVDA | Required |
| Safari | VoiceOver (macOS) | Required |
| Edge | JAWS | Required |
| Chrome | TalkBack (Android) | Recommended |
| Safari | VoiceOver (iOS) | Recommended |

### Tools

#### Automated

- [ ] axe DevTools extension
- [ ] Lighthouse accessibility audit
- [ ] WAVE evaluation tool
- [ ] Color contrast analyzer

#### Manual

- [ ] Keyboard-only navigation
- [ ] Screen reader testing
- [ ] 200% zoom testing
- [ ] 320px viewport testing

---

## Testing Process

### Pre-Test Setup

1. Set up testing environment with required browsers
2. Install and configure screen readers
3. Clear cache and cookies
4. Set viewport to 1280x720 (desktop) or 375x667 (mobile)

### Testing Steps

1. **Automated Testing First**
   - Run `npm run test:a11y`
   - Review and fix axe violations
   - Run Lighthouse audit

2. **Keyboard Testing**
   - Unplug mouse/trackpad
   - Navigate entire application with keyboard only
   - Check all checklist items above

3. **Screen Reader Testing**
   - Enable screen reader
   - Navigate with screen reader shortcuts
   - Verify all content is accessible

4. **Visual Testing**
   - Test zoom levels (100%, 150%, 200%)
   - Test responsive breakpoints
   - Verify color contrast

5. **Mobile Testing**
   - Test on actual devices if possible
   - Enable screen reader on mobile
   - Test touch targets

### Bug Reporting

For each issue found:

```markdown
**Issue**: [Brief description]
**WCAG Criterion**: [e.g., 1.4.3 Contrast Minimum]
**Severity**: [Critical/High/Medium/Low]
**Steps to Reproduce**:
1. Step one
2. Step two

**Expected**: [What should happen]
**Actual**: [What actually happens]

**Environment**:
- Browser: [e.g., Chrome 120]
- Screen Reader: [e.g., NVDA 2023.3]
- OS: [e.g., Windows 11]
```

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Accessibility Specialist | | | |
| Product Owner | | | |

---

## References

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WCAG-EM Report Tool](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM Resources](https://webaim.org/resources/)

---

<p align="center">
  <strong>Questions?</strong> Contact accessibility@redstick.vc
</p>
