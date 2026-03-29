# Component Theming Guide

Comprehensive guide for customizing and theming components.

---

## Table of Contents

- [Design Tokens](#design-tokens)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing](#spacing)
- [Shadows & Elevation](#shadows--elevation)
- [Component Customization](#component-customization)
- [Dark Mode](#dark-mode)
- [Custom Themes](#custom-themes)

---

## Design Tokens

Design tokens are the single source of truth for styling values used across components.

### Token Structure

```typescript
// tokens.ts
export const tokens = {
  colors: {
    // Brand colors
    primary: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#ff6b7a', // Primary accent
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
    },
    
    // Semantic colors
    success: {
      DEFAULT: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      DEFAULT: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      DEFAULT: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      DEFAULT: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    
    // Background colors
    background: '#0f0f1a',
    surface: '#1a1a2e',
    'surface-elevated': '#232337',
    
    // Text colors
    'text-primary': '#ffffff',
    'text-secondary': '#a0a0b0',
    'text-tertiary': '#6a6a7a',
    'text-muted': '#888899',
    'text-disabled': '#5a5a6a',
    
    // Border colors
    'border-default': 'rgba(255, 255, 255, 0.1)',
    'border-hover': 'rgba(255, 255, 255, 0.2)',
    'border-active': 'rgba(233, 69, 96, 0.5)',
  },
  
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },
  
  fontSize: {
    xs: ['12px', { lineHeight: '16px' }],
    sm: ['14px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['20px', { lineHeight: '28px' }],
    '2xl': ['24px', { lineHeight: '32px' }],
    '3xl': ['30px', { lineHeight: '36px' }],
    '4xl': ['36px', { lineHeight: '40px' }],
  },
  
  borderRadius: {
    none: '0',
    sm: '4px',
    DEFAULT: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    md: '0 6px 12px -2px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 20px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 40px -4px rgba(0, 0, 0, 0.6)',
    'glow-primary': '0 0 20px rgba(255, 107, 122, 0.3)',
    'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
    'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
  },
  
  transitions: {
    fast: '150ms ease',
    DEFAULT: '200ms ease',
    slow: '300ms ease',
  },
};
```

---

## Color System

### Using Colors in Components

```tsx
// Direct token usage
<Button className="bg-primary-500 hover:bg-primary-600">
  Primary Button
</Button>

// Semantic colors
<Badge className="bg-success text-white">Success</Badge>
<Badge className="bg-error text-white">Error</Badge>

// Text colors
<p className="text-text-primary">Primary text</p>
<p className="text-text-secondary">Secondary text</p>
<p className="text-text-muted">Muted text</p>

// Background colors
<div className="bg-background">Page background</div>
<div className="bg-surface">Card background</div>
<div className="bg-surface-elevated">Elevated surface</div>
```

### Color Contrast

All color combinations are tested for WCAG AA compliance:

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `#ffffff` | `#0f0f1a` | 17.5:1 | ✅ |
| `#ffffff` | `#1a1a2e` | 15.2:1 | ✅ |
| `#a0a0b0` | `#0f0f1a` | 7.2:1 | ✅ |
| `#ff6b7a` | `#0f0f1a` | 6.1:1 | ✅ |
| `#10b981` | `#0f0f1a` | 6.8:1 | ✅ |

---

## Typography

### Font Family

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
  },
};
```

### Typography Scale

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px | 16px | Captions, timestamps |
| `text-sm` | 14px | 20px | Secondary text, labels |
| `text-base` | 16px | 24px | Body text |
| `text-lg` | 18px | 28px | Lead paragraphs |
| `text-xl` | 20px | 28px | Section headings |
| `text-2xl` | 24px | 32px | Page headings |
| `text-3xl` | 30px | 36px | Major headings |
| `text-4xl` | 36px | 40px | Hero text |

### Font Weights

```tsx
<p className="font-normal">Regular (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>
```

### Usage Examples

```tsx
// Heading hierarchy
<h1 className="text-3xl font-bold text-text-primary">Page Title</h1>
<h2 className="text-2xl font-semibold text-text-primary">Section</h2>
<h3 className="text-xl font-semibold text-text-primary">Subsection</h3>

// Body text
<p className="text-base text-text-secondary">
  Regular body text with secondary color
</p>
<p className="text-sm text-text-muted">
  Smaller muted text for captions
</p>

// Labels
<label className="text-sm font-medium text-text-secondary">
  Form Label
</label>
```

---

## Spacing

### Spacing Scale

| Token | Value | Visual |
|-------|-------|--------|
| `space-1` | 4px | █ |
| `space-2` | 8px | ██ |
| `space-3` | 12px | ███ |
| `space-4` | 16px | ████ |
| `space-5` | 20px | █████ |
| `space-6` | 24px | ██████ |
| `space-8` | 32px | ████████ |

### Usage Patterns

```tsx
// Component padding
<Card className="p-4">Default padding</Card>
<Card className="p-6">Comfortable padding</Card>

// Gap between elements
<div className="flex gap-2">Small gap</div>
<div className="flex gap-4">Default gap</div>

// Section spacing
<section className="py-12">Section with vertical padding</section>

// Form spacing
<form className="space-y-4">
  <Input />
  <Input />
  <Button />
</form>
```

---

## Shadows & Elevation

### Elevation Levels

| Level | Token | Usage |
|-------|-------|-------|
| 0 | `shadow-none` | Flat elements |
| 1 | `shadow-sm` | Subtle elevation |
| 2 | `shadow` | Cards, buttons |
| 3 | `shadow-md` | Dropdowns, popovers |
| 4 | `shadow-lg` | Modals, dialogs |
| 5 | `shadow-xl` | Full-screen overlays |

### Usage

```tsx
// Card elevation
<Card className="shadow hover:shadow-md transition-shadow">
  Hover to elevate
</Card>

// Modal elevation
<Modal className="shadow-xl">
  High elevation for modals
</Modal>

// Glow effects
<Button className="shadow-glow-primary">
  Glowing primary button
</Button>

// Focus states
<button className="focus:shadow-glow-primary focus:outline-none">
  Focus glow
</button>
```

---

## Component Customization

### Using className Prop

All components accept a `className` prop for custom styling:

```tsx
// Custom button colors
<Button className="bg-purple-500 hover:bg-purple-600">
  Purple Button
</Button>

// Custom card border
<Card className="border-l-4 border-l-green-500">
  Left accent border
</Card>

// Custom badge size
<Badge className="px-3 py-1 text-sm">
  Large Badge
</Badge>
```

### Style Variants Pattern

```tsx
// Define variants
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-surface text-text-primary hover:bg-surface-elevated border border-border-default',
  ghost: 'bg-transparent text-text-primary hover:bg-surface',
  danger: 'bg-error text-white hover:bg-error-dark',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

// Usage
<button className={cn(
  'rounded font-medium transition-colors',
  buttonVariants[variant],
  buttonSizes[size],
  className
)}>
  {children}
</button>
```

### Compound Components

```tsx
// Card sub-components with consistent styling
const Card = ({ className, children }) => (
  <div className={cn('bg-surface rounded-lg shadow', className)}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={cn('px-6 py-4 border-b border-border-default', className)}>
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={cn('text-lg font-semibold text-text-primary', className)}>
    {children}
  </h3>
);

const CardContent = ({ className, children }) => (
  <div className={cn('px-6 py-4', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
```

---

## Dark Mode

### Automatic Dark Mode

All components support dark mode automatically through CSS variables:

```css
:root {
  --color-background: #0f0f1a;
  --color-surface: #1a1a2e;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0b0;
}

@media (prefers-color-scheme: light) {
  :root {
    --color-background: #ffffff;
    --color-surface: #f9fafb;
    --color-text-primary: #111827;
    --color-text-secondary: #6b7280;
  }
}
```

### Manual Toggle

```tsx
// ThemeProvider.tsx
const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Using Dark Mode Classes

```tsx
// Automatic with dark: prefix
<div className="bg-white dark:bg-surface text-gray-900 dark:text-white">
  <Card>
    <p className="text-gray-600 dark:text-text-secondary">
      Automatically themed content
    </p>
  </Card>
</div>

// Manual theme classes
<div className="bg-background text-text-primary">
  Uses CSS variables that change with theme
</div>
```

### Dark Mode Color Mapping

| Light Mode | Dark Mode |
|------------|-----------|
| `bg-white` | `bg-background` |
| `bg-gray-50` | `bg-surface` |
| `text-gray-900` | `text-text-primary` |
| `text-gray-600` | `text-text-secondary` |
| `border-gray-200` | `border-border-default` |

---

## Custom Themes

### Creating a Custom Theme

```typescript
// themes/corporate.ts
export const corporateTheme = {
  colors: {
    primary: {
      DEFAULT: '#0052cc',
      light: '#4c9aff',
      dark: '#0747a6',
    },
    secondary: {
      DEFAULT: '#6554c0',
      light: '#8777d9',
      dark: '#403294',
    },
    background: '#f4f5f7',
    surface: '#ffffff',
    'text-primary': '#172b4d',
    'text-secondary': '#5e6c84',
  },
  
  borderRadius: {
    none: '0',
    sm: '2px',
    DEFAULT: '4px',
    md: '6px',
    lg: '8px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

// themes/retro.ts
export const retroTheme = {
  colors: {
    primary: {
      DEFAULT: '#ff6b35',
      light: '#ff8c61',
      dark: '#cc4a1f',
    },
    background: '#fef3e2',
    surface: '#fff8e7',
    'text-primary': '#2d1b0e',
  },
  
  borderRadius: {
    DEFAULT: '0',
  },
  
  fontFamily: {
    sans: ['"VT323"', 'monospace'],
  },
};
```

### Applying Custom Themes

```tsx
// ThemeWrapper.tsx
import { corporateTheme } from './themes/corporate';

function ThemeWrapper({ children, theme = 'default' }) {
  const themeStyles = {
    default: {},
    corporate: generateCSSVariables(corporateTheme),
    retro: generateCSSVariables(retroTheme),
  };

  return (
    <div style={themeStyles[theme]} className={`theme-${theme}`}>
      {children}
    </div>
  );
}

// Usage
<ThemeWrapper theme="corporate">
  <App />
</ThemeWrapper>
```

### Runtime Theme Switching

```tsx
function ThemeCustomizer() {
  const [primaryColor, setPrimaryColor] = useState('#ff6b7a');
  const [borderRadius, setBorderRadius] = useState(8);
  
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--radius', `${borderRadius}px`);
  }, [primaryColor, borderRadius]);
  
  return (
    <div className="space-y-4">
      <div>
        <label>Primary Color</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
      </div>
      <div>
        <label>Border Radius</label>
        <input
          type="range"
          min="0"
          max="24"
          value={borderRadius}
          onChange={(e) => setBorderRadius(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
```

---

## Tailwind Configuration

### Full Tailwind Config

```javascript
// tailwind.config.js
const { tokens } = require('./src/lib/tokens');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'border-default': 'var(--color-border-default)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(255, 107, 122, 0.3)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

---

## Best Practices

### Do's

- ✅ Use design tokens for consistency
- ✅ Extend existing classes with `className` prop
- ✅ Use semantic color names (`success`, `error`) over literal colors (`green`, `red`)
- ✅ Test customizations in both light and dark modes
- ✅ Maintain accessibility contrast ratios

### Don'ts

- ❌ Hardcode colors in component files
- ❌ Override base styles without testing
- ❌ Use arbitrary values instead of tokens
- ❌ Forget to check reduced motion preferences
- ❌ Ignore high contrast mode compatibility

### CSS Custom Properties

```css
/* Use CSS variables for dynamic theming */
:root {
  --button-padding-x: 1rem;
  --button-padding-y: 0.5rem;
  --button-radius: 0.5rem;
}

.button {
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--button-radius);
}

/* Override per-component */
.button-large {
  --button-padding-x: 1.5rem;
  --button-padding-y: 0.75rem;
}
```

---

## Migration Guide

### From CSS Modules

```tsx
// Before: Button.module.css
// After: Tailwind classes

// Before
import styles from './Button.module.css';
<button className={styles.button}>Click</button>

// After
<button className="px-4 py-2 bg-primary text-white rounded">
  Click
</button>
```

### From Styled Components

```tsx
// Before: Styled components
const StyledButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.primary};
`;

// After: Tailwind with class-variance-authority
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'px-4 py-2 font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-surface text-text-primary border',
      },
    },
  }
);
```
