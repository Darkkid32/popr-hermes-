import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { readEnv, type EnvConfig } from '../services/config'

export interface PlatformConfig {
  env: EnvConfig
  featureFlags: Record<string, boolean>
  theme: 'dark' | 'light' | 'system'
  locale: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  animationsEnabled: boolean
  reducedMotion: boolean
  debugMode: boolean
}

interface ConfigProviderState {
  config: PlatformConfig
  loading: boolean
  error: Error | null
  updateConfig: (updates: Partial<PlatformConfig>) => void
  resetConfig: () => void
}

const defaultConfig: PlatformConfig = {
  env: { apiUrl: '', wsUrl: '' },
  featureFlags: {
    commandPalette: true,
    globalSearch: true,
    notifications: true,
    analytics: true,
    websocket: true,
    offlineMode: false,
  },
  theme: 'dark',
  locale: 'en-US',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  animationsEnabled: true,
  reducedMotion: false,
  debugMode: false,
}

// eslint-disable-next-line react/only-export-components
export const ConfigContext = createContext<ConfigProviderState | null>(null)

// eslint-disable-next-line react/only-export-components
export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return context
}

interface ConfigProviderProps {
  children: ReactNode
  initialConfig?: Partial<PlatformConfig>
}

export function ConfigProvider({ children, initialConfig = {} }: ConfigProviderProps) {
  const [state, setState] = useState<ConfigProviderState>({
    config: { ...defaultConfig, ...initialConfig },
    loading: true,
    error: null,
    updateConfig: () => {},
    resetConfig: () => {},
  })

  useEffect(() => {
    const env = readEnv()
    setState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        env,
      },
      loading: false,
    }))
  }, [])

  const updateConfig = (updates: Partial<PlatformConfig>) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, ...updates },
    }))
  }

  const resetConfig = () => {
    setState((prev) => ({
      ...prev,
      config: defaultConfig,
    }))
  }

  return (
    <ConfigContext.Provider
      value={{
        ...state,
        updateConfig,
        resetConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export function usePlatformConfig() {
  return useConfig()
}