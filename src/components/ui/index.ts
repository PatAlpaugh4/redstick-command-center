/**
 * UI Components Index
 * ===================
 * Export all UI components for easy imports.
 * 
 * @example
 * ```tsx
 * import { Button, Card, Badge, DataTable } from '@/components/ui';
 * ```
 */

// Button and variants
export {
  Button,
  IconButton,
  ButtonGroup,
  DestructiveButton,
  buttonVariants,
  type ButtonProps,
  type IconButtonProps,
  type ButtonGroupProps,
  type DestructiveButtonProps,
} from './Button';

// Card and subcomponents
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
} from './Card';

// Badge and variants
export {
  Badge,
  StatusBadge,
  StatusIndicator,
  type BadgeProps,
  type StatusBadgeProps,
  type StatusIndicatorProps,
} from './Badge';

// DataTable
export {
  DataTable,
  type ColumnDef,
  type BulkAction,
  type DataTableProps,
} from './DataTable';

// BulkActionsBar
export {
  BulkActionsBar,
  type BulkAction as BulkActionsBarAction,
  type BulkActionsBarProps,
} from './BulkActionsBar';

// Modal and subcomponents
export {
  Modal,
  ModalFooter,
  ConfirmModal,
  type ModalProps,
  type ModalFooterProps,
  type ConfirmModalProps,
} from './modal';

// Dropdown
export {
  Dropdown,
  DropdownButton,
  type DropdownProps,
  type DropdownItem,
  type DropdownButtonProps,
} from './Dropdown';

// Tabs
export {
  Tabs,
  TabPanel,
  type TabsProps,
  type Tab,
  type TabPanelProps,
} from './Tabs';

// SwipeableTableRow
export {
  SwipeableTableRow,
  SwipeHint,
  createEditAction,
  createDeleteAction,
  createConfirmAction,
  createCancelAction,
  type SwipeAction,
  type SwipeableTableRowProps,
  type SwipeHintProps,
} from './SwipeableTableRow';
