/**
 * API Type Definitions
 * ====================
 * Type definitions for API requests, responses, and data structures.
 */

import { Deal, Company, Agent, PortfolioMetrics, DealStage } from './index';

// =============================================================================
// API Response Wrappers
// =============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  timestamp: string;
}

/**
 * API error details
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  stack?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
  timestamp: string;
}

// =============================================================================
// Pagination Types
// =============================================================================

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// Filter Types
// =============================================================================

/**
 * Base filter interface
 */
export interface BaseFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  createdBy?: string;
}

/**
 * Deal-specific filters
 */
export interface DealFilters extends BaseFilters {
  stage?: DealStage;
  minValue?: number;
  maxValue?: number;
  companyId?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'closed' | 'archived';
}

/**
 * Company-specific filters
 */
export interface CompanyFilters extends BaseFilters {
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'enterprise';
  location?: string;
  fundingStage?: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'ipo';
  isPortfolioCompany?: boolean;
}

/**
 * Agent-specific filters
 */
export interface AgentFilters extends BaseFilters {
  type?: 'research' | 'analysis' | 'outreach' | 'reporting' | 'custom';
  status?: 'idle' | 'running' | 'paused' | 'error';
  isActive?: boolean;
}

// =============================================================================
// Request Types
// =============================================================================

/**
 * Create deal input
 */
export interface CreateDealInput {
  title: string;
  description?: string;
  value: number;
  stage: DealStage;
  companyId: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  expectedCloseDate?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Update deal input
 */
export interface UpdateDealInput {
  title?: string;
  description?: string;
  value?: number;
  stage?: DealStage;
  companyId?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  expectedCloseDate?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
  status?: 'active' | 'closed' | 'archived';
}

/**
 * Create company input
 */
export interface CreateCompanyInput {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'enterprise';
  location?: string;
  fundingStage?: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'ipo';
  fundingAmount?: number;
  foundedYear?: number;
  logo?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  contacts?: CompanyContactInput[];
  isPortfolioCompany?: boolean;
  notes?: string;
}

/**
 * Update company input
 */
export interface UpdateCompanyInput {
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'enterprise';
  location?: string;
  fundingStage?: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'ipo';
  fundingAmount?: number;
  foundedYear?: number;
  logo?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  contacts?: CompanyContactInput[];
  isPortfolioCompany?: boolean;
  notes?: string;
}

/**
 * Company contact input
 */
export interface CompanyContactInput {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
}

/**
 * Create agent input
 */
export interface CreateAgentInput {
  name: string;
  description?: string;
  type: 'research' | 'analysis' | 'outreach' | 'reporting' | 'custom';
  configuration: AgentConfiguration;
  schedule?: AgentSchedule;
}

/**
 * Update agent input
 */
export interface UpdateAgentInput {
  name?: string;
  description?: string;
  type?: 'research' | 'analysis' | 'outreach' | 'reporting' | 'custom';
  configuration?: Partial<AgentConfiguration>;
  schedule?: AgentSchedule | null;
  isActive?: boolean;
}

/**
 * Agent configuration
 */
export interface AgentConfiguration {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  tools?: string[];
  webSearch?: {
    enabled: boolean;
    maxResults?: number;
  };
  customSettings?: Record<string, unknown>;
}

/**
 * Agent schedule configuration
 */
export interface AgentSchedule {
  frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  cronExpression?: string;
  startDate?: string;
  endDate?: string;
  timezone?: string;
}

/**
 * Run agent input
 */
export interface RunAgentInput {
  prompt?: string;
  context?: Record<string, unknown>;
  variables?: Record<string, string>;
}

/**
 * Agent run result
 */
export interface AgentRunResult {
  runId: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
  error?: string;
  startedAt: string;
  completedAt?: string;
  tokensUsed?: number;
  cost?: number;
}

// =============================================================================
// Query Types
// =============================================================================

/**
 * Query options for list endpoints
 */
export interface ListQueryOptions<TFilters = BaseFilters> {
  filters?: TFilters;
  pagination?: PaginationParams;
}

/**
 * Query result with metadata
 */
export interface QueryResult<T> {
  data: T;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

/**
 * Paginated query result
 */
export interface PaginatedQueryResult<T> extends QueryResult<T[]> {
  pagination: PaginationInfo;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => Promise<void>;
  fetchPreviousPage: () => Promise<void>;
}

// =============================================================================
// Portfolio Types
// =============================================================================

/**
 * Portfolio time range
 */
export type PortfolioTimeRange = '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'all';

/**
 * Portfolio chart data point
 */
export interface PortfolioChartPoint {
  date: string;
  value: number;
  change: number;
  changePercent: number;
}

/**
 * Portfolio performance metrics
 */
export interface PortfolioPerformance {
  timeRange: PortfolioTimeRange;
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  chartData: PortfolioChartPoint[];
  topPerformers: CompanyPerformance[];
  worstPerformers: CompanyPerformance[];
}

/**
 * Individual company performance
 */
export interface CompanyPerformance {
  companyId: string;
  companyName: string;
  value: number;
  change: number;
  changePercent: number;
  dealsCount: number;
}

/**
 * Portfolio summary with companies
 */
export interface PortfolioSummary extends PortfolioMetrics {
  companies: Company[];
  performance: PortfolioPerformance;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Sort configuration
 */
export interface SortConfig<T = string> {
  key: T;
  direction: 'asc' | 'desc';
}

/**
 * Date range filter
 */
export interface DateRange {
  start: string;
  end: string;
}

/**
 * Generic ID parameter
 */
export interface IdParam {
  id: string;
}

/**
 * Bulk operation input
 */
export interface BulkOperationInput<T> {
  ids: string[];
  operation: 'delete' | 'update' | 'archive';
  payload?: T;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: Array<{ id: string; error: string }>;
}
