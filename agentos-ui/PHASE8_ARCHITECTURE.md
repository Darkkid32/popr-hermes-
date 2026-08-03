# Phase 8 Architecture Document

## Hermes Platform v1.0-phase8 — Real-Time Platform Architecture

**Version**: 1.0  
**Date**: 2026-08-03  
**Author**: Principal Platform Architect

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Services](#core-services)
3. [Data Flow](#data-flow)
4. [State Management](#state-management)
5. [WebSocket Protocol](#websocket-protocol)
6. [Event System](#event-system)
7. [Offline & Sync](#offline--sync)
8. [Performance Strategy](#performance-strategy)
9. [Security Considerations](#security-considerations)
10. [Extensibility](#extensibility)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HERMES REAL-TIME PLATFORM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐ │
│  │  Workspace   │    │  Workspace   │    │  Workspace   │    │   ...    │ │
│  │  Components  │    │  Components  │    │  Components  │    │          │ │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘    └────┬──────┘ │
│         │                   │                   │                   │        │
│         └───────────────────┼───────────────────┼───────────────────┘        │
│                             ▼                   ▼                            │
│                    ┌─────────────────────────────────────┐                  │
│                    │       useRealtimeStore              │                  │
│                    │  ┌──────┐ ┌──────┐ ┌──────┐       │                  │
│                    │  │ Conn │ │Pres  │ │ Sync │ ...   │                  │
│                    │  └──────┘ └──────┘ └──────┘       │                  │
│                    └──────────────┬────────────────────┘                  │
│                                  │                                        │
│                    ┌─────────────┼─────────────┐                          │
│                    ▼             ▼             ▼                          │
│           ┌──────────────┐ ┌─────────────┐ ┌──────────────┐              │
│           │useWebSocketM │ │ useEventBus │ │useOfflineQ   │              │
│           │   Manager    │ │             │ │              │              │
│           └──────┬───────┘ └──────┬──────┘ └──────┬───────┘              │
│                  │                │                │                       │
│                  ▼                ▼                ▼                       │
│           ┌─────────────────────────────────────────────┐                 │
│           │           BROWSER APIs                      │                 │
│           │  WebSocket  │  navigator.onLine  │  localS  │                 │
│           │  visibility │  connection API    │  Storage │                 │
│           └─────────────────────────────────────────────┘                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Single Source of Truth**: All real-time state in `useRealtimeStore`
2. **Event-Driven**: `useEventBus` as the central nervous system
3. **Transport Agnostic**: WebSocket with fallback-ready architecture
4. **Offline-First**: Local-first mutations with sync reconciliation
5. **Performance by Default**: Batching, throttling, lazy subscriptions

---

## Core Services

### 1. Real-Time Store (`realtime-store.ts`)

**Purpose**: Centralized Zustand store for all real-time state.

```typescript
interface RealtimeState {
  // Connection state
  connection: RealtimeConnectionState
  // Presence state
  presence: RealtimePresenceState
  // Sync state
  sync: RealtimeSyncState
  // Notifications
  notifications: RealtimeNotificationState
  // Activity feed
  activity: RealtimeActivityState
}
```

**Key Features**:
- Single store for all real-time state (connection, presence, sync, notifications, activity)
- Selective selectors for minimal re-renders
- Automatic WebSocket event subscription on initialization
- Centralized action dispatchers

**Selectors** (for minimal re-renders):
```typescript
export function useConnectionStatus()    // connection.status
export function useConnectionQuality()   // connection.quality
export function useLatency()             // connection.latency
export function usePresenceUsers()       // Array.from(presence.users.values())
export function useLocalUser()           // presence.localUser
export function useSyncStatus()          // sync.syncStatus
export function usePendingMutations()    // sync.pendingMutations
export function useUnreadNotifications() // notifications.unreadCount
export function useRecentActivity()      // activity.recentEvents
```

### 2. WebSocket Manager (`websocket-manager.ts`)

**Purpose**: Robust WebSocket connection with heartbeat, diagnostics, and multi-endpoint support.

```typescript
interface WebSocketManagerState {
  connectionState: ConnectionState
  reconnectAttempts: number
  lastConnected: number | null
  lastError: string | null
  messageQueue: WebSocketMessage[]
  socket: WebSocket | null
  reconnectTimer: ReturnType<typeof setTimeout> | null
  manualDisconnect: boolean
  
  // Heartbeat
  heartbeatConfig: HeartbeatConfig
  heartbeatTimer: ReturnType<typeof setInterval> | null
  pendingPing: number | null
  diagnostics: ConnectionDiagnostics
  
  // Multi-endpoint support
  endpoints: string[]
  currentEndpointIndex: number
  
  // Channel priorities
  channelPriorities: Map<string, 'high' | 'normal' | 'low'>
}
```

**Key Features**:

| Feature | Implementation |
|---------|----------------|
| **Heartbeat** | Configurable interval (30s default), timeout (5s), max missed (3) |
| **Diagnostics** | Latency, jitter, packet loss, quality score (0-100) |
| **Reconnection** | Exponential backoff (500ms * 2^n) + jitter, max 15s |
| **Multi-Endpoint** | Automatic failover to next endpoint on reconnect |
| **Channel Priority** | High/normal/low priority subscriptions |
| **Message Queue** | Persistent queue flushed on reconnect |

**Heartbeat Protocol**:
```
Client → Server: { type: "ping", payload: { timestamp: number } }
Server → Client: { type: "pong", payload: { timestamp: number } }
```

**Quality Score Calculation**:
```
qualityScore = 100 - (avgLatency / 10) - (jitter * 2) - (packetLoss * 50)
```

### 3. Event Bus (`event-bus.ts`)

**Purpose**: High-performance pub/sub with batching, throttling, and replay.

```typescript
interface EventBusState {
  subscriptions: Map<string, EventSubscription[]>
  eventLog: BatchedEvent[]
  maxLogSize: number
  batchTimer: ReturnType<typeof setTimeout> | null
  batchQueue: BatchedEvent[]
  batchInterval: number  // 50ms default
  throttledEvents: Map<string, number>
}
```

**Features**:

| Feature | Description |
|---------|-------------|
| **Batching** | 50ms window, emits latest per event type |
| **Throttling** | Per-event-type configurable throttle |
| **Wildcard** | `*` subscription receives all events |
| **Persistence** | Configurable log size (1000 default) |
| **Replay** | `replayEvents(eventType, callback, since?)` |

**Event Emission**:
```typescript
emitEvent<T>(eventType: string, payload: T, options?: { throttle?: number; persist?: boolean })
```

**Platform Events** (standardized):
```typescript
const PlatformEvents = {
  WS_CONNECTED: 'ws:connected',
  WS_DISCONNECTED: 'ws:disconnected',
  WS_ERROR: 'ws:error',
  WS_RECONNECTING: 'ws:reconnecting',
  NOTIFICATION_ADDED: 'notification:added',
  ACTIVITY_EVENT: 'activity:event',
  SYNC_CONFLICT: 'sync:conflict',
  // ... workspace, navigation, auth, workflow events
}
```

### 4. Presence Manager (`presence-manager.ts`)

**Purpose**: User presence with status, cursors, and TTL-based cleanup.

```typescript
interface PresenceUser {
  id: string
  name: string
  avatar: string
  color: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeen: number
  cursor?: { x: number; y: number; element?: string }
  metadata?: Record<string, unknown>
}
```

**Features**:
- **Channel-Based**: Isolated presence per workspace
- **TTL Cleanup**: 30s default TTL, 10s cleanup interval
- **Cursor Tracking**: Throttled cursor position updates
- **Self-Filtering**: Ignores own presence events

**Channel Protocol**:
```typescript
// Join
{ type: 'presence:join', payload: { channel: string, user: PresenceUser } }

// Leave
{ type: 'presence:leave', payload: { channel: string, userId: string } }

// Update
{ type: 'presence:update', payload: { channel: string, user: PresenceUser } }

// Cursor
{ type: 'presence:cursor', payload: { channel: string, userId: string, cursor: { x, y, element } } }
```

### 5. Offline Queue (`offline-queue.ts`)

**Purpose**: Persistent mutation queue with optimistic updates and retry.

```typescript
interface QueuedMutation {
  id: string
  type: 'create' | 'update' | 'delete'
  resource: string
  resourceId: string
  payload: unknown
  timestamp: number
  retryCount: number
  maxRetries: number
  optimisticData?: unknown
  rollbackData?: unknown
  status: 'pending' | 'processing' | 'success' | 'failed' | 'rolled_back'
}
```

**Features**:
- **Persistence**: LocalStorage survival across reloads
- **Optimistic Updates**: Immediate UI with rollback on failure
- **Exponential Backoff**: 2s * 2^(retry-1), max 5 retries
- **Online Trigger**: Auto-process on `navigator.onLine`
- **Visibility**: Queue status (pending/processing/failed/total)

**Optimistic Update Hook**:
```typescript
const { executeOptimistic } = useOptimisticUpdate()

await executeOptimistic({
  type: 'update',
  resource: 'settings',
  resourceId: 'theme',
  payload: { theme: 'dark' },
  optimisticData: { theme: 'dark' },
  rollbackData: { theme: 'light' },
  apiCall: () => api.updateSettings('theme', 'dark')
})
```

### 6. Sync Manager (`sync-manager.ts`)

**Purpose**: Vector clock-based conflict detection and resolution.

```typescript
interface VectorClock {
  [nodeId: string]: number
}

interface SyncConflict {
  id: string
  resource: string
  resourceId: string
  localVersion: VectorClock
  remoteVersion: VectorClock
  localData: unknown
  remoteData: unknown
  timestamp: number
  status: 'detected' | 'resolving' | 'resolved' | 'escalated'
  resolution?: 'local' | 'remote' | 'merge' | 'manual'
  resolvedData?: unknown
}
```

**Conflict Detection**:
```typescript
function compareVectorClocks(a: VectorClock, b: VectorClock): 
  'a-dominates' | 'b-dominates' | 'concurrent' | 'equal'
```

**Resolution Strategies**:
- `local`: Keep local changes
- `remote`: Accept remote changes
- `merge`: Shallow merge both
- `manual`: Escalate for human resolution

### 7. Network Detector (`network-detector.ts`)

**Purpose**: Real-time network quality detection.

```typescript
interface NetworkInfo {
  online: boolean
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  downlink: number
  rtt: number
  saveData: boolean
  lastChange: number
}
```

**Sources**:
- `navigator.onLine` (online/offline)
- `navigator.connection` (effectiveType, downlink, rtt, saveData)
- `PerformanceObserver` (resource timing)

### 8. Background Refresh Manager (`background-refresh.ts`)

**Purpose**: Intelligent polling with visibility and network awareness.

```typescript
interface RefreshConfig {
  interval: number
  enabled: boolean
  onlyWhenVisible: boolean
  onlyWhenOnline: boolean
  backoffOnError: boolean
  maxBackoff: number
}
```

**Features**:
- **Visibility API**: Pauses when tab hidden, triggers on visible
- **Network Awareness**: Respects `navigator.onLine`
- **Exponential Backoff**: On errors, up to `maxBackoff`
- **Per-Resource Config**: Independent intervals per subscription

---

## Data Flow

### Connection Establishment
```
1. App Start → initializeRealtime()
2. → initializeRealtime() → subscribeToEvent(WS_CONNECTED, ...)
3. → useWebSocketManager.connect()
4. → WebSocket.open → set connectionState='open'
5. → startHeartbeat() → schedule ping/pong
5. → Resubscribe channels → flush message queue
6. → emitEvent(WS_CONNECTED) → realtimeStore.recordConnect()
```

### Message Processing
```
WebSocket.message
  → parse envelope { channel, event }
  → if event.type === 'pong' → handlePong(latency)
  → emitEvent(event.type, event.payload)
  → channelListeners[channel].forEach(listener)
```

### Mutation Flow (Optimistic)
```
User Action
  → executeOptimistic({ type, resource, payload, optimisticData, rollbackData, apiCall })
  → incrementClock() → incrementPendingMutations()
  → enqueue({ type, resource, payload, optimisticData, rollbackData })
  → apiCall()
    → Success: updateClock() → decrementPendingMutations()
    → Failure: incrementFailedMutations() → decrementPendingMutations() → queue retries
```

### Presence Updates
```
Local: setStatus('away')
  → updatePresence({ status: 'away' })
  → emitEvent('presence:update', { channel, user: updatedUser })

Remote: WebSocket receives 'presence:update'
  → presenceManager.handleRemotePresence(event)
  → set({ users: new Map(state.users).set(user.id, user) })
  → Components re-render via usePresenceUsers()
```

---

## State Management

### Zustand Patterns Used

**Selective Selectors** (minimal re-renders):
```typescript
// ❌ Bad - subscribes to entire store
const state = useRealtimeStore()

// ✅ Good - subscribes only to needed slice
const status = useRealtimeStore(state => state.connection.status)
const users = useRealtimeStore(state => Array.from(state.presence.users.values()))
```

**Shallow Equality** (object selectors):
```typescript
import { useShallow } from 'zustand/react/shallow'

const connection = useRealtimeStore(useShallow(state => state.connection))
```

**Action Selectors** (stable references):
```typescript
// Actions are stable - no re-render on action change
const recordConnect = useRealtimeStore(state => state.recordConnect)
```

### Store Structure
```
useRealtimeStore
├── connection: RealtimeConnectionState
├── presence: RealtimePresenceState
├── sync: RealtimeSyncState
├── notifications: RealtimeNotificationState
├── activity: RealtimeActivityState
├── (actions...)
└── initialize/shutdown
```

---

## WebSocket Protocol

### Envelope Format
```typescript
interface WsEnvelope {
  channel: string
  event: WebSocketMessage
}

interface WebSocketMessage {
  type: string
  payload: unknown
}
```

### Standard Channels
| Channel | Purpose |
|---------|---------|
| `*` | Wildcard (all events) |
| `mission` | Mission Control updates |
| `machines` | Machine metrics |
| `observability` | Metrics, logs, alerts |
| `alerts` | Alert notifications |
| `presence:{workspace}` | User presence per workspace |

### Client → Server Messages
```typescript
// Subscribe
{ type: 'subscribe', payload: { channel: string, priority?: 'high'|'normal'|'low' } }

// Unsubscribe
{ type: 'unsubscribe', payload: { channel: string } }

// Ping
{ type: 'ping', payload: { timestamp: number } }

// Custom events
{ type: 'metrics:update', payload: { metric: 'cpu', value: 45 } }
```

### Server → Client Messages
```typescript
// Pong
{ type: 'pong', payload: { timestamp: number } }

// Metrics
{ channel: 'machines', event: { type: 'metrics:update', payload: { metric: 'cpu', value: 45 } } }

// Alert
{ channel: 'alerts', event: { type: 'notification:added', payload: { id: '...', title: '...' } } }

// Presence
{ channel: 'presence:mission', event: { type: 'presence:join', payload: { channel: 'mission', user: {...} } } }
```

---

## Event System

### Event Lifecycle
```
emitEvent('event:type', payload)
  → throttle check (if configured)
  → add to batchQueue
  → persist to eventLog (if persist=true)
  → schedule batch flush (50ms default)
    → group by eventType
    → emit latest to subscribers
    → emit all to wildcard subscribers
  → clear batchQueue
```

### Throttling
```typescript
emitEvent('metrics:update', { metric: 'cpu', value: 45 }, { throttle: 250 })
// Only emits if >250ms since last 'metrics:update'
```

### Replay
```typescript
replayEvents('metrics:update', (payload) => {
  updateChart(payload)
}, Date.now() - 60000) // Last minute
```

---

## Offline & Sync

### Offline Mutation Flow
```
1. User clicks "Save" offline
2. executeOptimistic() queues mutation
3. UI updates immediately (optimisticData)
4. Mutation stored in localStorage
5. User comes online
6. online event → processQueue()
7. For each mutation:
   a. Mark 'processing'
   b. apiCall()
   c. Success: mark 'success', decrement pending
   d. Failure: increment retry, schedule backoff
8. Cleanup successful >5min old
```

### Conflict Resolution
```
Remote update received
  → detectConflict(localVersion, remoteVersion)
  → if concurrent:
      → create SyncConflict
      → emitEvent('sync:conflict')
      → UI shows conflict resolver
  → Resolution:
      local → keep local, push to server
      remote → accept remote, update local
      merge → shallow merge, push to server
```

### Vector Clock Operations
```typescript
// Increment own clock
incrementClock() // clock[nodeId]++

// Merge received clock
updateClock(receivedClock)
// For each node: clock[node] = max(clock[node], received[node])
// clock[ownNodeId]++

// Compare
compareVectorClocks(local, remote)
// 'a-dominates' | 'b-dominates' | 'concurrent' | 'equal'
```

---

## Performance Strategy

### Event Batching
- **Window**: 50ms default (configurable via `setBatchInterval()`)
- **Strategy**: Collect all events, emit latest per type
- **Wildcard**: Emits all events in batch for debugging

### Throttling
```typescript
// Per-event-type throttling
emitEvent('metrics:update', data, { throttle: 250 })
// Only emits if >250ms since last same-type event
```

### Lazy Subscriptions
```typescript
// In component
useEffect(() => {
  const unsub = subscribeToEvent('metrics:update', updateChart)
  return unsub
}, [])
// Only subscribes when component mounts
```

### Memoized Selectors
```typescript
// Shallow equality for object slices
const connection = useRealtimeStore(useShallow(s => s.connection))
// Only re-renders if connection object reference changes
```

### Selective Rendering
```typescript
// Component only re-renders when its specific slice changes
const status = useRealtimeStore(s => s.connection.status)      // string
const quality = useRealtimeStore(s => s.connection.quality)    // string
const latency = useRealtimeStore(s => s.connection.latency)    // number
// Each triggers independent re-render
```

### Selective Subscriptions
```typescript
// Component subscribes only to needed events
useEventSubscription('metrics:update', (data) => {
  if (data.metric === 'cpu') updateCpuChart(data.value)
})
// Doesn't receive 'logs:entry', 'alerts:new', etc.
```

---

## Security Considerations

### WebSocket Security
- **Origin Validation**: Server must validate `Origin` header
- **Authentication**: Token in connection handshake or first message
- **Authorization**: Per-channel subscription authorization
- **Rate Limiting**: Per-connection message rate limits

### Data Privacy
- **LocalStorage**: Mutations stored locally, cleared on sync
- **Presence**: Minimal user data (id, name, avatar, status)
- **Event Log**: Configurable retention (default 1000 events)

### Input Validation
- **Event Payloads**: Schema validation on receive
- **Channel Names**: Whitelist validation
- **Message Size**: Max payload size limits

---

## Extensibility

### Adding New Real-Time Channels
```typescript
// 1. Define channel constant
export const Channels = {
  NEW_FEATURE: 'feature:updates'
}

// 2. Subscribe in component
useEffect(() => {
  return subscribeToWebSocketChannel('feature:updates', handleUpdate)
}, [])

// 3. Send from server
send({ channel: 'feature:updates', event: { type: 'feature:updated', payload: {...} } })
```

### Adding Custom Event Types
```typescript
// 1. Add to PlatformEvents
export const PlatformEvents = {
  ...,
  FEATURE_UPDATED: 'feature:updated'
}

// 2. Emit
emitEvent(PlatformEvents.FEATURE_UPDATED, { featureId, changes })

// 3. Subscribe
useEventSubscription(PlatformEvents.FEATURE_UPDATED, handleUpdate)
```

### Custom Presence Fields
```typescript
interface PresenceUser {
  // ... standard fields
  metadata?: Record<string, unknown>  // Extensible
}

// Usage
updatePresence({ 
  metadata: { currentPage: 'dashboard', role: 'admin' }
})
```

### Custom Sync Resolution
```typescript
// Register custom merge function
const customMerge = (local: T, remote: T): T => {
  return deepMerge(local, remote, { 
    arrayMerge: (target, source) => [...new Set([...target, ...source])]
  })
}

resolveConflict(conflictId, 'merge', customMerge(localData, remoteData))
```

---

## Testing Strategy

### Unit Tests
- Store actions and selectors
- WebSocket manager connection logic
- Event bus batching/throttling
- Offline queue persistence
- Sync conflict detection

### Integration Tests
- WebSocket connect/reconnect
- Presence join/leave/cursor
- Offline queue process/retry
- Sync conflict resolution

### E2E Tests (Planned)
- Full connection cycle
- Offline/online transitions
- Multi-tab presence
- Cross-workspace events

---

## Monitoring & Debugging

### Connection Diagnostics
```typescript
const diag = getWebSocketDiagnostics()
// { latency, jitter, packetLoss, qualityScore, lastPing, lastPong, ... }
```

### Event Log Inspection
```typescript
getEventLog('metrics:update', Date.now() - 60000)
// Returns last minute of metric events
```

### Queue Status
```typescript
getQueueStatus()
// { pending, processing, failed, total }
```

### Presence State
```typescript
getPresenceUsers()
// [{ id, name, avatar, color, status, lastSeen, cursor }]
```

---

## Future Enhancements

### Phase 9+
- **Code Splitting**: Per-workspace lazy loading
- **WebRTC**: Peer-to-peer for cursor/presence
- **Server-Sent Events**: Fallback for restricted networks
- **IndexedDB**: Larger offline queue capacity
- **CRDTs**: Conflict-free replicated data types
- **GraphQL Subscriptions**: Alternative transport

---

**Document Version**: 1.0  
**Last Updated**: 2026-08-03  
**Next Review**: Phase 9 Planning