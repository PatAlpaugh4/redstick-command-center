/**
 * Dashboard Page
 * ==============
 * Main dashboard view with stats, charts, and recent activity.
 */

import { StatCard } from '@components/charts/StatCard'
import { RevenueChart } from '@components/charts/RevenueChart'
import { SalesByCategory } from '@components/charts/SalesByCategory'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { Badge } from '@components/ui/Badge'
import {
  dashboardStats,
  revenueData,
  salesByCategory,
  recentActivity,
} from '@data/mockData'
import { formatDistanceToNow } from 'date-fns'
import { User, ShoppingCart, Package, Star } from 'lucide-react'

const activityIcons = {
  user_signup: User,
  order_placed: ShoppingCart,
  product_added: Package,
  review_submitted: Star,
}

const activityColors = {
  user_signup: 'bg-blue-100 text-blue-600',
  order_placed: 'bg-green-100 text-green-600',
  product_added: 'bg-purple-100 text-purple-600',
  review_submitted: 'bg-yellow-100 text-yellow-600',
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard metric={dashboardStats.totalRevenue} />
        <StatCard metric={dashboardStats.totalUsers} />
        <StatCard metric={dashboardStats.totalOrders} />
        <StatCard metric={dashboardStats.conversionRate} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart data={revenueData} />
        </div>
        <div className="lg:col-span-3">
          <SalesByCategory data={salesByCategory} />
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activityIcons[activity.type]
              return (
                <div key={activity.id} className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      activityColors[activity.type]
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    {activity.user && (
                      <p className="text-xs text-muted-foreground">
                        by {activity.user.name}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
