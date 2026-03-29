# ADR 004: Framer Motion for Animations

## Status
Accepted

## Context
We need an animation library that:
- Works well with React
- Supports gesture-based interactions
- Has good performance
- Supports accessibility (reduced motion)

## Decision
We chose Framer Motion for animations.

## Consequences

### Positive
- Declarative API
- Gesture support (drag, hover, tap)
- AnimatePresence for exit animations
- Layout animations
- Great TypeScript support

### Negative
- Bundle size (~25kb gzipped)
- Can impact performance if overused
- Learning curve for complex animations

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| CSS Animations | No JS, performant | Limited interactivity |
| React Spring | Physics-based | More complex API |
| GSAP | Powerful, industry standard | Heavy, licensing |
| Lottie | Complex animations | Large file sizes |

## Usage Pattern

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## Accessibility

All animations respect `prefers-reduced-motion`:

```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
>
```

## References
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Accessibility in Framer Motion](https://www.framer.com/motion/guide-accessibility/)
