# Webhook Documentation

Real-time event notifications for the Redstick Ventures Command Center API.

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Event Types](#event-types)
- [Payload Structure](#payload-structure)
- [Security](#security)
- [Delivery & Retries](#delivery--retries)
- [Best Practices](#best-practices)
- [Testing Webhooks](#testing-webhooks)

---

## Overview

Webhooks allow your application to receive real-time notifications when events occur in the Redstick Ventures Command Center. Instead of polling for changes, you can register a webhook URL to receive HTTP POST requests whenever specific events happen.

### Use Cases

- Sync deal data to external CRM systems
- Send Slack notifications on deal stage changes
- Trigger email alerts for agent run completions
- Update internal dashboards in real-time
- Log audit events to external systems

---

## Configuration

### Registering a Webhook

Webhooks are configured via the API or through the Command Center dashboard.

#### API Endpoint

```http
POST /api/v1/webhooks
```

#### Request Body

```json
{
  "url": "https://your-app.com/webhooks/redstick",
  "events": ["deal.updated", "agent.run.completed"],
  "secret": "your_webhook_secret",
  "description": "Production webhook handler",
  "active": true,
  "metadata": {
    "team": "investment",
    "priority": "high"
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "whk_abc123",
    "url": "https://your-app.com/webhooks/redstick",
    "events": ["deal.updated", "agent.run.completed"],
    "active": true,
    "createdAt": "2024-03-28T10:00:00Z"
  }
}
```

### Managing Webhooks

#### List Webhooks

```http
GET /api/v1/webhooks
```

#### Update Webhook

```http
PATCH /api/v1/webhooks/:id
```

```json
{
  "events": ["deal.updated", "deal.created", "agent.run.completed"],
  "active": true
}
```

#### Delete Webhook

```http
DELETE /api/v1/webhooks/:id
```

#### Test Webhook

```http
POST /api/v1/webhooks/:id/test
```

Sends a test event to verify your webhook endpoint is working correctly.

---

## Event Types

### Deal Events

| Event | Description |
|-------|-------------|
| `deal.created` | A new deal was created |
| `deal.updated` | A deal was updated |
| `deal.stage_changed` | A deal moved to a different stage |
| `deal.assigned` | A deal was assigned to a user |
| `deal.archived` | A deal was archived |
| `deal.restored` | An archived deal was restored |
| `deal.deleted` | A deal was permanently deleted |

### Company Events

| Event | Description |
|-------|-------------|
| `company.created` | A new company was added |
| `company.updated` | Company information was updated |
| `company.merged` | Two companies were merged |
| `company.deleted` | A company was deleted |

### Agent Events

| Event | Description |
|-------|-------------|
| `agent.run.queued` | An agent run was queued |
| `agent.run.started` | An agent run started executing |
| `agent.run.completed` | An agent run completed successfully |
| `agent.run.failed` | An agent run failed |
| `agent.run.cancelled` | An agent run was cancelled |

### User Events

| Event | Description |
|-------|-------------|
| `user.created` | A new user account was created |
| `user.updated` | User profile was updated |
| `user.login` | User logged in |
| `user.logout` | User logged out |

### Activity Events

| Event | Description |
|-------|-------------|
| `activity.created` | A new activity was logged |
| `activity.updated` | An activity was updated |
| `activity.deleted` | An activity was deleted |

### File Events

| Event | Description |
|-------|-------------|
| `file.uploaded` | A new file was uploaded |
| `file.deleted` | A file was deleted |

### Notification Events

| Event | Description |
|-------|-------------|
| `notification.created` | A notification was created |

---

## Payload Structure

### Standard Webhook Payload

All webhook events follow this structure:

```json
{
  "id": "evt_abc123",
  "type": "deal.stage_changed",
  "timestamp": "2024-03-28T10:30:00Z",
  "webhookId": "whk_def456",
  "data": {
    // Event-specific data
  }
}
```

### Deal Events

#### deal.created

```json
{
  "id": "evt_abc123",
  "type": "deal.created",
  "timestamp": "2024-03-28T10:30:00Z",
  "webhookId": "whk_def456",
  "data": {
    "deal": {
      "id": "deal_xyz789",
      "companyId": "comp_abc123",
      "companyName": "Acme Corp",
      "stage": "lead",
      "status": "active",
      "amount": 2500000,
      "assignedTo": "user_def456",
      "createdBy": "user_def456",
      "createdAt": "2024-03-28T10:30:00Z"
    },
    "actor": {
      "id": "user_def456",
      "name": "Jane Doe",
      "email": "jane@redstick.vc"
    }
  }
}
```

#### deal.updated

```json
{
  "id": "evt_abc124",
  "type": "deal.updated",
  "timestamp": "2024-03-28T11:00:00Z",
  "webhookId": "whk_def456",
  "data": {
    "deal": {
      "id": "deal_xyz789",
      "companyName": "Acme Corp",
      "stage": "duediligence",
      "probability": 65,
      "updatedAt": "2024-03-28T11:00:00Z"
    },
    "previous": {
      "stage": "pitch",
      "probability": 40
    },
    "changes": ["stage", "probability"],
    "actor": {
      "id": "user_def456",
      "name": "Jane Doe",
      "email": "jane@redstick.vc"
    }
  }
}
```

#### deal.stage_changed

```json
{
  "id": "evt_abc125",
  "type": "deal.stage_changed",
  "timestamp": "2024-03-28T11:00:00Z",
  "webhookId": "whk_def456",
  "data": {
    "deal": {
      "id": "deal_xyz789",
      "companyName": "Acme Corp",
      "stage": "duediligence"
    },
    "previousStage": "pitch",
    "newStage": "duediligence",
    "actor": {
      "id": "user_def456",
      "name": "Jane Doe",
      "email": "jane@redstick.vc"
    }
  }
}
```

### Agent Events

#### agent.run.queued

```json
{
  "id": "evt_abc126",
  "type": "agent.run.queued",
  "timestamp": "2024-03-28T11:15:00Z",
  "webhookId": "whk_def456",
  "data": {
    "run": {
      "id": "run_ghi789",
      "agentId": "agent_due_diligence_001",
      "agentName": "Due Diligence Analyzer",
      "status": "queued",
      "inputs": {
        "companyId": "comp_abc123",
        "focusAreas": ["financials", "market"]
      },
      "estimatedStart": "2024-03-28T11:16:00Z",
      "queuePosition": 3
    },
    "actor": {
      "id": "user_def456",
      "name": "Jane Doe",
      "email": "jane@redstick.vc"
    }
  }
}
```

#### agent.run.completed

```json
{
  "id": "evt_abc127",
  "type": "agent.run.completed",
  "timestamp": "2024-03-28T11:25:00Z",
  "webhookId": "whk_def456",
  "data": {
    "run": {
      "id": "run_ghi789",
      "agentId": "agent_due_diligence_001",
      "agentName": "Due Diligence Analyzer",
      "status": "completed",
      "inputs": {
        "companyId": "comp_abc123"
      },
      "outputs": {
        "score": 85,
        "recommendation": "Proceed with investment",
        "analysis": {
          "marketSize": "Large and growing",
          "competition": "Moderate",
          "team": "Strong technical background"
        },
        "risks": ["Market timing", "Customer concentration"],
        "opportunities": ["Expansion potential", "Strategic partnerships"]
      },
      "startedAt": "2024-03-28T11:15:00Z",
      "completedAt": "2024-03-28T11:25:00Z",
      "duration": 600
    },
    "relatedDealId": "deal_xyz789",
    "actor": {
      "id": "user_def456",
      "name": "Jane Doe",
      "email": "jane@redstick.vc"
    }
  }
}
```

#### agent.run.failed

```json
{
  "id": "evt_abc128",
  "type": "agent.run.failed",
  "timestamp": "2024-03-28T11:20:00Z",
  "webhookId": "whk_def456",
  "data": {
    "run": {
      "id": "run_ghi790",
      "agentId": "agent_due_diligence_001",
      "agentName": "Due Diligence Analyzer",
      "status": "failed",
      "inputs": {
        "companyId": "comp_abc123"
      },
      "error": {
        "message": "Failed to fetch market data",
        "code": "DATA_FETCH_ERROR",
        "details": {
          "source": "crunchbase",
          "retryable": true
        }
      },
      "startedAt": "2024-03-28T11:15:00Z",
      "failedAt": "2024-03-28T11:20:00Z",
      "duration": 300
    },
    "actor": {
      "id": "user_def456",
      "name": "Jane Doe"
    }
  }
}
```

### User Events

#### user.created

```json
{
  "id": "evt_abc129",
  "type": "user.created",
  "timestamp": "2024-03-28T12:00:00Z",
  "webhookId": "whk_def456",
  "data": {
    "user": {
      "id": "user_new789",
      "name": "John Smith",
      "email": "john@redstick.vc",
      "role": "analyst",
      "status": "pending"
    },
    "actor": {
      "id": "user_admin001",
      "name": "Admin User"
    }
  }
}
```

---

## Security

### Signature Verification

All webhook requests include a signature header for verification. You should verify this signature to ensure the request came from Redstick.

#### Headers

| Header | Description |
|--------|-------------|
| `X-Webhook-Signature` | HMAC-SHA256 signature of the payload |
| `X-Webhook-Timestamp` | Unix timestamp of when the webhook was sent |
| `X-Webhook-Id` | Unique ID for this webhook delivery |
| `X-Webhook-Event` | Event type being delivered |
| `X-Webhook-Retry` | Retry count (0 for first attempt) |

#### Verifying Signatures

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  timestamp: string,
  toleranceSeconds: number = 300 // 5 minutes
): boolean {
  // Check timestamp to prevent replay attacks
  const now = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp, 10);
  
  if (Math.abs(now - webhookTime) > toleranceSeconds) {
    throw new Error('Webhook timestamp too old');
  }

  // Create expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express middleware example
function webhookMiddleware(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;
    const payload = JSON.stringify(req.body);

    if (!signature || !timestamp) {
      return res.status(401).json({ error: 'Missing signature headers' });
    }

    try {
      const isValid = verifyWebhookSignature(payload, signature, secret, timestamp);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };
}
```

#### Python Example

```python
import hmac
import hashlib
import time
from flask import request, abort

def verify_webhook_signature(payload: str, signature: str, secret: str, timestamp: str, tolerance_seconds: int = 300) -> bool:
    # Check timestamp
    now = int(time.time())
    webhook_time = int(timestamp)
    
    if abs(now - webhook_time) > tolerance_seconds:
        raise ValueError("Webhook timestamp too old")
    
    # Create expected signature
    signed_payload = f"{timestamp}.{payload}"
    expected_signature = hmac.new(
        secret.encode(),
        signed_payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

@app.route('/webhooks/redstick', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Webhook-Signature')
    timestamp = request.headers.get('X-Webhook-Timestamp')
    
    if not signature or not timestamp:
        abort(401, 'Missing signature headers')
    
    payload = request.get_data(as_text=True)
    
    try:
        if not verify_webhook_signature(payload, signature, WEBHOOK_SECRET, timestamp):
            abort(401, 'Invalid signature')
    except ValueError as e:
        abort(401, str(e))
    
    # Process webhook
    return '', 200
```

### IP Allowlisting

For additional security, you can restrict webhook requests to come from Redstick's IP addresses:

```
Production: 52.0.0.0/8, 54.0.0.0/8
Staging: 3.0.0.0/8
```

---

## Delivery & Retries

### Delivery Attempts

If your endpoint returns a non-2xx status code or times out, we will retry the delivery:

| Attempt | Delay After Previous |
|---------|---------------------|
| 1 | Immediate |
| 2 | 5 seconds |
| 3 | 25 seconds |
| 4 | 2 minutes |
| 5 | 10 minutes |

Maximum: 5 attempts over approximately 12 minutes.

### Retry Headers

```
X-Webhook-Retry: 2
X-Webhook-Original-Timestamp: 1711623000
```

### Handling Duplicates

Webhook deliveries may occasionally be duplicated. Use the `X-Webhook-Id` header to deduplicate:

```typescript
const processedWebhooks = new Set<string>();

app.post('/webhooks/redstick', (req, res) => {
  const webhookId = req.headers['x-webhook-id'] as string;
  
  if (processedWebhooks.has(webhookId)) {
    return res.status(200).json({ message: 'Already processed' });
  }
  
  // Process webhook
  processWebhook(req.body);
  
  // Mark as processed (with cleanup)
  processedWebhooks.add(webhookId);
  setTimeout(() => processedWebhooks.delete(webhookId), 3600000); // Clean after 1 hour
  
  res.status(200).json({ success: true });
});
```

### Timeouts

Your endpoint should respond within **10 seconds**. Responses taking longer will be treated as failures and retried.

---

## Best Practices

### 1. Respond Quickly

Always return a 2xx status code immediately, then process the webhook asynchronously:

```typescript
app.post('/webhooks/redstick', async (req, res) => {
  // Acknowledge receipt immediately
  res.status(202).json({ received: true });
  
  // Process asynchronously
  await queueWebhookForProcessing(req.body);
});
```

### 2. Handle Events Idempotently

Design your handlers to be safe if called multiple times with the same event.

### 3. Validate Payloads

Always verify signatures and validate event data structure.

### 4. Log Everything

Log webhook deliveries for debugging and auditing:

```typescript
logger.info('Webhook received', {
  eventId: req.body.id,
  eventType: req.body.type,
  webhookId: req.headers['x-webhook-id'],
  timestamp: req.body.timestamp,
});
```

### 5. Use HTTPS

Only use HTTPS endpoints for webhooks in production.

### 6. Implement Circuit Breakers

If your service is down, temporarily disable webhooks:

```typescript
// Health check before processing
if (!isServiceHealthy()) {
  return res.status(503).json({ error: 'Service unavailable' });
}
```

---

## Testing Webhooks

### Local Development with ngrok

```bash
# Start ngrok to expose local server
ngrok http 3000

# Register webhook with ngrok URL
curl -X POST https://api.redstick.vc/api/v1/webhooks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://abc123.ngrok.io/webhooks/redstick",
    "events": ["deal.created"],
    "secret": "dev_secret"
  }'
```

### Using the Test Endpoint

```bash
# Send test event
curl -X POST https://api.redstick.vc/api/v1/webhooks/whk_def456/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Webhook Inspector

Use the dashboard to inspect recent webhook deliveries:

```http
GET /api/v1/webhooks/:id/deliveries
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "del_xyz789",
      "eventId": "evt_abc123",
      "eventType": "deal.created",
      "status": "delivered",
      "httpStatusCode": 200,
      "attempts": 1,
      "sentAt": "2024-03-28T10:30:00Z",
      "deliveredAt": "2024-03-28T10:30:01Z",
      "responseBody": "{\"received\":true}"
    }
  ]
}
```

---

## Example Implementations

### Slack Notification Handler

```typescript
import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_TOKEN);

async function handleDealStageChange(payload: WebhookPayload) {
  if (payload.type !== 'deal.stage_changed') return;

  const { deal, previousStage, newStage, actor } = payload.data;

  const stageEmoji: Record<string, string> = {
    lead: '🌱',
    qualified: '🔍',
    pitch: '📊',
    duediligence: '🔬',
    negotiation: '🤝',
    closed: '✅',
    passed: '❌',
  };

  await slack.chat.postMessage({
    channel: '#deals',
    text: `${stageEmoji[newStage]} Deal stage updated`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${stageEmoji[newStage]} ${deal.companyName}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*From:*\n${previousStage}`,
          },
          {
            type: 'mrkdwn',
            text: `*To:*\n${newStage}`,
          },
          {
            type: 'mrkdwn',
            text: `*Updated by:*\n${actor.name}`,
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Deal',
            },
            url: `https://redstick.vc/deals/${deal.id}`,
          },
        ],
      },
    ],
  });
}
```

### CRM Sync Handler

```typescript
async function handleDealCreated(payload: WebhookPayload) {
  if (payload.type !== 'deal.created') return;

  const { deal } = payload.data;

  // Sync to external CRM
  await salesforce.createOpportunity({
    Name: deal.companyName,
    StageName: mapStage(deal.stage),
    Amount: deal.amount,
    LeadSource: deal.source,
    CloseDate: deal.expectedCloseDate,
    Redstick_Deal_ID__c: deal.id,
  });

  // Log sync
  await auditLog.create({
    action: 'crm_sync',
    entity: 'deal',
    entityId: deal.id,
    status: 'success',
    timestamp: new Date(),
  });
}
```

### Database Event Log

```typescript
async function logWebhookEvent(payload: WebhookPayload) {
  await db.webhookEvents.create({
    data: {
      eventId: payload.id,
      eventType: payload.type,
      timestamp: new Date(payload.timestamp),
      payload: payload.data,
      processed: false,
    },
  });
}
```
