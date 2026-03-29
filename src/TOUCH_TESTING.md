# Touch Testing Documentation

## Overview

This document provides guidelines for testing touch interactions across the Redstick Ventures Dashboard.

## Minimum Touch Target Requirements

All interactive elements must meet minimum touch target sizes:

| Element Type | Minimum Size | Recommended Size |
|-------------|--------------|------------------|
| Buttons | 44x44px | 48x48px |
| Icon buttons | 44x44px | 48x48px |
| Form inputs | 44px height | 48px height |
| Links in text | 44px tall | With padding |
| Dropdown items | 44px height | 48px height |
| Table rows | 44px height | 48px height |

## Testing Checklist

### 1. Device Testing

#### Required Devices
- [ ] iPhone (iOS Safari)
- [ ] iPad (iOS Safari)
- [ ] Android phone (Chrome)
- [ ] Android tablet (Chrome)
- [ ] Windows touch device (Edge)

#### Touch Scenarios
- [ ] Single tap
- [ ] Double tap (zoom prevention)
- [ ] Long press
- [ ] Swipe left/right
- [ ] Swipe up/down
- [ ] Pinch to zoom
- [ ] Two-finger scroll

### 2. Component Testing

#### Buttons
```typescript
// Test: All buttons are minimum 44x44px
<button className="min-h-[44px] min-w-[44px] p-2">
  Click me
</button>

// Test: Icon buttons
<button className="w-11 h-11 flex items-center justify-center">
  <Icon className="w-5 h-5" />
</button>
```

**Test Cases:**
- [ ] Can tap without hitting adjacent elements
- [ ] Visual feedback on tap
- [ ] No accidental double-tap zoom
- [ ] Works with gloves (if applicable)

#### Form Inputs
```typescript
// Test: Input fields are minimum 44px height
<input className="h-11" />
```

**Test Cases:**
- [ ] Easy to tap into field
- [ ] Virtual keyboard opens reliably
- [ ] No zoom on focus (iOS)
- [ ] Clear button easy to tap

#### Links in Text
```typescript
// Test: Links have increased touch area
<a className="py-2 inline-block">Link text</a>
```

**Test Cases:**
- [ ] Minimum 44px touch height
- [ ] Clear visual distinction
- [ ] Works when surrounded by text

#### Dropdowns
```typescript
// Test: Dropdown items are touch-friendly
<DropdownItem className="min-h-[44px] px-4">
  Option text
</DropdownItem>
```

**Test Cases:**
- [ ] Easy to select correct item
- [ ] No accidental closes
- [ ] Scrollable if many items
- [ ] Dismissible by tapping outside

### 3. Gesture Testing

#### Swipe Gestures (Kanban Board)
- [ ] Swipe to move cards between columns
- [ ] Swipe threshold feels natural
- [ ] Visual feedback during swipe
- [ ] Haptic feedback on success

#### Long Press
- [ ] Hold to initiate drag
- [ ] Visual indicator during press
- [ ] Cancel on move threshold
- [ ] Works with timeout variations

#### Pull to Refresh
- [ ] Pull gesture detected
- [ ] Visual indicator shows progress
- [ ] Threshold triggers refresh
- [ ] Smooth animation on release

#### Pinch to Zoom (Charts)
- [ ] Pinch gesture zooms chart
- [ ] Double-tap to reset
- [ ] Smooth zoom animation
- [ ] Maintains chart readability

### 4. Special Input Testing

#### Stylus/Pen Input
- [ ] Precise tapping works
- [ ] Pressure sensitivity (if supported)
- [ ] Palm rejection
- [ ] Hover states

#### Glove Touch
- [ ] Works with thin gloves
- [ ] Works with thick gloves
- [ ] No false positives

### 5. Accessibility Testing

#### Screen Readers
- [ ] Touch targets announced
- [ ] Gestures have alternatives
- [ ] Focus management works
- [ ] State changes announced

#### Keyboard Navigation
- [ ] All touch actions have keyboard equivalents
- [ ] Focus indicators visible
- [ ] Tab order logical
- [ ] Enter/Space activates

### 6. Performance Testing

- [ ] No lag on touch start
- [ ] Smooth gesture tracking
- [ ] 60fps during animations
- [ ] No touch delay (300ms)

## Browser DevTools Testing

### Chrome DevTools

1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select device preset or set custom size
4. Enable "Touch" in device toolbar
5. Test pinch with Shift+drag

### Safari DevTools

1. Enable Develop menu in Safari preferences
2. Connect iOS device
3. Select device in Develop menu
4. Use Web Inspector for debugging

## Automated Testing

### Touch Event Simulation

```typescript
// Example: Testing touch targets with Jest + Testing Library
import { render, fireEvent } from '@testing-library/react';

test('button has minimum touch target size', () => {
  const { getByRole } = render(<Button>Click me</Button>);
  const button = getByRole('button');
  
  // Check minimum dimensions
  expect(button.offsetHeight).toBeGreaterThanOrEqual(44);
  expect(button.offsetWidth).toBeGreaterThanOrEqual(44);
});

test('swipe gesture triggers callback', () => {
  const onSwipeLeft = jest.fn();
  const { container } = render(
    <SwipeableComponent onSwipeLeft={onSwipeLeft} />
  );
  
  // Simulate touch swipe
  const element = container.firstChild;
  fireEvent.touchStart(element, {
    touches: [{ clientX: 300, clientY: 100 }],
  });
  fireEvent.touchMove(element, {
    touches: [{ clientX: 100, clientY: 100 }],
  });
  fireEvent.touchEnd(element);
  
  expect(onSwipeLeft).toHaveBeenCalled();
});
```

### Visual Regression Testing

Use tools like Percy or Chromatic to catch unintended touch target size changes.

## Common Issues and Solutions

### Issue: Touch targets too small
```css
/* Solution: Increase padding and minimum dimensions */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}
```

### Issue: Accidental touches
```typescript
// Solution: Use touch debounce
const { debouncedCallback } = useTouchDebounce(handleClick, 300);
```

### Issue: 300ms tap delay on mobile
```css
/* Solution: Use touch-action CSS */
.fast-tap {
  touch-action: manipulation;
}
```

### Issue: iOS zoom on input focus
```css
/* Solution: Use 16px font size minimum */
input, textarea, select {
  font-size: 16px;
}
```

### Issue: Scroll interference with swipe
```css
/* Solution: Control touch-action */
.swipeable-element {
  touch-action: pan-y; /* Allow vertical scroll, handle horizontal swipe in JS */
}
```

## Testing Tools

### Recommended Tools

1. **Chrome DevTools Device Mode**
   - Built-in touch simulation
   - Custom device creation
   - Throttling options

2. **Safari Web Inspector**
   - iOS device debugging
   - Touch event inspection

3. **BrowserStack / Sauce Labs**
   - Real device cloud testing
   - Multiple OS versions

4. **Lighthouse**
   - Touch target size audits
   - Mobile usability checks

5. **axe DevTools**
   - Accessibility checks
   - Touch target validation

### Manual Testing Tools

- **Ruler app**: Measure touch targets on device
- **Screen recording**: Review touch interactions
- **Slow motion video**: Analyze gesture detection

## Reporting Issues

When reporting touch-related issues, include:

1. Device model and OS version
2. Browser and version
3. Screen size/resolution
4. Touch input type (finger/stylus/glove)
5. Steps to reproduce
6. Expected vs actual behavior
7. Screenshots or videos

## Resources

- [WCAG 2.1 Target Size (Level AAA)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Material Design Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/)
- [Android Accessibility Guidelines](https://developer.android.com/guide/topics/ui/accessibility)
