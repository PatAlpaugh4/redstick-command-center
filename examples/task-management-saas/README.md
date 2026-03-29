# Task Management SaaS Application

A full-stack task management SaaS application built with Next.js, featuring authentication, real-time collaboration, and a modern UI.

## Features

- **User Authentication**: Secure login/signup with JWT
- **Task Management**: Create, edit, delete, and organize tasks
- **Projects**: Group tasks into projects
- **Real-time Collaboration**: Live updates when team members make changes
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io for live updates
- **State Management**: Zustand

## Project Structure

```
task-management-saas/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (login, signup)
│   ├── api/                 # API routes
│   ├── dashboard/           # Main dashboard
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # UI components
│   ├── tasks/               # Task components
│   └── projects/            # Project components
├── lib/                     # Utility functions
│   ├── prisma.ts            # Prisma client
│   ├── auth.ts              # Auth configuration
│   └── socket.ts            # Socket.io setup
├── prisma/
│   └── schema.prisma        # Database schema
├── types/                   # TypeScript types
├── public/                  # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up Database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Visit `http://localhost:3000`

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/*` | ALL | Authentication endpoints |
| `/api/tasks` | GET/POST | List/create tasks |
| `/api/tasks/[id]` | GET/PUT/DELETE | Task operations |
| `/api/projects` | GET/POST | List/create projects |
| `/api/projects/[id]` | GET/PUT/DELETE | Project operations |

## Database Schema

### User
- id, email, name, password, createdAt, updatedAt

### Project
- id, name, description, userId, createdAt, updatedAt

### Task
- id, title, description, status, priority, dueDate, projectId, userId, createdAt, updatedAt

## Kimi-Specific Patterns

This example demonstrates:
- **Full-Stack Development**: Complete Next.js application
- **Database Design**: Prisma schema and migrations
- **Authentication**: JWT-based auth flow
- **API Design**: RESTful API routes
- **Real-time Features**: Socket.io integration
- **Modern UI**: Tailwind CSS components

## Prompt That Generated This

```
Create a full-stack task management SaaS application with:
1. Next.js frontend with TypeScript
2. PostgreSQL database with Prisma ORM
3. User authentication with NextAuth.js
4. Task and project CRUD operations
5. Real-time collaboration with Socket.io
6. Responsive UI with Tailwind CSS
7. Dark mode support
```
