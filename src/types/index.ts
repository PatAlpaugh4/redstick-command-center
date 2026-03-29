/**
 * Type Definitions
 * ================
 * Core type definitions for the application.
 */

// Re-export from api types for convenience
export type { 
  DealFilters,
  CompanyFilters,
  AgentFilters,
  DealStage,
  PortfolioTimeRange,
  PortfolioPerformance,
  PortfolioChartPoint,
  CompanyPerformance,
  CreateDealInput,
  UpdateDealInput,
  CreateAgentInput,
  UpdateAgentInput,
  RunAgentInput,
  AgentRunResult,
  AgentConfiguration,
  PaginationParams,
  PaginatedResponse,
  ApiError,
  ApiResponse,
} from './api';

// =============================================================================
// Deal Types
// =============================================================================

export type DealStatus = 
  | 'SOURCED'
  | 'SCREENING'
  | 'FIRST_MEETING'
  | 'PARTNER_MEETING'
  | 'IC_PREP'
  | 'IC_PRESENTED'
  | 'DILIGENCE'
  | 'TERM_SHEET'
  | 'NEGOTIATING'
  | 'COMMITMENT'
  | 'CLOSED'
  | 'PASSED'
  | 'STALE';

export interface Deal {
  id: string;
  title: string;
  description?: string;
  companyName: string;
  amount: number;
  value: number;
  stage: DealStatus;
  status: 'active' | 'closed' | 'archived';
  assignedTo: string;
  assigneeId?: string | null;
  companyId?: string;
  priority?: 'low' | 'medium' | 'high';
  expectedCloseDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Company Types
// =============================================================================

export type CompanyStage = 'SEED' | 'SERIES_A' | 'SERIES_B' | 'SERIES_C' | 'SERIES_D' | 'GROWTH' | 'PUBLIC' | 'ACQUIRED';

export type CompanyStatus = 'ACTIVE' | 'ACQUIRED' | 'IPO' | 'SHUTDOWN' | 'ZOMBIE';

export interface Founder {
  id: string;
  name: string;
  role: string;
  email?: string | null;
  linkedIn?: string | null;
  bio?: string | null;
  photo?: string | null;
  isPrimary: boolean;
}

export interface Company {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  website?: string | null;
  logo?: string | null;
  industry?: string;
  sector?: string;
  stage?: CompanyStage;
  location?: string | null;
  foundedYear?: number | null;
  teamSize?: number | null;
  arr?: number | null;
  mrr?: number | null;
  growthRate?: number | null;
  burnRate?: number | null;
  runway?: number | null;
  investmentDate?: string | null;
  investmentAmount?: number | null;
  currentValuation?: number | null;
  ownershipStake?: number | null;
  status?: CompanyStatus;
  healthScore?: number | null;
  esgScore?: number | null;
  boardSeat?: boolean;
  lastCheckIn?: string | null;
  nextMilestone?: string | null;
  nextMilestoneDate?: string | null;
  founders?: Founder[];
  metrics?: {
    totalValue: number;
    growthRate: number;
    dealsCount: number;
  };
  deals?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// Agent Types
// =============================================================================

export type AgentType = 'RESEARCH' | 'SCREENING' | 'OUTREACH' | 'DILIGENCE' | 'PORTFOLIO' | 'REPORTING' | 'DATA_ENTRY' | 'CUSTOM';

export type AgentStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'MAINTENANCE' | 'idle' | 'running' | 'paused';

export interface Agent {
  id: string;
  name: string;
  description?: string | null;
  type: AgentType;
  status: AgentStatus;
  configuration?: Record<string, unknown> | null;
  config?: Record<string, unknown>;
  tools?: string[];
  isActive?: boolean;
  lastRunAt?: string | null;
  lastRunDuration?: number | null;
  totalRuns: number;
  successRate?: number | null;
  runCount?: number;
  tokenUsage?: number;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Portfolio Types
// =============================================================================

export interface PortfolioMetrics {
  totalValue: number;
  totalCompanies: number;
  totalDeals: number;
  averageDealSize: number;
  portfolioGrowth: number;
  lastUpdated?: string;
}

export interface PortfolioSummary extends PortfolioMetrics {
  companies: Company[];
  performance?: PortfolioPerformance;
}

export interface PortfolioPerformance {
  timeRange: PortfolioTimeRange;
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  chartData: PortfolioChartPoint[];
  topPerformers: CompanyPerformance[];
  worstPerformers: CompanyPerformance[];
}

export interface PortfolioChartPoint {
  date: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface CompanyPerformance {
  companyId: string;
  companyName: string;
  value: number;
  change: number;
  changePercent: number;
  dealsCount: number;
}

// =============================================================================
// Content Types
// =============================================================================

export type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled';
export type ContentType = 'blog' | 'newsletter' | 'report' | 'update' | 'social';

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  status: ContentStatus;
  author: string;
  authorId: string;
  tags: string[];
  views: number;
  likes: number;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// User Types
// =============================================================================

export type UserRole = 'ADMIN' | 'PARTNER' | 'ANALYST' | 'FOUNDER' | 'LP' | 'VISITOR';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
}

// =============================================================================
// Activity Types
// =============================================================================

export type ActivityType =
  | 'DEAL_CREATED'
  | 'DEAL_UPDATED'
  | 'DEAL_STAGE_CHANGED'
  | 'DEAL_ASSIGNED'
  | 'COMPANY_UPDATED'
  | 'MEETING_SCHEDULED'
  | 'MEETING_COMPLETED'
  | 'NOTE_ADDED'
  | 'DOCUMENT_UPLOADED'
  | 'METRIC_UPDATED'
  | 'AGENT_RUN'
  | 'AGENT_SCHEDULED';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  user?: User | null;
  userId?: string;
  deal?: Deal | null;
  dealId?: string;
  company?: Company | null;
  companyId?: string;
  createdAt: string;
}

// =============================================================================
// Dashboard Types
// =============================================================================

export interface DashboardStats {
  // Deal stats
  totalDeals: number;
  activeDeals: number;
  dealsByStage: Record<string, number>;
  pipelineValue: number;
  avgDealSize: number;
  
  // Portfolio stats
  totalCompanies: number;
  portfolioValue: number;
  avgGrowthRate: number;
  companiesNeedingAttention: number;
  
  // Agent stats
  totalAgents: number;
  activeAgents: number;
  totalRuns: number;
  successRate: number;
  
  // Activity
  recentActivities: Activity[];
}
