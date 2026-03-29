/**
 * Companies Data Hook
 * ===================
 * Custom hook for managing companies data with TanStack Query.
 * Provides queries, mutations, and optimistic updates.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { Company, Deal } from '@/types';
import {
  CompanyFilters,
  PaginationParams,
  CreateCompanyInput,
  UpdateCompanyInput,
  PaginatedResponse,
  ApiError,
} from '@/types/api';
import {
  fetchCompanies,
  fetchCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  fetchCompanyDeals,
} from '@/lib/api';
import {
  optimisticAddToList,
  optimisticUpdateInList,
  optimisticRemoveFromList,
  rollbackOptimisticUpdate,
} from '@/lib/optimistic';

// =============================================================================
// Types
// =============================================================================

export interface UseCompaniesOptions {
  filters?: CompanyFilters;
  pagination?: PaginationParams;
  enabled?: boolean;
}

export interface UseCompaniesReturn {
  // Query results
  companies: Company[];
  pagination: PaginatedResponse<Company>['pagination'] | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  
  // Pagination helpers
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Mutations
  createCompany: UseMutationResult<Company, ApiError, CreateCompanyInput>;
  updateCompany: UseMutationResult<Company, ApiError, { id: string; updates: UpdateCompanyInput }>;
  deleteCompany: UseMutationResult<void, ApiError, string>;
}

// =============================================================================
// Query Keys
// =============================================================================

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (filters: CompanyFilters | undefined, pagination: PaginationParams | undefined) =>
    [...companyKeys.lists(), { filters, pagination }] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
  deals: (id: string) => [...companyKeys.detail(id), 'deals'] as const,
  portfolio: () => [...companyKeys.all, 'portfolio'] as const,
};

// =============================================================================
// Hook
// =============================================================================

export function useCompanies(options: UseCompaniesOptions = {}): UseCompaniesReturn {
  const { filters, pagination = { page: 1, pageSize: 20 }, enabled = true } = options;
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const queryResult = useQuery<PaginatedResponse<Company>, ApiError>({
    queryKey: companyKeys.list(filters, pagination),
    queryFn: () => fetchCompanies(filters, pagination),
    enabled,
  });

  const companies = queryResult.data?.data ?? [];
  const paginationInfo = queryResult.data?.pagination ?? null;

  // ---------------------------------------------------------------------------
  // Create Mutation
  // ---------------------------------------------------------------------------

  const createCompanyMutation = useMutation<Company, ApiError, CreateCompanyInput>({
    mutationFn: createCompany,
    
    onMutate: async (newCompany) => {
      await queryClient.cancelQueries({ queryKey: companyKeys.lists() });

      const optimisticCompany = {
        ...newCompany,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deals: [],
      } as Company;

      const context = optimisticAddToList<Company, CreateCompanyInput>(
        companyKeys.list(filters, pagination),
        optimisticCompany,
        { prepend: true, queryClient }
      );

      return context;
    },

    onError: (error, variables, context) => {
      if (context) {
        rollbackOptimisticUpdate<Company[], CreateCompanyInput>(
          companyKeys.list(filters, pagination),
          context,
          queryClient
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });

  // ---------------------------------------------------------------------------
  // Update Mutation
  // ---------------------------------------------------------------------------

  const updateCompanyMutation = useMutation<
    Company,
    ApiError,
    { id: string; updates: UpdateCompanyInput }
  >({
    mutationFn: ({ id, updates }) => updateCompany(id, updates),
    
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: companyKeys.lists() });
      await queryClient.cancelQueries({ queryKey: companyKeys.detail(id) });

      const previousList = queryClient.getQueryData<Company[]>(companyKeys.lists());
      const previousDetail = queryClient.getQueryData<Company>(companyKeys.detail(id));

      optimisticUpdateInList<Company, UpdateCompanyInput>(
        companyKeys.list(filters, pagination),
        id,
        updates,
        {
          getItemId: (company) => company.id,
          queryClient,
        }
      );

      queryClient.setQueryData<Company>(companyKeys.detail(id), (old) => {
        if (!old) return old;
        return { ...old, ...updates, updatedAt: new Date().toISOString() };
      });

      return { previousList, previousDetail, variables: { id, updates } };
    },

    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(companyKeys.lists(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(companyKeys.detail(variables.id), context.previousDetail);
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(variables.id) });
    },
  });

  // ---------------------------------------------------------------------------
  // Delete Mutation
  // ---------------------------------------------------------------------------

  const deleteCompanyMutation = useMutation<void, ApiError, string>({
    mutationFn: deleteCompany,
    
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: companyKeys.lists() });

      const context = optimisticRemoveFromList<Company, string>(
        companyKeys.list(filters, pagination),
        id,
        {
          getItemId: (company) => company.id,
          queryClient,
        }
      );

      queryClient.removeQueries({ queryKey: companyKeys.detail(id) });
      queryClient.removeQueries({ queryKey: companyKeys.deals(id) });

      return context;
    },

    onError: (error, id, context) => {
      if (context) {
        rollbackOptimisticUpdate<Company[], string>(
          companyKeys.list(filters, pagination),
          context,
          queryClient
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });

  // ---------------------------------------------------------------------------
  // Refetch Helper
  // ---------------------------------------------------------------------------

  const refetch = async (): Promise<void> => {
    await queryResult.refetch();
  };

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    companies,
    pagination: paginationInfo,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch,
    hasNextPage: paginationInfo?.hasNextPage ?? false,
    hasPreviousPage: paginationInfo?.hasPreviousPage ?? false,
    createCompany: createCompanyMutation,
    updateCompany: updateCompanyMutation,
    deleteCompany: deleteCompanyMutation,
  };
}

// =============================================================================
// Single Company Hook
// =============================================================================

export interface UseCompanyReturn {
  company: Company | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  update: UseMutationResult<Company, ApiError, UpdateCompanyInput>;
  delete: UseMutationResult<void, ApiError, void>;
}

export function useCompany(id: string | null, enabled = true): UseCompanyReturn {
  const queryClient = useQueryClient();

  const queryResult = useQuery<Company, ApiError>({
    queryKey: companyKeys.detail(id ?? ''),
    queryFn: () => fetchCompanyById(id!),
    enabled: !!id && enabled,
  });

  const updateMutation = useMutation<Company, ApiError, UpdateCompanyInput>({
    mutationFn: (updates) => updateCompany(id!, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(companyKeys.detail(id!), data);
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });

  const deleteMutation = useMutation<void, ApiError, void>({
    mutationFn: () => deleteCompany(id!),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: companyKeys.detail(id!) });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });

  return {
    company: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
    update: updateMutation,
    delete: deleteMutation,
  };
}

// =============================================================================
// Company Deals Hook
// =============================================================================

export interface UseCompanyDealsReturn {
  deals: Deal[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useCompanyDeals(companyId: string | null, enabled = true): UseCompanyDealsReturn {
  const queryResult = useQuery<Deal[], ApiError>({
    queryKey: companyKeys.deals(companyId ?? ''),
    queryFn: () => fetchCompanyDeals(companyId!),
    enabled: !!companyId && enabled,
  });

  return {
    deals: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
  };
}

export default useCompanies;
