# Error Boundaries & Resilience Components

A comprehensive error handling system for React applications with Next.js App Router support.

## Components

### 1. ErrorBoundary (`ErrorBoundary.tsx`)

A React class component that catches JavaScript errors anywhere in its child component tree.

```typescript
class ErrorBoundary extends React.Component<
  { 
    fallback: React.ReactNode; 
    children: React.ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    onReset?: () => void;
  },
  { hasError: boolean; error?: Error }
>
```

**Features:**
- Catches React rendering errors
- Displays custom fallback UI
- Error logging with structured data
- Retry functionality
- Supports external error tracking integration (Sentry, LogRocket, etc.)

**Usage:**
```tsx
import { ErrorBoundary, ErrorFallback } from "@/components/error";

<ErrorBoundary
  fallback={<ErrorFallback onRetry={() => window.location.reload()} />}
  onError={(error, errorInfo) => {
    // Send to error tracking service
    Sentry.captureException(error, { extra: errorInfo });
  }}
>
  <MyComponent />
</ErrorBoundary>
```

---

### 2. ErrorFallback (`ErrorFallback.tsx`)

Beautiful error UI with error icon, message display, retry button, and collapsible stack trace.

```typescript
interface ErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  homeUrl?: string;
}
```

**Features:**
- Animated error icon (AlertTriangle)
- Error message display
- "Try Again" button with loading state
- "Go Home" link
- Collapsible stack trace (dev mode only)
- Support contact link

**Usage:**
```tsx
<ErrorFallback
  error={error}
  onRetry={() => window.location.reload()}
  title="Dashboard Error"
  description="Unable to load dashboard data"
/>
```

---

### 3. ApiError (`ApiError.tsx`)

API-specific error handling with status code display and contextual messaging.

```typescript
interface ApiErrorProps {
  status: number;
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
  title?: string;
}
```

**Features:**
- Status code display (404, 500, etc.)
- Context-aware icons and colors
- Friendly error messages per status code
- Retry button with loading state
- Client/Server error distinction

**Supported Status Codes:**
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 408 Request Timeout
- 429 Too Many Requests
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout

**Usage:**
```tsx
<ApiError
  status={404}
  message="Deal not found"
  onRetry={() => refetch()}
/>
```

**Helper Functions:**
```typescript
import { getApiErrorMessage, isRetryableError } from "@/components/error";

// Get user-friendly error message
const message = getApiErrorMessage(error);

// Check if error can be retried
if (isRetryableError(error)) {
  // Show retry button
}
```

---

### 4. ErrorCard (`ErrorCard.tsx`)

Compact error display for inline errors within cards, charts, and constrained spaces.

```typescript
interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "error" | "warning" | "info";
  title?: string;
}
```

**Features:**
- Three size variants (sm, md, lg)
- Three visual variants (error, warning, info)
- Mini retry button
- Dismiss functionality
- Icon customization

**Usage:**
```tsx
// Small inline error
<ErrorCard
  size="sm"
  message="Failed to refresh"
  onRetry={() => refetch()}
/>

// Warning with dismiss
<ErrorCard
  variant="warning"
  title="Partial Data"
  message="Some records couldn't be loaded"
  onDismiss={() => setShowError(false)}
/>
```

**ErrorChip:**
```tsx
// Ultra-compact error display
<ErrorChip
  message="Sync failed"
  onRetry={() => sync()}
/>
```

---

### 5. Next.js Error Pages

#### `error.tsx` - Route Error Handler

Client-side error boundary for App Router route segments.

```tsx
"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Automatically handles errors in this route segment
}
```

**Location:** `src/app/error.tsx`

**Features:**
- Catches errors in nested routes
- Error digest for server errors
- Full-page error UI
- Reload and navigation options

#### `global-error.tsx` - Critical Error Handler

Handles errors at the root layout level, including its own HTML structure.

```tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Last-resort error handling
}
```

**Location:** `src/app/global-error.tsx`

**Features:**
- Complete HTML wrapper
- Handles root layout failures
- Critical error logging
- Keyboard shortcuts (Ctrl+R to reload)
- Self-contained styles (no dependencies)

---

## Integration Examples

### Chart Error Boundaries

```tsx
import { ErrorBoundary, ErrorCard } from "@/components/error";
import { ActivityChart } from "@/components/charts";

export const SafeActivityChart: React.FC = (props) => (
  <ErrorBoundary
    fallback={
      <ErrorCard
        size="sm"
        message="Failed to load chart"
        onRetry={() => window.location.reload()}
      />
    }
  >
    <ActivityChart {...props} />
  </ErrorBoundary>
);
```

### DataTable Error Boundary

```tsx
import { ErrorBoundary, ErrorFallback } from "@/components/error";
import { DataTable } from "@/components/ui/DataTable";

export const SafeDataTable = <T extends Record<string, any>>(props) => (
  <ErrorBoundary
    fallback={
      <ErrorFallback
        title="Failed to Load Data"
        onRetry={() => window.location.reload()}
      />
    }
  >
    <DataTable {...props} />
  </ErrorBoundary>
);
```

### KanbanBoard Error Boundary

```tsx
import { ErrorBoundary, ErrorFallback } from "@/components/error";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";

export const SafeKanbanBoard: React.FC = () => (
  <ErrorBoundary
    fallback={
      <div className="h-screen flex items-center justify-center">
        <ErrorFallback
          title="Pipeline Error"
          onRetry={() => window.location.reload()}
        />
      </div>
    }
  >
    <KanbanBoard />
  </ErrorBoundary>
);
```

### AgentControlPanel Error Boundary

```tsx
import { ErrorBoundary, ErrorFallback } from "@/components/error";
import AgentControlPanel from "@/components/agents/AgentControlPanel";

export const SafeAgentControlPanel: React.FC = () => (
  <ErrorBoundary
    fallback={
      <ErrorFallback
        title="Agent Control Error"
        description="Your agents are still running, but we can't display their status."
        onRetry={() => window.location.reload()}
      />
    }
  >
    <AgentControlPanel />
  </ErrorBoundary>
);
```

---

## Design System

### Colors

| Element | Class |
|---------|-------|
| Error background | `bg-red-500/10` |
| Error border | `border-red-500/30` |
| Error icon | `text-red-500` |
| Primary action | `bg-[#e94560]` |
| Secondary action | `bg-[#2a2a3e]` |
| Background | `bg-[#0f0f1a]` |
| Card background | `bg-[#1a1a2e]` |
| Text primary | `text-white` |
| Text secondary | `text-[#a0a0b0]` |
| Text muted | `text-[#6a6a7a]` |

### Icons

- Error: `AlertTriangle`
- Warning: `Info`
- Info: `WifiOff`
- Retry: `RefreshCw`
- Home: `Home`
- Close: `X`
- Server Error: `ServerCrash`
- Not Found: `FileSearch`
- Unauthorized: `ShieldAlert`

---

## Best Practices

1. **Wrap at appropriate levels**: Wrap individual widgets rather than entire pages when possible to maintain partial functionality.

2. **Provide meaningful fallbacks**: Use ErrorCard for contained spaces and ErrorFallback for full-page errors.

3. **Always include retry**: Give users a way to recover from transient errors.

4. **Log errors**: Use the `onError` callback to send errors to your tracking service.

5. **Development vs Production**: Stack traces are automatically shown only in development mode.

6. **API Error Context**: Use ApiError for HTTP errors to provide status-specific messaging.

7. **Test error boundaries**: Use React's `shouldComponentUpdate` or intentionally throw errors in development to test boundaries.

---

## File Structure

```
src/components/error/
├── index.ts                    # Exports
├── README.md                   # Documentation
├── ErrorBoundary.tsx           # Core error boundary
├── ErrorFallback.tsx           # Full-page error UI
├── ApiError.tsx                # API error display
├── ErrorCard.tsx               # Compact error display
└── ErrorBoundaryExamples.tsx   # Integration examples

src/app/
├── error.tsx                   # Route error handler
└── global-error.tsx            # Critical error handler
```
