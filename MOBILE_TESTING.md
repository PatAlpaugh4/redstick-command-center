# Mobile Layout Optimization - Testing Checklist

> **Workstream 5A**: Mobile Layout Optimization

This document outlines the comprehensive testing procedures for ensuring responsive design across all device breakpoints.

---

## 📱 Device Breakpoints

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| Small Phones | 320px | iPhone 5/SE (1st gen), older Android |
| iPhone SE | 375px | iPhone SE (2020/2022), iPhone 8 |
| iPhone Max | 414px | iPhone 14/15 Pro Max, large Android |
| Tablets | 768px | iPad Mini, small tablets |
| Small Laptops | 1024px | iPad Pro, small laptops |
| Desktops | 1440px+ | Desktop monitors |

---

## ✅ Testing Checklist

### 1. Browser Testing

#### iOS Safari
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPhone 14/15 Pro (393px)
- [ ] Test on iPhone 14/15 Pro Max (430px)
- [ ] Test on iPad Mini (768px)
- [ ] Test on iPad Pro 11" (834px)
- [ ] Test on iPad Pro 12.9" (1024px)

#### Chrome Android
- [ ] Test on small Android (320px-360px)
- [ ] Test on medium Android (360px-400px)
- [ ] Test on large Android (400px-450px)
- [ ] Test on Android tablets (600px+)

#### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

### 2. Layout Testing

#### Horizontal Scroll
- [ ] No horizontal scroll at 320px
- [ ] No horizontal scroll at 375px
- [ ] No horizontal scroll at 414px
- [ ] No horizontal scroll at 768px
- [ ] Tables scroll horizontally only within container
- [ ] Kanban boards scroll horizontally as designed

#### Grid Systems
- [ ] Stats cards: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
- [ ] Charts: 1 col (mobile) → 2 cols (desktop)
- [ ] Content grids adapt properly at all breakpoints

#### Tables
- [ ] Tables display as cards on mobile (< 768px)
- [ ] Tables have horizontal scroll with hidden overflow
- [ ] Column visibility hides less important columns on mobile
- [ ] Touch targets for row actions are minimum 44px

---

### 3. Typography Testing

#### Font Sizes
- [ ] Input fields are minimum 16px on mobile (prevents iOS zoom)
- [ ] Input fields reduce to 14px on desktop (≥ 768px)
- [ ] Headings scale properly: 24px → 30px (h1)
- [ ] Body text remains readable at all sizes

#### Text Overflow
- [ ] Long text truncates with ellipsis where appropriate
- [ ] No text breaks layout at any breakpoint
- [ ] URLs and long words break properly with `word-break`

---

### 4. Touch & Interaction Testing

#### Touch Targets
- [ ] All interactive elements minimum 44px × 44px
- [ ] Comfortable touch targets (48px) on mobile
- [ ] Buttons have adequate spacing between them
- [ ] No overlapping touch targets

#### Touch Actions
- [ ] Swipe gestures work on mobile drawers
- [ ] Pull-to-refresh works if implemented
- [ ] Pinch-to-zoom works where appropriate
- [ ] Horizontal scroll areas don't interfere with vertical scroll

---

### 5. Component Testing

#### DashboardShell / Sidebar
- [ ] Mobile: Hamburger menu opens drawer
- [ ] Mobile: Overlay appears behind drawer
- [ ] Mobile: Swipe to close drawer works
- [ ] Mobile: Drawer doesn't exceed 80vw width
- [ ] Desktop: Sidebar is fixed and always visible
- [ ] Desktop: No hamburger menu shown

#### Modals
- [ ] Mobile (< 375px): Full screen modal
- [ ] Mobile (≥ 375px): Bottom sheet style
- [ ] Desktop: Centered dialog
- [ ] All sizes: Proper max-height (90vh)
- [ ] All sizes: Scrollable content if needed
- [ ] Escape key closes modal
- [ ] Click outside closes modal (configurable)

#### Data Tables
- [ ] Mobile: Card view displays correctly
- [ ] Mobile: Horizontal scroll within container
- [ ] Desktop: Full table view with all columns
- [ ] Sorting works on both mobile and desktop
- [ ] Row selection works on both mobile and desktop
- [ ] Actions menu accessible on touch devices

#### Charts
- [ ] Charts resize properly on viewport change
- [ ] Chart height: 192px mobile → 256px tablet → 320px desktop
- [ ] Tooltips work on touch devices
- [ ] Legends display properly on small screens

#### Kanban Board
- [ ] Horizontal scroll with snap points on mobile
- [ ] Desktop: Full grid layout
- [ ] Cards are touch-friendly
- [ ] Drag handles visible and usable

---

### 6. Orientation Testing

#### Portrait Mode
- [ ] Layout works at all breakpoints in portrait
- [ ] Sidebar drawer works in portrait
- [ ] Modals display correctly in portrait

#### Landscape Mode
- [ ] iPhone landscape (667px-926px width)
- [ ] iPad landscape (1024px-1366px width)
- [ ] Content reflows appropriately
- [ ] Tables may switch to desktop view in landscape

---

### 7. Accessibility Testing

#### Font Scaling
- [ ] Test at 100% system font size
- [ ] Test at 150% system font size
- [ ] Test at 200% system font size
- [ ] Layout doesn't break with larger fonts
- [ ] No text is clipped or obscured

#### Color Contrast
- [ ] All text meets WCAG 4.5:1 contrast ratio
- [ ] Large text meets WCAG 3:1 contrast ratio
- [ ] Interactive elements have visible focus states

#### Screen Readers
- [ ] Test with VoiceOver (iOS)
- [ ] Test with TalkBack (Android)
- [ ] All images have alt text
- [ ] All interactive elements have labels
- [ ] Skip links work properly

---

### 8. Performance Testing

#### Load Time
- [ ] First Contentful Paint < 1.8s on 4G
- [ ] Largest Contentful Paint < 2.5s on 4G
- [ ] Time to Interactive < 3.8s on 4G

#### Scroll Performance
- [ ] Smooth scrolling on all devices
- [ ] No jank during scroll
- [ ] Virtualized lists if > 100 items

#### Animation Performance
- [ ] 60fps animations
- [ ] `transform` and `opacity` used for animations
- [ ] `will-change` applied sparingly

---

### 9. Input Testing

#### Keyboard
- [ ] Input fields don't cause page zoom on iOS
- [ ] Numeric inputs show number pad
- [ ] Email inputs show email keyboard
- [ ] Date inputs work properly
- [ ] Form navigation via "Next" button works

#### Virtual Keyboard
- [ ] Layout adjusts when keyboard opens
- [ ] Input fields remain visible above keyboard
- [ ] Fixed elements behave correctly with keyboard

---

### 10. Edge Cases

#### Very Small Screens (< 320px)
- [ ] Layout doesn't break
- [ ] Content remains accessible
- [ ] Horizontal scroll doesn't appear

#### Very Large Screens (> 1920px)
- [ ] Content doesn't stretch too wide
- [ ] Max-width constraints work
- [ ] Centered layout looks good

#### Slow Networks
- [ ] Skeleton screens display while loading
- [ ] Images have proper placeholders
- [ ] Critical CSS is inlined

---

## 🔧 Testing Tools

### Browser DevTools
- Device Mode for responsive testing
- Network throttling (Fast 3G, Slow 4G)
- Performance profiling
- Lighthouse audits

### Physical Devices
- iPhone (various models)
- Android phones (various models)
- iPad
- Android tablets

### Emulators/Simulators
- iOS Simulator (Xcode)
- Android Emulator (Android Studio)
- BrowserStack or similar services

### Automated Testing
- Playwright for cross-browser testing
- Jest for unit tests
- Cypress for E2E tests

---

## 🐛 Common Issues & Solutions

### Issue: iOS Zoom on Input Focus
**Solution**: Ensure inputs have `font-size: 16px` minimum

```css
input, textarea, select {
  font-size: 16px;
}
```

### Issue: Horizontal Scroll on Mobile
**Solution**: Add overflow-x hidden to html/body and ensure all media has max-width

```css
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

img, video, svg {
  max-width: 100%;
  height: auto;
}
```

### Issue: Touch Targets Too Small
**Solution**: Use minimum 44px touch targets with comfortable spacing

```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

### Issue: Tables Breaking Layout on Mobile
**Solution**: Convert to card view or enable horizontal scroll within container

```css
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

---

## 📊 Testing Report Template

```markdown
## Mobile Testing Report - [Date]

### Devices Tested
- [ ] iPhone SE (375px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad Mini (768px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] Desktop Chrome (1440px)

### Issues Found
| # | Issue | Device | Severity | Status |
|---|-------|--------|----------|--------|
| 1 | Description | iPhone SE | High | Open |

### Performance Metrics
| Metric | Mobile | Desktop | Target |
|--------|--------|---------|--------|
| FCP | | | < 1.8s |
| LCP | | | < 2.5s |
| TTI | | | < 3.8s |

### Sign-off
- [ ] QA Approved
- [ ] Design Approved
- [ ] Product Approved
```

---

## 📝 Notes

- Test on real devices whenever possible
- Use BrowserStack for devices you don't have
- Document any device-specific quirks
- Update this checklist as new components are added
- Re-test after any layout changes

---

**Last Updated**: March 2026
**Owner**: Frontend Team
**Review Cycle**: Monthly
