# Database Performance Optimization

This guide covers performance optimization strategies for the Redstick Ventures Command Center database.

## Table of Contents

1. [Indexing Strategy](#indexing-strategy)
2. [Query Optimization](#query-optimization)
3. [Connection Pooling](#connection-pooling)
4. [Caching Strategies](#caching-strategies)
5. [Monitoring & Profiling](#monitoring--profiling)
6. [Best Practices](#best-practices)

---

## Indexing Strategy

### Current Indexes

The schema includes optimized indexes for common query patterns:

| Table | Index | Purpose |
|-------|-------|---------|
| User | email (unique) | Authentication lookups |
| User | role | Role-based filtering |
| Deal | stage | Pipeline filtering |
| Deal | status | List view filtering |
| Deal | assignedTo | "My deals" view |
| Deal | companyId | Company lookup |
| Deal | companyName | Search by company |
| Company | name (unique) | Company search |
| Company | sector | Sector filtering |
| Company | status | Portfolio views |
| Agent | type | Agent type filtering |
| Agent | status | Active agent queries |
| AgentRun | agentId | Agent history |
| AgentRun | userId | User activity |
| AgentRun | startedAt | Recent runs sorting |
| AgentRun | status | Status filtering |

### When to Add Indexes

Add indexes for:
- **Foreign keys** (automatic in Prisma)
- **Frequently filtered columns** (status, stage, role)
- **Search fields** (name, email)
- **Sort columns** (createdAt, updatedAt)
- **Join conditions**

Avoid indexes on:
- **Low cardinality columns** (boolean, enum with few values)
- **Frequently updated columns** (counters, timestamps)
- **Small tables** (< 1000 rows)

### Composite Indexes

For multi-column filters, use composite indexes:

```prisma
// Good for: WHERE status = 'ACTIVE' AND stage = 'SCREENING'
@@index([status, stage])

// Good for: WHERE assignedTo = 'id' AND status = 'ACTIVE'
@@index([assignedTo, status])
```

### Analyzing Index Usage

```sql
-- Check index usage on a table
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,        -- Number of index scans
  idx_tup_read,    -- Tuples read via index
  idx_tup_fetch    -- Live tuples fetched
FROM pg_stat_user_indexes
WHERE tablename = 'Deal';
```

---

## Query Optimization

### Select Only Required Fields

**Avoid:**
```typescript
const deal = await prisma.deal.findUnique({
  where: { id: 'deal-id' }
  // Returns ALL fields
});
```

**Prefer:**
```typescript
const deal = await prisma.deal.findUnique({
  where: { id: 'deal-id' },
  select: {
    id: true,
    companyName: true,
    stage: true,
    amount: true
  }
});
```

### Use Pagination

```typescript
// Cursor-based (most efficient)
const deals = await prisma.deal.findMany({
  take: 50,
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: 'desc' }
});
```

### Batch Queries

```typescript
// Use findMany with IN clause instead of multiple findUnique
const deals = await prisma.deal.findMany({
  where: {
    id: { in: dealIds }
  }
});
```

### Avoid N+1 Queries

**Problem (N+1):**
```typescript
const deals = await prisma.deal.findMany();
for (const deal of deals) {
  const user = await prisma.user.findUnique({
    where: { id: deal.assignedTo }
  });
  // 1 query for deals + N queries for users = N+1
}
```

**Solution (Include):**
```typescript
const deals = await prisma.deal.findMany({
  include: {
    assignee: true  // Single JOIN query
  }
});
```

### Raw SQL for Complex Queries

For complex aggregations, use raw SQL:

```typescript
const metrics = await prisma.$queryRaw`
  SELECT 
    COUNT(*) as total,
    SUM(amount) as total_amount
  FROM "Deal"
  WHERE stage = 'CLOSED'
`;
```

---

## Connection Pooling

### Environment Configuration

```env
# Development
DATABASE_URL="postgresql://user:pass@localhost:5432/redstick?connection_limit=5"

# Production (with PgBouncer or similar)
DATABASE_URL="postgresql://user:pass@prod-host:5432/redstick?connection_limit=20&pool_timeout=30"
```

### Prisma Connection Settings

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Connection Pool Sizing

Recommended pool sizes:
- **Development:** 5-10 connections
- **Production (single instance):** 10-20 connections
- **Production (multiple instances):** 5-10 per instance
- **Serverless:** 1-2 connections (use connection pooling service)

---

## Caching Strategies

### Application-Level Caching

```typescript
// Cache frequently accessed data
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

export async function getPortfolioMetrics() {
  const cacheKey = 'portfolio_metrics';
  let metrics = cache.get(cacheKey);
  
  if (!metrics) {
    metrics = await prisma.company.aggregate({
      _count: { id: true },
      _sum: { investment: true, valuation: true }
    });
    cache.set(cacheKey, metrics);
  }
  
  return metrics;
}
```

### Cache Invalidation

```typescript
// Invalidate cache on data changes
export async function updateCompany(id: string, data: any) {
  const result = await prisma.company.update({
    where: { id },
    data
  });
  
  // Invalidate related caches
  cache.del('portfolio_metrics');
  cache.del(`company_${id}`);
  
  return result;
}
```

### Query Result Caching

Cache candidates:
- Portfolio metrics (5-15 minutes)
- Company lists (1-5 minutes)
- Agent statistics (1 minute)
- Static reference data (1 hour)

---

## Monitoring & Profiling

### Enable Query Logging

```typescript
// Development only
const prisma = new PrismaClient({
  log: [
    { emit: 'stdout', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' }
  ]
});
```

### Slow Query Analysis

```sql
-- Find slow queries
SELECT 
  query,
  calls,
  mean_time,
  total_time,
  rows
FROM pg_stat_statements
WHERE query LIKE '%Deal%'
ORDER BY mean_time DESC
LIMIT 10;
```

### Performance Metrics to Monitor

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Query duration (p95) | < 100ms | > 500ms |
| Query duration (p99) | < 200ms | > 1000ms |
| Connection pool usage | < 80% | > 90% |
| Cache hit rate | > 90% | < 80% |
| Table bloat | < 20% | > 50% |

### EXPLAIN ANALYZE

Always use EXPLAIN ANALYZE for query optimization:

```sql
EXPLAIN ANALYZE
SELECT d.*, c.name as company_name
FROM "Deal" d
LEFT JOIN "Company" c ON d."companyId" = c.id
WHERE d.status = 'ACTIVE'
ORDER BY d."createdAt" DESC
LIMIT 50;
```

Look for:
- **Seq Scan** on large tables (should use Index Scan)
- **High execution time** > 100ms
- **Large row counts** before LIMIT

---

## Best Practices

### Schema Design

1. **Use appropriate data types:**
   - `TEXT` over `VARCHAR` (no length limit overhead)
   - `TIMESTAMP WITH TIME ZONE` for timestamps
   - `DECIMAL` for monetary values (not FLOAT)

2. **Add NOT NULL constraints** where appropriate

3. **Use CUID for IDs** (better than auto-increment for distributed systems)

4. **Normalize data** but denormalize for read-heavy queries

### Transaction Management

```typescript
// Use transactions for related operations
await prisma.$transaction([
  prisma.deal.update({
    where: { id: dealId },
    data: { stage: 'CLOSED' }
  }),
  prisma.company.update({
    where: { id: companyId },
    data: { status: 'ACTIVE' }
  })
]);
```

### Bulk Operations

```typescript
// Use createMany for bulk inserts
await prisma.deal.createMany({
  data: dealsArray,
  skipDuplicates: true
});

// Use deleteMany with caution
await prisma.agentRun.deleteMany({
  where: {
    startedAt: { lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
  }
});
```

### Database Maintenance

```bash
# Regular maintenance tasks

# 1. Analyze tables for query planner
psql -c "ANALYZE;"

# 2. Vacuum to reclaim space
psql -c "VACUUM ANALYZE;"

# 3. Reindex if needed
psql -c "REINDEX DATABASE redstick;"
```

### Environment-Specific Settings

**Development:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/redstick_dev"
DEBUG=true
QUERY_LOGGING=true
```

**Production:**
```env
DATABASE_URL="postgresql://user:pass@prod:5432/redstick_prod?connection_limit=20&pool_timeout=30"
DEBUG=false
QUERY_LOGGING=false
```

---

## Performance Checklist

Before deploying new features:

- [ ] Added appropriate indexes for new queries
- [ ] Tested query performance with EXPLAIN ANALYZE
- [ ] Implemented pagination for list queries
- [ ] Added caching for frequently accessed data
- [ ] Verified connection pool settings
- [ ] Tested with realistic data volumes
- [ ] Added monitoring/alerting for slow queries
- [ ] Documented any complex query patterns

## Troubleshooting

### High CPU Usage
1. Check for missing indexes
2. Look for sequential scans on large tables
3. Analyze and vacuum tables

### Slow Queries
1. Run EXPLAIN ANALYZE
2. Check for N+1 queries
3. Verify index usage
4. Consider denormalization

### Connection Issues
1. Check connection pool size
2. Verify no connection leaks
3. Use connection pooling service in production
4. Monitor active connections

### Memory Issues
1. Reduce connection pool size
2. Add result pagination
3. Optimize large result set queries
4. Consider streaming for exports
