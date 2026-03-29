/**
 * Root Loading Page
 * =================
 * Global loading state for the Next.js application.
 * Displayed during initial page load and route transitions.
 */

import { PageSkeleton } from '@/components/skeletons'

export default function RootLoading() {
  return (
    <PageSkeleton
      layout="simple"
      showHeader={false}
      showSidebar={false}
      sections={2}
      animation="pulse"
    />
  )
}
