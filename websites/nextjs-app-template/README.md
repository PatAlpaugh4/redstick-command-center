# Next.js App Template

A full-stack Next.js 16 application with TypeScript, authentication, database, and modern UI components. Built for Kimi Code with production-ready architecture.

## Features

- **Next.js 16** - Latest App Router with React Server Components
- **TypeScript** - Full type safety with strict configuration
- **Authentication** - NextAuth.js with credentials and OAuth (GitHub, Google)
- **Database** - Prisma ORM with PostgreSQL
- **UI Components** - Tailwind CSS + Radix UI primitives
- **API Routes** - RESTful endpoints with Zod validation
- **Dark Mode** - Built-in theme switching
- **Responsive** - Mobile-first design

## Quick Start

```bash
# 1. Clone and install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 3. Set up database
npx prisma generate
npx prisma db push

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nextjs-app-template/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Protected pages
│   │   ├── login/          # Auth pages
│   │   ├── register/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # React components
│   │   ├── providers/      # Context providers
│   │   └── ui/             # UI components
│   ├── lib/                # Utility functions
│   │   ├── auth.ts         # NextAuth config
│   │   ├── prisma.ts       # Prisma client
│   │   └── utils.ts        # Helper functions
│   └── types/              # TypeScript types
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextjs_app"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth (Optional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |

## Authentication

### Credentials (Email/Password)
- User registration at `/register`
- Login at `/login`
- Passwords hashed with bcrypt

### OAuth Providers
- GitHub
- Google

Configure OAuth credentials in `.env.local`

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  posts     Post[]
  // ...
}
```

### Post Model (Example)
```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints
- `POST /api/register` - User registration

### Protected Routes Example
```typescript
// app/api/posts/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Return protected data
}
```

## Kimi Prompts

### Add New API Route
```
Create a new API route at app/api/users/route.ts.
Include GET to list users and POST to create a user.
Use Prisma for database operations and Zod for validation.
```

### Add New Page
```
Create a new protected page at app/profile/page.tsx.
Display user information from the session.
Use the Card and Button components from @/components/ui.
```

### Add Database Model
```
Add a new Category model to the Prisma schema.
It should have: id, name, slug, createdAt, updatedAt.
Create a relation to the Post model.
```

## Component Usage

### Button
```tsx
import { Button } from '@/components/ui/Button'

<Button variant="primary" size="lg">
  Click Me
</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-Hosted
```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT License - Free for personal and commercial use.

---

Built with ❤️ by Kimi Code
