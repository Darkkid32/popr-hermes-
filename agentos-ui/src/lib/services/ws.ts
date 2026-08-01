import { Emitter, type ConnectionState, isConfigured, readEnv } from './config'

export type WsEvent =
  | { type: string; payload: unknown; ts?: number }

export interface WsEnvelope {
  channel: string
  event: WsEvent
}

const stateEmitter = new Emitter<ConnectionState>()
let socket: WebSocket | null = null
let state: ConnectionState = 'idle'
let reconnectAttempts = 0
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
const channelListeners = new Map<string, Set<(event: WsEvent) => void>>()
let manualDisconnect = false

function setState(next: ConnectionState): void {
  state = next
  stateEmitter.emit(next)
}

function dispatch(channel: string, event: WsEvent): void {
  const listeners = channelListeners.get(channel)
  if (!listeners) return
  listeners.forEach((listener) => listener(event))
}

function dispatchToAll(envelope: WsEnvelope): void {
  dispatch(envelope.channel, envelope.event)
  if (envelope.channel === '*') {
    channelListeners.forEach((listeners, channel) => {
      if (channel === '*') return
      listeners.forEach((listener) => listener(envelope.event))
    })
  }
}

function flushTimer(): void {
  reconnectTimer = null
}

function scheduleReconnect(): void {
  if (manualDisconnect) return
  if (reconnectTimer) return
  const delay = Math.min(15_000, 500 * Math.pow(2, reconnectAttempts))
  reconnectTimer = setTimeout(() => {
    reconnectAttempts += 1
    flushTimer()
    connect()
  }, delay)
}

function connect(): void {
  if (manualDisconnect) return
  if (typeof WebSocket === 'undefined') {
    setState('error')
    return
  }
  const { wsUrl } = readEnv()
  if (!wsUrl) {
    setState('idle')
    return
  }
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return
  }
  setState('connecting')
  try {
    socket = new WebSocket(wsUrl)
  } catch {
    setState('error')
    scheduleReconnect()
    return
  }
  socket.addEventListener('open', () => {
    reconnectAttempts = 0
    setState('open')
    channelListeners.forEach((_listeners, channel) => {
      if (channel === '*') return
      send({ type: 'subscribe', payload: { channel } })
    })
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
    const envelope = parsed as Partial<WsEnvelope>
    if (typeof envelope.channel !== 'string' || !envelope.event || typeof envelope.event !== 'object') return
    const channel = envelope.channel
    const event = envelope.event as WsEvent
    dispatchToAll({ channel, event })
  })
  socket.addEventListener('error', () => {
    setState('error')
  })
  socket.addEventListener('close', () => {
    socket = null
    setState('closed')
    scheduleReconnect()
  })
}

export function send(event: WsEvent): void {
  if (!socket || socket.readyState !== WebSocket.OPEN) return
  try {
    socket.send(JSON.stringify(event))
  } catch {
    // swallow; transport will close and reconnect
  }
}

export function ensureConnected(): void {
  if (!isConfigured()) return
  if (state === 'idle' || state === 'closed' || state === 'error') {
    connect()
  }
}

export function disconnect(): void {
  manualDisconnect = true
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (socket) {
    try { socket.close() } catch { /* noop */ }
    socket = null
  }
  setState('closed')
}

export function subscribe(channel: string, listener: (event: WsEvent) => void): () => void {
  let set = channelListeners.get(channel)
  let isNew = false
  if (!set) {
    set = new Set()
    channelListeners.set(channel, set)
    isNew = true
  }
  set.add(listener)
  if (channel !== '*' && isNew) {
    send({ type: 'subscribe', payload: { channel } })
    ensureConnected()
  } else if (!isConfigured() && state === 'idle') {
    // no-op: stays idle, callers receive nothing
  }
  return () => {
    const current = channelListeners.get(channel)
    if (!current) return
    current.delete(listener)
    if (current.size === 0) {
      channelListeners.delete(channel)
      if (channel !== '*') {
        send({ type: 'unsubscribe', payload: { channel } })
      }
    }
  }
}

export function getState(): ConnectionState {
  return state
}

export function onStateChange(listener: (s: ConnectionState) => void): () => void {
  return stateEmitter.subscribe(listener)
}