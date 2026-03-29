/**
 * Page Skeleton Component
 * =======================
 * Full page skeleton with header, sidebar placeholder, and content area.
 * Mimics the entire dashboard layout during initial page load.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'
import { CardSkeleton } from './CardSkeleton'

export interface PageSkeletonProps {
  /** Type of page layout */
  layout?: 'dashboard' | 'simple' | 'full'
  /** Whether to show sidebar */
  showSidebar?: boolean
  /** Whether to show header */
  showHeader?: boolean
  /** Number of content sections */
  sections?: number
  /** Custom className for styling */
  className?: string
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none'
}

export function PageSkeleton({
  layout = 'dashboard',
  showSidebar = true,
  showHeader = true,
  sections = 3,
  className,
  animation = 'pulse',
}: PageSkeletonProps) {
  if (layout === 'simple') {
    return <SimplePageSkeleton animation={animation} className={className} />
  }

  if (layout === 'full') {
    return <FullPageSkeleton animation={animation} className={className} />
  }

  return (
    <div
      className={cn(
        // Full page layout matching dashboard structure
        'min-h-screen bg-background',
        className
      )}
    >
      {/* Header */}
      {showHeader && <HeaderSkeleton animation={animation} />}

      {/* Main content area with sidebar */}
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && <SidebarSkeleton animation={animation} />}

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">
          <DashboardContentSkeleton
            sections={sections}
            animation={animation}
          />
        </main>
      </div>
    </div>
  )
}

/** Header skeleton matching the app header */
function HeaderSkeleton({
  animation,
}: {
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Logo area */}
        <div className="flex items-center gap-3">
          <Skeleton
            variant="rectangular"
            width={32}
            height={32}
            animation={animation}
            className="rounded-lg"
          />
          <Skeleton
            variant="text"
            width={120}
            height={20}
            animation={animation}
          />
        </div>

        {/* Search bar placeholder */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            animation={animation}
            className="rounded-full"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            animation={animation}
          />
          {/* User avatar */}
          <Skeleton
            variant="circular"
            width={36}
            height={36}
            animation={animation}
          />
        </div>
      </div>
    </header>
  )
}

/** Sidebar skeleton matching navigation sidebar */
function SidebarSkeleton({
  animation,
}: {
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)] border-r border-border bg-card">
      <nav className="p-4 space-y-6">
        {/* Main navigation */}
        <div className="space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg"
            >
              <Skeleton
                variant="rectangular"
                width={20}
                height={20}
                animation={animation}
                className="rounded"
              />
              <Skeleton
                variant="text"
                width={`${60 + Math.random() * 30}%`}
                height={16}
                animation={animation}
              />
            </div>
          ))}
        </div>

        {/* Divider */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={1}
          animation={animation}
          className="opacity-30"
        />

        {/* Secondary navigation */}
        <div className="space-y-1">
          <Skeleton
            variant="text"
            width={80}
            height={12}
            animation={animation}
            className="mb-3 opacity-60"
          />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg"
            >
              <Skeleton
                variant="rectangular"
                width={20}
                height={20}
                animation={animation}
                className="rounded"
              />
              <Skeleton
                variant="text"
                width={`${50 + Math.random() * 30}%`}
                height={16}
                animation={animation}
              />
            </div>
          ))}
        </div>
      </nav>
    </aside>
  )
}

/** Dashboard content skeleton */
function DashboardContentSkeleton({
  sections,
  animation,
}: {
  sections: number
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton
            variant="text"
            width={200}
            height={28}
            animation={animation}
            className="mb-2"
          />
          <Skeleton
            variant="text"
            width={300}
            height={16}
            animation={animation}
          />
        </div>
        <Skeleton
          variant="rectangular"
          width={120}
          height={40}
          animation={animation}
          className="rounded-md"
        />
      </div>

      {/* Stats cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} animation={animation} />
        ))}
      </div>

      {/* Content sections */}
      {Array.from({ length: sections }).map((_, sectionIdx) => (
        <div key={sectionIdx}>
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton
              variant="text"
              width={150}
              height={20}
              animation={animation}
            />
            <Skeleton
              variant="text"
              width={80}
              height={14}
              animation={animation}
            />
          </div>

          {/* Section content - alternating between chart and table patterns */}
          {sectionIdx % 2 === 0 ? (
            // Chart section
            <div className="rounded-xl border border-border bg-card p-5">
              <div
                className="relative"
                style={{ height: 300 }}
              >
                <div className="absolute inset-0 flex items-end justify-between gap-3 px-8 pb-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      width="100%"
                      height={`${30 + Math.random() * 60}%`}
                      animation={animation}
                      className="rounded-t-md"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Table section
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="p-4">
                {Array.from({ length: 5 }).map((_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                  >
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      animation={animation}
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton
                        variant="text"
                        width={`${40 + Math.random() * 30}%`}
                        height={16}
                        animation={animation}
                      />
                      <Skeleton
                        variant="text"
                        width={`${20 + Math.random() * 20}%`}
                        height={12}
                        animation={animation}
                      />
                    </div>
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={32}
                      animation={animation}
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/** Simple page skeleton without sidebar */
function SimplePageSkeleton({
  animation,
  className,
}: {
  animation: 'pulse' | 'wave' | 'none'
  className?: string
}) {
  return (
    <div className={cn('min-h-screen bg-background p-6 lg:p-8', className)}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page title */}
        <Skeleton
          variant="text"
          width={250}
          height={32}
          animation={animation}
          className="mb-8"
        />

        {/* Content blocks */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <Skeleton
              variant="text"
              width={`${50 + Math.random() * 30}%`}
              height={20}
              animation={animation}
            />
            <Skeleton
              variant="text"
              width="100%"
              height={14}
              animation={animation}
            />
            <Skeleton
              variant="text"
              width={`${70 + Math.random() * 20}%`}
              height={14}
              animation={animation}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Full page skeleton for complex layouts */
function FullPageSkeleton({
  animation,
  className,
}: {
  animation: 'pulse' | 'wave' | 'none'
  className?: string
}) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Full-width header */}
      <div className="h-16 border-b border-border bg-card">
        <div className="flex h-full items-center justify-between px-4 lg:px-8">
          <Skeleton
            variant="text"
            width={150}
            height={24}
            animation={animation}
          />
          <div className="flex items-center gap-4">
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              animation={animation}
              className="rounded-md"
            />
            <Skeleton
              variant="circular"
              width={36}
              height={36}
              animation={animation}
            />
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex">
        {/* Left sidebar */}
        <div className="hidden xl:block w-72 min-h-[calc(100vh-4rem)] border-r border-border bg-card p-4">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width="100%"
                height={48}
                animation={animation}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          <DashboardContentSkeleton sections={4} animation={animation} />
        </main>

        {/* Right panel */}
        <div className="hidden 2xl:block w-80 min-h-[calc(100vh-4rem)] border-l border-border bg-card p-4">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton
                  variant="text"
                  width={100}
                  height={16}
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={120}
                  animation={animation}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageSkeleton
