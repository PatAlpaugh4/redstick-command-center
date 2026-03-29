/**
 * Components Index
 * ================
 * Master export file for all components.
 */

// Accessibility components
export * from './a11y';

// Animation components
export * from './animation';

// UI components
export * from './ui';

// Modal components
export * from './ui/modal';

// Chart components
export * from './charts';

// Activity components
export * from './activity';

// Agent components
export { AgentControlPanel, type AgentControlPanelProps } from './agents/AgentControlPanel';

// Pipeline components
export { KanbanBoard, type KanbanBoardProps } from './pipeline/KanbanBoard';

// Keyboard components
export {
  KeyboardHelp,
  KeyboardHelpButton,
  type KeyboardHelpProps,
  type KeyboardHelpButtonProps,
  type Shortcut,
} from './keyboard';

// Providers
export * from './providers';
