# Architecture Overview

## System Overview

The Redstick Ventures Command Center is a modern, accessible dashboard for venture capital firms. It provides comprehensive tools for deal management, portfolio tracking, and AI-powered investment analysis.

### Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.0+ |
| Styling | Tailwind CSS 3.0 |
| UI Primitives | Radix UI |
| Animations | Framer Motion |
| State Management | TanStack Query + React Context |
| Authentication | NextAuth.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Testing | Jest + React Testing Library + Playwright |

### Architecture Philosophy

1. **Accessibility First**: WCAG 2.1 AA compliance built-in, not bolted on
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Type Safety**: End-to-end TypeScript with strict mode
4. **Performance**: Server components, code splitting, optimized bundles
5. **Maintainability**: Clear patterns, comprehensive documentation

---

## Frontend Architecture

### Next.js 16 App Router

We use the Next.js App Router for its advanced features and improved performance characteristics.

#### App Router Benefits

- **Server Components by Default**: Reduced client-side JavaScript
- **Nested Layouts**: Shared UI across routes without re-renders
- **Streaming**: Progressive page loading with Suspense
- **Parallel Routes**: Complex UI patterns like dashboards with side panels
- **Intercepting Routes**: Modals that maintain URL state

#### Route Groups and Layouts

```
app/
├── (public)/          # Route group (no URL segment)
│   ├── page.tsx       # Marketing landing page
│   └── layout.tsx     # Public layout
├── app/               # Dashboard routes
│   ├── layout.tsx     # App shell with sidebar
│   ├── page.tsx       # Dashboard home
│   ├── deals/
│   ├── companies/
│   └── settings/
└── api/               # API routes
```

#### Server vs Client Components

| Use Server Components | Use Client Components |
|----------------------|----------------------|
| Static content | Interactive UI |
| Data fetching | Browser APIs |
| Access to backend resources | Event handlers |
| Large dependencies | useState, useEffect |

**Pattern**: Default to Server Components, add `'use client'` only when needed.

```tsx
// Server Component (default)
async function DealsPage() {
  const deals = await getDeals(); // Direct DB access
  return <DealList deals={deals} />;
}

// Client Component
'use client';
function DealCard({ deal }: { deal: Deal }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <button onClick={() => setExpanded(!expanded)}>
      {deal.companyName}
    </button>
  );
}
```

### Component Architecture

We follow **Atomic Design** methodology for component organization:

#### Atomic Design Hierarchy

```
components/
├── ui/              # Atoms & Molecules
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Modal.tsx
├── molecules/       # Complex molecules
│   ├── DealCard.tsx
│   └── MetricCard.tsx
├── organisms/       # Organisms
│   ├── DealTable.tsx
│   └── PipelineBoard.tsx
├── layouts/         # Templates
│   ├── AppLayout.tsx
│   └── DashboardLayout.tsx
└── (pages)/         # Page components
```

#### Component Composition Patterns

**Compound Components** for complex UI:

```tsx
<DataTable data={deals}>
  <DataTable.Header>
    <DataTable.Column sortable>Company</DataTable.Column>
    <DataTable.Column>Stage</DataTable.Column>
  </DataTable.Header>
  <DataTable.Body>
    {deals.map(deal => (
      <DataTable.Row key={deal.id}>
        <DataTable.Cell>{deal.companyName}</DataTable.Cell>
      </DataTable.Row>
    ))}
  </DataTable.Body>
</DataTable>
```

#### Shared Component Library

All reusable UI components are in `components/ui/`:

```tsx
// components/ui/index.ts
export { Button } from './Button';
export { Card, CardHeader, CardContent } from './Card';
export { Modal } from './Modal';
// ... etc
```

### State Management

#### TanStack Query (Server State)

For all server state (data from API/database):

```tsx
function DealList() {
  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['deals'],
    queryFn: fetchDeals,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ul>{deals.map(deal => <DealItem key={deal.id} deal={deal} />)}</ul>;
}
```

Benefits:
- Automatic caching and background refetching
- Optimistic updates
- Request deduplication
- Pagination and infinite scroll support

#### React Context (Global UI State)

For UI state that needs to be global:

```tsx
// contexts/ThemeContext.tsx
const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### URL State (Filters/Pagination)

Use URL search params for shareable state:

```tsx
function useDealFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const stage = searchParams.get('stage');
  
  const setStage = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('stage', value);
    router.push(`?${params.toString()}`);
  };
  
  return { stage, setStage };
}
```

#### Local Component State

Use `useState` for purely local UI state:

```tsx
function Accordion({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

### Design System

#### Tailwind CSS Architecture

Custom configuration in `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary palette
        primary: {
          DEFAULT: '#e94560',
          light: '#ff6b7a',
          dark: '#c73e54',
        },
        // Background
        background: '#0f0f1a',
        surface: '#1a1a2e',
        // Text
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0b0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
};
```

#### Design Tokens

Centralized in `lib/design-tokens.ts`:

```typescript
export const tokens = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.15)',
    lg: '0 10px 15px rgba(0,0,0,0.2)',
  },
};
```

#### Component Variants

Use `class-variance-authority` for type-safe variants:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-light',
        secondary: 'bg-surface text-white hover:bg-surface-light',
        ghost: 'hover:bg-white/10',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

---

## Authentication & Security

### NextAuth.js

We use NextAuth.js for authentication with credentials provider.

#### Credentials Provider

```typescript
// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Validate credentials against database
        const user = await validateCredentials(credentials);
        if (!user) return null;
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
});
```

#### JWT Session Strategy

Sessions are stored as JWTs in cookies:

```typescript
// Token contains user info
type JWTToken = {
  sub: string;      // User ID
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};
```

#### Role-Based Access Control

Middleware for route protection:

```typescript
// middleware.ts
import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  
  // Protect dashboard routes
  if (nextUrl.pathname.startsWith('/app') && !isLoggedIn) {
    return Response.redirect(new URL('/login', nextUrl));
  }
  
  // Admin-only routes
  if (nextUrl.pathname.startsWith('/app/admin') && userRole !== 'ADMIN') {
    return Response.redirect(new URL('/app/dashboard', nextUrl));
  }
});
```

---

## Database Architecture

### Prisma ORM

#### Schema Design

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole @default(ANALYST)
  password  String   // Hashed
  deals     Deal[]
  createdAt DateTime @default(now())
}

model Deal {
  id          String     @id @default(cuid())
  companyName String
  stage       DealStage
  amount      Float?
  assignedTo  String?
  user        User?      @relation(fields: [assignedTo], references: [id])
  createdAt   DateTime   @default(now())
}

enum UserRole {
  ADMIN
  PARTNER
  ANALYST
}

enum DealStage {
  INBOUND
  SCREENING
  FIRST_MEETING
  DUE_DILIGENCE
  TERM_SHEET
  CLOSED
  PASSED
}
```

#### Migration Strategy

```bash
# Development
npx prisma migrate dev --name add_new_feature

# Production
npx prisma migrate deploy
```

#### Connection Pooling

```env
# Connection with pooling
DATABASE_URL="postgresql://user:pass@host/db?connection_limit=10&pool_timeout=20"
```

#### Query Optimization

Use Prisma's query engine effectively:

```typescript
// Good: Select only needed fields
const deals = await prisma.deal.findMany({
  select: {
    id: true,
    companyName: true,
    stage: true,
  },
  where: {
    stage: 'DUE_DILIGENCE',
  },
  orderBy: {
    createdAt: 'desc',
  },
});

// Good: Include related data
const dealsWithUsers = await prisma.deal.findMany({
  include: {
    user: {
      select: { name: true, email: true },
    },
  },
});
```

---

## Folder Structure

```
redstick-command-center/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public pages (marketing)
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── app/                 # Dashboard routes
│   │   ├── layout.tsx       # App shell
│   │   ├── page.tsx         # Dashboard home
│   │   ├── deals/
│   │   ├── companies/
│   │   ├── agents/
│   │   └── settings/
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   ├── deals/
│   │   ├── companies/
│   │   └── agents/
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── not-found.tsx
├── components/              # React components
│   ├── ui/                 # Base UI components
│   ├── layout/             # Layout components
│   ├── charts/             # Chart components
│   ├── deals/              # Deal-specific components
│   ├── companies/          # Company-specific components
│   └── agents/             # Agent-specific components
├── hooks/                   # Custom React hooks
│   ├── useDeals.ts
│   ├── useCompanies.ts
│   └── useToast.ts
├── lib/                     # Utility functions
│   ├── utils.ts            # General utilities
│   ├── animations.ts       # Animation configs
│   ├── design-tokens.ts    # Design system tokens
│   └── prisma.ts           # Prisma client
├── types/                   # TypeScript types
│   ├── deal.ts
│   ├── company.ts
│   └── index.ts
├── prisma/                  # Database
│   ├── schema.prisma
│   └── seed.ts
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── ...
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/                  # Static assets
├── .github/                 # GitHub workflows
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

### Rationale

1. **App Router Structure**: Leverages Next.js 13+ features
2. **Component Organization**: Atomic Design for scalability
3. **Separate Hooks**: Reusable logic isolated from UI
4. **Lib Folder**: Shared utilities clearly separated
5. **Types Folder**: Centralized type definitions
6. **Docs Folder**: Documentation co-located with code

---

## Data Flow

### System Architecture Data Flow

```mermaid
graph TB
    subgraph "Client"
        A[User Interface]
        B[React Components]
        C[TanStack Query]
        D[Client State]
    end
    
    subgraph "Next.js Server"
        E[API Routes]
        F[Server Components]
        G[NextAuth]
    end
    
    subgraph "Backend"
        H[Prisma Client]
        I[PostgreSQL]
    end
    
    subgraph "External"
        J[AI Services]
    end
    
    A -->|Interaction| B
    B -->|Fetch| C
    C -->|API Request| E
    C -->|Cache| D
    F -->|Direct Query| H
    E -->|Query| H
    G -->|Auth Check| E
    H -->|SQL| I
    E -->|AI Call| J
```

### Request Lifecycle Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS
    participant API
    participant DB
    
    User->>Browser: Navigate to /app/deals
    Browser->>NextJS: Request page
    
    alt Server Component
        NextJS->>DB: Direct Prisma query
        DB-->>NextJS: Return data
        NextJS-->>Browser: HTML with data
    else Client Component
        NextJS-->>Browser: HTML shell
        Browser->>API: Fetch /api/deals
        API->>DB: Prisma query
        DB-->>API: Return data
        API-->>Browser: JSON response
    end
    
    Browser-->>User: Render page
```

### State Synchronization Flow

```mermaid
graph LR
    A[User Action] --> B[Optimistic Update]
    B --> C[API Call]
    C --> D{Success?}
    D -->|Yes| E[Confirm Update]
    D -->|No| F[Rollback]
    E --> G[Cache Update]
    F --> H[Show Error]
    G --> I[UI Reflects State]
```

### Authentication Data Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant NextAuth
    participant DB
    
    User->>App: Login request
    App->>NextAuth: signIn(credentials)
    NextAuth->>DB: Validate credentials
    DB-->>NextAuth: User data
    NextAuth-->>App: JWT token
    App-->>User: Redirect to dashboard
    
    User->>App: Access protected route
    App->>NextAuth: Verify JWT
    NextAuth-->>App: Valid session
    App-->>User: Serve content
```

### Data Fetching Patterns

1. **Server Components (Default)**
   ```tsx
   // Direct database access
   async function Page() {
     const data = await prisma.deal.findMany();
     return <DealList deals={data} />;
   }
   ```

2. **Client Components with TanStack Query**
   ```tsx
   'use client';
   function Page() {
     const { data } = useQuery({ queryKey: ['deals'], queryFn: fetchDeals });
     return <DealList deals={data} />;
   }
   ```

3. **Hybrid Approach**
   ```tsx
   // Server Component fetches initial data
   async function Page() {
     const initialDeals = await prisma.deal.findMany();
     return <DealListClient initialDeals={initialDeals} />;
   }
   
   // Client Component handles interactions
   'use client';
   function DealListClient({ initialDeals }) {
     const { data } = useQuery({
       queryKey: ['deals'],
       queryFn: fetchDeals,
       initialData: initialDeals,
     });
   }
   ```

### Cache Invalidation Strategy

| Cache Layer | Invalidation Trigger | Strategy |
|------------|---------------------|----------|
| Browser | Data mutation | TanStack Query automatic |
| CDN | Deployment | Vercel cache purge |
| API Response | Data change | Cache-Control headers |
| Database | Write operation | Not applicable |

### Error Handling Flow

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type}
    B -->|API| C[Return Error Response]
    B -->|Database| D[Prisma Error]
    B -->|Validation| E[Zod Error]
    B -->|Unexpected| F[500 Error]
    
    C --> G[Client Receives]
    D --> H[Transform to API Error]
    E --> I[Return 400 Response]
    F --> J[Log to Sentry]
    
    G --> K[TanStack Query onError]
    H --> C
    I --> G
    J --> F
    
    K --> L[Show Toast Error]
    K --> M[Error Boundary UI]
```

---

## Build & Bundle Architecture

### Code Splitting Strategy

Next.js automatically handles:
- **Page-level splitting**: Each page is a separate chunk
- **Dynamic imports**: Lazy load heavy components

```tsx
// Lazy load chart component
const PortfolioChart = dynamic(
  () => import('@/components/charts/PortfolioChart'),
  { 
    loading: () => <Skeleton height={400} />,
    ssr: false // Don't server-render charts
  }
);
```

### Dynamic Imports

Use for heavy dependencies:

```tsx
// Heavy PDF export library
const exportToPDF = async (data) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  // ... generate PDF
};
```

### Bundle Optimization

```javascript
// next.config.js
module.exports = {
  // Enable bundle analyzer in analyze mode
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(new BundleAnalyzerPlugin());
      return config;
    },
  }),
  
  // Optimize package imports
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};
```

---

## Summary

This architecture provides:

1. **Performance**: Server components, code splitting, optimized builds
2. **Type Safety**: End-to-end TypeScript coverage
3. **Scalability**: Clear patterns, atomic design, separation of concerns
4. **Accessibility**: WCAG 2.1 AA compliance throughout
5. **Developer Experience**: Great DX with clear patterns and documentation
6. **Maintainability**: Well-documented, consistent code organization

For questions or suggestions about this architecture, refer to the ADRs in `docs/ADRs/` or open an issue.
