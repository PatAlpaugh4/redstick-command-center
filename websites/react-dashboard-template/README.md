# React Dashboard Template

A modern, responsive dashboard built with React, TypeScript, Tailwind CSS, and Vite. Designed for Kimi Code with a focus on developer experience and production-ready architecture.

![Dashboard Preview](public/preview.png)

## Features

- **Modern Stack** - React 18, TypeScript, Tailwind CSS, Vite
- **Data Visualization** - Recharts for beautiful charts and graphs
- **State Management** - Zustand for global state, React Query for server state
- **UI Components** - Radix UI primitives with custom styling
- **Responsive Design** - Mobile-first with collapsible sidebar
- **Dark Mode** - Built-in theme switching support
- **Type Safe** - Full TypeScript coverage
- **Fast Development** - Hot reload with Vite

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
react-dashboard-template/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── charts/        # Chart components (Recharts)
│   │   ├── layout/        # Layout components (Sidebar, Header)
│   │   └── ui/            # UI components (Button, Card, Badge)
│   ├── context/           # React context providers
│   ├── data/              # Mock data and API helpers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

## Customization Guide

### 1. Theme Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* HSL format */
  --background: 0 0% 100%;
  /* ... */
}
```

### 2. Navigation Items

Edit `src/components/layout/Sidebar.tsx`:

```typescript
const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Your Page', href: '/your-page', icon: YourIcon },
]
```

### 3. API Integration

Replace mock data with real API calls:

```typescript
// src/data/api.ts
import { useQuery } from '@tanstack/react-query'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      return response.json()
    },
  })
}
```

## Kimi Prompts

### Add New Page
```
Create a new page component called "Orders" at src/pages/Orders.tsx.
Include a data table with columns: Order ID, Customer, Date, Status, Total.
Use the existing Card and Badge components from @components/ui.
```

### Add New Chart
```
Create a new chart component at src/components/charts/OrderStatusChart.tsx.
Use Recharts PieChart to display order status distribution.
Accept data prop with { name: string, value: number }[] type.
```

### Customize Theme
```
Update the dashboard theme to use a green color palette.
Modify the CSS variables in src/index.css and update Tailwind config.
```

## Component Usage

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Button
```tsx
import { Button } from '@components/ui/Button'

<Button variant="primary" size="lg">
  Click Me
</Button>
```

### Badge
```tsx
import { Badge } from '@components/ui/Badge'

<Badge variant="success">Active</Badge>
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### Production
- React 18.2+
- React Router DOM 6+
- TanStack Query 5+
- Zustand 4+
- Recharts 2+
- Radix UI primitives
- Lucide React icons

### Development
- TypeScript 5+
- Vite 5+
- Tailwind CSS 3+
- ESLint + Prettier

## License

MIT License - Free for personal and commercial use.

---

Built with ❤️ by Kimi Code
