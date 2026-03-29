/**
 * Dashboard Loading Page
 * ======================
 * Dashboard-specific loading state for the /app route.
 * Displayed while fetching dashboard data and user information.
 */

import { PageSkeleton } from '@/components/skeletons'

export default function DashboardLoading() {
  return (
    <PageSkeleton
      layout="dashboard"
      showHeader={true}
      showSidebar={true}
      sections={3}
      animation="pulse"
    />
  )
}
