# Database Migrations

## Overview
This document tracks all database migrations for the Redstick Ventures Command Center.

## Migration History

### Initial Migration (000000000000_init)
**Date:** 2024-01-15
**Description:** Initial database schema creation

**Changes:**
- Created `User` table with authentication fields
- Created `Company` table for portfolio tracking
- Created `Deal` table with pipeline stages
- Created `Agent` table for AI configurations
- Created `AgentRun` table for execution history
- Established all foreign key relationships
- Created indexes for performance

**SQL Summary:**
```sql
-- User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ANALYST',
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Company table
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "sector" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "founded" INTEGER,
    "employees" INTEGER,
    "investment" DOUBLE PRECISION,
    "valuation" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Deal table
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'INBOUND',
    "amount" DOUBLE PRECISION,
    "description" TEXT,
    "source" TEXT NOT NULL DEFAULT 'REFERRAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "companyId" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("companyId") REFERENCES "Company"("id"),
    FOREIGN KEY ("assignedTo") REFERENCES "User"("id")
);

-- Agent table
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INACTIVE',
    "config" JSONB NOT NULL DEFAULT '{}',
    "lastRun" TIMESTAMP(3),
    "successRate" INTEGER NOT NULL DEFAULT 0,
    "totalRuns" INTEGER NOT NULL DEFAULT 0,
    "tokenUsage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- AgentRun table
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "output" TEXT,
    "error" TEXT,
    FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id")
);
```

---

## Migration Guidelines

### Creating a New Migration

1. **Update Schema:** Modify `prisma/schema.prisma` with your changes

2. **Generate Migration:**
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```

3. **Review SQL:** Check the generated SQL in `prisma/migrations/XXXXXXXXXXXXXX_descriptive_name/`

4. **Apply Migration:**
   ```bash
   npx prisma migrate dev
   ```

### Naming Conventions

- Use descriptive, lowercase names with underscores
- Examples:
  - `add_user_preferences`
  - `create_deal_notes`
  - `add_company_logo`
  - `update_agent_config`

### Migration Best Practices

1. **Always review generated SQL** before applying
2. **Test migrations** on a copy of production data
3. **Never modify existing migrations** that have been applied
4. **Create new migrations** to fix issues
5. **Backup database** before running migrations in production

### Rollback Procedures

If a migration fails:

```bash
# Reset to a specific migration
npx prisma migrate resolve --rolled-back "20240115120000_migration_name"

# Or reset entire database (development only)
npx prisma migrate reset
```

### Production Deployment

1. **Generate migration (without applying):**
   ```bash
   npx prisma migrate dev --name migration_name --create-only
   ```

2. **Apply in production:**
   ```bash
   npx prisma migrate deploy
   ```

### Environment Variables

Ensure these are set before running migrations:

```bash
# Database connection string
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# For shadow database (development)
SHADOW_DATABASE_URL="postgresql://user:password@host:port/shadow_db"
```

### Migration Checklist

Before creating a migration:

- [ ] Schema changes are complete and tested
- [ ] All required fields have defaults or are optional
- [ ] Foreign key constraints are correct
- [ ] Indexes are added for performance
- [ ] Enum values are appropriate
- [ ] No breaking changes to existing data

After creating a migration:

- [ ] SQL looks correct
- [ ] Migration applies successfully locally
- [ ] Application works with new schema
- [ ] Tests pass
- [ ] Documentation is updated

### Common Migration Patterns

#### Adding a new column
```prisma
// schema.prisma
model Deal {
  // ... existing fields
  priority Priority @default(MEDIUM) // New field
}
```

#### Creating a new table
```prisma
// schema.prisma
model DealNote {
  id        String   @id @default(cuid())
  dealId    String
  content   String
  createdAt DateTime @default(now())
  
  deal Deal @relation(fields: [dealId], references: [id])
}
```

#### Adding an index
```prisma
// schema.prisma
model Deal {
  // ... existing fields
  
  @@index([priority])
}
```

### Troubleshooting

**Error: Migration already applied**
```bash
npx prisma migrate resolve --applied "migration_name"
```

**Error: Database drift detected**
```bash
# Reset and reapply
npx prisma migrate reset
```

**Error: Migration lock timeout**
```bash
# Check for hanging connections and retry
```
