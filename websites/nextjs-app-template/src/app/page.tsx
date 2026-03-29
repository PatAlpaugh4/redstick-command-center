/**
 * Home Page
 * =========
 * Landing page with hero section and feature highlights.
 */

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="text-xl font-bold">NextApp</span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-2">
            {session ? (
              <Button asChild variant="default">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-16 md:pt-24">
          <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              Build faster with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Next.js 16
              </span>
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              A production-ready template with TypeScript, authentication, database,
              and modern UI components. Start building your next big idea today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                title: 'Authentication',
                description: 'Secure authentication with NextAuth.js, including OAuth providers.',
              },
              {
                title: 'Database Ready',
                description: 'Prisma ORM configured with PostgreSQL support out of the box.',
              },
              {
                title: 'Modern UI',
                description: 'Beautiful components built with Tailwind CSS and Radix UI.',
              },
              {
                title: 'Type Safety',
                description: 'Full TypeScript support with strict type checking.',
              },
              {
                title: 'API Routes',
                description: 'RESTful API endpoints with input validation using Zod.',
              },
              {
                title: 'Dark Mode',
                description: 'Built-in dark mode support with theme switching.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-lg border bg-background p-6"
              >
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Kimi Code. The source code is available on{' '}
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
