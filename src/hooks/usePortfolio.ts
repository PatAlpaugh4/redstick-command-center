/**
 * Portfolio Data Hook
 * ===================
 * Custom hook for managing portfolio data with TanStack Query.
 * Provides metrics, performance charts, and company listings.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PortfolioMetrics, Company } from '@/types';
import {
  PortfolioSummary,
  PortfolioPerformance,
  PortfolioTimeRange,
  CompanyPerformance,
  ApiError,
} from '@/types/api';
import {
  fetchPortfolioSummary,
  fetchPortfolioPerformance,
  fetchPortfolioCompanies,
} from '@/lib/api';

// =============================================================================
// Types
// =============================================================================

export interface UsePortfolioOptions {
  timeRange?: PortfolioTimeRange;
  enabled?: boolean;
}

export interface UsePortfolioReturn {
  // Portfolio data
  metrics: PortfolioMetrics | null;
  performance: PortfolioPerformance | null;
  companies: Company[];
  
  // Loading states
  isLoading: boolean;
  isMetricsLoading: boolean;
  isPerformanceLoading: boolean;
  isCompaniesLoading: boolean;
  
  // Error states
  isError: boolean;
  error: ApiError | null;
  
  // Actions
  refetch: () => Promise<void>;
  refetchMetrics: () => Promise<void>;
  refetchPerformance: () => Promise<void>;
  refetchCompanies: () => Promise<void>;
  
  // Computed values
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

// =============================================================================
// Query Keys
// =============================================================================

export const portfolioKeys = {
  all: ['portfolio'] as const,
  summary: () => [...portfolioKeys.all, 'summary'] as const,
  metrics: () => [...portfolioKeys.all, 'metrics'] as const,
  performance: (timeRange: PortfolioTimeRange) =>
    [...portfolioKeys.all, 'performance', timeRange] as const,
  companies: () => [...portfolioKeys.all, 'companies'] as const,
  companyMetrics: (companyId: string) =>
    [...portfolioKeys.all, 'company', companyId] as const,
};

// =============================================================================
// Hook
// =============================================================================

export function usePortfolio(options: UsePortfolioOptions = {}): UsePortfolioReturn {
  const { timeRange = '1y', enabled = true } = options;
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Summary Query
  // ---------------------------------------------------------------------------

  const summaryQuery = useQuery<PortfolioSummary, ApiError>({
    queryKey: portfolioKeys.summary(),
    queryFn: fetchPortfolioSummary,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ---------------------------------------------------------------------------
  // Performance Query
  // ---------------------------------------------------------------------------

  const performanceQuery = useQuery<PortfolioPerformance, ApiError>({
    queryKey: portfolioKeys.performance(timeRange),
    queryFn: () => fetchPortfolioPerformance(timeRange),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ---------------------------------------------------------------------------
  // Companies Query
  // ---------------------------------------------------------------------------

  const companiesQuery = useQuery<Company[], ApiError>({
    queryKey: portfolioKeys.companies(),
    queryFn: fetchPortfolioCompanies,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ---------------------------------------------------------------------------
  // Refetch Helpers
  // ---------------------------------------------------------------------------

  const refetch = async (): Promise<void> => {
    await Promise.all([
      summaryQuery.refetch(),
      performanceQuery.refetch(),
      companiesQuery.refetch(),
    ]);
  };

  const refetchMetrics = async (): Promise<void> => {
    await summaryQuery.refetch();
  };

  const refetchPerformance = async (): Promise<void> => {
    await performanceQuery.refetch();
  };

  const refetchCompanies = async (): Promise<void> => {
    await companiesQuery.refetch();
  };

  // ---------------------------------------------------------------------------
  // Computed Values
  // ---------------------------------------------------------------------------

  const metrics = summaryQuery.data ?? null;
  const performance = performanceQuery.data ?? null;
  const companies = companiesQuery.data ?? [];

  const totalValue = performance?.totalValue ?? 0;
  const totalChange = performance?.totalChange ?? 0;
  const totalChangePercent = performance?.totalChangePercent ?? 0;
  const chartData = performance?.chartData ?? [];
  const topPerformers = performance?.topPerformers ?? [];
  const worstPerformers = performance?.worstPerformers ?? [];

  // Combined loading state
  const isLoading =
    summaryQuery.isLoading ||
    performanceQuery.isLoading ||
    companiesQuery.isLoading;

  // Combined error state
  const isError =
    summaryQuery.isError ||
    performanceQuery.isError ||
    companiesQuery.isError;

  // Aggregate errors
  const error =
    summaryQuery.error ??
    performanceQuery.error ??
    companiesQuery.error ??
    null;

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    metrics,
    performance,
    companies,
    isLoading,
    isMetricsLoading: summaryQuery.isLoading,
    isPerformanceLoading: performanceQuery.isLoading,
    isCompaniesLoading: companiesQuery.isLoading,
    isError,
    error,
    refetch,
    refetchMetrics,
    refetchPerformance,
    refetchCompanies,
    totalValue,
    totalChange,
    totalChangePercent,
    chartData,
    topPerformers,
    worstPerformers,
  };
}

// =============================================================================
// Portfolio Metrics Only Hook
// =============================================================================

export interface UsePortfolioMetricsReturn {
  metrics: PortfolioMetrics | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function usePortfolioMetrics(enabled = true): UsePortfolioMetricsReturn {
  const queryResult = useQuery<PortfolioSummary, ApiError>({
    queryKey: portfolioKeys.summary(),
    queryFn: fetchPortfolioSummary,
    enabled,
    select: (data) => ({
      totalValue: data.totalValue,
      totalCompanies: data.totalCompanies,
      totalDeals: data.totalDeals,
      averageDealSize: data.averageDealSize,
      portfolioGrowth: data.portfolioGrowth,
      lastUpdated: data.lastUpdated,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    metrics: queryResult.data ?? null,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
  };
}

// =============================================================================
// Portfolio Performance Only Hook
// =============================================================================

export interface UsePortfolioPerformanceReturn {
  performance: PortfolioPerformance | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function usePortfolioPerformance(
  timeRange: PortfolioTimeRange = '1y',
  enabled = true
): UsePortfolioPerformanceReturn {
  const queryResult = useQuery<PortfolioPerformance, ApiError>({
    queryKey: portfolioKeys.performance(timeRange),
    queryFn: () => fetchPortfolioPerformance(timeRange),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    performance: queryResult.data ?? null,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
  };
}

// =============================================================================
// Portfolio Companies Only Hook
// =============================================================================

export interface UsePortfolioCompaniesOptions {
  sortBy?: 'name' | 'value' | 'growth' | 'dealsCount';
  sortOrder?: 'asc' | 'desc';
  enabled?: boolean;
}

export interface UsePortfolioCompaniesReturn {
  companies: Company[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function usePortfolioCompanies(
  options: UsePortfolioCompaniesOptions = {}
): UsePortfolioCompaniesReturn {
  const { sortBy = 'value', sortOrder = 'desc', enabled = true } = options;

  const queryResult = useQuery<Company[], ApiError>({
    queryKey: portfolioKeys.companies(),
    queryFn: fetchPortfolioCompanies,
    enabled,
    select: (data) => {
      // Sort companies based on options
      return [...data].sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'value':
            comparison = (a.metrics?.totalValue ?? 0) - (b.metrics?.totalValue ?? 0);
            break;
          case 'growth':
            comparison = (a.metrics?.growthRate ?? 0) - (b.metrics?.growthRate ?? 0);
            break;
          case 'dealsCount':
            comparison = (a.deals?.length ?? 0) - (b.deals?.length ?? 0);
            break;
          default:
            comparison = 0;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    companies: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
  };
}

// =============================================================================
// Portfolio Chart Data Hook
// =============================================================================

export interface UsePortfolioChartReturn {
  chartData: PortfolioChartPoint[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function usePortfolioChart(
  timeRange: PortfolioTimeRange = '1y',
  enabled = true
): UsePortfolioChartReturn {
  const queryResult = useQuery<PortfolioPerformance, ApiError>({
    queryKey: portfolioKeys.performance(timeRange),
    queryFn: () => fetchPortfolioPerformance(timeRange),
    enabled,
    select: (data) => data.chartData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    chartData: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
  };
}

// =============================================================================
// Export
// =============================================================================

export default usePortfolio;
