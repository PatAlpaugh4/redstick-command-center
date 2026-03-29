# Reduced Motion Support

This document describes how our application handles reduced motion preferences for accessibility.

## Overview

We respect the user's `prefers-reduced-motion` system preference as well as providing an in-app toggle for users to disable animations. This is essential for users with vestibular disorders, motion sensitivity, or those who simply prefer less animation.

## How It Works

### 1. System Preference Detection

The `useReducedMotion` hook automatically detects the user's system preference:

```typescript
import { useReducedMotion } from "@/hooks/useReducedMotion";

function MyComponent() {
  const prefersReducedMotion = useReducedMotion();
  // Returns true if user prefers reduced motion
}
```

### 2. CSS Media Query

Our global CSS automatically disables animations when reduced motion is preferred:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 3. Framer Motion Integration

All Framer Motion animations use variants from `@/lib/animations` that include reduced motion versions:

```typescript
import { fadeVariants, fadeVariantsReduced } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? fadeVariantsReduced : fadeVariants;

  return (
    <motion.div variants={variants} initial="hidden" animate="visible">
      Content
    </motion.div>
  );
}
```

## Animation Categories

### ✅ KEEP (with reduced duration)

These animations are kept but made nearly instant (0.01ms):

- **Opacity fades** - Essential for showing/hiding content
- **Color transitions** - State changes (hover, focus)
- **Static state changes** - Button presses, toggles

### ⚠️ REDUCE

These are simplified for reduced motion:

| Animation | Normal | Reduced Motion |
|-----------|--------|----------------|
| Scale | Scale + fade | Fade only |
| Slide | Translate + fade | Fade only |
| Rotate | Rotate animation | Static or removed |
| Stagger | Sequential delays | All at once |

### ❌ DISABLE

These animations are completely removed:

- **Parallax effects** - Can cause nausea
- **Continuous pulsing** - Distracting and unnecessary
- **Auto-playing carousels** - Motion without user control
- **Bouncing effects** - Can trigger vestibular issues
- **Shake animations** - Disorienting
- **Spinning loaders** - Replaced with static indicators

## Available Hooks

### `useReducedMotion()`

Returns a boolean indicating if reduced motion is preferred.

```typescript
const prefersReducedMotion = useReducedMotion();
```

### `useMotionPreference(animatedProps)`

Returns animation props or empty object based on preference.

```typescript
const animationProps = useMotionPreference({
  animate: { scale: [1, 1.05, 1] },
  transition: { duration: 2, repeat: Infinity }
});
// Returns {} if reduced motion is preferred
```

### `useAnimationDuration(normal, reduced?)`

Returns appropriate duration based on preference.

```typescript
const duration = useAnimationDuration(0.5);
// Returns 0.5 normally, 0.01 when reduced motion is on
```

### `useAnimationControl()`

Returns a control object with utilities.

```typescript
const { shouldAnimate, transition, instant } = useAnimationControl();
```

## Available Components

### `MotionWrapper`

Automatically applies reduced motion variants:

```tsx
<MotionWrapper variants={fadeVariants} initial="hidden" animate="visible">
  <Content />
</MotionWrapper>
```

### Pre-built Animation Components

```tsx
<FadeIn delay={0.2}>Content</FadeIn>
<SlideUp y={30}>Content</SlideUp>
<ScaleIn>Modal content</ScaleIn>
<StaggerContainer>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
</StaggerContainer>
```

### Components with Built-in Support

- **Modal** - Fade only, no scale animation
- **Toast** - Simplified entrance/exit
- **Page transitions** - Fade only, no slide

## Animation Variants Library

Located in `@/lib/animations`:

| Variant | Normal | Reduced |
|---------|--------|---------|
| `fadeVariants` | 300ms fade | 0.01ms fade |
| `slideUpVariants` | Slide + fade | Fade only |
| `scaleVariants` | Scale + fade | Fade only |
| `pageVariants` | Page fade | Instant |
| `toastVariants` | Slide from right | Instant |
| `modalContentVariants` | Scale + fade | Fade only |

## Testing Reduced Motion

### Browser DevTools

1. Open DevTools (F12)
2. Press `Ctrl/Cmd + Shift + P`
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "prefers-reduced-motion: reduce"

### System Settings

**macOS:**
- System Preferences → Accessibility → Display → Reduce motion

**Windows:**
- Settings → Accessibility → Visual effects → Animation effects

**iOS:**
- Settings → Accessibility → Motion → Reduce Motion

**Android:**
- Settings → Accessibility → Remove animations

### Manual Toggle

Users can also toggle reduced motion in Settings → Preferences → Reduce Motion.

## Implementation Checklist

When adding new animations:

- [ ] Use `useReducedMotion()` hook to detect preference
- [ ] Import variants from `@/lib/animations`
- [ ] Provide reduced variants or use built-in reduced versions
- [ ] Test with "Emulate CSS prefers-reduced-motion" in DevTools
- [ ] Verify no motion sickness triggers remain
- [ ] Ensure content is still accessible without animation

## Common Patterns

### Conditional Animation Props

```typescript
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { scale: [1, 1.05, 1] }}
  transition={{ duration: prefersReducedMotion ? 0.01 : 2 }}
/>
```

### Using selectVariants Helper

```typescript
import { selectVariants, fadeVariants, fadeVariantsReduced } from "@/lib/animations";

const variants = selectVariants(
  fadeVariants,
  fadeVariantsReduced,
  prefersReducedMotion
);
```

### Wrapper Component Pattern

```typescript
function SafeAnimation({ children }) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <div>{children}</div>;
  }
  
  return (
    <motion.div animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  );
}
```

## Resources

- [WCAG 2.1 - Pause, Stop, Hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html)
- [MDN - prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [A11y Project - Vestibular Disorders](https://www.a11yproject.com/posts/understanding-vestibular-disorders/)
