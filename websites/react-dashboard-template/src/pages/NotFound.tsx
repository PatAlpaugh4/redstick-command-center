/**
 * 404 Not Found Page
 * ==================
 * Displayed when a route doesn't exist.
 */

import { Link } from 'react-router-dom'
import { Button } from '@components/ui/Button'
import { Home, ArrowLeft } from 'lucide-react'

export function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">Page not found</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
