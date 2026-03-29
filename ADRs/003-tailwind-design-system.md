# ADR 003: Tailwind CSS and Custom Design System

## Status

**Accepted**

## Context

The Redstick Ventures Command Center requires:

- A consistent, maintainable styling approach
- Rapid UI development for a data-heavy dashboard
- Responsive design across devices
- Dark mode support
- Custom theming aligned with brand identity
- Type safety for styles

We evaluated several CSS and styling approaches.

## Decision

We will use **Tailwind CSS** as our primary styling solution, complemented by **shadcn/ui** for base components and a custom design system built on top.

## Consequences

### Positive

- **Rapid Development**: Utility classes enable fast iteration without context switching
- **Consistency**: Design tokens ensure consistent spacing, colors, typography
- **Bundle Size**: Only used classes are included (PurgeCSS built-in)
- **Maintainability**: No CSS file proliferation, styles colocated with components
- **Responsive**: First-class responsive design with breakpoint prefixes
- **Dark Mode**: Simple dark mode implementation with `dark:` variants
- **Type Safety**: Tailwind CSS IntelliSense provides autocomplete
- **Performance**: Minimal CSS output, no runtime CSS-in-JS overhead

### Negative

- **Learning Curve**: Different mental model from traditional CSS
- **HTML Clutter**: Can result in long class strings
- **Component Abstraction**: Requires discipline to extract reusable components
- **Initial Setup**: Configuration and design token setup takes time
- **Team Adoption**: May require training for team members new to Tailwind

### Neutral

- **Opinionated**: Enforces a specific way of working that may not suit all preferences
- **Build Step**: Requires PostCSS build step (handled by Next.js)

## Alternatives Considered

### 1. CSS Modules

**Pros:**
- Scoped styles by default
- Familiar CSS syntax
- No build configuration needed
- Zero runtime cost

**Cons:**
- Requires manual design system implementation
- Context switching between CSS and JS files
- Harder to maintain consistency
- More boilerplate for common patterns

**Verdict**: Rejected - While solid, Tailwind provides faster development and better consistency.

### 2. Styled Components / Emotion

**Pros:**
- CSS-in-JS with full JavaScript power
- Dynamic styling based on props
- Scoped styles
- Large ecosystem

**Cons:**
- Runtime overhead (though minimal)
- Larger bundle size
- Requires additional Babel configuration
- Potential for CSS injection order issues
- Server Components compatibility challenges

**Verdict**: Rejected - Runtime CSS-in-JS conflicts with React Server Components and adds unnecessary overhead.

### 3. CSS-in-JS (Linaria, Vanilla Extract)

**Pros:**
- Zero runtime (compile-time CSS extraction)
- Type-safe styles
- CSS Modules-like scoping

**Cons:**
- Smaller ecosystem
- More complex setup
- Less community support
- Build-time complexity

**Verdict**: Rejected - Good technical approach but Tailwind has better tooling and community.

### 4. Bootstrap / Material UI

**Pros:**
- Complete component library out of the box
- Rapid prototyping
- Familiar to many developers

**Cons:**
- Difficult to customize deeply
- "Bootstrap look" - hard to make unique
- Larger bundle size
- Less flexible than utility-first approach

**Verdict**: Rejected - Too opinionated and hard to customize for our brand requirements.

### 5. Sass / SCSS with BEM

**Pros:**
- Familiar to most developers
- Powerful features (mixins, functions)
- No JavaScript dependency

**Cons:**
- Naming convention overhead (BEM)
- CSS file organization challenges
- Larger CSS bundles
- Slower development than utility classes

**Verdict**: Rejected - More overhead than Tailwind for our use case.

## Implementation Notes

### Tailwind Configuration

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Semantic colors
        success: {
          DEFAULT: '#22c55e',
          light: '#86efac',
          dark: '#15803d',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fcd34d',
          dark: '#b45309',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fca5a5',
          dark: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;
```

### Design Tokens (CSS Variables)

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Component Variants with CVA

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### Utility for Class Merging

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS: From Zero to Production](https://www.youtube.com/playlist?list=PL5f_mz_zU5eXWYDXHRUfMxDxKMjDQ2fGz)
- [CVA (Class Variance Authority)](https://cva.style/docs)

## Date

2024-01-15

## Authors

- Architecture Team
