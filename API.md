# API Documentation

## Base URL

| Environment | URL |
|-------------|-----|
| Production | `https://api.redstick.vc` |
| Staging | `https://staging-api.redstick.vc` |
| Development | `http://localhost:3000/api` |

## Authentication

All API requests (except authentication endpoints) require a valid JWT token in the Authorization header.

```
Authorization: Bearer <token>
```

The token is obtained from the `/api/auth/login` endpoint and expires after 24 hours.

### Refreshing Tokens

When a token expires, you'll receive a `401 Unauthorized` response. Use the refresh token to obtain a new access token:

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh-token>"
}
```

---

## Endpoints

### Deals

#### List All Deals

```http
GET /api/deals
```

Retrieve a paginated list of deals with optional filtering.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `stage` | string | - | Filter by deal stage (INBOUND, SCREENING, FIRST_MEETING, DEEP_DIVE, DUE_DILIGENCE, IC_REVIEW, TERM_SHEET, CLOSED, PASSED) |
| `status` | string | ACTIVE | Filter by status (ACTIVE, INACTIVE, ARCHIVED) |
| `assignedTo` | string | - | Filter by assigned user ID |
| `source` | string | - | Filter by lead source |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `sortBy` | string | createdAt | Sort field (companyName, stage, amount, createdAt, updatedAt) |
| `sortOrder` | string | desc | Sort direction (asc, desc) |
| `search` | string | - | Search by company name (min 2 characters) |

**Example Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.redstick.vc/api/deals?stage=DUE_DILIGENCE&page=1&limit=20"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "deal_abc123",
      "companyName": "TechStart Inc",
      "stage": "DUE_DILIGENCE",
      "status": "ACTIVE",
      "amount": 2500000,
      "description": "B2B SaaS platform for supply chain management",
      "source": "WARM_INTRO",
      "assignedTo": "user_def456",
      "assignedUser": {
        "id": "user_def456",
        "name": "Jane Smith",
        "email": "jane@redstick.vc"
      },
      "companyId": "comp_xyz789",
      "company": {
        "id": "comp_xyz789",
        "name": "TechStart Inc",
        "sector": "Enterprise Software",
        "website": "https://techstart.io"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-02-20T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### Get Deal by ID

```http
GET /api/deals/:id
```

Retrieve a specific deal with full details.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "deal_abc123",
    "companyName": "TechStart Inc",
    "stage": "DUE_DILIGENCE",
    "status": "ACTIVE",
    "amount": 2500000,
    "description": "B2B SaaS platform...",
    "source": "WARM_INTRO",
    "notes": "Strong team, growing market...",
    "assignedTo": "user_def456",
    "assignedUser": {
      "id": "user_def456",
      "name": "Jane Smith",
      "email": "jane@redstick.vc",
      "role": "PARTNER"
    },
    "companyId": "comp_xyz789",
    "company": {
      "id": "comp_xyz789",
      "name": "TechStart Inc",
      "sector": "Enterprise Software",
      "stage": "Series A",
      "website": "https://techstart.io",
      "founded": 2021,
      "employees": 25,
      "valuation": 12000000
    },
    "activities": [
      {
        "id": "act_001",
        "type": "STAGE_CHANGE",
        "description": "Moved from DEEP_DIVE to DUE_DILIGENCE",
        "createdBy": "user_def456",
        "createdAt": "2024-02-20T14:22:00Z"
      }
    ],
    "documents": [
      {
        "id": "doc_001",
        "name": "Pitch Deck.pdf",
        "size": 5242880,
        "uploadedBy": "user_ghi789",
        "uploadedAt": "2024-01-16T09:00:00Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-02-20T14:22:00Z"
  }
}
```

---

#### Create Deal

```http
POST /api/deals
Content-Type: application/json
```

Create a new deal.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `companyName` | string | Yes | Company name (2-100 characters) |
| `stage` | string | Yes | Initial stage |
| `amount` | number | No | Investment amount |
| `description` | string | No | Deal description |
| `source` | string | No | Lead source |
| `assignedTo` | string | No | User ID to assign |
| `companyId` | string | No | Existing company ID |

**Example Request:**
```json
{
  "companyName": "GreenEnergy Co",
  "stage": "INBOUND",
  "amount": 5000000,
  "description": "Renewable energy storage solutions",
  "source": "COLD_OUTREACH",
  "assignedTo": "user_def456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "deal_new123",
    "companyName": "GreenEnergy Co",
    "stage": "INBOUND",
    "status": "ACTIVE",
    "amount": 5000000,
    "description": "Renewable energy storage solutions",
    "source": "COLD_OUTREACH",
    "assignedTo": "user_def456",
    "createdAt": "2024-03-15T09:00:00Z",
    "updatedAt": "2024-03-15T09:00:00Z"
  }
}
```

---

#### Update Deal

```http
PATCH /api/deals/:id
Content-Type: application/json
```

Update an existing deal. Only provided fields are updated.

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `companyName` | string | Company name |
| `stage` | string | Deal stage |
| `status` | string | Deal status |
| `amount` | number | Investment amount |
| `description` | string | Description |
| `assignedTo` | string | User ID to assign (null to unassign) |

**Example Request:**
```json
{
  "stage": "FIRST_MEETING",
  "assignedTo": "user_jkl012"
}
```

**Response:** Same as GET /api/deals/:id

---

#### Delete Deal

```http
DELETE /api/deals/:id
```

Soft-delete a deal (sets status to ARCHIVED).

**Response:**
```json
{
  "success": true,
  "message": "Deal archived successfully"
}
```

---

#### Get Deal Activities

```http
GET /api/deals/:id/activities
```

Get activity history for a deal.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "act_001",
      "type": "STAGE_CHANGE",
      "description": "Moved from INBOUND to SCREENING",
      "metadata": {
        "from": "INBOUND",
        "to": "SCREENING"
      },
      "createdBy": {
        "id": "user_def456",
        "name": "Jane Smith"
      },
      "createdAt": "2024-01-16T14:30:00Z"
    }
  ]
}
```

---

### Companies

#### List All Companies

```http
GET /api/companies
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sector` | string | - | Filter by sector |
| `stage` | string | - | Filter by funding stage |
| `status` | string | ACTIVE | Filter by status |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `sortBy` | string | name | Sort field |
| `sortOrder` | string | asc | Sort direction |
| `search` | string | - | Search by name |

**Response:** Similar to deals list

---

#### Get Company by ID

```http
GET /api/companies/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "comp_xyz789",
    "name": "TechStart Inc",
    "sector": "Enterprise Software",
    "stage": "Series A",
    "website": "https://techstart.io",
    "description": "B2B SaaS platform...",
    "founded": 2021,
    "employees": 25,
    "location": "San Francisco, CA",
    "investment": 3000000,
    "valuation": 12000000,
    "status": "ACTIVE",
    "deals": [
      {
        "id": "deal_abc123",
        "amount": 2500000,
        "stage": "CLOSED",
        "closedAt": "2024-02-15T00:00:00Z"
      }
    ],
    "metrics": {
      "revenue": 2500000,
      "growth": 3.5,
      "burnRate": 150000
    },
    "createdAt": "2024-01-10T00:00:00Z",
    "updatedAt": "2024-02-20T00:00:00Z"
  }
}
```

---

#### Create Company

```http
POST /api/companies
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Company name (2-100 characters) |
| `sector` | string | Yes | Industry sector |
| `stage` | string | Yes | Funding stage |
| `website` | string | No | Company website URL |
| `description` | string | No | Company description |
| `founded` | number | No | Year founded |
| `employees` | number | No | Employee count |
| `location` | string | No | Company location |

---

#### Update Company

```http
PATCH /api/companies/:id
Content-Type: application/json
```

---

#### Delete Company

```http
DELETE /api/companies/:id
```

---

### Agents

#### List All Agents

```http
GET /api/agents
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | - | Filter by status (ACTIVE, INACTIVE, ERROR) |
| `type` | string | - | Filter by type |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "agent_screen_001",
      "name": "Deal Screener",
      "description": "Automated deal screening and scoring",
      "type": "SCREENING",
      "status": "ACTIVE",
      "config": {
        "minRevenue": 1000000,
        "preferredSectors": ["SaaS", "Fintech"]
      },
      "lastRun": "2024-03-15T08:00:00Z",
      "successRate": 94,
      "totalRuns": 128,
      "tokenUsage": 45000,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-03-15T08:00:00Z"
    }
  ]
}
```

---

#### Get Agent by ID

```http
GET /api/agents/:id
```

---

#### Run Agent

```http
POST /api/agents/:id/run
Content-Type: application/json
```

Execute an agent with optional parameters.

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `params` | object | Runtime parameters for the agent |

**Example:**
```json
{
  "params": {
    "dealId": "deal_abc123",
    "focus": "market_analysis"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "runId": "run_xyz789",
    "status": "RUNNING",
    "startedAt": "2024-03-15T10:00:00Z",
    "estimatedDuration": 30
  }
}
```

---

#### Get Agent Run Status

```http
GET /api/agents/runs/:runId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "run_xyz789",
    "agentId": "agent_screen_001",
    "status": "COMPLETED",
    "startedAt": "2024-03-15T10:00:00Z",
    "completedAt": "2024-03-15T10:00:25Z",
    "duration": 25000,
    "tokensUsed": 1250,
    "output": "Deal analysis complete. Score: 85/100...",
    "metrics": {
      "marketScore": 90,
      "teamScore": 80,
      "tractionScore": 85
    }
  }
}
```

---

#### Get Agent Run History

```http
GET /api/agents/:id/runs
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 20 | Number of runs to return |
| `status` | string | - | Filter by status |

---

### Users

#### Get Current User

```http
GET /api/users/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_def456",
    "email": "jane@redstick.vc",
    "name": "Jane Smith",
    "role": "PARTNER",
    "image": "https://...",
    "preferences": {
      "notifications": true,
      "theme": "dark"
    },
    "createdAt": "2023-06-01T00:00:00Z"
  }
}
```

---

#### List Users (Admin Only)

```http
GET /api/users
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `role` | string | Filter by role |
| `status` | string | Filter by status |

---

#### Update User

```http
PATCH /api/users/:id
Content-Type: application/json
```

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | User's name |
| `role` | string | User's role (ADMIN only) |
| `preferences` | object | User preferences |

---

#### Delete User (Admin Only)

```http
DELETE /api/users/:id
```

---

### Authentication

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "ANALYST"
    }
  }
}
```

---

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### Request Password Reset

```http
POST /api/auth/forgot-password
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

#### Reset Password

```http
POST /api/auth/reset-password
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

---

### Dashboard & Analytics

#### Get Dashboard Summary

```http
GET /api/dashboard/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": {
      "totalValue": 47200000,
      "totalCompanies": 24,
      "avgMultiple": 3.2,
      "irr": 28.5
    },
    "pipeline": {
      "activeDeals": 156,
      "avgDealSize": 3200000,
      "conversionRate": 12.5
    },
    "agents": {
      "activeAgents": 5,
      "runsToday": 47,
      "successRate": 92
    },
    "recentActivity": [
      {
        "type": "DEAL_CREATED",
        "description": "New deal: GreenEnergy Co",
        "timestamp": "2024-03-15T09:00:00Z"
      }
    ]
  }
}
```

---

#### Get Portfolio Metrics

```http
GET /api/analytics/portfolio
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startDate` | string | - | Filter start date (ISO 8601) |
| `endDate` | string | - | Filter end date (ISO 8601) |

**Response:**
```json
{
  "success": true,
  "data": {
    "valueOverTime": [
      { "date": "2024-01-01", "value": 42000000 },
      { "date": "2024-02-01", "value": 44500000 },
      { "date": "2024-03-01", "value": 47200000 }
    ],
    "sectorBreakdown": [
      { "sector": "SaaS", "value": 18000000, "percentage": 38 },
      { "sector": "Fintech", "value": 12000000, "percentage": 25 }
    ],
    "stageBreakdown": [
      { "stage": "Series A", "value": 15000000, "count": 8 },
      { "stage": "Series B", "value": 22000000, "count": 6 }
    ],
    "performance": {
      "momentum": 1.15,
      "topPerformer": {
        "company": "CloudScale Inc",
        "return": 4.5
      }
    }
  }
}
```

---

#### Get Pipeline Analytics

```http
GET /api/analytics/pipeline
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dealsByStage": [
      { "stage": "INBOUND", "count": 45, "value": 144000000 },
      { "stage": "DUE_DILIGENCE", "count": 12, "value": 38000000 }
    ],
    "conversionRates": [
      { "from": "INBOUND", "to": "SCREENING", "rate": 65 },
      { "from": "SCREENING", "to": "FIRST_MEETING", "rate": 45 }
    ],
    "avgTimeInStage": [
      { "stage": "INBOUND", "days": 3 },
      { "stage": "DUE_DILIGENCE", "days": 21 }
    ]
  }
}
```

---

### Notifications

#### Get Notifications

```http
GET /api/notifications
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `unreadOnly` | boolean | false | Show only unread |
| `limit` | number | 20 | Number of notifications |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_001",
      "type": "AGENT_COMPLETED",
      "title": "Deal Analysis Complete",
      "message": "Deal Screener finished analyzing TechStart Inc",
      "data": {
        "dealId": "deal_abc123",
        "score": 85
      },
      "read": false,
      "createdAt": "2024-03-15T10:30:00Z"
    }
  ],
  "unreadCount": 5
}
```

---

#### Mark Notification as Read

```http
PATCH /api/notifications/:id/read
```

---

#### Mark All Notifications as Read

```http
POST /api/notifications/read-all
```

---

### Files & Documents

#### Upload File

```http
POST /api/files/upload
Content-Type: multipart/form-data
```

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | File to upload (max 50MB) |
| `entityType` | string | Type of entity (deal, company) |
| `entityId` | string | ID of the entity |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file_abc123",
    "name": "Pitch_Deck.pdf",
    "size": 5242880,
    "url": "https://storage.redstick.vc/files/abc123.pdf",
    "mimeType": "application/pdf",
    "uploadedAt": "2024-03-15T10:00:00Z"
  }
}
```

---

#### List Files

```http
GET /api/files?entityType=deal&entityId=deal_abc123
```

---

#### Delete File

```http
DELETE /api/files/:id
```

---

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "specific error detail"
  },
  "timestamp": "2024-03-15T10:00:00Z",
  "requestId": "req_abc123"
}
```

### HTTP Status Codes

| Status | Meaning | When Used |
|--------|---------|-----------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token, insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (e.g., duplicate email) |
| 422 | Unprocessable | Semantic errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Server error |
| 503 | Service Unavailable | Temporary outage |

### Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `UNAUTHORIZED` | Invalid or missing token | Check Authorization header |
| `FORBIDDEN` | Insufficient permissions | Contact administrator |
| `NOT_FOUND` | Resource not found | Verify resource ID |
| `VALIDATION_ERROR` | Invalid request data | Check request body |
| `DUPLICATE_ENTRY` | Resource already exists | Use different unique value |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry |
| `INTERNAL_ERROR` | Server error | Contact support |
| `SERVICE_UNAVAILABLE` | Temporary outage | Retry after delay |

---

## Rate Limiting

Rate limits are applied per API key/IP address:

| Endpoint Group | Limit | Window |
|---------------|-------|--------|
| Authentication | 10 requests | 1 minute |
| General API | 100 requests | 1 minute |
| File Upload | 10 requests | 1 minute |
| Agent Execution | 20 requests | 1 minute |

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1710504000
```

When rate limited (429), response includes:

```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 45 seconds.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 45
}
```

---

## API Versioning

Current API version: **v1**

Version is specified in the URL path:

```
https://api.redstick.vc/v1/deals
```

### Version Header

Include API version in headers for forward compatibility:

```
API-Version: 1
Accept: application/json
```

### Deprecation Policy

- New versions are released with 6 months notice
- Deprecated versions remain functional for 12 months
- Deprecation warnings include `Sunset` header

```
Sunset: Sat, 01 Jan 2025 00:00:00 GMT
Deprecation: true
```

---

## Pagination

All list endpoints support cursor-based and offset pagination.

### Offset Pagination (Default)

Use `page` and `limit` parameters:

```http
GET /api/deals?page=2&limit=20
```

### Cursor Pagination

For large datasets, use cursor pagination:

```http
GET /api/deals?cursor=eyJpZCI6ImRlYWxfMTIzIn0&limit=20
```

Response includes:

```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6ImRlYWxfNDU2In0",
    "hasMore": true
  }
}
```

### Link Headers

RFC 5988 Link headers are included:

```
Link: </api/deals?page=2>; rel="next",
      </api/deals?page=10>; rel="last",
      </api/deals?page=1>; rel="first"
```

---

## Filtering & Sorting

### Filtering

Multiple filters can be combined:

```http
GET /api/deals?stage=DUE_DILIGENCE&status=ACTIVE&minAmount=1000000
```

### Sorting

Use `sortBy` and `sortOrder`:

```http
GET /api/deals?sortBy=amount&sortOrder=desc
```

Multiple sort fields:

```http
GET /api/deals?sort=stage:asc,createdAt:desc
```

---

## SDKs & Libraries

Official SDKs:

| Language | Package | Installation |
|----------|---------|--------------|
| JavaScript/TypeScript | `@redstick/sdk` | `npm install @redstick/sdk` |
| Python | `redstick-py` | `pip install redstick-py` |

See `/docs/api/examples.md` for detailed SDK usage examples.

---

## Support

For API support:
- Documentation: https://docs.redstick.vc
- Status: https://status.redstick.vc
- Contact: api-support@redstick.vc
