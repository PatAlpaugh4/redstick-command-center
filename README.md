# Redstick Ventures Command Center

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)](https://tailwindcss.com/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1_AA-brightgreen)]()

A modern, accessible dashboard for venture capital firms to manage deals, portfolio companies, and AI-powered investment analysis.

## Features

### Deal Management
- **Pipeline Kanban Board**: Drag-and-drop deal tracking across stages
- **Advanced Data Tables**: Sort, filter, and bulk operations
- **Deal Screener**: AI-powered initial screening

### Portfolio Analytics
- **Performance Charts**: Portfolio value, returns, sector distribution
- **Company Tracking**: Monitor portfolio company metrics
- **LP Intelligence**: Investor reporting and communications

### AI Agents
- **Deal Screener**: Automated deal evaluation
- **Market Intel**: Real-time market monitoring
- **Portfolio Monitor**: Anomaly detection and alerts

### Accessibility
- Full WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader optimized
- Reduced motion support

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom + Radix UI primitives
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: PostgreSQL + [Prisma](https://www.prisma.io/)
- **Testing**: Jest + React Testing Library

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/redstick/redstick-command-center.git
cd redstick-command-center
```

2. Run setup script:

```bash
./scripts/setup.sh
```

Or manually:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   ├── app/               # Dashboard routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── charts/            # Chart components
│   └── ...
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript types
├── prisma/                # Database schema
├── docs/                  # Documentation
└── tests/                 # Test files
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check code style
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format with Prettier
npm run format
```

### Git Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to GitHub: `git push origin feature/my-feature`
4. Open a Pull Request

## Documentation

- [Architecture](ARCHITECTURE.md) - System architecture and design decisions
- [API Reference](API.md) - API documentation
- [Components](COMPONENTS.md) - Component library documentation
- [Hooks](HOOKS.md) - Custom hooks documentation
- [Database](DATABASE.md) - Database schema and queries
- [Deployment](DEPLOYMENT.md) - Deployment guides
- [Contributing](CONTRIBUTING.md) - Contribution guidelines
- [Development](DEVELOPMENT.md) - Development workflow

## Accessibility

This project aims for WCAG 2.1 Level AA compliance. All components include:

- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast ratios of 4.5:1 or higher
- Screen reader announcements
- Reduced motion support

## License

[MIT](LICENSE)
