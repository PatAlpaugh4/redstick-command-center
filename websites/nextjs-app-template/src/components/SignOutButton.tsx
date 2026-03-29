/**
 * Sign Out Button
 * ===============
 * Button to sign out the current user.
 */

'use client'

import { signOut } from 'next-auth/react'
import { Button } from './ui/Button'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}
