/**
 * Root Layout
 * ===========
 * Main layout wrapper with fonts, metadata, and providers.
 */

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Next.js App Template',
    template: '%s | Next.js App',
  },
  description: 'Full-stack Next.js 16 app with TypeScript, Auth, and API routes',
  keywords: ['Next.js', 'React', 'TypeScript', 'Template'],
  authors: [{ name: 'Kimi Code' }],
  creator: 'Kimi Code',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Next.js App Template',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@kimicode',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
