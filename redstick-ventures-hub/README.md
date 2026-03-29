# Redstick Ventures - Command Center

A unified command center hub for Redstick Ventures, an early-stage VC firm investing at the intersection of food systems, agriculture, and AI.

## Features

### Public Website
- **Landing Page**: Hero section with marker-pen animations, thesis presentation, portfolio showcase
- **Founder Application**: Complete application form for funding requests
- **LP Portal**: Login for limited partners

### Internal Dashboard
- **Overview**: Real-time metrics, active deals, AI agent status, portfolio alerts
- **AI Agents**: Agent management, orchestration visualization, execution logs
- **Deal Flow**: Kanban board and list view of investment pipeline
- **Portfolio**: Portfolio company monitoring with health scores and metrics

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Animation**: Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
cd redstick-ventures-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/redstick_ventures"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@redstick.vc | admin123 |
| Partner | partner@redstick.vc | partner123 |
| Analyst | analyst@redstick.vc | analyst123 |

## Project Structure

```
redstick-ventures-hub/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── (public)/     # Public-facing pages
│   │   ├── (dashboard)/  # Protected dashboard pages
│   │   ├── api/          # API routes
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   │   ├── ui/          # UI components
│   │   ├── layout/      # Layout components
│   │   ├── landing/     # Landing page sections
│   │   └── dashboard/   # Dashboard components
│   ├── lib/             # Utilities and configurations
│   └── types/           # TypeScript types
├── prisma/              # Database schema and migrations
└── public/             # Static assets
```

## Key Design Decisions

1. **Dark Theme Default**: Sophisticated dark UI with accent colors (#e94560 redstick red)
2. **Motion-First**: Framer Motion for Sequoia-style marker-pen animations
3. **Unified Architecture**: Single codebase for public site and internal tools
4. **Role-Based Access**: Different views for visitors, founders, LPs, and team members
5. **AI-First**: Built-in AI agent management as a core feature

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio |

## License

MIT

---

Built with ❤️ for Redstick Ventures
