# API Code Examples

Copy-paste ready code examples for the Redstick Ventures Command Center API.

## Table of Contents

- [Authentication](#authentication)
- [Deals](#deals)
- [Companies](#companies)
- [Agents](#agents)
- [Error Handling](#error-handling)
- [TypeScript Types](#typescript-types)

---

## Base Configuration

```typescript
// config/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.redstick.vc/api/v1';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
```

---

## Authentication

### Login

#### Fetch API

```typescript
async function login(email: string, password: string, mfaCode?: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ email, password, mfaCode }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const { data } = await response.json();
  
  // Store tokens
  localStorage.setItem('accessToken', data.tokens.accessToken);
  localStorage.setItem('refreshToken', data.tokens.refreshToken);
  
  return data.user;
}

// Usage
const user = await login('jane@redstick.vc', 'password123');
```

#### Axios

```typescript
import axios from 'axios';

async function login(email: string, password: string, mfaCode?: string) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
      mfaCode,
    });

    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

    return data.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
    throw error;
  }
}
```

#### TanStack Query (React Query)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string; mfaCode?: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      queryClient.setQueryData(['user'], data.data.user);
    },
  });
};

// Usage in component
function LoginComponent() {
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
}
```

#### cURL

```bash
curl -X POST https://api.redstick.vc/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@redstick.vc",
    "password": "password123"
  }'
```

---

### Refresh Token

```typescript
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    // Clear tokens and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const { data } = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  
  return data.accessToken;
}
```

---

### Logout

```typescript
async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { ...defaultHeaders, ...getAuthHeaders() },
    });
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
}
```

---

## Deals

### List Deals

#### Fetch API

```typescript
interface ListDealsParams {
  stage?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

async function listDeals(params: ListDealsParams = {}) {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v != null) as string[][]
  ).toString();

  const response = await fetch(`${API_BASE_URL}/deals?${queryString}`, {
    headers: { ...defaultHeaders, ...getAuthHeaders() },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch deals');
  }

  return response.json();
}

// Usage
const deals = await listDeals({ stage: 'duediligence', limit: 50 });
```

#### TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query';

const useDeals = (params: ListDealsParams = {}) => {
  return useQuery({
    queryKey: ['deals', params],
    queryFn: async () => {
      const queryString = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v != null) as string[][]
      ).toString();

      const response = await fetch(`${API_BASE_URL}/deals?${queryString}`, {
        headers: { ...defaultHeaders, ...getAuthHeaders() },
      });

      if (!response.ok) throw new Error('Failed to fetch deals');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Usage in component
function DealsList() {
  const { data, isLoading, error } = useDeals({ stage: 'duediligence' });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.data?.map((deal) => (
        <li key={deal.id}>{deal.companyName}</li>
      ))}
    </ul>
  );
}
```

#### cURL

```bash
# List all deals
curl https://api.redstick.vc/api/v1/deals \
  -H "Authorization: Bearer YOUR_TOKEN"

# List with filters
curl "https://api.redstick.vc/api/v1/deals?stage=duediligence&status=active&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Create Deal

```typescript
interface CreateDealInput {
  companyName: string;
  companyId?: string;
  stage: string;
  status?: string;
  amount?: number;
  description?: string;
  source?: string;
  probability?: number;
  expectedCloseDate?: string;
  assignedTo?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

async function createDeal(input: CreateDealInput) {
  const response = await fetch(`${API_BASE_URL}/deals`, {
    method: 'POST',
    headers: { ...defaultHeaders, ...getAuthHeaders() },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create deal');
  }

  return response.json();
}

// Usage
try {
  const result = await createDeal({
    companyName: 'Acme Corp',
    stage: 'lead',
    amount: 2500000,
    description: 'Investment opportunity',
    source: 'referral',
    tags: ['saas', 'b2b'],
  });
  console.log('Created deal:', result.data);
} catch (error) {
  console.error('Error creating deal:', error.message);
}
```

#### cURL

```bash
curl -X POST https://api.redstick.vc/api/v1/deals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Corp",
    "stage": "lead",
    "amount": 2500000,
    "description": "Investment opportunity",
    "source": "referral",
    "tags": ["saas", "b2b"]
  }'
```

---

### Update Deal

```typescript
async function updateDeal(id: string, updates: Partial<CreateDealInput>) {
  const response = await fetch(`${API_BASE_URL}/deals/${id}`, {
    method: 'PATCH',
    headers: { ...defaultHeaders, ...getAuthHeaders() },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update deal');
  }

  return response.json();
}

// Usage
await updateDeal('deal_abc123', {
  stage: 'negotiation',
  probability: 80,
});
```

#### TanStack Query Mutation

```typescript
const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateDealInput> }) =>
      updateDeal(id, updates),
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', variables.id] });
    },
  });
};
```

---

### Delete Deal

```typescript
async function deleteDeal(id: string, permanent = false) {
  const response = await fetch(
    `${API_BASE_URL}/deals/${id}?permanent=${permanent}`,
    {
      method: 'DELETE',
      headers: { ...defaultHeaders, ...getAuthHeaders() },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete deal');
  }

  return response.json();
}
```

---

## Companies

### List Companies

```typescript
interface ListCompaniesParams {
  industry?: string;
  stage?: string;
  search?: string;
  hasDeal?: boolean;
  page?: number;
  limit?: number;
}

async function listCompanies(params: ListCompaniesParams = {}) {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v != null).map(([k, v]) => [k, String(v)])
  ).toString();

  const response = await fetch(`${API_BASE_URL}/companies?${queryString}`, {
    headers: { ...defaultHeaders, ...getAuthHeaders() },
  });

  return response.json();
}
```

### Create Company

```typescript
interface CreateCompanyInput {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  foundedYear?: number;
  employees?: number;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  founders?: Array<{
    name: string;
    title?: string;
  }>;
}

async function createCompany(input: CreateCompanyInput) {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: { ...defaultHeaders, ...getAuthHeaders() },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create company');
  }

  return response.json();
}
```

#### cURL

```bash
curl -X POST https://api.redstick.vc/api/v1/companies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "description": "Enterprise SaaS platform",
    "website": "https://acme.com",
    "industry": "Software",
    "foundedYear": 2020,
    "employees": 50,
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA"
    }
  }'
```

---

## Agents

### List Agents

```typescript
async function listAgents(category?: string) {
  const params = category ? `?category=${category}` : '';
  
  const response = await fetch(`${API_BASE_URL}/agents${params}`, {
    headers: { ...defaultHeaders, ...getAuthHeaders() },
  });

  return response.json();
}
```

### Run Agent

```typescript
interface RunAgentInput {
  inputs: Record<string, unknown>;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

async function runAgent(agentId: string, input: RunAgentInput) {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}/run`, {
    method: 'POST',
    headers: { ...defaultHeaders, ...getAuthHeaders() },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to start agent');
  }

  return response.json();
}

// Usage
const result = await runAgent('agent_due_diligence_001', {
  inputs: {
    companyId: 'comp_xyz789',
    focusAreas: ['financials', 'market'],
    depth: 'standard',
  },
  metadata: {
    dealId: 'deal_abc123',
    requestedBy: 'user_def456',
  },
});

console.log('Agent run queued:', result.data.runId);
```

#### cURL

```bash
curl -X POST https://api.redstick.vc/api/v1/agents/agent_due_diligence_001/run \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {
      "companyId": "comp_xyz789",
      "focusAreas": ["financials", "market"],
      "depth": "standard"
    },
    "metadata": {
      "dealId": "deal_abc123"
    }
  }'
```

### Get Agent Run Status

```typescript
async function getAgentRun(runId: string) {
  const response = await fetch(`${API_BASE_URL}/agents/runs/${runId}`, {
    headers: { ...defaultHeaders, ...getAuthHeaders() },
  });

  return response.json();
}

// Poll for completion
async function waitForAgentCompletion(runId: string, interval = 5000) {
  return new Promise((resolve, reject) => {
    const check = async () => {
      const result = await getAgentRun(runId);
      const status = result.data.status;

      if (status === 'completed') {
        resolve(result.data);
      } else if (status === 'failed') {
        reject(new Error('Agent execution failed'));
      } else {
        setTimeout(check, interval);
      }
    };

    check();
  });
}

// Usage
const run = await runAgent('agent_due_diligence_001', { inputs: { companyId: 'comp_xyz789' } });
const result = await waitForAgentCompletion(run.data.runId);
console.log('Agent result:', result.outputs);
```

---

## Error Handling

### Global Error Handler

```typescript
interface ApiError {
  success: false;
  error: string;
  code: string;
  details?: Record<string, unknown>;
  requestId?: string;
}

class ApiErrorHandler extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Record<string, unknown>,
    public requestId?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    
    // Handle specific error codes
    switch (error.code) {
      case 'UNAUTHORIZED':
      case 'TOKEN_EXPIRED':
        // Redirect to login
        window.location.href = '/login';
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Retry with backoff
        const retryAfter = error.details?.retryAfter || 60;
        console.warn(`Rate limited. Retry after ${retryAfter}s`);
        break;
    }

    throw new ApiErrorHandler(
      error.error,
      error.code,
      response.status,
      error.details,
      error.requestId
    );
  }

  return data;
}
```

### Axios Interceptors

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: defaultHeaders,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## TypeScript Types

```typescript
// types/api.ts

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  meta?: Record<string, unknown>;
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  department?: string;
  title?: string;
  phone?: string;
  lastLoginAt?: string;
  createdAt: string;
}

// Deal
export type DealStage = 'lead' | 'qualified' | 'pitch' | 'duediligence' | 'negotiation' | 'closed' | 'passed';
export type DealStatus = 'active' | 'onhold' | 'archived';

export interface Deal {
  id: string;
  companyId?: string;
  companyName: string;
  stage: DealStage;
  status: DealStatus;
  amount?: number;
  description?: string;
  source?: string;
  sourceDetail?: string;
  probability?: number;
  expectedCloseDate?: string;
  assignedTo?: string;
  assignee?: User;
  tags: string[];
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastActivityAt?: string;
}

// Company
export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  subIndustry?: string;
  stage?: string;
  foundedYear?: number;
  employees?: number;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
  founders?: Array<{
    name: string;
    title?: string;
    linkedin?: string;
  }>;
  fundingHistory?: unknown[];
  metrics?: {
    revenue?: number;
    growthRate?: number;
    customers?: number;
  };
  dealCount?: number;
  activeDealId?: string;
  createdAt: string;
  updatedAt: string;
}

// Agent
export interface Agent {
  id: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  status: 'active' | 'inactive';
  capabilities: string[];
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  avgExecutionTime?: number;
  successRate?: number;
  createdAt: string;
}

export interface AgentRun {
  id: string;
  agentId: string;
  agentName: string;
  status: 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  inputs: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  logs?: Array<{
    timestamp: string;
    level: string;
    message: string;
  }>;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  createdBy: string;
}

// Activity
export interface Activity {
  id: string;
  type: 'meeting' | 'call' | 'email' | 'note' | 'task' | 'document' | 'status_change';
  title: string;
  description?: string;
  date?: string;
  duration?: number;
  participants?: string[];
  outcome?: string;
  nextSteps?: string;
  createdBy: string;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

// File
export interface File {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  createdAt: string;
}

// Dashboard
export interface DashboardData {
  pipeline: {
    totalDeals: number;
    totalValue: number;
    byStage: Record<string, { count: number; value: number }>;
  };
  activities: {
    totalThisPeriod: number;
    byType: Record<string, number>;
  };
  agents: {
    activeRuns: number;
    completedToday: number;
    avgExecutionTime: number;
  };
  upcoming: Array<{
    type: string;
    title: string;
    date: string;
  }>;
}
```

---

## React Hook Examples

### useApi Hook

```typescript
// hooks/useApi.ts
import { useCallback } from 'react';

export function useApi() {
  const fetchWithAuth = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    return handleApiResponse(response);
  }, []);

  return { fetchWithAuth };
}
```

### useDeals Hook

```typescript
// hooks/useDeals.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Deal, CreateDealInput } from '@/types/api';

const DEALS_KEY = 'deals';

export function useDeals(params: ListDealsParams = {}) {
  return useQuery<ApiResponse<Deal[]>>({
    queryKey: [DEALS_KEY, params],
    queryFn: () => listDeals(params),
  });
}

export function useDeal(id: string) {
  return useQuery<ApiResponse<Deal>>({
    queryKey: [DEALS_KEY, id],
    queryFn: () => fetch(`${API_BASE_URL}/deals/${id}`, {
      headers: { ...defaultHeaders, ...getAuthHeaders() },
    }).then(r => r.json()),
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEALS_KEY] });
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateDealInput> }) =>
      updateDeal(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DEALS_KEY] });
      queryClient.invalidateQueries({ queryKey: [DEALS_KEY, variables.id] });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEALS_KEY] });
    },
  });
}
```

---

## Python Examples

```python
import requests
from typing import Optional, Dict, Any

BASE_URL = "https://api.redstick.vc/api/v1"

class RedstickApiClient:
    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "Accept": "application/json",
        })
        if token:
            self.session.headers["Authorization"] = f"Bearer {token}"

    def login(self, email: str, password: str) -> Dict[str, Any]:
        response = self.session.post(
            f"{BASE_URL}/auth/login",
            json={"email": email, "password": password}
        )
        response.raise_for_status()
        data = response.json()
        
        self.token = data["data"]["tokens"]["accessToken"]
        self.session.headers["Authorization"] = f"Bearer {self.token}"
        
        return data["data"]["user"]

    def list_deals(self, **params) -> Dict[str, Any]:
        response = self.session.get(f"{BASE_URL}/deals", params=params)
        response.raise_for_status()
        return response.json()

    def create_deal(self, deal_data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.session.post(f"{BASE_URL}/deals", json=deal_data)
        response.raise_for_status()
        return response.json()

    def get_deal(self, deal_id: str) -> Dict[str, Any]:
        response = self.session.get(f"{BASE_URL}/deals/{deal_id}")
        response.raise_for_status()
        return response.json()

    def update_deal(self, deal_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        response = self.session.patch(f"{BASE_URL}/deals/{deal_id}", json=updates)
        response.raise_for_status()
        return response.json()

    def delete_deal(self, deal_id: str) -> Dict[str, Any]:
        response = self.session.delete(f"{BASE_URL}/deals/{deal_id}")
        response.raise_for_status()
        return response.json()

    def run_agent(self, agent_id: str, inputs: Dict[str, Any]) -> Dict[str, Any]:
        response = self.session.post(
            f"{BASE_URL}/agents/{agent_id}/run",
            json={"inputs": inputs}
        )
        response.raise_for_status()
        return response.json()

# Usage
client = RedstickApiClient()
client.login("jane@redstick.vc", "password123")

deals = client.list_deals(stage="duediligence", limit=20)
print(f"Found {deals['pagination']['total']} deals")

new_deal = client.create_deal({
    "companyName": "Acme Corp",
    "stage": "lead",
    "amount": 2500000,
    "source": "referral"
})
print(f"Created deal: {new_deal['data']['id']}")
```
