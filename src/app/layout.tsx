/**
 * Workstream 5A: Mobile Layout Optimization
 * Root Layout with Proper Viewport Meta Tag
 * 
 * Features:
 * - Proper viewport meta tag for responsive design
 * - Initial scale and maximum scale settings
 * - Prevents iOS zoom on input focus
 */

import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

// ============================================
// VIEWPORT CONFIGURATION (Task 10)
// ============================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: 'Redstick Ventures Hub',
  description: 'Investment management dashboard for Redstick Ventures',
  applicationName: 'Redstick Ventures Hub',
  authors: [{ name: 'Redstick Ventures' }],
  keywords: ['investment', 'venture capital', 'dashboard', 'CRM'],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Redstick Hub',
  },
  formatDetection: {
    telephone: false,
  },
};

// ============================================
// ROOT LAYOUT
// ============================================

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 
          Additional meta tags for mobile optimization 
          These complement the Next.js viewport export
        */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* 
          Preconnect to external domains for performance
          Add your API domains here
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {/* 
          Skip to main content link for accessibility
          Hidden by default, visible on focus
        */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
