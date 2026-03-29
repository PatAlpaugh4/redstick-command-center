# Animation Performance Guide

This document outlines best practices for maintaining 60fps animations and measuring performance.

## Target Performance

- **60fps** - Smooth animations
- **< 16ms** per frame (budget)
- **First Contentful Paint** - < 1.8s
- **Largest Contentful Paint** - < 2.5s

## Performance Best Practices

### 1. Use transform and opacity Only

These properties don't trigger layout or paint:

```typescript
// ✅ GOOD
<motion.div
  animate={{ 
    transform: "translateX(100px)",  // Composite only
    opacity: 0.5 
  }}
/>

// ❌ BAD - Triggers layout
<motion.div
  animate={{ 
    width: "100px",      // Layout
    height: "100px",     // Layout
    left: "100px",       // Layout
    top: "100px"         // Layout
  }}
/>

// ❌ BAD - Triggers paint
<motion.div
  animate={{ 
    backgroundColor: "#ff0000",  // Paint
    boxShadow: "0 0 10px red"    // Paint
  }}
/>
```

### 2. Use will-change Sparingly

```typescript
// ✅ Apply before animation
<motion.div
  style={{ willChange: "transform, opacity" }}
  animate={{ x: 100, opacity: 0.5 }}
/>

// ✅ Remove after animation
<motion.div
  animate={{ x: 100 }}
  onAnimationComplete={() => {
    // Remove will-change
  }}
/>
```

### 3. Prefer CSS Transitions for Simple Animations

```typescript
// ✅ CSS for hover states (more performant)
<div className="hover:scale-105 transition-transform duration-200" />

// Framer Motion for complex sequences
<motion.div
  animate={{ 
    x: [0, 100, 0],
    rotate: [0, 180, 360]
  }}
/>
```

### 4. Use AnimatePresence Correctly

```typescript
// ✅ Single exit animation
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

### 5. Debounce Rapid State Changes

```typescript
// ✅ Debounced animation
import { useDebouncedCallback } from "use-debounce";

const debouncedAnimate = useDebouncedCallback((value) => {
  animate(value);
}, 16); // 1 frame
```

## Measuring Performance

### Chrome DevTools

1. **Performance Tab**
   - Record while animating
   - Look for long tasks (> 50ms)
   - Check for dropped frames

2. **Rendering Tab**
   - Enable "Paint flashing"
   - Enable "Layer borders"
   - Check for excessive repaints

3. **FPS Meter**
   ```
   DevTools → Esc → Rendering → Frame Rendering Stats
   ```

### React DevTools Profiler

```typescript
// Wrap components to measure
import { Profiler } from "react";

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log({ id, phase, actualDuration });
}

<Profiler id="Animation" onRender={onRenderCallback}>
  <AnimatedComponent />
</Profiler>
```

### Performance.mark API

```typescript
// Mark animation start
performance.mark("animation-start");

// Mark animation end
performance.mark("animation-end");

// Measure
performance.measure("animation", "animation-start", "animation-end");

// Get results
const entries = performance.getEntriesByName("animation");
console.log(`Animation took ${entries[0].duration}ms`);
```

## Testing on Low-End Devices

### Chrome DevTools Device Emulation

1. Open DevTools (F12)
2. Performance tab → Settings gear
3. CPU throttling: "4x slowdown" or "6x slowdown"

### Network Throttling

Test with "Slow 3G" to ensure animations don't block content.

### Real Device Testing

| Device Type | Target |
|-------------|--------|
| High-end (iPhone 14, Pixel 7) | 60fps, all animations |
| Mid-range (iPhone SE, Pixel 5) | 60fps, reduce complex animations |
| Low-end (Budget Android) | 30fps acceptable, prefer CSS transitions |

## Common Performance Issues

### 1. Layout Thrashing

```typescript
// ❌ BAD - Forces sync layout
const height = element.offsetHeight; // Read
element.style.height = (height * 2) + "px"; // Write
const newHeight = element.offsetHeight; // Read (forces recalc!)

// ✅ GOOD - Batch reads and writes
const height = element.offsetHeight;
const newHeight = height * 2;
requestAnimationFrame(() => {
  element.style.height = newHeight + "px";
});
```

### 2. Too Many Simultaneous Animations

```typescript
// ❌ BAD - 100 items animating
{items.map(item => (
  <motion.div key={item.id} animate={{ y: 100 }} />
))}

// ✅ GOOD - Virtualize or stagger
{visibleItems.map((item, i) => (
  <motion.div
    key={item.id}
    animate={{ y: 100 }}
    transition={{ delay: i * 0.05 }} // Stagger
  />
))}
```

### 3. Memory Leaks in Animations

```typescript
// ❌ BAD - Animation continues after unmount
useEffect(() => {
  const interval = setInterval(() => {
    setState(s => s + 1);
  }, 16);
  // Missing cleanup!
}, []);

// ✅ GOOD - Clean up animations
useEffect(() => {
  const controls = animate(value);
  return () => controls.stop();
}, []);
```

## Reduced Motion Performance

Reduced motion not only helps users with vestibular disorders but also improves performance:

```typescript
// With reduced motion: minimal work
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={{ opacity: prefersReducedMotion ? 1 : [0, 1, 0] }}
  transition={{ duration: prefersReducedMotion ? 0.01 : 2 }}
/>
```

Benefits:
- **CPU**: No continuous calculations
- **GPU**: No compositor work
- **Battery**: Significant savings on mobile

## Performance Budget

Track these metrics:

| Metric | Budget | Warning |
|--------|--------|---------|
| Animation duration | < 300ms | > 500ms |
| Simultaneous animations | < 10 | > 20 |
| Layout triggers | 0 | > 0 |
| Paint triggers | < 2 per frame | > 5 per frame |
| Memory increase | < 10MB | > 50MB |

## Tools

- **Lighthouse** - Performance audits
- **Web Vitals** - Core metrics
- **Framer Motion DevTools** - Animation inspection
- **React DevTools Profiler** - Component render times

## Resources

- [Chrome DevTools - Analyze Runtime Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Framer Motion - Performance](https://www.framer.com/motion/guide-performance/)
- [Web.dev - Animations Guide](https://web.dev/animations/)
