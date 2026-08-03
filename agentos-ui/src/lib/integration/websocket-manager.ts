import { create } from 'zustand'
import type { ConnectionState } from '../services/config'
import { isConfigured, readEnv } from '../services/config'
import { PlatformEvents, emitEvent } from './event-bus'

interface WebSocketMessage {
  type: string
  payload: unknown
}

export interface HeartbeatConfig {
  interval: number
  timeout: number
  maxMissed: number
}

export interface ConnectionDiagnostics {
  latency: number
  jitter: number
  packetLoss: number
  qualityScore: number
  lastPing: number
  lastPong: number
  missedHeartbeats: number
  reconnectCount: number
  totalMessagesSent: number
  totalMessagesReceived: number
  bytesSent: number
  bytesReceived: number
}

export interface WebSocketManagerState {
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
  
  // Actions
  connect: () => void
  disconnect: () => void
  send: (event: WebSocketMessage) => void
  subscribe: (channel: string, listener: (event: WebSocketMessage) => void, priority?: 'high' | 'normal' | 'low') => () => void
  reconnect: () => void
  scheduleReconnect: () => void
  setHeartbeatConfig: (config: Partial<HeartbeatConfig>) => void
  switchEndpoint: (index: number) => void
  getDiagnostics: () => ConnectionDiagnostics
  resetDiagnostics: () => void
  
  // Internal helpers
  startHeartbeat: () => void
  stopHeartbeat: () => void
  handlePong: (latency: number) => void
}

const channelListeners = new Map<string, Set<(event: WebSocketMessage) => void>>()
const channelPriorities = new Map<string, 'high' | 'normal' | 'low'>()

const DEFAULT_HEARTBEAT_CONFIG: HeartbeatConfig = {
  interval: 30000,
  timeout: 5000,
  maxMissed: 3,
}

const DEFAULT_DIAGNOSTICS: ConnectionDiagnostics = {
  latency: 0,
  jitter: 0,
  packetLoss: 0,
  qualityScore: 100,
  lastPing: 0,
  lastPong: 0,
  missedHeartbeats: 0,
  reconnectCount: 0,
  totalMessagesSent: 0,
  totalMessagesReceived: 0,
  bytesSent: 0,
  bytesReceived: 0,
}

let latencyHistory: number[] = []
const MAX_LATENCY_HISTORY = 50

export const useWebSocketManager = create<WebSocketManagerState>((set, get) => ({
  connectionState: 'idle',
  reconnectAttempts: 0,
  lastConnected: null,
  lastError: null,
  messageQueue: [],
  socket: null,
  reconnectTimer: null,
  manualDisconnect: false,
  
  heartbeatConfig: DEFAULT_HEARTBEAT_CONFIG,
  heartbeatTimer: null,
  pendingPing: null,
  diagnostics: DEFAULT_DIAGNOSTICS,
  
  endpoints: [],
  currentEndpointIndex: 0,
  
  channelPriorities: new Map(),
  
  connect: () => {
    const state = get()
    if (state.manualDisconnect) return
    if (!isConfigured()) {
      set({ connectionState: 'idle' })
      return
    }
    if (state.socket && (state.socket.readyState === WebSocket.OPEN || state.socket.readyState === WebSocket.CONNECTING)) {
      return
    }
    
    // Determine WebSocket URL from endpoints or config
    let wsUrl: string
    if (state.endpoints.length > 0 && state.currentEndpointIndex < state.endpoints.length) {
      wsUrl = state.endpoints[state.currentEndpointIndex]
    } else {
      const { wsUrl: configWsUrl } = readEnv()
      wsUrl = configWsUrl
    }
    
    if (!wsUrl) {
      set({ connectionState: 'idle' })
      return
    }
    
    set({ connectionState: 'connecting' })
    
    try {
      const socket = new WebSocket(wsUrl)
      set({ socket })
      
      socket.addEventListener('open', () => {
        set({ reconnectAttempts: 0, lastConnected: Date.now(), lastError: null, connectionState: 'open' })
        
        // Start heartbeat
        get().startHeartbeat()
        
        // Resubscribe to all channels with their priorities
        channelListeners.forEach((_listeners, channel) => {
          if (channel !== '*') {
            const priority = channelPriorities.get(channel) || 'normal'
            get().send({ type: 'subscribe', payload: { channel, priority } })
          }
        })
        
        // Flush message queue
        const { messageQueue } = get()
        while (messageQueue.length > 0) {
          const msg = messageQueue.shift()
          if (msg) get().send(msg)
        }
        
        emitEvent(PlatformEvents.WS_CONNECTED, { timestamp: Date.now() })
      })
      
      socket.addEventListener('message', (msg) => {
        if (typeof msg.data !== 'string') return
        let parsed: unknown
        try {
          parsed = JSON.parse(msg.data)
        } catch {
          return
        }
        if (!parsed || typeof parsed !== 'object') return
        const envelope = parsed as { channel?: string; event?: WebSocketMessage }
        if (!envelope.channel || !envelope.event) return
        
        // Update diagnostics
        const { diagnostics } = get()
        const messageSize = msg.data.length
        set({
          diagnostics: {
            ...diagnostics,
            totalMessagesReceived: diagnostics.totalMessagesReceived + 1,
            bytesReceived: diagnostics.bytesReceived + messageSize,
          }
        })
        
        const channel = envelope.channel
        const event = envelope.event
        
        // Handle heartbeat pong
        if (event.type === 'pong' && event.payload && typeof event.payload === 'object' && 'timestamp' in event.payload) {
          const pingTimestamp = (event.payload as { timestamp: number }).timestamp
          const now = Date.now()
          const latency = now - pingTimestamp
          get().handlePong(latency)
          return
        }
        
        // Emit to event bus for cross-component communication
        emitEvent(event.type, event.payload)
        
        // Also dispatch to channel-specific listeners
        const listeners = channelListeners.get(channel)
        if (listeners) {
          listeners.forEach((listener) => {
            try {
              listener(event)
            } catch (error) {
              console.error(`Error in WebSocket channel listener for ${channel}:`, error)
            }
          })
        }
      })
      
      socket.addEventListener('error', (error) => {
        set({ connectionState: 'error', lastError: 'WebSocket error' })
        emitEvent(PlatformEvents.WS_ERROR, { error: String(error), timestamp: Date.now() })
      })
      
      socket.addEventListener('close', () => {
        set({ socket: null })
        const wasConnected = get().connectionState === 'open'
        set({ connectionState: 'closed' })
        get().stopHeartbeat()
        
        if (wasConnected) {
          emitEvent(PlatformEvents.WS_DISCONNECTED, { timestamp: Date.now() })
        }
        
        if (!get().manualDisconnect) {
          get().scheduleReconnect()
          emitEvent(PlatformEvents.WS_RECONNECTING, { attempt: get().reconnectAttempts + 1, timestamp: Date.now() })
        }
      })
    } catch (error) {
      set({ connectionState: 'error', lastError: String(error) })
      get().scheduleReconnect()
    }
  },
  
  disconnect: () => {
    const { reconnectTimer, socket, heartbeatTimer } = get()
    set({ manualDisconnect: true })
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      set({ reconnectTimer: null })
    }
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      set({ heartbeatTimer: null, pendingPing: null })
    }
    if (socket) {
      try { socket.close() } catch { /* noop */ }
      set({ socket: null })
    }
    set({ connectionState: 'closed' })
  },
  
  send: (event: WebSocketMessage) => {
    const { socket, messageQueue, diagnostics } = get()
    const messageStr = JSON.stringify(event)
    const messageSize = messageStr.length
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(messageStr)
        set({
          diagnostics: {
            ...diagnostics,
            totalMessagesSent: diagnostics.totalMessagesSent + 1,
            bytesSent: diagnostics.bytesSent + messageSize,
          }
        })
      } catch {
        // Message will be queued on error
        set({ messageQueue: [...messageQueue, event] })
      }
    } else {
      set({ messageQueue: [...messageQueue, event] })
    }
  },
  
  subscribe: (channel: string, listener: (event: WebSocketMessage) => void, priority: 'high' | 'normal' | 'low' = 'normal') => {
    let listeners = channelListeners.get(channel)
    if (!listeners) {
      listeners = new Set()
      channelListeners.set(channel, listeners)
    }
    listeners.add(listener)
    
    channelPriorities.set(channel, priority)
    
    // If connected, send subscribe message with priority
    const { connectionState } = get()
    if (connectionState === 'open' && channel !== '*') {
      get().send({ type: 'subscribe', payload: { channel, priority } })
    }
    
    return () => {
      const current = channelListeners.get(channel)
      if (!current) return
      current.delete(listener)
      if (current.size === 0) {
        channelListeners.delete(channel)
        channelPriorities.delete(channel)
        if (channel !== '*') {
          get().send({ type: 'unsubscribe', payload: { channel } })
        }
      }
    }
  },
  
  scheduleReconnect: () => {
    const { manualDisconnect, reconnectTimer, reconnectAttempts, endpoints, currentEndpointIndex } = get()
    if (manualDisconnect) return
    if (reconnectTimer) return
    
    // Try next endpoint on reconnect if available
    const nextEndpointIndex = (currentEndpointIndex + 1) % (endpoints.length || 1)
    if (endpoints.length > 1 && nextEndpointIndex !== currentEndpointIndex) {
      set({ currentEndpointIndex: nextEndpointIndex })
    }
    
    const delay = Math.min(15000, 500 * Math.pow(2, reconnectAttempts))
    const jitter = Math.random() * 1000
    const timer = setTimeout(() => {
      set({ reconnectAttempts: reconnectAttempts + 1 })
      get().connect()
    }, delay + jitter)
    set({ reconnectTimer: timer })
  },
  
  reconnect: () => {
    const { reconnectTimer, heartbeatTimer } = get()
    set({ manualDisconnect: false, reconnectAttempts: 0 })
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      set({ reconnectTimer: null })
    }
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      set({ heartbeatTimer: null, pendingPing: null })
    }
    get().connect()
  },
  
  setHeartbeatConfig: (config: Partial<HeartbeatConfig>) => {
    const { heartbeatConfig, heartbeatTimer } = get()
    const newConfig = { ...heartbeatConfig, ...config }
    set({ heartbeatConfig: newConfig })
    if (heartbeatTimer && get().connectionState === 'open') {
      get().startHeartbeat()
    }
  },
  
  switchEndpoint: (index: number) => {
    const { endpoints, connectionState } = get()
    if (index >= 0 && index < endpoints.length) {
      set({ currentEndpointIndex: index })
      if (connectionState === 'open') {
        get().reconnect()
      }
    }
  },
  
  getDiagnostics: () => get().diagnostics,
  
  resetDiagnostics: () => {
    set({ diagnostics: DEFAULT_DIAGNOSTICS })
    latencyHistory = []
  },
  
  // Internal helpers
  startHeartbeat: () => {
    const { heartbeatTimer, heartbeatConfig } = get()
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
    }
    const timer = setInterval(() => {
      const currentSocket = get().socket
      if (!currentSocket || currentSocket.readyState !== WebSocket.OPEN) {
        clearInterval(timer)
        set({ heartbeatTimer: null })
        return
      }
      
      const { pendingPing, diagnostics, heartbeatConfig: config } = get()
      if (pendingPing !== null) {
        // Ping was sent but no pong received
        const missed = diagnostics.missedHeartbeats + 1
        set({ diagnostics: { ...diagnostics, missedHeartbeats: missed } })
        
        if (missed >= config.maxMissed) {
          // Too many missed heartbeats, force reconnect
          console.warn('[WebSocket] Max missed heartbeats reached, forcing reconnect')
          currentSocket.close()
          return
        }
      }
      
      const pingTimestamp = Date.now()
      set({ pendingPing: pingTimestamp })
      get().send({ type: 'ping', payload: { timestamp: pingTimestamp } })
    }, heartbeatConfig.interval)
    set({ heartbeatTimer: timer })
  },
  
  stopHeartbeat: () => {
    const { heartbeatTimer } = get()
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      set({ heartbeatTimer: null, pendingPing: null })
    }
  },
  
  handlePong: (latency: number) => {
    const { diagnostics } = get()
    const now = Date.now()
    
    // Update latency history
    latencyHistory.push(latency)
    if (latencyHistory.length > MAX_LATENCY_HISTORY) {
      latencyHistory.shift()
    }
    
    // Calculate metrics
    const avgLatency = latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length
    const jitter = latencyHistory.length > 1
      ? Math.sqrt(latencyHistory.reduce((sum, val) => sum + Math.pow(val - avgLatency, 2), 0) / latencyHistory.length)
      : 0
    
    const totalSent = diagnostics.totalMessagesSent
    const totalReceived = diagnostics.totalMessagesReceived
    const packetLoss = totalSent > 0 ? Math.max(0, (totalSent - totalReceived) / totalSent) : 0
    
    // Quality score: 100 - (latency/10) - (jitter*2) - (packetLoss*50)
    const qualityScore = Math.max(0, Math.min(100, 100 - (avgLatency / 10) - (jitter * 2) - (packetLoss * 50)))
    
    set({
      pendingPing: null,
      diagnostics: {
        ...diagnostics,
        latency: Math.round(avgLatency),
        jitter: Math.round(jitter * 100) / 100,
        packetLoss: Math.round(packetLoss * 10000) / 10000,
        qualityScore: Math.round(qualityScore),
        lastPong: now,
        missedHeartbeats: 0,
      }
    })
  },
}))

export function useWebSocketManagerState() {
  return useWebSocketManager()
}

export function connectWebSocket() {
  useWebSocketManager.getState().connect()
}

export function disconnectWebSocket() {
  useWebSocketManager.getState().disconnect()
}

export function sendWebSocketEvent(event: { type: string; payload: unknown }) {
  useWebSocketManager.getState().send(event)
}

export function subscribeToWebSocketChannel(
  channel: string, 
  listener: (event: { type: string; payload: unknown }) => void,
  priority?: 'high' | 'normal' | 'low'
) {
  return useWebSocketManager.getState().subscribe(channel, listener, priority)
}

export function getWebSocketConnectionState() {
  return useWebSocketManager.getState().connectionState
}

export function getWebSocketDiagnostics() {
  return useWebSocketManager.getState().diagnostics
}

export function setWebSocketEndpoints(endpoints: string[]) {
  useWebSocketManager.setState({ endpoints, currentEndpointIndex: 0 })
}

export function addWebSocketEndpoint(endpoint: string) {
  const { endpoints } = useWebSocketManager.getState()
  if (!endpoints.includes(endpoint)) {
    useWebSocketManager.setState({ endpoints: [...endpoints, endpoint] })
  }
}