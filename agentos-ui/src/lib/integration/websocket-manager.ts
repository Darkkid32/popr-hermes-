import { create } from 'zustand'
import type { ConnectionState } from '../services/config'
import { isConfigured, readEnv } from '../services/config'
import { PlatformEvents, emitEvent } from './event-bus'

interface WebSocketMessage {
  type: string
  payload: unknown
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
  connect: () => void
  disconnect: () => void
  send: (event: WebSocketMessage) => void
  subscribe: (channel: string, listener: (event: WebSocketMessage) => void) => () => void
  reconnect: () => void
  scheduleReconnect: () => void
}

const channelListeners = new Map<string, Set<(event: WebSocketMessage) => void>>()

export const useWebSocketManager = create<WebSocketManagerState>((set, get) => ({
  connectionState: 'idle',
  reconnectAttempts: 0,
  lastConnected: null,
  lastError: null,
  messageQueue: [],
  socket: null,
  reconnectTimer: null,
  manualDisconnect: false,

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

    set({ connectionState: 'connecting' })

    const { wsUrl } = readEnv()
    if (!wsUrl) {
      set({ connectionState: 'idle' })
      return
    }

    try {
      const socket = new WebSocket(wsUrl)
      set({ socket })

      socket.addEventListener('open', () => {
        set({ reconnectAttempts: 0, lastConnected: Date.now(), lastError: null, connectionState: 'open' })

        // Resubscribe to all channels
        channelListeners.forEach((_listeners, channel) => {
          if (channel !== '*') {
            get().send({ type: 'subscribe', payload: { channel } })
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

        const channel = envelope.channel
        const event = envelope.event

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
    const { reconnectTimer, socket } = get()
    set({ manualDisconnect: true })
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      set({ reconnectTimer: null })
    }
    if (socket) {
      try { socket.close() } catch { /* noop */ }
      set({ socket: null })
    }
    set({ connectionState: 'closed' })
  },

  send: (event: WebSocketMessage) => {
    const { socket, messageQueue } = get()
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify(event))
      } catch {
        // Message will be queued on error
      }
    } else {
      set({ messageQueue: [...messageQueue, event] })
    }
  },

  subscribe: (channel: string, listener: (event: WebSocketMessage) => void) => {
    let listeners = channelListeners.get(channel)
    if (!listeners) {
      listeners = new Set()
      channelListeners.set(channel, listeners)
    }
    listeners.add(listener)

    // If connected, send subscribe message
    const { connectionState } = get()
    if (connectionState === 'open' && channel !== '*') {
      get().send({ type: 'subscribe', payload: { channel } })
    }

    return () => {
      const current = channelListeners.get(channel)
      if (!current) return
      current.delete(listener)
      if (current.size === 0) {
        channelListeners.delete(channel)
        if (channel !== '*') {
          get().send({ type: 'unsubscribe', payload: { channel } })
        }
      }
    }
  },

  scheduleReconnect: () => {
    const { manualDisconnect, reconnectTimer, reconnectAttempts } = get()
    if (manualDisconnect) return
    if (reconnectTimer) return
    const delay = Math.min(15000, 500 * Math.pow(2, reconnectAttempts))
    const timer = setTimeout(() => {
      set({ reconnectAttempts: reconnectAttempts + 1 })
      get().connect()
    }, delay)
    set({ reconnectTimer: timer })
  },

  reconnect: () => {
    const { reconnectTimer } = get()
    set({ manualDisconnect: false, reconnectAttempts: 0 })
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      set({ reconnectTimer: null })
    }
    get().connect()
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

export function subscribeToWebSocketChannel(channel: string, listener: (event: { type: string; payload: unknown }) => void) {
  return useWebSocketManager.getState().subscribe(channel, listener)
}

export function getWebSocketConnectionState() {
  return useWebSocketManager.getState().connectionState
}