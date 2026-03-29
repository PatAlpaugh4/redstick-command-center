/**
 * Agents Data Hook
 * ================
 * Custom hook for managing AI agents with TanStack Query.
 * Provides queries, mutations, agent execution, and config updates.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { Agent } from '@/types';
import {
  AgentFilters,
  CreateAgentInput,
  UpdateAgentInput,
  RunAgentInput,
  AgentRunResult,
  AgentConfiguration,
  ApiError,
} from '@/types/api';
import {
  fetchAgents,
  fetchAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  runAgent,
  getAgentRunStatus,
  getAgentRunHistory,
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

export interface UseAgentsOptions {
  filters?: AgentFilters;
  enabled?: boolean;
}

export interface UseAgentsReturn {
  // Query results
  agents: Agent[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  
  // Mutations
  createAgent: UseMutationResult<Agent, ApiError, CreateAgentInput>;
  updateAgent: UseMutationResult<Agent, ApiError, { id: string; updates: UpdateAgentInput }>;
  deleteAgent: UseMutationResult<void, ApiError, string>;
  updateConfig: UseMutationResult<Agent, ApiError, { id: string; config: Partial<AgentConfiguration> }>;
  toggleActive: UseMutationResult<Agent, ApiError, { id: string; isActive: boolean }>;
}

export interface UseAgentRunReturn {
  runAgent: UseMutationResult<AgentRunResult, ApiError, RunAgentInput>;
  isRunning: boolean;
  lastRun: AgentRunResult | undefined;
}

// =============================================================================
// Query Keys
// =============================================================================

export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (filters: AgentFilters | undefined) =>
    [...agentKeys.lists(), { filters }] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
  runs: (id: string) => [...agentKeys.detail(id), 'runs'] as const,
  run: (agentId: string, runId: string) =>
    [...agentKeys.runs(agentId), runId] as const,
};

// =============================================================================
// Hook
// =============================================================================

export function useAgents(options: UseAgentsOptions = {}): UseAgentsReturn {
  const { filters, enabled = true } = options;
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const queryResult = useQuery<Agent[], ApiError>({
    queryKey: agentKeys.list(filters),
    queryFn: () => fetchAgents(filters),
    enabled,
  });

  const agents = queryResult.data ?? [];

  // ---------------------------------------------------------------------------
  // Create Mutation
  // ---------------------------------------------------------------------------

  const createAgentMutation = useMutation<Agent, ApiError, CreateAgentInput>({
    mutationFn: createAgent,
    
    onMutate: async (newAgent) => {
      await queryClient.cancelQueries({ queryKey: agentKeys.lists() });

      const optimisticAgent = {
        ...newAgent,
        id: `temp-${Date.now()}`,
        status: 'idle' as const,
        lastRunAt: null,
        runCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Agent;

      const context = optimisticAddToList<Agent, CreateAgentInput>(
        agentKeys.list(filters),
        optimisticAgent,
        { prepend: true, queryClient }
      );

      return context;
    },

    onError: (error, variables, context) => {
      if (context) {
        rollbackOptimisticUpdate<Agent[], CreateAgentInput>(
          agentKeys.list(filters),
          context,
          queryClient
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });

  // ---------------------------------------------------------------------------
  // Update Mutation
  // ---------------------------------------------------------------------------

  const updateAgentMutation = useMutation<
    Agent,
    ApiError,
    { id: string; updates: UpdateAgentInput }
  >({
    mutationFn: ({ id, updates }) => updateAgent(id, updates),
    
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: agentKeys.lists() });
      await queryClient.cancelQueries({ queryKey: agentKeys.detail(id) });

      const previousList = queryClient.getQueryData<Agent[]>(agentKeys.lists());
      const previousDetail = queryClient.getQueryData<Agent>(agentKeys.detail(id));

      optimisticUpdateInList<Agent, UpdateAgentInput>(
        agentKeys.list(filters),
        id,
        updates,
        {
          getItemId: (agent) => agent.id,
          queryClient,
        }
      );

      queryClient.setQueryData<Agent>(agentKeys.detail(id), (old) => {
        if (!old) return old;
        return { ...old, ...updates, updatedAt: new Date().toISOString() };
      });

      return { previousList, previousDetail, variables: { id, updates } };
    },

    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(agentKeys.lists(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(agentKeys.detail(variables.id), context.previousDetail);
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
    },
  });

  // ---------------------------------------------------------------------------
  // Delete Mutation
  // ---------------------------------------------------------------------------

  const deleteAgentMutation = useMutation<void, ApiError, string>({
    mutationFn: deleteAgent,
    
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: agentKeys.lists() });

      const context = optimisticRemoveFromList<Agent, string>(
        agentKeys.list(filters),
        id,
        {
          getItemId: (agent) => agent.id,
          queryClient,
        }
      );

      queryClient.removeQueries({ queryKey: agentKeys.detail(id) });
      queryClient.removeQueries({ queryKey: agentKeys.runs(id) });

      return context;
    },

    onError: (error, id, context) => {
      if (context) {
        rollbackOptimisticUpdate<Agent[], string>(
          agentKeys.list(filters),
          context,
          queryClient
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });

  // ---------------------------------------------------------------------------
  // Update Config Mutation
  // ---------------------------------------------------------------------------

  const updateConfigMutation = useMutation<
    Agent,
    ApiError,
    { id: string; config: Partial<AgentConfiguration> }
  >({
    mutationFn: ({ id, config }) =>
      updateAgent(id, { configuration: config }),
    
    onMutate: async ({ id, config }) => {
      await queryClient.cancelQueries({ queryKey: agentKeys.detail(id) });

      const previousDetail = queryClient.getQueryData<Agent>(agentKeys.detail(id));

      queryClient.setQueryData<Agent>(agentKeys.detail(id), (old) => {
        if (!old) return old;
        return {
          ...old,
          configuration: { ...old.configuration, ...config },
          updatedAt: new Date().toISOString(),
        };
      });

      return { previousDetail, variables: { id, config } };
    },

    onError: (error, variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(agentKeys.detail(variables.id), context.previousDetail);
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
    },
  });

  // ---------------------------------------------------------------------------
  // Toggle Active Mutation
  // ---------------------------------------------------------------------------

  const toggleActiveMutation = useMutation<
    Agent,
    ApiError,
    { id: string; isActive: boolean }
  >({
    mutationFn: ({ id, isActive }) => updateAgent(id, { isActive }),
    
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: agentKeys.lists() });

      const previousList = queryClient.getQueryData<Agent[]>(agentKeys.lists());

      optimisticUpdateInList<Agent, { isActive: boolean }>(
        agentKeys.list(filters),
        id,
        { isActive },
        {
          getItemId: (agent) => agent.id,
          queryClient,
        }
      );

      return { previousList, variables: { id, isActive } };
    },

    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(agentKeys.lists(), context.previousList);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
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
    agents,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch,
    createAgent: createAgentMutation,
    updateAgent: updateAgentMutation,
    deleteAgent: deleteAgentMutation,
    updateConfig: updateConfigMutation,
    toggleActive: toggleActiveMutation,
  };
}

// =============================================================================
// Single Agent Hook
// =============================================================================

export interface UseAgentReturn {
  agent: Agent | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  update: UseMutationResult<Agent, ApiError, UpdateAgentInput>;
  delete: UseMutationResult<void, ApiError, void>;
}

export function useAgent(id: string | null, enabled = true): UseAgentReturn {
  const queryClient = useQueryClient();

  const queryResult = useQuery<Agent, ApiError>({
    queryKey: agentKeys.detail(id ?? ''),
    queryFn: () => fetchAgentById(id!),
    enabled: !!id && enabled,
  });

  const updateMutation = useMutation<Agent, ApiError, UpdateAgentInput>({
    mutationFn: (updates) => updateAgent(id!, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(agentKeys.detail(id!), data);
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });

  const deleteMutation = useMutation<void, ApiError, void>({
    mutationFn: () => deleteAgent(id!),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: agentKeys.detail(id!) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });

  return {
    agent: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
    update: updateMutation,
    delete: deleteMutation,
  };
}

// =============================================================================
// Agent Run Hook
// =============================================================================

export function useAgentRun(agentId: string | null): UseAgentRunReturn {
  const queryClient = useQueryClient();

  const runMutation = useMutation<AgentRunResult, ApiError, RunAgentInput>({
    mutationFn: (input) => runAgent(agentId!, input),
    
    onMutate: async () => {
      // Optimistically update agent status
      await queryClient.cancelQueries({ queryKey: agentKeys.detail(agentId!) });

      const previousAgent = queryClient.getQueryData<Agent>(agentKeys.detail(agentId!));

      queryClient.setQueryData<Agent>(agentKeys.detail(agentId!), (old) => {
        if (!old) return old;
        return { ...old, status: 'running' };
      });

      return { previousAgent };
    },

    onSuccess: (data) => {
      // Update agent with completed status
      queryClient.setQueryData<Agent>(agentKeys.detail(agentId!), (old) => {
        if (!old) return old;
        return {
          ...old,
          status: 'idle',
          lastRunAt: new Date().toISOString(),
          runCount: old.runCount + 1,
        };
      });

      // Add run to history
      queryClient.setQueryData<AgentRunResult[]>(
        agentKeys.runs(agentId!),
        (old) => (old ? [data, ...old] : [data])
      );
    },

    onError: (error, variables, context) => {
      // Rollback agent status
      if (context?.previousAgent) {
        queryClient.setQueryData(agentKeys.detail(agentId!), context.previousAgent);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(agentId!) });
      queryClient.invalidateQueries({ queryKey: agentKeys.runs(agentId!) });
    },
  });

  return {
    runAgent: runMutation,
    isRunning: runMutation.isPending,
    lastRun: runMutation.data,
  };
}

// =============================================================================
// Agent Run History Hook
// =============================================================================

export interface UseAgentRunHistoryReturn {
  runs: AgentRunResult[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useAgentRunHistory(
  agentId: string | null,
  enabled = true
): UseAgentRunHistoryReturn {
  const queryResult = useQuery<AgentRunResult[], ApiError>({
    queryKey: agentKeys.runs(agentId ?? ''),
    queryFn: () => getAgentRunHistory(agentId!),
    enabled: !!agentId && enabled,
  });

  return {
    runs: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
  };
}

// =============================================================================
// Agent Run Status Hook
// =============================================================================

export interface UseAgentRunStatusReturn {
  run: AgentRunResult | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useAgentRunStatus(
  agentId: string | null,
  runId: string | null,
  enabled = true,
  pollInterval?: number
): UseAgentRunStatusReturn {
  const queryResult = useQuery<AgentRunResult, ApiError>({
    queryKey: agentKeys.run(agentId ?? '', runId ?? ''),
    queryFn: () => getAgentRunStatus(agentId!, runId!),
    enabled: !!agentId && !!runId && enabled,
    refetchInterval: (query) => {
      if (!pollInterval) return false;
      const data = query.state.data;
      // Stop polling if run is completed or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return pollInterval;
    },
  });

  return {
    run: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: async () => { await queryResult.refetch(); },
  };
}

export default useAgents;
