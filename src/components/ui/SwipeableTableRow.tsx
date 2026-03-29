/**
 * SwipeableTableRow Component
 * ===========================
 * Table row with swipe-to-reveal actions.
 * Supports left and right swipe to show action buttons.
 * 
 * @accessibility
 * - Touch targets minimum 44x44px
 * - Keyboard accessible actions
 * - Screen reader announcements
 * - Haptic feedback on swipe
 * 
 * @example
 * <SwipeableTableRow
 *   actions={[
 *     { icon: Edit, onClick: handleEdit, label: 'Edit', color: 'blue' },
 *     { icon: Trash, onClick: handleDelete, label: 'Delete', color: 'red', danger: true },
 *   ]}
 *   onSwipeLeft={() => setShowActions(true)}
 * >
 *   <td>Row content</td>
 * </SwipeableTableRow>
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Edit, Trash2, MoreHorizontal, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export interface SwipeAction {
  /** Icon component */
  icon: React.ReactNode;
  /** Click handler */
  onClick: () => void;
  /** Accessible label */
  label: string;
  /** Button color variant */
  color?: 'default' | 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  /** Danger/destructive action */
  danger?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

export interface SwipeableTableRowProps {
  /** Row content */
  children: React.ReactNode;
  /** Actions to reveal on swipe left */
  actions?: SwipeAction[];
  /** Actions to reveal on swipe right */
  rightActions?: SwipeAction[];
  /** Callback when swipe left threshold is reached */
  onSwipeLeft?: () => void;
  /** Callback when swipe right threshold is reached */
  onSwipeRight?: () => void;
  /** Callback when row is clicked */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Threshold percentage to trigger actions (default: 30) */
  threshold?: number;
  /** Enable haptic feedback (default: true) */
  hapticFeedback?: boolean;
  /** Maximum swipe distance as percentage (default: 50) */
  maxSwipe?: number;
  /** Whether the row is selected */
  isSelected?: boolean;
  /** Row is in a table with selection enabled */
  hasSelection?: boolean;
}

// =============================================================================
// Action Button Component
// =============================================================================

interface ActionButtonProps {
  action: SwipeAction;
  index: number;
  total: number;
  side: 'left' | 'right';
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, index, total, side }) => {
  const colorClasses = {
    default: 'bg-slate-500 hover:bg-slate-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    red: 'bg-red-500 hover:bg-red-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
  };

  const baseClasses = colorClasses[action.color || 'default'];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        action.onClick();
      }}
      disabled={action.disabled}
      className={cn(
        'flex flex-col items-center justify-center',
        'min-w-[72px] h-full px-3',
        'text-white transition-all duration-200',
        baseClasses,
        action.danger && 'bg-red-600 hover:bg-red-700',
        action.disabled && 'opacity-50 cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50'
      )}
      aria-label={action.label}
      title={action.label}
      style={{
        zIndex: total - index,
      }}
    >
      <span className="w-6 h-6 flex items-center justify-center">{action.icon}</span>
      <span className="text-[10px] mt-1 font-medium hidden sm:block">{action.label}</span>
    </button>
  );
};

// =============================================================================
// Main Component
// =============================================================================

export const SwipeableTableRow: React.FC<SwipeableTableRowProps> = ({
  children,
  actions = [],
  rightActions = [],
  onSwipeLeft,
  onSwipeRight,
  onClick,
  className,
  threshold = 30,
  hapticFeedback = true,
  maxSwipe = 50,
  isSelected = false,
  hasSelection = false,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedSide, setRevealedSide] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const x = useMotionValue(0);
  const controlsRef = useRef<any>(null);

  // Calculate action panel width
  const leftActionWidth = actions.length * 72;
  const rightActionWidth = rightActions.length * 72;
  const maxActionWidth = Math.max(leftActionWidth, rightActionWidth);

  // Haptic feedback
  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if (hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [hapticFeedback]);

  // Close actions
  const closeActions = useCallback(() => {
    setIsRevealed(false);
    setRevealedSide(null);
    if (controlsRef.current) {
      controlsRef.current.stop();
    }
    animate(x, 0, {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    });
  }, [x]);

  // Open actions
  const openActions = useCallback((side: 'left' | 'right') => {
    const targetX = side === 'left' ? -leftActionWidth : rightActionWidth;
    setIsRevealed(true);
    setRevealedSide(side);
    
    if (controlsRef.current) {
      controlsRef.current.stop();
    }
    animate(x, targetX, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  }, [leftActionWidth, rightActionWidth, x]);

  // Handle drag end
  const handleDragEnd = useCallback((_: any, info: any) => {
    setIsDragging(false);
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    const currentX = x.get();

    // Fast swipe detection
    if (Math.abs(velocity) > 500) {
      if (velocity > 0 && rightActions.length > 0) {
        triggerHaptic(15);
        onSwipeRight?.();
        openActions('right');
        return;
      } else if (velocity < 0 && actions.length > 0) {
        triggerHaptic(15);
        onSwipeLeft?.();
        openActions('left');
        return;
      }
    }

    // Threshold-based reveal
    if (currentX < -threshold * 3 && actions.length > 0) {
      triggerHaptic(15);
      onSwipeLeft?.();
      openActions('left');
    } else if (currentX > threshold * 3 && rightActions.length > 0) {
      triggerHaptic(15);
      onSwipeRight?.();
      openActions('right');
    } else {
      closeActions();
    }
  }, [actions.length, rightActions.length, threshold, x, onSwipeLeft, onSwipeRight, triggerHaptic, openActions, closeActions]);

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    triggerHaptic(5);
  }, [triggerHaptic]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        closeActions();
      }
    };

    if (isRevealed) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isRevealed, closeActions]);

  // Keyboard accessibility - close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRevealed) {
        closeActions();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, closeActions]);

  return (
    <tr
      ref={rowRef}
      className={cn(
        'relative overflow-hidden',
        isSelected && 'bg-accent',
        className
      )}
    >
      {/* Background Actions Layer */}
      <td colSpan={100} className="p-0">
        <div className="absolute inset-0 flex justify-between overflow-hidden">
          {/* Left Actions (revealed on swipe right) */}
          {rightActions.length > 0 && (
            <div 
              className="flex h-full"
              style={{ width: rightActionWidth }}
            >
              {rightActions.map((action, index) => (
                <ActionButton
                  key={index}
                  action={action}
                  index={index}
                  total={rightActions.length}
                  side="left"
                />
              ))}
            </div>
          )}

          {/* Right Actions (revealed on swipe left) */}
          {actions.length > 0 && (
            <div 
              className="flex h-full ml-auto"
              style={{ width: leftActionWidth }}
            >
              {actions.map((action, index) => (
                <ActionButton
                  key={index}
                  action={action}
                  index={index}
                  total={actions.length}
                  side="right"
                />
              ))}
            </div>
          )}
        </div>
      </td>

      {/* Foreground Content Layer */}
      <motion.td
        colSpan={100}
        className="p-0 relative bg-background"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -maxActionWidth, right: maxActionWidth }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (!isDragging) {
            if (isRevealed) {
              closeActions();
            } else {
              onClick?.();
            }
          }
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <div className={cn(
          'flex items-center transition-colors',
          isDragging && 'cursor-grabbing',
          !isDragging && 'cursor-pointer'
        )}>
          {children}
        </div>
      </motion.td>

      {/* Selection Checkbox (if enabled) */}
      {hasSelection && (
        <td className="w-12 px-4 py-3 border-t border-border">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => e.stopPropagation()}
            className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
          />
        </td>
      )}
    </tr>
  );
};

// =============================================================================
// Swipe Hint Component
// =============================================================================

export interface SwipeHintProps {
  className?: string;
}

/**
 * Visual hint indicating swipe functionality
 */
export const SwipeHint: React.FC<SwipeHintProps> = ({ className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'flex items-center justify-center gap-2',
        'text-xs text-muted-foreground',
        'py-2 px-4 rounded-full bg-muted',
        className
      )}
    >
      <motion.div
        animate={{ x: [-4, 4, -4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <MoreHorizontal className="w-4 h-4" />
      </motion.div>
      <span>Swipe for actions</span>
    </motion.div>
  );
};

// =============================================================================
// Example Actions Presets
// =============================================================================

export const createEditAction = (onEdit: () => void): SwipeAction => ({
  icon: <Edit className="w-5 h-5" />,
  onClick: onEdit,
  label: 'Edit',
  color: 'blue',
});

export const createDeleteAction = (onDelete: () => void): SwipeAction => ({
  icon: <Trash2 className="w-5 h-5" />,
  onClick: onDelete,
  label: 'Delete',
  danger: true,
});

export const createConfirmAction = (onConfirm: () => void): SwipeAction => ({
  icon: <Check className="w-5 h-5" />,
  onClick: onConfirm,
  label: 'Confirm',
  color: 'green',
});

export const createCancelAction = (onCancel: () => void): SwipeAction => ({
  icon: <X className="w-5 h-5" />,
  onClick: onCancel,
  label: 'Cancel',
  color: 'default',
});

export default SwipeableTableRow;
