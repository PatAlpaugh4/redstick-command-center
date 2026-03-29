# ADR 001: Next.js App Router

## Status
Accepted

## Context
We needed to choose a React framework for the Redstick Ventures Command Center that provides:
- Server-side rendering for SEO and performance
- Modern React features (Server Components, Suspense, Streaming)
- Excellent developer experience
- Strong ecosystem and community support

## Decision
We chose Next.js 16 with the App Router.

## Consequences

### Positive
- Server Components reduce client-side JavaScript
- Built-in optimizations (images, fonts, scripts)
- Nested layouts without prop drilling
- Streaming and Suspense for progressive loading
- API routes co-located with pages

### Negative
- Learning curve for new patterns
- Some third-party libraries need adaptations
- More complex mental model (Server vs Client)

## Alternatives Considered

| Framework | Pros | Cons |
|-----------|------|------|
| Remix | Great data loading, nested routes | Smaller ecosystem, newer |
| Astro | Zero JS by default | Less React-native experience |
| Vite + React Router | Fast dev, simple | More manual setup needed |
| Pages Router | Mature, well-documented | Missing App Router features |

## References
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Vercel App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
