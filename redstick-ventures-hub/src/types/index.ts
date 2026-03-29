// Export all types
export * from "./api";

// Core entity types
export interface Deal {
  id: string;
  companyName: string;
  stage: DealStage;
  amount: number;
  description?: string;
  source: DealSource;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
  companyId?: string;
  assignedTo?: string;
}

export type DealStage =
  | "INBOUND"
  | "SCREENING"
  | "FIRST_MEETING"
  | "DEEP_DIVE"
  | "DUE_DILIGENCE"
  | "IC_REVIEW"
  | "TERM_SHEET"
  | "CLOSED"
  | "PASSED";

export type DealSource = "INBOUND" | "OUTBOUND" | "REFERRAL" | "DEMO_DAY" | "AGENT";
export type DealStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface Company {
  id: string;
  name: string;
  sector: string;
  stage: string;
  website?: string;
  description?: string;
  founded?: number;
  employees?: number;
  investment?: number;
  valuation?: number;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
}

export type CompanyStatus = "ACTIVE" | "ACQUIRED" | "IPO" | "SHUTDOWN";

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  config: Record<string, any>;
  lastRun: string | null;
  successRate: number;
  totalRuns: number;
  tokenUsage: number;
}

export type AgentType = "SCREENING" | "RESEARCH" | "PORTFOLIO" | "OUTREACH" | "DILIGENCE" | "REPORTING";
export type AgentStatus = "ACTIVE" | "INACTIVE" | "ERROR" | "MAINTENANCE" | "RUNNING";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  createdAt: string;
}

export type UserRole = "ADMIN" | "PARTNER" | "ANALYST";

// Filter types
export interface DealFilters {
  stage?: DealStage;
  status?: DealStatus;
  source?: DealSource;
  assignedTo?: string;
  search?: string;
}

export interface CompanyFilters {
  sector?: string;
  stage?: string;
  status?: CompanyStatus;
  search?: string;
}

// Form input types
export interface CreateDealInput {
  companyName: string;
  stage: DealStage;
  amount?: number;
  description?: string;
  source: DealSource;
}

export interface UpdateDealInput extends Partial<CreateDealInput> {
  id: string;
}

// Content types
export interface ContentItem {
  id: string;
  title: string;
  type: "blog" | "lp-letter" | "market-analysis";
  author: string;
  status: "published" | "draft" | "scheduled";
  publishDate: string;
  views: number;
  excerpt: string;
  tags: string[];
}

// Activity types
export interface Activity {
  id: string;
  type: string;
  entityType: "deal" | "company" | "agent" | "user" | "settings";
  entityId: string;
  entityName: string;
  action: string;
  user: { id: string; name: string; avatar?: string };
  timestamp: string;
  metadata?: Record<string, any>;
}
