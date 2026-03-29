# ADR 005: Prisma and PostgreSQL

## Status
Accepted

## Context
We need a database stack that provides:
- Relational data structure
- Type-safe queries
- Migration support
- Good performance
- Scalability

## Decision
We chose PostgreSQL with Prisma ORM.

## Consequences

### Positive
- Type-safe database queries
- Excellent migration system
- Great developer experience
- Strong PostgreSQL performance
- Connection pooling

### Negative
- Additional build step (generate)
- Learning curve for Prisma schema
- ORM limitations for complex queries

## Schema Example

```prisma
model Deal {
  id          String   @id @default(cuid())
  companyName String
  stage       DealStage
  amount      Float?
  status      DealStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  
  @@index([stage])
  @@index([status])
}
```

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| MongoDB | Flexible schema | Less relational integrity |
| MySQL | Widely supported | Fewer advanced features |
| Supabase | Built-in auth, real-time | Vendor lock-in |
| Drizzle | Lightweight, SQL-like | Newer, smaller community |
| Raw SQL | Full control | No type safety |

## References
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
