/**
 * Workstream 5A: Mobile Layout Optimization
 * KanbanBoard Component with Horizontal Scroll on Mobile
 * 
 * Features:
 * - Horizontal scroll on mobile with snap points
 * - Desktop grid layout
 * - Touch-friendly drag handles
 * - Responsive column widths
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Plus, GripVertical } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  labels?: { name: string; color: string }[];
  assignee?: { name: string; avatar?: string };
  dueDate?: string;
  value?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color?: string;
  limit?: number;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onItemMove?: (itemId: string, fromColumnId: string, toColumnId: string) => void;
  onItemClick?: (item: KanbanItem) => void;
  onAddItem?: (columnId: string) => void;
  onColumnAction?: (columnId: string, action: string) => void;
  className?: string;
  readonly?: boolean;
}

// ============================================
// PRIORITY BADGE
// ============================================

const PriorityBadge: React.FC<{ priority: KanbanItem['priority'] }> = ({ priority }) => {
  const styles = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  if (!priority) return null;

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[priority]}`}>
      {priority}
    </span>
  );
};

// ============================================
// KANBAN CARD COMPONENT
// ============================================

interface KanbanCardProps {
  item: KanbanItem;
  onClick?: () => void;
  dragHandleProps?: any;
  readonly?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ 
  item, 
  onClick, 
  dragHandleProps,
  readonly 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-yellow-600' };
    if (diffDays <= 7) return { text: `${diffDays}d`, color: 'text-gray-600' };
    return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-gray-500' };
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200 p-3 sm:p-4
        shadow-sm hover:shadow-md
        transition-shadow cursor-pointer
        active:scale-[0.98] transform
        touch-manipulation
        ${readonly ? '' : 'hover:border-blue-300'}
      `}
    >
      {/* Card Header */}
      <div className="flex items-start gap-2 mb-2">
        {!readonly && dragHandleProps && (
          <div 
            {...dragHandleProps}
            className="p-1 -ml-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-target"
          >
            <GripVertical size={16} />
          </div>
        )}
        
        <h4 className="flex-1 text-sm font-medium text-gray-900 line-clamp-2">
          {item.title}
        </h4>
        
        <PriorityBadge priority={item.priority} />
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Labels */}
      {item.labels && item.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.labels.map((label, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: `${label.color}20`, 
                color: label.color 
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {/* Assignee */}
          {item.assignee && (
            <div className="flex items-center gap-1.5">
              {item.assignee.avatar ? (
                <img
                  src={item.assignee.avatar}
                  alt={item.assignee.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                  {item.assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
            </div>
          )}
          
          {/* Due Date */}
          {item.dueDate && (
            <span className={`text-xs ${formatDate(item.dueDate).color}`}>
              {formatDate(item.dueDate).text}
            </span>
          )}
        </div>
        
        {/* Value */}
        {item.value && (
          <span className="text-xs font-medium text-gray-900">
            {formatCurrency(item.value)}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================
// KANBAN COLUMN COMPONENT
// ============================================

interface KanbanColumnComponentProps {
  column: KanbanColumn;
  onItemClick?: (item: KanbanItem) => void;
  onAddItem?: () => void;
  onColumnAction?: (action: string) => void;
  readonly?: boolean;
}

const KanbanColumnComponent: React.FC<KanbanColumnComponentProps> = ({
  column,
  onItemClick,
  onAddItem,
  onColumnAction,
  readonly,
}) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Close actions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const itemCount = column.items.length;
  const isOverLimit = column.limit && itemCount > column.limit;

  return (
    <div 
      className="
        flex-shrink-0 w-[280px] sm:w-[300px] lg:w-auto lg:flex-1
        flex flex-col
        bg-gray-50 rounded-lg
        snap-start
      "
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0">
          {column.color && (
            <span 
              className="w-3 h-3 rounded-full shrink-0" 
              style={{ backgroundColor: column.color }} 
            />
          )}
          <h3 className="font-medium text-gray-900 truncate">
            {column.title}
          </h3>
          <span className={`
            text-xs px-2 py-0.5 rounded-full shrink-0
            ${isOverLimit ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}
          `}>
            {itemCount}{column.limit && `/${column.limit}`}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {onAddItem && !readonly && (
            <button
              type="button"
              onClick={onAddItem}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 touch-target"
              aria-label={`Add item to ${column.title}`}
            >
              <Plus size={16} />
            </button>
          )}
          
          {onColumnAction && (
            <div className="relative" ref={actionsRef}>
              <button
                type="button"
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 touch-target"
                aria-label="Column actions"
              >
                <MoreHorizontal size={16} />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {['Rename', 'Set limit', 'Archive all'].map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => {
                        onColumnAction(action.toLowerCase().replace(' ', '_'));
                        setShowActions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 touch-target"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items Container */}
      <div 
        className="
          flex-1 p-3 space-y-3
          overflow-y-auto max-h-[calc(100vh-300px)]
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
        "
      >
        {column.items.map((item) => (
          <KanbanCard
            key={item.id}
            item={item}
            onClick={() => onItemClick?.(item)}
            readonly={readonly}
          />
        ))}
        
        {column.items.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No items</p>
            {onAddItem && !readonly && (
              <button
                type="button"
                onClick={onAddItem}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 touch-target"
              >
                Add first item
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN KANBAN BOARD
// ============================================

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onItemMove,
  onItemClick,
  onAddItem,
  onColumnAction,
  className = '',
  readonly = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scrollability
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Scroll indicators for mobile */}
      <div className="lg:hidden">
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none z-10" />
        )}
      </div>

      {/* Kanban Container */}
      <div
        ref={scrollContainerRef}
        className="
          flex gap-4 overflow-x-auto pb-4
          lg:overflow-visible lg:pb-0
          snap-x snap-mandatory
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
          -mx-4 px-4 lg:mx-0 lg:px-0
        "
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin'
        }}
      >
        {columns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            onItemClick={onItemClick}
            onAddItem={onAddItem ? () => onAddItem(column.id) : undefined}
            onColumnAction={onColumnAction ? (action) => onColumnAction(column.id, action) : undefined}
            readonly={readonly}
          />
        ))}
      </div>

      {/* Mobile scroll hint */}
      {columns.length > 1 && (
        <div className="lg:hidden text-center mt-2 text-xs text-gray-400">
          Swipe to see more columns
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
