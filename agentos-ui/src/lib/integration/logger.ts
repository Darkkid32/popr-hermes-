import { create } from 'zustand'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  stack?: string
}

interface LoggerState {
  logs: LogEntry[]
  maxLogs: number
  log: (level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) => void
  debug: (message: string, context?: Record<string, unknown>) => void
  info: (message: string, context?: Record<string, unknown>) => void
  warn: (message: string, context?: Record<string, unknown>) => void
  error: (message: string, context?: Record<string, unknown>, error?: Error) => void
  getLogs: (level?: LogLevel, since?: number) => LogEntry[]
  clearLogs: () => void
  setMaxLogs: (max: number) => void
}

let logIdCounter = 0

export const useLogger = create<LoggerState>((set, get) => ({
  logs: [],
  maxLogs: 5000,
  
  log: (level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) => {
    const entry: LogEntry = {
      id: `log-${++logIdCounter}-${Date.now()}`,
      timestamp: Date.now(),
      level,
      message,
      context,
      stack: error?.stack,
    }
    
    // Console output in development
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'debug' ? 'debug' : level === 'info' ? 'info' : level === 'warn' ? 'warn' : 'error'
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, context ?? '')
      if (error) console[consoleMethod](error)
    }
    
    set((state) => {
      const newLogs = [...state.logs, entry]
      if (newLogs.length > state.maxLogs) {
        newLogs.splice(0, newLogs.length - state.maxLogs)
      }
      return { logs: newLogs }
    })
  },
  
  debug: (message: string, context?: Record<string, unknown>) => {
    get().log('debug', message, context)
  },
  
  info: (message: string, context?: Record<string, unknown>) => {
    get().log('info', message, context)
  },
  
  warn: (message: string, context?: Record<string, unknown>) => {
    get().log('warn', message, context)
  },
  
  error: (message: string, context?: Record<string, unknown>, error?: Error) => {
    get().log('error', message, context, error)
  },
  
  getLogs: (level?: LogLevel, since?: number) => {
    const { logs } = get()
    let filtered = logs
    if (level) {
      filtered = filtered.filter((l) => l.level === level)
    }
    if (since) {
      filtered = filtered.filter((l) => l.timestamp >= since)
    }
    return filtered
  },
  
  clearLogs: () => {
    set({ logs: [] })
  },
  
  setMaxLogs: (max: number) => {
    set({ maxLogs: max })
  },
}))

export function logDebug(message: string, context?: Record<string, unknown>) {
  useLogger.getState().debug(message, context)
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  useLogger.getState().info(message, context)
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  useLogger.getState().warn(message, context)
}

export function logError(message: string, context?: Record<string, unknown>, error?: Error) {
  useLogger.getState().error(message, context, error)
}

export function getLogs(level?: LogLevel, since?: number) {
  return useLogger.getState().getLogs(level, since)
}