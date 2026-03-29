# ADR 004: Framer Motion for Animations

## Status

**Accepted**

## Context

The Redstick Ventures Command Center requires animations for:

- Smooth page transitions and route changes
- Micro-interactions (button hovers, form focus states)
- Data visualization entrance animations
- Sidebar and modal transitions
- List item reordering and filtering
- Loading state animations
- Scroll-triggered animations

We need a robust, performant animation library that works well with React and Next.js App Router.

## Decision

We will use **Framer Motion** as our primary animation library.

## Consequences

### Positive

- **Declarative API**: Animations defined in JSX, not imperative code
- **React-Native Compatible**: Shared API if we ever build mobile
- **Layout Animations**: Automatic layout transitions when elements move
- **Gesture Support**: Drag, pan, hover, tap gestures built-in
- **Variants System**: Orchestrate complex animations with variants
- **Performance**: Hardware-accelerated transforms and opacity
- **AniPresence**: Animate components entering/exiting the DOM
- **Server Component Safe**: Works in client components alongside Server Components

### Negative

- **Bundle Size**: ~40kb gzipped (larger than some alternatives)
- **Learning Curve**: Different mental model from CSS animations
- **Overkill for Simple Cases**: CSS transitions sufficient for basic hover effects
- **Client Component Only**: Requires `'use client'` directive

### Neutral

- **Framer Ecosystem**: Part of larger Framer design tool ecosystem
- **Community**: Large community but smaller than CSS animation resources

## Alternatives Considered

### 1. CSS Animations / Transitions

**Pros:**
- Native browser support, no JavaScript
- Smallest bundle size
- Best performance for simple animations
- Works in Server Components

**Cons:**
- Complex animations difficult to manage
- No orchestration of enter/exit animations
- Harder to coordinate multiple elements
- No gesture support

**Verdict**: Partially accepted - Use CSS for simple transitions (hover, focus), Framer Motion for complex animations.

### 2. React Spring

**Pros:**
- Physics-based animations feel natural
- Smaller bundle than Framer Motion
- Excellent performance
- Interpolation capabilities

**Cons:**
- Steeper learning curve
- API more complex for common use cases
- Smaller community
- Documentation less comprehensive

**Verdict**: Rejected - Framer Motion's API is more intuitive for our team.

### 3. GSAP (GreenSock)

**Pros:**
- Industry-standard for complex animations
- Timeline sequencing
- ScrollTrigger plugin
- Excellent performance
- Commercial support available

**Cons:**
- Requires paid license for some features
- Imperative API (less React-friendly)
- Larger learning curve
- Overkill for most UI animations

**Verdict**: Rejected - GSAP is powerful but Framer Motion is better suited for React component animations.

### 4. Lottie

**Pros:**
- Complex animations from After Effects
- Small file sizes (JSON)
- Cross-platform
- Designer-friendly workflow

**Cons:**
- Requires After Effects expertise
- Limited interactivity
- Overhead of JSON parsing
- Not suitable for UI micro-interactions

**Verdict**: Rejected - Reserved for specific complex animations (illustrations, onboarding), not general UI.

### 5. React Transition Group

**Pros:**
- Lightweight
- Well-established
- Good for enter/exit animations

**Cons:**
- Requires more boilerplate
- No built-in gesture support
- Less declarative than Framer Motion
- Maintenance mode (not actively developed)

**Verdict**: Rejected - Framer Motion provides more features with less code.

## Implementation Notes

### Basic Animation Pattern

```tsx
'use client';

import { motion } from 'framer-motion';

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

### Page Transitions

```tsx
// components/page-transition.tsx
'use client';

import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Staggered List Animation

```tsx
'use client';

import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function AnimatedDealList({ deals }: { deals: Deal[] }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {deals.map((deal) => (
        <motion.li key={deal.id} variants={item}>
          <DealCard deal={deal} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### AnimatePresence for Exit Animations

```tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export function ExpandableSection({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Layout Animations

```tsx
'use client';

import { motion, LayoutGroup } from 'framer-motion';

export function SortableDealList({ deals }: { deals: Deal[] }) {
  return (
    <LayoutGroup>
      <ul className="space-y-2">
        {deals.map((deal) => (
          <motion.li
            key={deal.id}
            layout
            layoutId={deal.id}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <DealCard deal={deal} />
          </motion.li>
        ))}
      </ul>
    </LayoutGroup>
  );
}
```

### Gestures

```tsx
'use client';

import { motion } from 'framer-motion';

export function SwipeableCard({ deal, onDismiss }: Props) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.x > 100 || velocity.x > 500) {
          onDismiss(deal.id);
        }
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <DealCard deal={deal} />
    </motion.div>
  );
}
```

### Reduced Motion Support

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function AccessibleAnimation({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
```

## Performance Guidelines

1. **Animate Only Transform and Opacity**: These properties are GPU-accelerated
2. **Use `layout` Prop Sparingly**: Layout animations can be expensive
3. **Lazy Load Animation Components**: For heavy animations, use dynamic imports
4. **Use `will-change` Hint**: Framer Motion handles this automatically
5. **Test on Low-End Devices**: Ensure smooth 60fps on mobile

## References

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Framer Motion Examples](https://www.framer.com/motion/examples/)
- [Accessibility in Animation](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)

## Date

2024-01-15

## Authors

- Architecture Team
