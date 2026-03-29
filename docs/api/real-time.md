# Real-time Features

Real-time communication options for the Redstick Ventures Command Center API.

## Table of Contents

- [Overview](#overview)
- [Server-Sent Events (SSE)](#server-sent-events-sse)
- [WebSocket Connections](#websocket-connections)
- [Choosing Between SSE and WebSocket](#choosing-between-sse-and-websocket)
- [Error Handling](#error-handling)

---

## Overview

The Redstick Ventures Command Center provides two real-time communication mechanisms:

1. **Server-Sent Events (SSE)** - For server-to-client push notifications
2. **WebSocket Connections** - For bidirectional real-time communication (agent logs, live updates)

---

## Server-Sent Events (SSE)

SSE provides a one-way stream of events from server to client. Ideal for notifications and live updates.

### Connection Endpoint

```
GET /api/v1/events/stream
```

### Headers

```
Authorization: Bearer <token>
Accept: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

### Event Types

| Event | Description |
|-------|-------------|
| `notification` | New notification for the user |
| `deal.update` | Deal data has changed |
| `agent.status` | Agent run status update |
| `pipeline.update` | Pipeline metrics updated |
| `user.presence` | User online/offline status |

### JavaScript Client Example

```typescript
// services/sse.ts
class SSEClient {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token: string): void {
    const url = `https://api.redstick.vc/api/v1/events/stream?token=${encodeURIComponent(token)}`;
    
    this.eventSource = new EventSource(url);
    
    this.eventSource.onopen = () => {
      console.log('SSE connection established');
      this.reconnectAttempts = 0;
    };
    
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };
    
    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.handleReconnect();
    };
  }

  private handleMessage(data: any): void {
    const listeners = this.listeners.get(data.type);
    if (listeners) {
      listeners.forEach(callback => callback(data.payload));
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(localStorage.getItem('token') || ''), delay);
    } else {
      console.error('Max reconnect attempts reached');
    }
  }

  on(eventType: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
  }
}

// React Hook
import { useEffect, useRef, useCallback } from 'react';

export function useSSE(eventType: string, callback: (data: any) => void) {
  const sseRef = useRef<SSEClient>(new SSEClient());
  const callbackRef = useRef(callback);
  
  callbackRef.current = callback;
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    const client = sseRef.current;
    client.connect(token);
    
    const unsubscribe = client.on(eventType, (data) => {
      callbackRef.current(data);
    });
    
    return () => {
      unsubscribe();
      client.disconnect();
    };
  }, [eventType]);
}

// Usage
function NotificationsComponent() {
  const [notifications, setNotifications] = useState([]);
  
  useSSE('notification', (payload) => {
    setNotifications(prev => [payload, ...prev]);
  });
  
  return (
    <div>
      {notifications.map(n => (
        <Notification key={n.id} {...n} />
      ))}
    </div>
  );
}
```

### Event Payloads

#### notification

```json
{
  "type": "notification",
  "timestamp": "2024-03-28T10:30:00Z",
  "payload": {
    "id": "not_abc123",
    "type": "deal_update",
    "title": "Deal Stage Changed",
    "message": "Acme Corp moved to Due Diligence",
    "data": {
      "dealId": "deal_xyz789",
      "previousStage": "pitch",
      "newStage": "duediligence"
    }
  }
}
```

#### deal.update

```json
{
  "type": "deal.update",
  "timestamp": "2024-03-28T10:30:00Z",
  "payload": {
    "id": "deal_xyz789",
    "changes": ["stage", "probability"],
    "data": {
      "stage": "duediligence",
      "probability": 65
    }
  }
}
```

#### agent.status

```json
{
  "type": "agent.status",
  "timestamp": "2024-03-28T10:30:00Z",
  "payload": {
    "runId": "run_abc123",
    "agentId": "agent_due_diligence_001",
    "status": "running",
    "progress": 45,
    "message": "Analyzing financial statements..."
  }
}
```

#### pipeline.update

```json
{
  "type": "pipeline.update",
  "timestamp": "2024-03-28T10:30:00Z",
  "payload": {
    "totalDeals": 156,
    "totalValue": 450000000,
    "byStage": {
      "duediligence": { "count": 25, "value": 100000000 }
    }
  }
}
```

---

## WebSocket Connections

WebSockets provide bidirectional real-time communication. Used for agent log streaming and interactive features.

### Connection Endpoint

```
wss://api.redstick.vc/api/v1/ws
```

### Connection Parameters

```
wss://api.redstick.vc/api/v1/ws?token=<jwt_token>&channels=<channel_list>
```

| Parameter | Description |
|-----------|-------------|
| `token` | JWT authentication token |
| `channels` | Comma-separated list of channels to subscribe to |

### Available Channels

| Channel | Description | Permission |
|---------|-------------|------------|
| `agent:*` | All agent events | Any user |
| `agent:<runId>` | Specific agent run logs | Run creator or admin |
| `deal:*` | All deal updates | Any user |
| `deal:<dealId>` | Specific deal updates | Deal assignee or admin |
| `notifications` | User notifications | Current user only |
| `system` | System-wide announcements | Any user |
| `presence` | User presence updates | Any user |

### Message Protocol

All messages are JSON with the following structure:

```typescript
interface WebSocketMessage {
  id: string;           // Unique message ID
  type: string;         // Message type
  channel: string;      // Target channel
  timestamp: string;    // ISO 8601 timestamp
  payload: any;         // Message payload
}
```

### Client-to-Server Messages

#### Subscribe to Channel

```json
{
  "id": "msg_abc123",
  "type": "subscribe",
  "channel": "agent:run_xyz789",
  "timestamp": "2024-03-28T10:30:00Z",
  "payload": {}
}
```

#### Unsubscribe from Channel

```json
{
  "id": "msg_def456",
  "type": "unsubscribe",
  "channel": "agent:run_xyz789",
  "timestamp": "2024-03-28T10:30:00Z",
  "payload": {}
}
```

#### Ping (Keep Alive)

```json
{
  "id": "msg_ghi789",
  "type": "ping",
  "channel": "system",
  "timestamp": "2024-03-28T10:30:00Z",
  "payload": {}
}
```

### Server-to-Client Messages

#### Subscription Confirmed

```json
{
  "id": "msg_jkl012",
  "type": "subscribed",
  "channel": "agent:run_xyz789",
  "timestamp": "2024-03-28T10:30:01Z",
  "payload": {
    "channel": "agent:run_xyz789",
    "subscribedAt": "2024-03-28T10:30:01Z"
  }
}
```

#### Error Response

```json
{
  "id": "msg_mno345",
  "type": "error",
  "channel": "system",
  "timestamp": "2024-03-28T10:30:02Z",
  "payload": {
    "code": "ACCESS_DENIED",
    "message": "You do not have access to this channel",
    "originalMessageId": "msg_abc123"
  }
}
```

#### Pong Response

```json
{
  "id": "msg_pqr678",
  "type": "pong",
  "channel": "system",
  "timestamp": "2024-03-28T10:30:05Z",
  "payload": {
    "latency": 50
  }
}
```

### Agent Log Messages

When subscribed to an agent channel, you'll receive log messages:

```json
{
  "id": "msg_stu901",
  "type": "agent.log",
  "channel": "agent:run_xyz789",
  "timestamp": "2024-03-28T10:30:10Z",
  "payload": {
    "runId": "run_xyz789",
    "level": "info",
    "message": "Starting market analysis...",
    "timestamp": "2024-03-28T10:30:10Z",
    "metadata": {
      "step": 2,
      "totalSteps": 10
    }
  }
}
```

Log levels: `debug`, `info`, `warning`, `error`, `success`

### JavaScript WebSocket Client

```typescript
// services/websocket.ts
class WebSocketClient {
  private ws: WebSocket | null = null;
  private channels: Set<string> = new Set();
  private messageHandlers: Map<string, Set<(payload: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageQueue: any[] = [];

  constructor(private baseUrl: string = 'wss://api.redstick.vc/api/v1/ws') {}

  connect(token: string): void {
    const url = `${this.baseUrl}?token=${encodeURIComponent(token)}`;
    
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.startPing();
      this.resubscribeChannels();
      this.flushMessageQueue();
    };
    
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.stopPing();
      this.handleReconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleMessage(message: any): void {
    // Handle system messages
    if (message.type === 'pong') {
      console.log('Latency:', message.payload.latency, 'ms');
      return;
    }
    
    if (message.type === 'error') {
      console.error('WebSocket error:', message.payload);
      return;
    }
    
    // Dispatch to handlers
    const handlers = this.messageHandlers.get(message.channel);
    if (handlers) {
      handlers.forEach(handler => handler(message.payload));
    }
    
    // Dispatch to wildcard handlers
    const wildcardHandlers = this.messageHandlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => handler(message));
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => {
        const token = localStorage.getItem('accessToken');
        if (token) this.connect(token);
      }, delay);
    }
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({
        type: 'ping',
        channel: 'system',
        payload: {}
      });
    }, 30000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private resubscribeChannels(): void {
    this.channels.forEach(channel => {
      this.send({
        type: 'subscribe',
        channel,
        payload: {}
      });
    });
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.ws?.send(JSON.stringify(message));
    }
  }

  subscribe(channel: string, handler: (payload: any) => void): () => void {
    // Add handler
    if (!this.messageHandlers.has(channel)) {
      this.messageHandlers.set(channel, new Set());
    }
    this.messageHandlers.get(channel)!.add(handler);
    
    // Track channel
    this.channels.add(channel);
    
    // Send subscribe message
    this.send({
      type: 'subscribe',
      channel,
      payload: {}
    });
    
    // Return unsubscribe function
    return () => {
      this.unsubscribe(channel, handler);
    };
  }

  private unsubscribe(channel: string, handler: (payload: any) => void): void {
    this.messageHandlers.get(channel)?.delete(handler);
    this.channels.delete(channel);
    
    this.send({
      type: 'unsubscribe',
      channel,
      payload: {}
    });
  }

  send(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): void {
    const fullMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date().toISOString()
    };
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      this.messageQueue.push(fullMessage);
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  disconnect(): void {
    this.stopPing();
    this.ws?.close();
    this.ws = null;
    this.channels.clear();
  }
}

// React Hook for Agent Logs
export function useAgentLogs(runId: string) {
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('disconnected');
  const wsRef = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const ws = new WebSocketClient();
    wsRef.current = ws;
    
    ws.connect(token);
    
    const unsubscribe = ws.subscribe(`agent:${runId}`, (payload) => {
      if (payload.level) {
        setLogs(prev => [...prev, payload]);
      }
      if (payload.status) {
        setStatus(payload.status);
      }
    });

    return () => {
      unsubscribe();
      ws.disconnect();
    };
  }, [runId]);

  return { logs, status };
}
```

### React Component Example

```tsx
// components/AgentLogViewer.tsx
import { useAgentLogs } from '@/services/websocket';

export function AgentLogViewer({ runId }: { runId: string }) {
  const { logs, status } = useAgentLogs(runId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="border rounded-lg bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="font-medium">Agent Logs</span>
        <span className={`text-sm ${status === 'running' ? 'text-green-500' : 'text-gray-500'}`}>
          {status}
        </span>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-96 overflow-y-auto p-4 font-mono text-sm"
      >
        {logs.length === 0 ? (
          <p className="text-gray-500 italic">No logs yet...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1">
              <span className="text-gray-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`ml-2 font-semibold ${getLevelColor(log.level)}`}>
                {log.level.toUpperCase()}
              </span>
              <span className="ml-2 text-gray-300">{log.message}</span>
              {log.metadata && (
                <span className="ml-2 text-gray-500">
                  {JSON.stringify(log.metadata)}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## Choosing Between SSE and WebSocket

| Feature | SSE | WebSocket |
|---------|-----|-----------|
| Direction | Server to client only | Bidirectional |
| Protocol | HTTP | WebSocket |
| Reconnection | Automatic | Manual implementation |
| Browser support | Excellent | Excellent |
| Firewalls/proxies | Works through most | May be blocked |
| Use case | Notifications, updates | Interactive, streaming |
| Message ordering | Guaranteed | Guaranteed |
| Binary data | Base64 only | Native support |

### When to Use SSE

- Real-time notifications
- Dashboard updates
- Deal pipeline changes
- User presence updates

### When to Use WebSocket

- Agent log streaming
- Real-time collaboration
- Interactive commands
- Binary data transfer

---

## Error Handling

### SSE Error Handling

```typescript
// Automatic reconnection with exponential backoff
class ResilientSSEClient extends SSEClient {
  private handleReconnect(): void {
    const maxDelay = 30000; // 30 seconds max
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      maxDelay
    );
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => this.connect(localStorage.getItem('token') || ''), delay);
    } else {
      // Fall back to polling
      this.enablePolling();
    }
  }
  
  private enablePolling(): void {
    // Switch to HTTP polling as fallback
    setInterval(() => this.pollForUpdates(), 30000);
  }
}
```

### WebSocket Error Handling

```typescript
// Connection state management
type ConnectionState = 
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

class ManagedWebSocket extends WebSocketClient {
  private state: ConnectionState = 'disconnected';
  private stateListeners: Set<(state: ConnectionState) => void> = new Set();

  onStateChange(listener: (state: ConnectionState) => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private setState(state: ConnectionState): void {
    this.state = state;
    this.stateListeners.forEach(l => l(state));
  }

  connect(token: string): void {
    this.setState('connecting');
    super.connect(token);
    // Override onopen/onclose to track state
  }
}

// Usage with React
function useConnectionState() {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const wsRef = useRef<ManagedWebSocket | null>(null);

  useEffect(() => {
    const ws = new ManagedWebSocket();
    wsRef.current = ws;
    
    const unsubscribe = ws.onStateChange(setState);
    
    return () => {
      unsubscribe();
      ws.disconnect();
    };
  }, []);

  return { state, client: wsRef.current };
}
```

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `ACCESS_DENIED` | No permission for channel | Check user permissions |
| `CHANNEL_NOT_FOUND` | Invalid channel name | Verify channel format |
| `RATE_LIMITED` | Too many connections | Reduce connection rate |
| `TOKEN_EXPIRED` | Authentication expired | Refresh token and reconnect |
| `INVALID_MESSAGE` | Malformed message | Check message format |

---

## Testing Real-time Features

### Using wscat for WebSocket Testing

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c "wss://api.redstick.vc/api/v1/ws?token=YOUR_TOKEN"

# Send subscribe message
> {"type":"subscribe","channel":"agent:run_abc123"}

# Send ping
> {"type":"ping","channel":"system","payload":{}}
```

### Using curl for SSE Testing

```bash
curl -N \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.redstick.vc/api/v1/events/stream
```

### Local Testing with ngrok

```bash
# For testing webhooks with local development
ngrok http 3000

# Use the HTTPS URL for webhook registration
```
