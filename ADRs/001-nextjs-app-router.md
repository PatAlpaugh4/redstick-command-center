# ADR 001: Next.js App Router

## Status

**Accepted**

## Context

The Redstick Ventures Command Center requires a modern, performant web application framework that supports:

- Server-side rendering for SEO and initial load performance
- API routes for backend functionality
- TypeScript support for type safety
- Scalable architecture for future growth
- Rich ecosystem of integrations

We evaluated several options for the application's foundation.

## Decision

We will use **Next.js 16 with the App Router** as our primary framework.

## Consequences

### Positive

- **Performance**: Built-in optimizations including image optimization, font optimization, and code splitting
- **Server Components**: Zero client-side JavaScript for static content by default
- **Streaming**: Partial page loading with Suspense boundaries
- **Nested Layouts**: Persistent layouts across route segments reduce re-renders
- **Developer Experience**: Excellent TypeScript support, hot reload, and clear error messages
- **Ecosystem**: Large community, extensive documentation, and rich plugin ecosystem
- **Vercel Integration**: Seamless deployment with edge caching and analytics

### Negative

- **Learning Curve**: App Router patterns differ significantly from Pages Router and traditional React
- **Server/Client Boundaries**: Requires careful consideration of where code runs
- **Third-Party Compatibility**: Some libraries may not yet support React Server Components
- **Caching Complexity**: Multiple caching layers (request memoization, Data Cache, Full Route Cache) require understanding

### Neutral

- **Opinionated**: Next.js makes many decisions for you, which can be good or bad depending on use case
- **Vercel Coupling**: While deployable anywhere, some features work best on Vercel

## Alternatives Considered

### 1. Next.js Pages Router

**Pros:**
- Mature and battle-tested
- Familiar to many React developers
- Simple mental model (everything client-side by default)

**Cons:**
- Less performant (more client-side JavaScript)
- No built-in streaming support
- Layouts are less powerful (no nested layouts)
- Future development focus is on App Router

**Verdict**: Rejected - App Router is the future of Next.js and provides significant advantages.

### 2. Remix

**Pros:**
- Excellent data loading patterns
- Nested routing with layouts
- Strong focus on web standards
- Great error handling

**Cons:**
- Smaller ecosystem than Next.js
- Different deployment model (requires server runtime)
- Less mature image/font optimization
- Smaller community

**Verdict**: Rejected - While excellent, the ecosystem and tooling around Next.js is more mature for our needs.

### 3. Astro

**Pros:**
- Excellent static site generation
- Islands architecture for partial hydration
- Great performance scores
- Framework agnostic

**Cons:**
- Requires more setup for full-stack features
- Different paradigm from React SPA
- Smaller ecosystem for dynamic applications
- Less mature server-side capabilities

**Verdict**: Rejected - Astro is excellent for content sites but Next.js is better suited for our data-heavy dashboard.

### 4. Create React App + Express

**Pros:**
- Complete control over configuration
- Familiar to many developers
- Decoupled frontend/backend

**Cons:**
- No built-in SSR
- Manual setup for routing, code splitting, optimization
- More maintenance overhead
- Outdated compared to modern meta-frameworks

**Verdict**: Rejected - Would require too much boilerplate and lose too many optimizations.

## Implementation Notes

### Migration Strategy

1. **New Project**: Starting fresh with App Router from day one
2. **Server Components First**: Default to Server Components, use Client Components only when needed
3. **Gradual Feature Addition**: Build features incrementally, leveraging App Router patterns

### Key Patterns to Follow

```tsx
// Server Component by default (preferred)
// app/portfolio/page.tsx
async function PortfolioPage() {
  const data = await fetchPortfolio(); // Direct data fetching
  return <Portfolio data={data} />;
}

// Client Component when interactivity needed
'use client';
// components/DealFilter.tsx
function DealFilter() {
  const [filter, setFilter] = useState('');
  return <input value={filter} onChange={e => setFilter(e.target.value)} />;
}
```

### Important Configuration

```ts
// next.config.js
module.exports = {
  experimental: {
    // Enable if needed
    // serverActions: true,
  },
  images: {
    domains: ['cdn.redstick.vc'],
  },
};
```

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js 13+ Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

## Date

2024-01-15

## Authors

- Architecture Team
