/**
 * Stat Card Component
 * ===================
 * Displays a single metric with trend indicator.
 */

import { Card, CardContent } from '@components/ui/Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@utils/cn'
import type { Metric } from '@types'

interface StatCardProps {
  metric: Metric
}

export function StatCard({ metric }: StatCardProps) {
  const { label, value, change, changeType, prefix = '', suffix = '' } = metric

  const formatValue = () => {
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    return value
  }

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {prefix}{formatValue()}{suffix}
          </span>
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              changeType === 'increase' && 'text-green-600',
              changeType === 'decrease' && 'text-red-600',
              changeType === 'neutral' && 'text-muted-foreground'
            )}
          >
            {changeType === 'increase' && <TrendingUp className="h-4 w-4" />}
            {changeType === 'decrease' && <TrendingDown className="h-4 w-4" />}
            {changeType === 'neutral' && <Minus className="h-4 w-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Compared to last month
        </p>
      </CardContent>
    </Card>
  )
}
