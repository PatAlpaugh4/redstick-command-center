# ADR 003: Tailwind CSS and Custom Design System

## Status
Accepted

## Context
We need a styling solution that:
- Enables rapid UI development
- Maintains design consistency
- Supports dark mode
- Is maintainable at scale

## Decision
We chose Tailwind CSS with a custom design system built on top.

## Consequences

### Positive
- Utility-first speeds up development
- Consistent design via configuration
- Built-in dark mode support
- Small production bundle (purgeCSS)
- Great IDE support

### Negative
- HTML can become verbose
- Learning curve for utility classes
- Requires discipline to maintain consistency

## Design System

### Colors
```javascript
colors: {
  primary: {
    DEFAULT: '#e94560',
    light: '#ff6b7a',
    dark: '#c73e54',
  },
  background: '#0f0f1a',
  surface: '#1a1a2e',
}
```

### Spacing
Based on 4px grid system

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| CSS Modules | Scoped styles, no build tool needed | More manual work |
| Styled Components | CSS-in-JS, dynamic styles | Runtime overhead |
| Chakra UI | Component library, accessible | Less customization |
| Material UI | Mature, comprehensive | Heavy, generic look |

## References
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/)
