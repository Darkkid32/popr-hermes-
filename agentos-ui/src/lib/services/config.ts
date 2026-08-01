export type ConnectionState = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

export interface EnvConfig {
  apiUrl: string
  wsUrl: string
}

export function readEnv(): EnvConfig {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {}
  return {
    apiUrl: env.VITE_AGENTOS_API_URL ?? '',
    wsUrl: env.VITE_AGENTOS_WS_URL ?? '',
  }
}

export function isConfigured(): boolean {
  const env = readEnv()
  return env.wsUrl.length > 0 || env.apiUrl.length > 0
}

export class LiveSourceMissingError extends Error {
  constructor() {
    super('No live source connected')
    this.name = 'LiveSourceMissingError'
  }
}

type Listener<T> = (value: T) => void

export class Emitter<T> {
  private listeners = new Set<Listener<T>>()
  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
  emit(value: T): void {
    this.listeners.forEach((listener) => listener(value))
  }
  size(): number {
    return this.listeners.size
  }
}