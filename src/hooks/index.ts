/**
 * Hooks Index
 * ===========
 * Centralized exports for all custom React hooks.
 */

// Data hooks
export { useActivityFeed } from "./useActivityFeed";
export { useAgents } from "./useAgents";
export { useCompanies } from "./useCompanies";
export { useDeals } from "./useDeals";
export { usePortfolio } from "./usePortfolio";

// Feature hooks
export { useBulkOperations } from "./useBulkOperations";
export { useExport } from "./useExport";
export { useToast } from "./useToast";

// Performance hooks
export { useIntersectionObserver } from "./useIntersectionObserver";
export { usePrefetch } from "./usePrefetch";

// Keyboard navigation hooks
export { useFocusTrap } from "./useFocusTrap";
export { useArrowKeyNavigation } from "./useArrowKeyNavigation";
export { useTabNavigation } from "./useTabNavigation";
export { 
  useKeyboardShortcut,
  useKeyboardShortcuts,
  KeyboardShortcuts,
  registerShortcut,
  getRegisteredShortcuts,
  unregisterShortcut,
} from "./useKeyboardShortcut";

// Re-export types
export type { 
  UseFocusTrapOptions, 
  UseFocusTrapReturn 
} from "./useFocusTrap";

export type { 
  ArrowKeyOrientation,
  UseArrowKeyNavigationOptions,
  UseArrowKeyNavigationReturn 
} from "./useArrowKeyNavigation";

export type { 
  UseTabNavigationOptions,
  UseTabNavigationReturn 
} from "./useTabNavigation";

export type { 
  KeyboardShortcutOptions,
  KeyboardShortcutHandler,
  ShortcutConfig 
} from "./useKeyboardShortcut";
