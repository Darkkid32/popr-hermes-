# Real-Time Architecture Summary

## Hermes Platform v1.0-phase8

---

## Connection Flow

```
App Start
    │
    ▼
initializeRealtime() ──────► subscribeToEvent(WS_CONNECTED, recordConnect)
    │
    ▼
useWebSocketManager.connect()
    │
    ▼
WebSocket.open (or retry with backoff)
    │
    ▼
ConnectionState = 'open'
    │
    ▼
startHeartbeat() ──► setInterval(ping, 30s)
    │
    ▼
Resubscribe channels + flush queue
    │
    ▼
emitEvent(WS_CONNECTED)
    │
    ▼
realtimeStore.recordConnect() ──► status='connected', quality='excellent'
```

---

## Event Flow

```
WebSocket Message Received
    │
    ▼
Parse Envelope { channel, event }
    │
    ├── event.type === 'pong' ──► handlePong(latency)
    │       │
    │       └── Update diagnostics (latency, jitter, packetLoss, qualityScore)
    │
    ├── emitEvent(event.type, event.payload)
    │       │
    │       ├── throttle check
    │       ├── add to batchQueue
    │       ├── persist to eventLog
    │       └── schedule flushBatch (50ms)
    │
    └── channelListeners[channel].forEach(listener(event))
            │
            └── Component updates via Zustand selectors
```

---

## Event Bus Batch Flush

```
flushBatch() (every 50ms)
    │
    ▼
Group batchQueue by eventType
    │
    ▼
For each eventType:
    │
    ├── Get subscribers
    ├── Emit latest event payload to each
    │
    └── Wildcard subscribers get ALL events in batch
    │
    ▼
Clear batchQueue, batchTimer = null
```

---

## Mutation Flow (Optimistic)

```
User Action (e.g., Save Settings)
    │
    ▼
executeOptimistic({ type, resource, payload, optimisticData, rollbackData, apiCall })
    │
    ├── incrementClock() → vectorClock[nodeId]++
    ├── incrementPendingMutations()
    ├── enqueue({ type, resource, payload, optimisticData, rollbackData })
    │       │
    │       └── UI updates immediately with optimisticData
    │
    └── apiCall()
            │
            ├── SUCCESS
            │       ├── updateClock(receivedVersion)
            │       ├── decrementPendingMutations()
            │       └── emitEvent(SYNC_SUCCESS)
            │
            └── FAILURE
                    ├── incrementFailedMutations()
                    ├── decrementPendingMutations()
                    └── queue retry with exponential backoff
```

---

## Offline Queue Processing

```
online event OR processQueue() called
    │
    ▼
if isProcessing or !navigator.onLine → return
    │
    ▼
set isProcessing = true
    │
    ▼
Filter: pending OR (failed AND retryCount < maxRetries)
    │
    ▼
For each mutation:
    │
    ├── Mark 'processing', lastAttempt = now
    ├── apiCall()
    │       │
    │       ├── SUCCESS → status='success', decrementPending, emit(SYNC_SUCCESS)
    │       │
    │       └── FAILURE
    │               ├── retryCount++
    │               ├── if maxRetries: status='failed'
    │               ├── else: status='pending', schedule backoff retry
    │               └── emit(WORKFLOW_FAILED)
    │
    ▼
Cleanup: remove 'success' older than 5min
    │
    ▼
persist queue to localStorage
    │
    ▼
set isProcessing = false
```

---

## Presence Sync

```
Local User Changes Status
    │
    ▼
updatePresence({ status: 'away' })
    │
    ├── set({ localUser: { ...localUser, status: 'away', lastSeen: now } })
    │
    └── emitEvent('presence:update', { channel, user: updatedUser })
            │
            ▼
        WebSocket sends { type: 'presence:update', payload: { channel, user } }
            │
            ▼
        Remote Clients Receive
            │
            ▼
        presenceManager.handleRemotePresence(event)
            │
            ├── Validate channel matches
            ├── Update users Map
            └── Zustand triggers usePresenceUsers() selector
                    │
                    ▼
                Components re-render (PresenceAvatars, etc.)
```

---

## Sync Conflict Detection

```
Remote Update Received for Resource
    │
    ▼
detectConflict(localVersion, remoteVersion)
    │
    ├── compareVectorClocks(local, remote)
    │       │
    │       ├── 'a-dominates' → local newer, ignore remote
    │       ├── 'b-dominates' → remote newer, auto-accept
    │       ├── 'equal' → same, ignore
    │       └── 'concurrent' → CONFLICT
    │
    ▼ (if concurrent)
create SyncConflict { id, resource, localVersion, remoteVersion, localData, remoteData }
    │
    ▼
set({ conflicts: new Map(state.conflicts).set(id, conflict) })
    │
    ▼
emitEvent('sync:conflict', { conflictId, resource, resourceId })
    │
    ▼
UI Shows Conflict Resolver
    │
    ├── User chooses: Local / Remote / Merge / Manual
    │
    ▼
resolveConflict(id, strategy, mergedData?)
    │
    ├── strategy='local' → resolvedData = localData
    ├── strategy='remote' → resolvedData = remoteData
    ├── strategy='merge' → resolvedData = mergedData ?? { ...local, ...remote }
    │
    ▼
set conflict.status = 'resolved', conflict.resolution, conflict.resolvedData
    │
    ▼
emitEvent('sync:conflict_resolved', { conflictId, resolution })
    │
    ▼
UI Updates, Conflict Cleared
```

---

## Network Quality Scoring

```
Quality Score = 100 - (avgLatency / 10) - (jitter * 2) - (packetLoss * 50)

Where:
- avgLatency = mean of last 50 ping/pong latencies (ms)
- jitter = standard deviation of latencies (ms)
- packetLoss = max(0, (sent - received) / sent)

Quality Labels:
- 90-100: 'excellent' (green)
- 70-89:  'good' (green)
- 50-69:  'fair' (yellow)
- 30-49:  'poor' (orange)
- 0-29:   'offline' (red)
```

---

## Background Refresh Decision Tree

```
Visibility Timer Fires (10s)
    │
    ├── globalConfig.enabled = false? → return
    │
    ├── document.hidden AND config.onlyWhenVisible? → return
    │
    ├── !navigator.onLine AND config.onlyWhenOnline? → return
    │
    ▼
For each subscription:
    │
    ├── !config.enabled? → continue
    │
    ├── config.onlyWhenVisible AND document.hidden? → continue
    │
    ├── config.onlyWhenOnline AND !navigator.onLine? → continue
    │
    ├── now >= nextRun AND !timer? → scheduleRun()
    │
    ▼
scheduleRun(id)
    │
    ├── setTimeout(async () => {
    │       await callback()
    │       lastRun = now
    │       errorCount = 0
    │       currentInterval = config.interval
    │       nextRun = now + interval
    │   }, max(0, nextRun - now))
    │
    ▼
On Error:
    │
    ├── errorCount++
    ├── if backoffOnError: currentInterval = min(currentInterval * 2, maxBackoff)
    ├── nextRun = now + currentInterval
    ├── scheduleRun(id)
    └── emitEvent(ERROR_OCCURRED, { type: 'background_refresh_error', ... })
```

---

## Reconnection Logic

```
WebSocket close/error (not manual)
    │
    ▼
scheduleReconnect()
    │
    ├── manualDisconnect? → return
    │
    ├── reconnectTimer exists? → return
    │
    ├── endpoints.length > 1?
    │       ├── currentEndpointIndex = (current + 1) % length
    │       └── try next endpoint
    │
    ▼
delay = min(15000, 500 * 2^reconnectAttempts) + jitter(0-1000ms)
    │
    ▼
setTimeout(() → reconnectAttempts++ → connect(), delay)
    │
    ▼
emitEvent(WS_RECONNECTING, { attempt, timestamp })
```

---

## Quality Gate

```
TYPECHECK: tsc --noEmit          → PASS (0 errors)
LINT:      oxlint                → PASS (37 warnings, 0 errors)
BUILD:     vite build            → PASS (4.5s, 685 modules)
TESTS:     vitest run            → PASS (2/2 tests)
WARNINGS:  37 ≤ baseline 37      → PASS
```