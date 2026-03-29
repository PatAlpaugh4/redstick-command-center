# ADR 005: Prisma ORM with PostgreSQL

## Status

**Accepted**

## Context

The Redstick Ventures Command Center requires:

- Reliable, ACID-compliant data storage
- Complex relational data (funds, deals, users, LPs, holdings)
- Type-safe database queries
- Schema migrations and version control
- Connection pooling for scalability
- JSON support for flexible metadata
- Full-text search capabilities
- Geographic data support (for portfolio company locations)

We need to decide on a database system and ORM.

## Decision

We will use **PostgreSQL** as our database and **Prisma** as our ORM.

## Consequences

### Positive

- **Type Safety**: Prisma generates TypeScript types from schema
- **Auto-generated Queries**: Intuitive, chainable query API
- **Migration System**: Version-controlled schema changes
- **Connection Pooling**: Built-in connection management
- **Raw Query Fallback**: Can drop to SQL when needed
- **Prisma Studio**: Visual database management tool
- **Relations**: First-class support for relationships
- **JSON Support**: PostgreSQL JSONB for flexible schemas
- **Full-Text Search**: PostgreSQL tsvector for search
- **Mature Ecosystem**: Large community, extensive documentation

### Negative

- **Prisma Learning Curve**: New syntax and concepts to learn
- **Migration Limitations**: Some schema changes require manual intervention
- **Bundle Size**: Prisma Client adds to bundle size
- **Cold Start**: Connection establishment can be slow in serverless
- **Complex Aggregations**: Some SQL patterns are harder to express

### Neutral

- **Schema-First**: Requires maintaining schema.prisma file
- **Client Generation**: Build step required to generate client

## Alternatives Considered

### 1. MongoDB + Mongoose

**Pros:**
- Flexible schema
- JSON-like document storage
- Horizontal scaling (sharding)
- Good for unstructured data

**Cons:**
- No ACID transactions across collections (historically)
- No native joins
- Less mature TypeScript support
- Eventual consistency model

**Verdict**: Rejected - Our data is highly relational (funds have deals, deals have activities, etc.). PostgreSQL is better suited.

### 2. MySQL + TypeORM

**Pros:**
- Widely used, battle-tested
- Good performance
- TypeORM is popular in TypeScript ecosystem
- Supports Active Record and Data Mapper patterns

**Cons:**
- Less feature-rich than PostgreSQL
- TypeORM has had maintenance issues
- More complex API than Prisma
- Migration system less robust

**Verdict**: Rejected - PostgreSQL has better JSON support and Prisma provides a better developer experience than TypeORM.

### 3. SQLite (for development) + PostgreSQL (production)

**Pros:**
- Zero-config for development
- Fast tests with in-memory database
- Simple setup

**Cons:**
- Different SQL dialects between dev and prod
- Risk of "works on my machine"
- Limited concurrency
- No advanced PostgreSQL features in dev

**Verdict**: Rejected - Using the same database in all environments prevents environment-specific bugs.

### 4. Supabase (Firebase alternative)

**Pros:**
- Managed PostgreSQL
- Real-time subscriptions
- Built-in auth
- Row-level security

**Cons:**
- Vendor lock-in
- Less control over database
- Additional abstraction layer
- Costs scale with usage

**Verdict**: Partially considered - May use for specific features, but core database will be direct PostgreSQL.

### 5. Drizzle ORM

**Pros:**
- Type-safe SQL-like syntax
- Smaller bundle size than Prisma
- No code generation step
- Good performance

**Cons:**
- Newer, smaller community
- Less mature ecosystem
- Fewer features than Prisma
- Smaller documentation

**Verdict**: Rejected - While promising, Prisma's maturity and ecosystem make it the safer choice for production.

### 6. Raw SQL (pg, postgres.js)

**Pros:**
- Full SQL power
- No abstraction overhead
- Smallest bundle size
- Complete control

**Cons:**
- No type safety
- Manual migration management
- More boilerplate
- Higher risk of SQL injection

**Verdict**: Rejected - ORM provides significant productivity and safety benefits worth the abstraction cost.

## Implementation Notes

### Schema Design Example

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Users and Authentication
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  role         UserRole @default(ASSOCIATE)
  passwordHash String
  avatarUrl    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  assignedDeals  Deal[]
  activities     Activity[]
  notifications  Notification[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

// Core VC Domain
model Fund {
  id          String     @id @default(cuid())
  name        String
  vintage     Int
  targetSize  Decimal    @db.Decimal(15, 2)
  actualSize  Decimal?   @db.Decimal(15, 2)
  currency    String     @default("USD")
  status      FundStatus @default(ACTIVE)
  description String?    @db.Text
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Relations
  deals    Deal[]
  holdings Holding[]
  reports  LPReport[]

  @@map("funds")
}

model Deal {
  id             String     @id @default(cuid())
  companyName    String
  stage          DealStage  @default(SOURCING)
  investmentDate DateTime?
  amount         Decimal?   @db.Decimal(15, 2)
  valuation      Decimal?   @db.Decimal(15, 2)
  equityStake    Decimal?   @db.Decimal(5, 2) // Percentage
  sector         String?
  geography      String?
  website        String?
  description    String?    @db.Text
  tags           String[]   @default([])
  metadata       Json?      // Flexible storage
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  // Relations
  assignedTo   User       @relation(fields: [assignedToId], references: [id])
  assignedToId String
  fund         Fund       @relation(fields: [fundId], references: [id])
  fundId       String
  documents    Document[]
  activities   Activity[]

  // Indexes
  @@index([stage])
  @@index([assignedToId])
  @@index([fundId])
  @@index([sector])
  @@index([createdAt])
  @@map("deals")
}

model Holding {
  id                String   @id @default(cuid())
  investmentAmount  Decimal  @db.Decimal(15, 2)
  currentValue      Decimal  @db.Decimal(15, 2)
  realizedValue     Decimal? @db.Decimal(15, 2)
  acquisitionDate   DateTime
  exitDate          DateTime?
  exitValue         Decimal? @db.Decimal(15, 2)
  companyName       String
  sector            String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  fund   Fund   @relation(fields: [fundId], references: [id])
  fundId String

  @@index([fundId])
  @@map("holdings")
}

// Documents and Activities
model Document {
  id       String       @id @default(cuid())
  filename String
  url      String
  type     DocumentType
  size     Int
  uploadedAt DateTime   @default(now())

  // Relations
  deal   Deal   @relation(fields: [dealId], references: [id], onDelete: Cascade)
  dealId String

  @@map("documents")
}

model Activity {
  id      String       @id @default(cuid())
  type    ActivityType
  content String       @db.Text
  createdAt DateTime   @default(now())

  // Relations
  deal   Deal   @relation(fields: [dealId], references: [id], onDelete: Cascade)
  dealId String
  user   User   @relation(fields: [userId], references: [id])
  userId String

  @@index([dealId])
  @@index([userId])
  @@map("activities")
}

// LP Reporting
model LPReport {
  id          String     @id @default(cuid())
  quarter     Int
  year        Int
  status      ReportStatus @default(DRAFT)
  content     Json       // Structured report data
  generatedAt DateTime?
  sentAt      DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Relations
  fund   Fund   @relation(fields: [fundId], references: [id])
  fundId String

  @@unique([fundId, year, quarter])
  @@map("lp_reports")
}

// Enums
enum UserRole {
  ADMIN
  PARTNER
  ASSOCIATE
  LP
}

enum FundStatus {
  ACTIVE
  CLOSED
  LIQUIDATED
}

enum DealStage {
  SOURCING
  INITIAL_SCREENING
  DILIGENCE
  IC_REVIEW
  APPROVED
  PASSED
  WITHDRAWN
}

enum DocumentType {
  PITCH_DECK
  FINANCIAL_MODEL
  LEGAL_AGREEMENT
  DUE_DILIGENCE
  IC_MEMO
  OTHER
}

enum ActivityType {
  NOTE
  EMAIL
  MEETING
  CALL
  STAGE_CHANGE
  DOCUMENT_UPLOAD
}

enum ReportStatus {
  DRAFT
  REVIEW
  FINAL
  SENT
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  title     String
  message   String
  read      Boolean  @default(false)
  data      Json?    // Additional notification data
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([read])
  @@map("notifications")
}
```

### Database Client Setup

```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Query Patterns

```ts
// Fetching with relations
const deals = await prisma.deal.findMany({
  where: {
    stage: 'DILIGENCE',
    fundId: 'some-fund-id',
  },
  include: {
    assignedTo: {
      select: { name: true, email: true },
    },
    activities: {
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
  },
  orderBy: { createdAt: 'desc' },
});

// Creating with relations
const newDeal = await prisma.deal.create({
  data: {
    companyName: 'TechCorp',
    stage: 'SOURCING',
    fund: { connect: { id: fundId } },
    assignedTo: { connect: { id: userId } },
    activities: {
      create: {
        type: 'NOTE',
        content: 'Initial contact made',
        user: { connect: { id: userId } },
      },
    },
  },
  include: {
    assignedTo: true,
    activities: true,
  },
});

// Transactions
const [updatedDeal, activity] = await prisma.$transaction([
  prisma.deal.update({
    where: { id: dealId },
    data: { stage: 'DILIGENCE' },
  }),
  prisma.activity.create({
    data: {
      type: 'STAGE_CHANGE',
      content: 'Moved to Diligence',
      deal: { connect: { id: dealId } },
      user: { connect: { id: userId } },
    },
  }),
]);

// Aggregations
const portfolioMetrics = await prisma.holding.groupBy({
  by: ['sector'],
  where: { fundId },
  _sum: {
    investmentAmount: true,
    currentValue: true,
  },
  _count: true,
});
```

### Migration Workflow

```bash
# Development
npx prisma migrate dev --name add_user_preferences

# Production (CI/CD)
npx prisma migrate deploy

# Reset (development only)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### Connection Pooling (for Serverless)

```
# .env
# Direct connection for migrations
DIRECT_URL="postgresql://user:pass@host:5432/db"

# Pooled connection for application
DATABASE_URL="postgresql://user:pass@pooler-host:5432/db?pgbouncer=true"
```

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Data Guide](https://www.prisma.io/dataguide)
- [PostgreSQL vs MongoDB](https://www.prisma.io/dataguide/postgresql/comparing-mysql-postgres)

## Date

2024-01-15

## Authors

- Architecture Team
