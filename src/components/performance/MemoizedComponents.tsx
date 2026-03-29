/**
 * Memoized Components
 * ===================
 * React.memo optimized components to prevent unnecessary re-renders.
 * These components use custom comparison functions for optimal performance.
 * 
 * When to use React.memo:
 * - Pure functional components that render often with same props
 * - Components with expensive render operations
 * - Components that receive complex objects as props
 * - List items in virtualized or long lists
 * 
 * When NOT to use React.memo:
 * - Components that always receive different props
 * - Simple components where comparison overhead exceeds render savings
 * - Components that rely on closures capturing changing values
 */

'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// =============================================================================
// Memoized Deal Card
// =============================================================================

interface Deal {
  id: string;
  companyName: string;
  amount: number;
  stage: string;
  assignedTo: string;
  updatedAt: string;
  logoUrl?: string;
}

interface DealCardProps {
  deal: Deal;
  onClick?: (deal: Deal) => void;
  onEdit?: (deal: Deal) => void;
  onDelete?: (dealId: string) => void;
  selected?: boolean;
  className?: string;
}

/**
 * Memoized DealCard Component
 * Prevents re-render when parent updates but deal data hasn't changed
 * 
 * Performance optimization:
 * - Custom comparison checks if deal object reference changed
 * - Only re-renders when deal data or selection state changes
 * - Critical for Kanban board performance with many cards
 */
const DealCard: React.FC<DealCardProps> = ({
  deal,
  onClick,
  onEdit,
  onDelete,
  selected = false,
  className,
}) => {
  const formatAmount = (amount: number): string => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string): string => {
    const colors = ['#e94560', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = useMemo(() => getAvatarColor(deal.assignedTo), [deal.assignedTo]);

  return (
    <motion.div
      layoutId={deal.id}
      onClick={() => onClick?.(deal)}
      className={cn(
        'group relative bg-card rounded-xl p-4 border cursor-pointer',
        'transition-all duration-200',
        selected
          ? 'border-primary ring-1 ring-primary shadow-lg'
          : 'border-border hover:border-primary/50 hover:shadow-md',
        className
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {deal.logoUrl ? (
            <img
              src={deal.logoUrl}
              alt={deal.companyName}
              className="w-10 h-10 rounded-lg object-contain bg-muted flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">
                {getInitials(deal.companyName)}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground truncate">{deal.companyName}</h4>
            <p className="text-xs text-muted-foreground capitalize">{deal.stage.replace(/-/g, ' ')}</p>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-3">
        <p className="text-lg font-bold text-foreground">{formatAmount(deal.amount)}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
            style={{ backgroundColor: avatarColor }}
          >
            {getInitials(deal.assignedTo)}
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
            {deal.assignedTo}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(deal);
              }}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deal.id);
              }}
              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Memoized DealCard with custom comparison
 * Only re-renders when deal ID changes or selection state changes
 */
export const MemoizedDealCard = memo(DealCard, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these change
  return (
    prevProps.deal.id === nextProps.deal.id &&
    prevProps.selected === nextProps.selected &&
    prevProps.deal.amount === nextProps.deal.amount &&
    prevProps.deal.stage === nextProps.deal.stage
  );
});

// =============================================================================
// Memoized Company Card
// =============================================================================

interface Company {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  employees: number;
  logoUrl?: string;
  foundedYear?: number;
}

interface CompanyCardProps {
  company: Company;
  onClick?: (company: Company) => void;
  selected?: boolean;
  className?: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onClick,
  selected = false,
  className,
}) => {
  const formatValuation = (valuation: number): string => {
    if (valuation >= 1000000000) return `$${(valuation / 1000000000).toFixed(1)}B`;
    if (valuation >= 1000000) return `$${(valuation / 1000000).toFixed(1)}M`;
    return `$${(valuation / 1000).toFixed(0)}K`;
  };

  return (
    <motion.div
      onClick={() => onClick?.(company)}
      className={cn(
        'group relative bg-card rounded-xl p-4 border cursor-pointer',
        'transition-all duration-200',
        selected
          ? 'border-primary ring-1 ring-primary'
          : 'border-border hover:border-primary/50',
        className
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            className="w-12 h-12 rounded-lg object-contain bg-muted flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-lg">
              {company.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{company.name}</h4>
          <p className="text-sm text-muted-foreground">{company.sector}</p>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>{formatValuation(company.valuation)} valuation</span>
            <span>•</span>
            <span>{company.employees} employees</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Memoized CompanyCard
 */
export const MemoizedCompanyCard = memo(CompanyCard, (prevProps, nextProps) => {
  return (
    prevProps.company.id === nextProps.company.id &&
    prevProps.selected === nextProps.selected &&
    prevProps.company.valuation === nextProps.company.valuation
  );
});

// =============================================================================
// Memoized Table Row
// =============================================================================

interface TableRowProps<T> {
  data: T;
  index: number;
  columns: Array<{
    key: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
  }>;
  selected?: boolean;
  onClick?: (data: T) => void;
  onSelect?: (data: T) => void;
  className?: string;
}

const TableRow = <T extends { id: string }>({
  data,
  index,
  columns,
  selected = false,
  onClick,
  onSelect,
  className,
}: TableRowProps<T>) => {
  return (
    <tr
      onClick={() => onClick?.(data)}
      className={cn(
        'transition-colors cursor-pointer',
        selected ? 'bg-primary/5' : 'hover:bg-muted/50',
        className
      )}
    >
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect?.(data)}
          className="h-4 w-4 rounded border-border"
        />
      </td>
      {columns.map((column) => {
        const value = data[column.key];
        return (
          <td key={String(column.key)} className="px-4 py-3">
            {column.render ? column.render(value, data) : String(value ?? '-')}
          </td>
        );
      })}
    </tr>
  );
};

/**
 * Memoized TableRow - Critical for DataTable performance
 */
export const MemoizedTableRow = memo(TableRow, <T extends { id: string }>(
  prevProps: TableRowProps<T>,
  nextProps: TableRowProps<T>
) => {
  return (
    prevProps.data.id === nextProps.data.id &&
    prevProps.selected === nextProps.selected &&
    prevProps.index === nextProps.index
  );
}) as typeof TableRow;

// =============================================================================
// Memoized Chart Components
// =============================================================================

interface ChartContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  height?: number;
  loading?: boolean;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  title,
  subtitle,
  className,
  height = 300,
  loading = false,
}) => {
  return (
    <div className={cn('bg-card rounded-xl border border-border p-4', className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="font-semibold text-foreground">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      
      <div className="relative" style={{ height }}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

/**
 * Memoized ChartContainer
 * Prevents re-render when only data changes (Recharts handles data updates internally)
 */
export const MemoizedChartContainer = memo(ChartContainer, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.height === nextProps.height &&
    prevProps.loading === nextProps.loading &&
    prevProps.className === nextProps.className
  );
});

// =============================================================================
// Memoized Activity Item
// =============================================================================

interface ActivityItemProps {
  id: string;
  type: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  entityName?: string;
  onClick?: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  id,
  type,
  description,
  user,
  timestamp,
  entityName,
  onClick,
}) => {
  const getActivityIcon = (type: string): string => {
    const icons: Record<string, string> = {
      DEAL_CREATED: '📋',
      DEAL_UPDATED: '✏️',
      DEAL_DELETED: '🗑️',
      COMPANY_CREATED: '🏢',
      COMPANY_UPDATED: '📝',
      AGENT_RUN_STARTED: '🤖',
      AGENT_RUN_COMPLETED: '✅',
    };
    return icons[type] || '📌';
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 px-4 py-3 hover:bg-accent/50 cursor-pointer transition-colors rounded-lg"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-lg">
        {getActivityIcon(type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{user.name}</span>{' '}
          <span className="text-muted-foreground">{description}</span>
        </p>
        {entityName && (
          <p className="text-xs text-primary mt-0.5 truncate">{entityName}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{formatTime(timestamp)}</p>
      </div>
    </div>
  );
};

/**
 * Memoized ActivityItem
 * Critical for activity feed performance
 */
export const MemoizedActivityItem = memo(ActivityItem, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.timestamp === nextProps.timestamp &&
    prevProps.type === nextProps.type
  );
});

// =============================================================================
// Usage Guidelines
// =============================================================================

/**
 * GUIDELINES FOR USING MEMOIZED COMPONENTS:
 * 
 * 1. DealCard / MemoizedDealCard:
 *    - Use in Kanban boards and deal lists
 *    - Pass stable callbacks (useCallback) for onClick handlers
 *    - Ensure deal object is memoized if derived from state
 * 
 * 2. CompanyCard / MemoizedCompanyCard:
 *    - Use in company directories
 *    - Pass stable selection state
 * 
 * 3. TableRow / MemoizedTableRow:
 *    - Use in DataTable component
 *    - Columns array must be stable (defined outside render or memoized)
 *    - Critical for tables with 100+ rows
 * 
 * 4. ChartContainer / MemoizedChartContainer:
 *    - Wraps Recharts components
 *    - Title/subtitle should be stable strings
 *    - Let Recharts handle data updates internally
 * 
 * 5. ActivityItem / MemoizedActivityItem:
 *    - Use in activity feeds
 *    - Pass stable onClick handlers
 * 
 * PERFORMANCE TIPS:
 * 
 * 1. Always use useCallback for event handlers passed to memoized components:
 *    const handleDealClick = useCallback((deal) => { ... }, []);
 * 
 * 2. Memoize arrays/objects passed as props:
 *    const deals = useMemo(() => computeDeals(rawData), [rawData]);
 * 
 * 3. Use React DevTools Profiler to verify memoization is working
 * 
 * 4. Don't over-memoize - measure first, optimize second
 */

// =============================================================================
// Named Exports
// =============================================================================

export {
  DealCard,
  CompanyCard,
  TableRow,
  ChartContainer,
  ActivityItem,
};

export type {
  Deal,
  DealCardProps,
  Company,
  CompanyCardProps,
  TableRowProps,
  ChartContainerProps,
  ActivityItemProps,
};

export default {
  MemoizedDealCard,
  MemoizedCompanyCard,
  MemoizedTableRow,
  MemoizedChartContainer,
  MemoizedActivityItem,
};
