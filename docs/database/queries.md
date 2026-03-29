# Common Query Patterns

This document provides common SQL and Prisma query patterns for the Redstick Ventures Command Center database.

## Table of Contents

1. [User Queries](#user-queries)
2. [Deal Queries](#deal-queries)
3. [Company Queries](#company-queries)
4. [Agent Queries](#agent-queries)
5. [Analytics Queries](#analytics-queries)
6. [Complex Joins](#complex-joins)

---

## User Queries

### Get user by email

**Prisma:**
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

**SQL:**
```sql
SELECT * FROM "User" WHERE email = 'user@example.com';
```

### Get user with assigned deals

**Prisma:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: {
    assignedDeals: {
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    }
  }
});
```

**SQL:**
```sql
SELECT u.*, d.* 
FROM "User" u
LEFT JOIN "Deal" d ON u.id = d."assignedTo"
WHERE u.id = 'user-id' AND d.status = 'ACTIVE'
ORDER BY d."createdAt" DESC;
```

### Count users by role

**Prisma:**
```typescript
const roleCounts = await prisma.user.groupBy({
  by: ['role'],
  _count: { id: true }
});
```

**SQL:**
```sql
SELECT role, COUNT(*) as count
FROM "User"
GROUP BY role;
```

---

## Deal Queries

### Get active pipeline deals

**Prisma:**
```typescript
const pipelineDeals = await prisma.deal.findMany({
  where: {
    status: 'ACTIVE',
    stage: { not: 'CLOSED' }
  },
  include: {
    assignee: { select: { name: true, email: true } },
    company: { select: { name: true, sector: true } }
  },
  orderBy: { createdAt: 'desc' }
});
```

**SQL:**
```sql
SELECT 
  d.*,
  u.name as assignee_name,
  u.email as assignee_email,
  c.name as company_name,
  c.sector as company_sector
FROM "Deal" d
LEFT JOIN "User" u ON d."assignedTo" = u.id
LEFT JOIN "Company" c ON d."companyId" = c.id
WHERE d.status = 'ACTIVE' AND d.stage != 'CLOSED'
ORDER BY d."createdAt" DESC;
```

### Get deals by stage

**Prisma:**
```typescript
const dealsByStage = await prisma.deal.groupBy({
  by: ['stage'],
  where: { status: 'ACTIVE' },
  _count: { id: true },
  _sum: { amount: true }
});
```

**SQL:**
```sql
SELECT 
  stage,
  COUNT(*) as deal_count,
  COALESCE(SUM(amount), 0) as total_amount
FROM "Deal"
WHERE status = 'ACTIVE'
GROUP BY stage;
```

### Get my deals (assigned to current user)

**Prisma:**
```typescript
const myDeals = await prisma.deal.findMany({
  where: {
    assignedTo: userId,
    status: 'ACTIVE'
  },
  include: { company: true },
  orderBy: [{ stage: 'asc' }, { createdAt: 'desc' }]
});
```

**SQL:**
```sql
SELECT d.*, c.*
FROM "Deal" d
LEFT JOIN "Company" c ON d."companyId" = c.id
WHERE d."assignedTo" = 'user-id' AND d.status = 'ACTIVE'
ORDER BY d.stage ASC, d."createdAt" DESC;
```

### Search deals by company name

**Prisma:**
```typescript
const deals = await prisma.deal.findMany({
  where: {
    companyName: {
      contains: searchTerm,
      mode: 'insensitive'
    }
  }
});
```

**SQL:**
```sql
SELECT * FROM "Deal"
WHERE "companyName" ILIKE '%searchTerm%';
```

### Get deals created in date range

**Prisma:**
```typescript
const deals = await prisma.deal.findMany({
  where: {
    createdAt: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31')
    }
  }
});
```

**SQL:**
```sql
SELECT * FROM "Deal"
WHERE "createdAt" >= '2024-01-01' AND "createdAt" <= '2024-12-31';
```

---

## Company Queries

### Get portfolio companies with metrics

**Prisma:**
```typescript
const companies = await prisma.company.findMany({
  where: { status: 'ACTIVE' },
  include: {
    _count: { select: { deals: true } }
  },
  orderBy: { name: 'asc' }
});
```

**SQL:**
```sql
SELECT 
  c.*,
  COUNT(d.id) as deal_count
FROM "Company" c
LEFT JOIN "Deal" d ON c.id = d."companyId"
WHERE c.status = 'ACTIVE'
GROUP BY c.id
ORDER BY c.name ASC;
```

### Get companies by sector

**Prisma:**
```typescript
const sectorBreakdown = await prisma.company.groupBy({
  by: ['sector'],
  where: { status: 'ACTIVE' },
  _count: { id: true },
  _avg: { valuation: true }
});
```

**SQL:**
```sql
SELECT 
  sector,
  COUNT(*) as company_count,
  AVG(valuation) as avg_valuation
FROM "Company"
WHERE status = 'ACTIVE'
GROUP BY sector;
```

### Get total portfolio value

**Prisma:**
```typescript
const portfolioMetrics = await prisma.company.aggregate({
  where: { status: 'ACTIVE' },
  _count: { id: true },
  _sum: { investment: true, valuation: true }
});
```

**SQL:**
```sql
SELECT 
  COUNT(*) as total_companies,
  COALESCE(SUM(investment), 0) as total_invested,
  COALESCE(SUM(valuation), 0) as total_valuation
FROM "Company"
WHERE status = 'ACTIVE';
```

---

## Agent Queries

### Get active agents with recent runs

**Prisma:**
```typescript
const agents = await prisma.agent.findMany({
  where: { status: 'ACTIVE' },
  include: {
    runs: {
      take: 5,
      orderBy: { startedAt: 'desc' }
    }
  }
});
```

**SQL:**
```sql
SELECT a.*, r.*
FROM "Agent" a
LEFT JOIN LATERAL (
  SELECT * FROM "AgentRun"
  WHERE "agentId" = a.id
  ORDER BY "startedAt" DESC
  LIMIT 5
) r ON true
WHERE a.status = 'ACTIVE';
```

### Get agent success rate

**Prisma:**
```typescript
const agentStats = await prisma.agentRun.groupBy({
  by: ['agentId'],
  _count: { id: true },
  where: { status: 'COMPLETED' }
});
```

**SQL:**
```sql
SELECT 
  "agentId",
  COUNT(*) as completed_runs,
  COUNT(*) FILTER (WHERE status = 'COMPLETED') as successful_runs
FROM "AgentRun"
GROUP BY "agentId";
```

### Get recent agent activity

**Prisma:**
```typescript
const recentRuns = await prisma.agentRun.findMany({
  take: 20,
  orderBy: { startedAt: 'desc' },
  include: {
    agent: { select: { name: true, type: true } },
    user: { select: { name: true } }
  }
});
```

**SQL:**
```sql
SELECT 
  r.*,
  a.name as agent_name,
  a.type as agent_type,
  u.name as user_name
FROM "AgentRun" r
JOIN "Agent" a ON r."agentId" = a.id
LEFT JOIN "User" u ON r."userId" = u.id
ORDER BY r."startedAt" DESC
LIMIT 20;
```

---

## Analytics Queries

### Pipeline conversion rates

**SQL:**
```sql
SELECT 
  stage,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM "Deal"
WHERE status = 'ACTIVE'
GROUP BY stage
ORDER BY 
  CASE stage
    WHEN 'INBOUND' THEN 1
    WHEN 'SCREENING' THEN 2
    WHEN 'FIRST_MEETING' THEN 3
    WHEN 'DEEP_DIVE' THEN 4
    WHEN 'DUE_DILIGENCE' THEN 5
    WHEN 'IC_REVIEW' THEN 6
    WHEN 'TERM_SHEET' THEN 7
    WHEN 'CLOSED' THEN 8
    ELSE 9
  END;
```

### Monthly deal flow

**SQL:**
```sql
SELECT 
  DATE_TRUNC('month', "createdAt") as month,
  COUNT(*) as deals_created,
  COUNT(*) FILTER (WHERE stage = 'CLOSED') as deals_closed,
  COALESCE(SUM(amount) FILTER (WHERE stage = 'CLOSED'), 0) as amount_closed
FROM "Deal"
WHERE "createdAt" >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY DATE_TRUNC('month', "createdAt")
ORDER BY month;
```

### User activity metrics

**SQL:**
```sql
SELECT 
  u.name,
  u.role,
  COUNT(DISTINCT d.id) as assigned_deals,
  COUNT(DISTINCT ar.id) as agent_runs,
  COALESCE(SUM(d.amount) FILTER (WHERE d.stage = 'CLOSED'), 0) as closed_amount
FROM "User" u
LEFT JOIN "Deal" d ON u.id = d."assignedTo"
LEFT JOIN "AgentRun" ar ON u.id = ar."userId"
GROUP BY u.id, u.name, u.role;
```

---

## Complex Joins

### Full deal details with all relations

**Prisma:**
```typescript
const dealDetails = await prisma.deal.findUnique({
  where: { id: 'deal-id' },
  include: {
    assignee: true,
    company: {
      include: {
        deals: {
          where: { NOT: { id: 'deal-id' } }
        }
      }
    }
  }
});
```

**SQL:**
```sql
SELECT 
  d.*,
  u.id as assignee_id,
  u.name as assignee_name,
  u.email as assignee_email,
  c.id as company_id,
  c.name as company_name,
  c.sector,
  c.stage as company_stage,
  c.website,
  c.founded,
  c.employees,
  c.investment,
  c.valuation
FROM "Deal" d
LEFT JOIN "User" u ON d."assignedTo" = u.id
LEFT JOIN "Company" c ON d."companyId" = c.id
WHERE d.id = 'deal-id';
```

### Dashboard summary query

**SQL:**
```sql
WITH deal_stats AS (
  SELECT 
    COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_deals,
    COUNT(*) FILTER (WHERE stage = 'CLOSED') as closed_deals,
    COALESCE(SUM(amount) FILTER (WHERE stage = 'CLOSED'), 0) as total_closed
  FROM "Deal"
),
company_stats AS (
  SELECT 
    COUNT(*) as total_companies,
    COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_companies,
    COALESCE(SUM(valuation) FILTER (WHERE status = 'ACTIVE'), 0) as portfolio_value
  FROM "Company"
),
agent_stats AS (
  SELECT 
    COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_agents,
    COUNT(*) FILTER (WHERE "startedAt" >= CURRENT_DATE - INTERVAL '24 hours') as runs_24h
  FROM "Agent"
  LEFT JOIN "AgentRun" ON "Agent".id = "AgentRun"."agentId"
)
SELECT * FROM deal_stats, company_stats, agent_stats;
```

### Pipeline stage history

**SQL:**
```sql
SELECT 
  d.id,
  d."companyName",
  d.stage,
  d."createdAt",
  DATE_PART('day', CURRENT_TIMESTAMP - d."createdAt") as days_in_pipeline,
  u.name as assigned_to
FROM "Deal" d
LEFT JOIN "User" u ON d."assignedTo" = u.id
WHERE d.status = 'ACTIVE'
ORDER BY 
  CASE d.stage
    WHEN 'INBOUND' THEN 1
    WHEN 'SCREENING' THEN 2
    WHEN 'FIRST_MEETING' THEN 3
    WHEN 'DEEP_DIVE' THEN 4
    WHEN 'DUE_DILIGENCE' THEN 5
    WHEN 'IC_REVIEW' THEN 6
    WHEN 'TERM_SHEET' THEN 7
  END,
  d."createdAt" DESC;
```

---

## Pagination Patterns

### Cursor-based pagination

**Prisma:**
```typescript
const deals = await prisma.deal.findMany({
  take: 10,
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: 'desc' }
});
```

### Offset pagination

**Prisma:**
```typescript
const deals = await prisma.deal.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
});
```

**SQL:**
```sql
SELECT * FROM "Deal"
ORDER BY "createdAt" DESC
LIMIT 10 OFFSET 20;
```

---

## Performance Tips

1. **Use `select` instead of `include`** when you only need specific fields
2. **Add `where` clauses** before joining to reduce data transfer
3. **Use indexes** for filtered columns (see optimization.md)
4. **Limit nested includes** to prevent N+1 queries
5. **Use `distinct`** when joining to avoid duplicates

### Example: Optimized query

**Avoid:**
```typescript
// This loads ALL fields and relations
const deal = await prisma.deal.findUnique({
  where: { id: 'deal-id' },
  include: { 
    company: { include: { deals: true } },
    assignee: true 
  }
});
```

**Prefer:**
```typescript
// Only select needed fields
const deal = await prisma.deal.findUnique({
  where: { id: 'deal-id' },
  select: {
    id: true,
    companyName: true,
    stage: true,
    company: {
      select: { name: true, sector: true }
    },
    assignee: {
      select: { name: true }
    }
  }
});
```
