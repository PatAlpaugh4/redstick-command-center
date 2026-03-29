# Data Flow Diagrams

## System Architecture Data Flow

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

## Request Lifecycle Flow

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

## State Synchronization Flow

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

## Authentication Data Flow

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

## Data Fetching Patterns

### Server Component Pattern
```
┌─────────────────────────────────────────┐
│  Server Component                       │
│  ┌─────────────────────────────────────┐│
│  │ async function Page() {             ││
│  │   const data = await prisma.deal    ││
│  │     .findMany();                     ││
│  │   return <DealList deals={data} />; ││
│  │ }                                   ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Client Component Pattern
```
┌─────────────────────────────────────────┐
│  Client Component                       │
│  'use client'                           │
│  ┌─────────────────────────────────────┐│
│  │ function Page() {                   ││
│  │   const { data } = useQuery({       ││
│  │     queryKey: ['deals'],            ││
│  │     queryFn: fetchDeals             ││
│  │   });                               ││
│  │   return <DealList deals={data} />; ││
│  │ }                                   ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Hybrid Pattern
```
┌──────────────────────────────────────────────┐
│  Server Component                            │
│  ┌─────────────────────────────────────────┐ │
│  │ async function Page() {                 │ │
│  │   const initial = await prisma.deal     │ │
│  │     .findMany();                        │ │
│  │   return (                              │ │
│  │     <DealListClient                     │ │
│  │       initialDeals={initial}            │ │
│  │     />                                  │ │
│  │   );                                    │ │
│  │ }                                       │ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│  Client Component                            │
│  'use client'                                │
│  ┌─────────────────────────────────────────┐ │
│  │ function DealListClient({               │ │
│  │   initialDeals                          │ │
│  │ }) {                                    │ │
│  │   const { data } = useQuery({           │ │
│  │     queryKey: ['deals'],                │ │
│  │     queryFn: fetchDeals,                │ │
│  │     initialData: initialDeals           │ │
│  │   });                                   │ │
│  │   return <DealList deals={data} />;     │ │
│  │ }                                       │ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

## Cache Invalidation Strategy

```mermaid
graph TB
    subgraph "Cache Layers"
        L1[Browser Cache]
        L2[CDN Cache]
        L3[API Response Cache]
    end
    
    subgraph "Triggers"
        T1[Data Mutation]
        T2[Time Expiration]
        T3[Manual Invalidation]
    end
    
    T1 -->|TanStack Query| L1
    T2 -->|staleTime| L1
    T3 -->|refetchQueries| L1
    
    T1 -->|revalidatePath| L2
    T1 -->|Cache-Control headers| L3
```

## Error Handling Flow

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
