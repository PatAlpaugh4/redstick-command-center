// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
  meta?: Record<string, any>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Sort configuration
export interface SortConfig<T> {
  key: keyof T;
  direction: "asc" | "desc";
}

// Bulk operation result
export interface BulkOperationResult {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors?: Array<{ id: string; error: string }>;
}

// Agent-specific types
export interface AgentConfiguration {
  autoStart?: boolean;
  threshold?: number;
  maxTokens?: number;
  sectors?: string[];
  tags?: string[];
  schedule?: AgentSchedule;
}

export interface AgentSchedule {
  enabled: boolean;
  frequency: "hourly" | "daily" | "weekly";
  time?: string;
  days?: string[];
}

export interface AgentRunResult {
  runId: string;
  agentId: string;
  status: "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  startedAt: string;
  completedAt?: string;
  duration?: number;
  tokensUsed: number;
  output?: string;
  error?: string;
}

// Portfolio types
export interface PortfolioPerformance {
  totalValue: number;
  totalDeployed: number;
  totalRealized: number;
  totalUnrealized: number;
  multiple: number;
  irr: number;
  changePercentage: number;
  changeAmount: number;
}

export interface PortfolioChartPoint {
  date: string;
  deployed: number;
  realized: number;
  unrealized: number;
  value: number;
}

// Notification types
export interface Notification {
  id: string;
  type: "deal" | "agent" | "system" | "mention";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

// Export types
export interface ExportOptions {
  format: "csv" | "json" | "xlsx";
  filename?: string;
  includeHeaders?: boolean;
  columns?: string[];
}
