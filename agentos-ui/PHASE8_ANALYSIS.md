# Phase 8 — Repository Analysis & Real-Time Readiness Assessment

**Date**: 2026-08-03  
**Baseline**: v1.0-project-baseline (commit a8dc170)  
**Role**: Chief Platform Architect / Principal Real-Time Systems Engineer  

---

## 1. Repository Analysis Summary

### 1.1 Current Architecture (Frozen)

| Layer | Status | Files |
|-------|--------|-------|
| **Workspaces** | 10/10 Complete | `/mission`, `/machines`, `/organization`, `/security`, `/observability`, `/automation`, `/models`, `/memory`, `/plugins`, `/mcp` |
| **Core Stores** | 6 Zustand Stores | `UIStore`, `MCPStore`, `MemoryStore`, `ModelsStore`, `PluginsStore`, `SkillsStore` |
| **Integration Stores** | 12 Stores | ServiceRegistry, WorkspaceRegistry, NavigationRegistry, CommandPalette, NotificationCenter, GlobalSearch, DialogManager, DrawerManager, ModalManager, LoadingManager, EventBus, WebSocketManager |
| **Platform Services** | 30 Services | All categories: Infrastructure, Navigation, UI State, Security, Auth, UX |
| **Components** | ~205 Total | 47 Shared UI + ~150 Workspace + 8 Layout |
| **Design System** | Complete | Typography, Colors, Spacing, Radius, Elevation, Motion, Icons |

### 1.2 Existing Real-Time Infrastructure

| Component | File | Capability | Gap |
|-----------|------|------------|-----|
| **WebSocketManager (Integration)** | `src/lib/integration/websocket-manager.ts` | Zustand store, auto-reconnect, message queue, channel subscriptions, event bus bridge | No heartbeat, no presence, no diagnostics, no offline queue |
| **WebSocket Service (Legacy)** | `src/lib/services/ws.ts` | Emitter-based, connection state, channel listeners, reconnection | Standalone, not integrated with Zustand, no event bus bridge |
| **Event Bus** | `src/lib/integration/event-bus.ts` | Pub/sub, typed events, wildcard listeners, PlatformEvents enum | No batching, no persistence, no replay |
| **Notification Center** | `src/lib/integration/notification-center.ts` | Toast queue, persistence, actions, UIStore link | Not connected to WebSocket for live notifications |
| **UIStore** | `src/stores/UIStore.ts` | Toasts, drawers, modals, sidebar | No connection status, no presence, no sync indicators |
| **Config Service** | `src/lib/services/config.ts` | `readEnv()`, `isConfigured()`, `Emitter<T>` | No WS URL validation, no fallback endpoints |

---

## 2. Real-Time Readiness Analysis

### 2.1 Strengths (Ready to Build On)

✅ **Zustand-based state management** — All stores are reactive, minimal boilerplate  
✅ **Event Bus with typed events** — Cross-workspace communication exists  
✅ **WebSocket Manager (Integration layer)** — Auto-reconnect, message queue, channel subscriptions  
✅ **Event Bus ↔ WebSocket Bridge** — `emitEvent(PlatformEvents.WS_*)` already connected  
✅ **Protected Routes & Auth Context** — Session management ready for presence  
✅ **Notification Center + UIStore** — Toast delivery pipeline exists  
✅ **Workspace Registry** — 10 workspaces defined with metadata  
✅ **Design System** — Tokens for live badges, connection indicators, sync status

### 2.2 Critical Gaps (Must Implement)

| Gap | Impact | Priority |
|-----|--------|----------|
| **No Heartbeat Monitor** | Cannot detect stale connections; no keep-alive | P0 |
| **No Connection Diagnostics** | No latency, quality, or health metrics | P0 |
| **No Presence Manager** | No user presence, cursors, collaborative features | P0 |
| **No Offline Queue / Retry Queue** | Messages lost during disconnect; no optimistic UI | P0 |
| **No Live Metrics Streaming** | Observability workspace static; no real-time data | P0 |
| **No Live Log Streaming** | Logs page static; no real-time log tail | P0 |
| **No Live Alerts** | Alerts page static; no push notifications | P0 |
| **No Sync Status Indicators** | Users cannot see connection/sync health | P0 |
| **No Reconnect Banner** | No user-visible offline/online status | P0 |
| **No Event Batching/Throttling** | High-frequency events cause re-render storms | P1 |
| **No Conflict Detection/Recovery** | Concurrent edits may overwrite silently | P1 |
| **No Background Refresh Manager** | No intelligent polling fallback | P1 |
| **No Network Status Detection** | No `navigator.onLine` integration | P1 |
| **No Optimistic UI Updates** | Latency perceived as lag | P2 |
| **No Activity Feed (Real-Time)** | Current activity bus is static mock data | P2 |

### 2.3 Duplicate/Conflicting Implementations

| Duplicate | Files | Resolution |
|-----------|-------|------------|
| **Two WebSocket Layers** | `websocket-manager.ts` (Zustand) + `ws.ts` (Emitter) | **Deprecate `ws.ts`** — migrate all consumers to integration layer |
| **Two Config Systems** | `config.ts` (services) + `config-provider.tsx` (integration) | **Unify** — use integration config as source of truth |
| **Two Event Systems** | `event-bus.ts` (Zustand) + `ws.ts` Emitter | **Consolidate** — event-bus as single source |

---

## 3. Gap Analysis — Phase 8 Requirements Mapping

| Phase 8 Requirement | Current State | Implementation Needed |
|---------------------|---------------|----------------------|
| **1. Global WebSocket Manager** | ✅ Exists (integration) | Extend: heartbeat, diagnostics, multi-endpoint |
| **2. Connection Manager** | ✅ Partial | Extend: connection pool, priority channels |
| **3. Auto Reconnect** | ✅ Exponential backoff | Extend: max attempts, jitter, fallback URLs |
| **4. Heartbeat Monitor** | ❌ Missing | **NEW**: ping/pong, latency tracking, missed threshold |
| **5. Presence Manager** | ❌ Missing | **NEW**: user presence, cursor sync, TTL |
| **6. Live Notification System** | ⚠️ NotificationCenter exists | Extend: WS-driven, priority, actions |
| **7. Live Activity Feed** | ⚠️ Mock data only | **NEW**: Real-time event stream, filtering |
| **8. Live Event Streaming** | ⚠️ EventBus only | Extend: WS channels, replay, buffering |
| **9. Workspace Synchronization** | ❌ Missing | **NEW**: Cross-tab sync, conflict detection |
| **10. Cross Workspace Events** | ✅ EventBus | Extend: WS broadcast, ordering guarantees |
| **11. Global Sync Status** | ❌ Missing | **NEW**: Connection quality, sync health UI |
| **12. Background Refresh Manager** | ❌ Missing | **NEW**: Intelligent polling, visibility API |
| **13. Network Status Detection** | ❌ Missing | **NEW**: `navigator.onLine`, effective type |
| **14. Offline Mode** | ❌ Missing | **NEW**: Queue mutations, sync on reconnect |
| **15. Reconnect Banner** | ❌ Missing | **NEW**: Top-bar component, dismissible |
| **16. Optimistic UI Updates** | ❌ Missing | **NEW**: Mutation queue, rollback on failure |
| **17. Live Metrics Updates** | ❌ Static pages | **NEW**: WS channels per workspace |
| **18. Live Log Streaming** | ❌ Static pages | **NEW**: Log tail channel, buffering |
| **19. Live Alerts** | ❌ Static pages | **NEW**: Alert push, escalation |
| **20. Event Queue** | ⚠️ MessageQueue in WS | Extend: priority, persistence, replay |
| **21. Retry Queue** | ❌ Missing | **NEW**: Failed mutations, exponential retry |
| **22. Connection Diagnostics** | ❌ Missing | **NEW**: Latency, jitter, packet loss, quality score |
| **23. Sync Conflict Detection** | ❌ Missing | **NEW**: Vector clocks, last-write-wins |
| **24. Sync Recovery** | ❌ Missing | **NEW**: State reconciliation, merge strategies |
| **25. Shared Real-Time Store** | ❌ Missing | **NEW**: Central `RealtimeStore` for all live state |

---

## 4. Implementation Strategy

### 4.1 Core Architecture Principles

1. **Single Source of Truth** — One WebSocket manager (integration layer), one Event Bus
2. **Extend, Don't Replace** — Enhance existing stores/services rather than creating new ones
3. **Layered Approach**:
   - Layer 1: Transport (WebSocket + Heartbeat + Reconnect)
   - Layer 2: Protocol (Channels, Events, Presence)
   - Layer 3: State (RealtimeStore, Optimistic Updates)
   - Layer 4: UI (Indicators, Banners, Live Components)
4. **Performance First** — Batching, throttling, selective subscriptions, memoization

### 4.2 File Creation Plan (New Files)

| File | Purpose | Layer |
|------|---------|-------|
| `src/lib/integration/realtime-store.ts` | Central Zustand store for all real-time state | 3 |
| `src/lib/integration/heartbeat-monitor.ts` | Ping/pong, latency, health scoring | 1 |
| `src/lib/integration/presence-manager.ts` | User presence, cursors, TTL cleanup | 2 |
| `src/lib/integration/offline-queue.ts` | Mutation queue, retry logic, persistence | 3 |
| `src/lib/integration/sync-manager.ts` | Conflict detection, vector clocks, recovery | 3 |
| `src/lib/integration/connection-diagnostics.ts` | Quality metrics, network info | 1 |
| `src/lib/integration/background-refresh.ts` | Visibility API, intelligent polling | 2 |
| `src/lib/integration/network-detector.ts` | `navigator.onLine`, effective type | 1 |
| `src/components/realtime/ConnectionIndicator.tsx` | Live connection status badge | 4 |
| `src/components/realtime/ReconnectBanner.tsx` | Offline/online top banner | 4 |
| `src/components/realtime/PresenceAvatars.tsx` | Collaborative presence display | 4 |
| `src/components/realtime/SyncStatusIndicator.tsx` | Per-workspace sync health | 4 |
| `src/components/realtime/LiveActivityFeed.tsx` | Real-time activity stream | 4 |
| `src/components/realtime/LiveMetrics.tsx` | Streaming metrics display | 4 |
| `src/components/realtime/LiveLogStream.tsx` | Log tail component | 4 |
| `src/components/realtime/LiveAlerts.tsx` | Push alert display | 4 |
| `src/hooks/useRealtime.ts` | Unified real-time hook for components | 4 |
| `src/hooks/usePresence.ts` | Presence subscription hook | 4 |
| `src/hooks/useOptimisticUpdate.ts` | Optimistic mutation hook | 3 |

### 4.3 Files to Modify (Extensions)

| File | Changes |
|------|---------|
| `src/lib/integration/websocket-manager.ts` | Add heartbeat, diagnostics, multi-channel priority, connection pool |
| `src/lib/integration/event-bus.ts` | Add batching, throttling, replay, persistence |
| `src/lib/integration/notification-center.ts` | WS-driven notifications, priority channels |
| `src/lib/integration/index.ts` | Export all new real-time modules |
| `src/stores/UIStore.ts` | Add connection state, presence, sync status |
| `src/components/Sidebar.tsx` | Add connection indicator, presence avatars |
| `src/App.tsx` | Wrap with RealtimeProvider, add ReconnectBanner |
| `src/main.tsx` | Initialize real-time on app start |
| `src/pages/MissionControl.tsx` | Live metrics, activity feed integration |
| `src/pages/Logs.tsx` | Live log streaming |
| `src/pages/Alerts.tsx` | Live alert push |
| `src/pages/Observability.tsx` | Live metrics streaming |
| `src/pages/Machines.tsx` | Live machine telemetry |

---

## 5. Performance Considerations

| Technique | Implementation |
|-----------|----------------|
| **Event Batching** | Accumulate events 50ms, flush via `requestAnimationFrame` |
| **Throttling** | High-frequency channels (metrics, logs) throttled to 250ms |
| **Lazy Subscriptions** | Subscribe only when component mounts, unsubscribe on unmount |
| **Memoized Selectors** | Zustand `shallow` equality, `useShallow` for object selectors |
| **Selective Re-renders** | Split stores by domain; components subscribe to minimal state |
| **Offline Queue Persistence** | IndexedDB for mutation queue survival across reloads |

---

## 6. Accessibility Checklist

- [ ] Connection indicator: ARIA live region for status changes
- [ ] Reconnect banner: Focus management, dismissible via keyboard
- [ ] Presence avatars: Alt text, keyboard navigation
- [ ] Sync indicators: High contrast, reduced motion respected
- [ ] Activity feed: Live region polite, pause on hover
- [ ] All new components: Focus visible, semantic HTML

---

## 7. Testing Strategy

| Test Type | Coverage |
|-----------|----------|
| **Store Tests** | `realtime-store`, `offline-queue`, `presence-manager`, `sync-manager` |
| **WebSocket Tests** | Connection, reconnect, heartbeat, message routing |
| **Connection Manager Tests** | Multi-endpoint, priority, fallback |
| **Event Bus Tests** | Batching, throttling, wildcard, replay |
| **Component Smoke Tests** | ConnectionIndicator, ReconnectBanner, PresenceAvatars |
| **Integration Tests** | Full flow: disconnect → queue → reconnect → sync |

---

## 8. Phase 8 Deliverables

| Document | Description |
|----------|-------------|
| `PHASE8_CHANGELOG.md` | Detailed change log |
| `PHASE8_RELEASE.md` | Release notes |
| `PHASE8_ARCHITECTURE.md` | Real-time architecture deep dive |
| `REALTIME_ARCHITECTURE.md` | Connection flow, event flow, state diagrams |

---

**Analysis Complete** — Ready to implement Phase 8 Real-Time Platform