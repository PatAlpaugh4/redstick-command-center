/**
 * Deals Data Hook
 * ===============
 * Custom hook for managing deals data with TanStack Query.
 * Provides queries, mutations, and optimistic updates.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
  QueryKey,
} from '@tanstack/react-query';
import { Deal } from '@/types';
import {
  DealFilters,
  PaginationParams,
  CreateDealInput,
  UpdateDealInput,
  PaginatedResponse,
  ApiError,
} from '@/types/api';
import {
  fetchDeals,
  fetchDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  updateDealStage,
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

export interface UseDealsOptions {
  filters?: DealFilters;
  pagination?: PaginationParams;
  enabled?: boolean;
}

export interface UseDealsReturn {
  // Query results
  deals: Deal[];
  pagination: PaginatedResponse<Deal>['pagination'] | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  
  // Pagination helpers
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Mutations
  createDeal: UseMutationResult<Deal, ApiError, CreateDealInput>;
  updateDeal: UseMutationResult<Deal, ApiError, { id: string; updates: UpdateDealInput }>;
  deleteDeal: UseMutationResult<void, ApiError, string>;
  updateDealStage: UseMutationResult<Deal, ApiError, { id: string; stage: Deal['stage'] }>;
}

// =============================================================================
// Query Keys
// =============================================================================

export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (filters: DealFilters | undefined, pagination: PaginationParams | undefined) =>
    [...dealKeys.lists(), { filters, pagination }] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
};

// =============================================================================
// Hook
// =============================================================================

export function useDeals(options: UseDealsOptions = {}): UseDealsReturn {
  const { filters, pagination = { page: 1, pageSize: 20 }, enabled = true } = options;
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const queryResult = useQuery<PaginatedResponse<Deal>, ApiError>({
    queryKey: dealKeys.list(filters, pagination),
    queryFn: () => fetchDeals(filters, pagination),
    enabled,
  });

  const deals = queryResult.data?.data ?? [];
  const paginationInfo = queryResult.data?.pagination ?? null;

  // ---------------------------------------------------------------------------
  // Create Mutation
  // ---------------------------------------------------------------------------

  const createDealMutation = useMutation<Deal, ApiError, CreateDealInput>({
    mutationFn: createDeal,
    
    onMutate: async (newDeal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: dealKeys.lists() });

      // Optimistically add to list
      const optimisticDeal = {
        ...newDeal,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Deal;

      const context = optimisticAddToList<Deal, CreateDealInput>(
        dealKeys.list(filters, pagination),
        optimisticDeal,
        { prepend: true, queryClient }
      );

      return context;
    },

    onError: (error, variables, context) => {
      // Rollback on error
      if (context) {
        rollbackOptimisticUpdate<Deal[], CreateDealInput>(
          dealKeys.list(filters, pagination),
          context,
          queryClient
        );
      }
    },

    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
    },
  });

  // ---------------------------------------------------------------------------
  // Update Mutation
  // ---------------------------------------------------------------------------

  const updateDealMutation = useMutation<
    Deal,
    ApiError,
    { id: string; updates: UpdateDealInput }
  >({
    mutationFn: ({ id, updates }) => updateDeal(id, updates),
    
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: dealKeys.lists() });
      await queryClient.cancelQueries({ queryKey: dealKeys.detail(id) });

      // Snapshot previous values
      const previousList = queryClient.getQueryData<Deal[]>(dealKeys.lists());
      const previousDetail = queryClient.getQueryData<Deal>(dealKeys.detail(id));

      // Optimistically update list
      optimisticUpdateInList<Deal, UpdateDealInput>(
        dealKeys.list(filters, pagination),
        id,
        updates,
        {
          getItemId: (deal) => deal.id,
          queryClient,
        }
      );

      // Optimistically update detail
      queryClient.setQueryData<Deal>(dealKeys.detail(id), (old) => {
        if (!old) return old;
        return { ...old, ...updates, updatedAt: new Date().toISOString() };
      });

      return { previousList, previousDetail, variables: { id, updates } };
    },

    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousList) {
        queryClient.setQueryData(dealKeys.lists(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(dealKeys.detail(variables.id), context.previousDetail);
      }
    },

    onSettled: (data, error, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(variables.id) });
    },
  });

  // ---------------------------------------------------------------------------
  // Delete Mutation
  // ---------------------------------------------------------------------------

  const deleteDealMutation = useMutation<void, ApiError, string>({
    mutationFn: deleteDeal,
    
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: dealKeys.lists() });

      // Optimistically remove from list
      const context = optimisticRemoveFromList<Deal, string>(
        dealKeys.list(filters, pagination),
        id,
        {
          getItemId: (deal) => deal.id,
          queryClient,
        }
      );

      // Remove detail cache
      queryClient.removeQueries({ queryKey: dealKeys.detail(id) });

      return context;
    },

    onError: (error, id, context) => {
      // Rollback on error
      if (context) {
        rollbackOptimisticUpdate<Deal[], string>(
          dealKeys.list(filters, pagination),
          context,
          queryClient
        );
      }
    },

    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
    },
  });

  // ---------------------------------------------------------------------------
  // Update Stage Mutation
  // ---------------------------------------------------------------------------

  const updateStageMutation = useMutation<
    Deal,
    ApiError,
    { id: string; stage: Deal['stage'] }
  >({
    mutationFn: ({ id, stage }) => updateDealStage(id, stage),
    
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: dealKeys.lists() });

      const previousList = queryClient.getQueryData<Deal[]>(dealKeys.lists());

      optimisticUpdateInList<Deal, { stage: Deal['stage'] }>(
        dealKeys.list(filters, pagination),
        id,
        { stage },
        {
          getItemId: (deal) => deal.id,
          queryClient,
        }
      );

      return { previousList, variables: { id, stage } };
    },

    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(dealKeys.lists(), context.previousList);
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(variables.id) });
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
    deals,
    pagination: paginationInfo,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch,
    hasNextPage: paginationInfo?.hasNextPage ?? false,
    hasPreviousPage: paginationInfo?.hasPreviousPage ?? false,
    createDeal: createDealMutation,
    updateDeal: updateDealMutation,
    deleteDeal: deleteDealMutation,
    updateDealStage: updateStageMutation,
  };
}

// =============================================================================
// Single Deal Hook
// =============================================================================

export interface UseDealReturn {
  deal: Deal | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  update: UseMutationResult<Deal, ApiError, UpdateDealInput>;
  delete: UseMutationResult<void, ApiError, void>;
}

export function useDeal(id: string | null, enabled = true): UseDealReturn {
  const queryClient = useQueryClient();

  const queryResult = useQuery<Deal, ApiError>({
    queryKey: dealKeys.detail(id ?? ''),
    queryFn: () => fetchDealById(id!),
    enabled: !!id && enabled,
  });

  const updateMutation = useMutation<Deal, ApiError, UpdateDealInput>({
    mutationFn: (updates) => updateDeal(id!, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(dealKeys.detail(id!), data);
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
    },
  });

  const deleteMutation = useMutation<void, ApiError, void>({
    mutationFn: () => deleteDeal(id!),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: dealKeys.detail(id!) });
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
    },
  });

  return {
    deal: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
    update: updateMutation,
    delete: deleteMutation,
  };
}

export default useDeals;
