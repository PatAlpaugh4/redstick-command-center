/**
 * API Helper Functions
 * ====================
 * Core API functions for interacting with the backend.
 * Provides typed wrappers around fetch for all resources.
 */

import {
  Deal,
  Company,
  Agent,
  AgentRunResult,
  PortfolioSummary,
} from '@/types';
import {
  ApiResponse,
  ApiError,
  ApiErrorResponse,
  PaginatedResponse,
  DealFilters,
  CompanyFilters,
  AgentFilters,
  CreateDealInput,
  UpdateDealInput,
  CreateCompanyInput,
  UpdateCompanyInput,
  CreateAgentInput,
  UpdateAgentInput,
  RunAgentInput,
  PaginationParams,
  PortfolioTimeRange,
  BulkOperationInput,
  BulkOperationResult,
} from '@/types/api';

// =============================================================================
// API Configuration
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// =============================================================================
// HTTP Client
// =============================================================================

/**
 * Custom API error class
 */
export class ApiClientError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, string[]>;

  constructor(error: ApiError, status: number) {
    super(error.message);
    this.name = 'ApiClientError';
    this.code = error.code;
    this.status = status;
    this.details = error.details;
  }
}

/**
 * Make an API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json() as ApiResponse<T> | ApiErrorResponse;

    if (!response.ok || !data.success) {
      const errorData = data as ApiErrorResponse;
      throw new ApiClientError(errorData.error, response.status);
    }

    return (data as ApiResponse<T>).data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    
    // Network or parsing error
    throw new ApiClientError(
      {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error occurred',
      },
      0
    );
  }
}

// =============================================================================
// Deals API
// =============================================================================

/**
 * Fetch deals with optional filters and pagination
 */
export async function fetchDeals(
  filters?: DealFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Deal>> {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  
  if (pagination) {
    Object.entries(pagination).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/deals${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<PaginatedResponse<Deal>>(endpoint, { method: 'GET' });
}

/**
 * Fetch a single deal by ID
 */
export async function fetchDealById(id: string): Promise<Deal> {
  return apiRequest<Deal>(`/deals/${id}`, { method: 'GET' });
}

/**
 * Create a new deal
 */
export async function createDeal(deal: CreateDealInput): Promise<Deal> {
  return apiRequest<Deal>('/deals', {
    method: 'POST',
    body: JSON.stringify(deal),
  });
}

/**
 * Update an existing deal
 */
export async function updateDeal(
  id: string,
  updates: UpdateDealInput
): Promise<Deal> {
  return apiRequest<Deal>(`/deals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a deal
 */
export async function deleteDeal(id: string): Promise<void> {
  return apiRequest<void>(`/deals/${id}`, { method: 'DELETE' });
}

/**
 * Bulk delete deals
 */
export async function bulkDeleteDeals(ids: string[]): Promise<BulkOperationResult> {
  return apiRequest<BulkOperationResult>('/deals/bulk', {
    method: 'POST',
    body: JSON.stringify({ ids, operation: 'delete' } as BulkOperationInput<void>),
  });
}

/**
 * Update deal stage
 */
export async function updateDealStage(
  id: string,
  stage: Deal['stage']
): Promise<Deal> {
  return updateDeal(id, { stage });
}

// =============================================================================
// Companies API
// =============================================================================

/**
 * Fetch companies with optional filters and pagination
 */
export async function fetchCompanies(
  filters?: CompanyFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Company>> {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  
  if (pagination) {
    Object.entries(pagination).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/companies${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<PaginatedResponse<Company>>(endpoint, { method: 'GET' });
}

/**
 * Fetch a single company by ID
 */
export async function fetchCompanyById(id: string): Promise<Company> {
  return apiRequest<Company>(`/companies/${id}`, { method: 'GET' });
}

/**
 * Create a new company
 */
export async function createCompany(company: CreateCompanyInput): Promise<Company> {
  return apiRequest<Company>('/companies', {
    method: 'POST',
    body: JSON.stringify(company),
  });
}

/**
 * Update an existing company
 */
export async function updateCompany(
  id: string,
  updates: UpdateCompanyInput
): Promise<Company> {
  return apiRequest<Company>(`/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a company
 */
export async function deleteCompany(id: string): Promise<void> {
  return apiRequest<void>(`/companies/${id}`, { method: 'DELETE' });
}

/**
 * Fetch deals for a specific company
 */
export async function fetchCompanyDeals(companyId: string): Promise<Deal[]> {
  return apiRequest<Deal[]>(`/companies/${companyId}/deals`, { method: 'GET' });
}

// =============================================================================
// Agents API
// =============================================================================

/**
 * Fetch agents with optional filters
 */
export async function fetchAgents(
  filters?: AgentFilters
): Promise<Agent[]> {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/agents${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<Agent[]>(endpoint, { method: 'GET' });
}

/**
 * Fetch a single agent by ID
 */
export async function fetchAgentById(id: string): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${id}`, { method: 'GET' });
}

/**
 * Create a new agent
 */
export async function createAgent(agent: CreateAgentInput): Promise<Agent> {
  return apiRequest<Agent>('/agents', {
    method: 'POST',
    body: JSON.stringify(agent),
  });
}

/**
 * Update an existing agent
 */
export async function updateAgent(
  id: string,
  updates: UpdateAgentInput
): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete an agent
 */
export async function deleteAgent(id: string): Promise<void> {
  return apiRequest<void>(`/agents/${id}`, { method: 'DELETE' });
}

/**
 * Run an agent
 */
export async function runAgent(
  id: string,
  input: RunAgentInput
): Promise<AgentRunResult> {
  return apiRequest<AgentRunResult>(`/agents/${id}/run`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Get agent run status
 */
export async function getAgentRunStatus(
  agentId: string,
  runId: string
): Promise<AgentRunResult> {
  return apiRequest<AgentRunResult>(`/agents/${agentId}/runs/${runId}`, {
    method: 'GET',
  });
}

/**
 * Get agent run history
 */
export async function getAgentRunHistory(agentId: string): Promise<AgentRunResult[]> {
  return apiRequest<AgentRunResult[]>(`/agents/${agentId}/runs`, { method: 'GET' });
}

// =============================================================================
// Portfolio API
// =============================================================================

/**
 * Fetch portfolio summary
 */
export async function fetchPortfolioSummary(): Promise<PortfolioSummary> {
  return apiRequest<PortfolioSummary>('/portfolio', { method: 'GET' });
}

/**
 * Fetch portfolio performance data
 */
export async function fetchPortfolioPerformance(
  timeRange: PortfolioTimeRange = '1y'
): Promise<PortfolioSummary['performance']> {
  return apiRequest<PortfolioSummary['performance']>(
    `/portfolio/performance?timeRange=${timeRange}`,
    { method: 'GET' }
  );
}

/**
 * Fetch portfolio companies with metrics
 */
export async function fetchPortfolioCompanies(): Promise<Company[]> {
  return apiRequest<Company[]>('/portfolio/companies', { method: 'GET' });
}

// =============================================================================
// Export
// =============================================================================

export default {
  // Deals
  fetchDeals,
  fetchDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  bulkDeleteDeals,
  updateDealStage,
  
  // Companies
  fetchCompanies,
  fetchCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  fetchCompanyDeals,
  
  // Agents
  fetchAgents,
  fetchAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  runAgent,
  getAgentRunStatus,
  getAgentRunHistory,
  
  // Portfolio
  fetchPortfolioSummary,
  fetchPortfolioPerformance,
  fetchPortfolioCompanies,
};
