import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { readEnv, type EnvConfig, isConfigured } from '../services/config'

export interface EnvironmentInfo {
  env: EnvConfig
  isConfigured: boolean
  connectionState: 'idle' | 'connecting' | 'open' | 'closed' | 'error'
  platform: string
  userAgent: string
  screenResolution: string
  viewport: { width: number; height: number }
  colorScheme: 'dark' | 'light' | 'no-preference'
  language: string
  online: boolean
  cookieEnabled: boolean
  storage: { localStorage: boolean; sessionStorage: boolean }
  touchSupport: boolean
}

interface EnvironmentProviderState {
  environment: EnvironmentInfo
  loading: boolean
  refreshEnvironment: () => Promise<void>
}

const defaultEnvironment: EnvironmentInfo = {
  env: { apiUrl: '', wsUrl: '' },
  isConfigured: false,
  connectionState: 'idle',
  platform: navigator.platform,
  userAgent: navigator.userAgent,
  screenResolution: `${screen.width}x${screen.height}`,
  viewport: { width: window.innerWidth, height: window.innerHeight },
  colorScheme: 'dark',
  language: navigator.language,
  online: navigator.onLine,
  cookieEnabled: navigator.cookieEnabled,
  storage: {
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
  },
  touchSupport: 'ontouchstart' in window,
}

export const EnvironmentContext = createContext<EnvironmentProviderState | null>(null)

export function useEnvironment() {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('useEnvironment must be used within EnvironmentProvider')
  }
  return context
}

interface EnvironmentProviderProps {
  children: ReactNode
}

function getConnectionState(): 'idle' | 'connecting' | 'open' | 'closed' | 'error' {
  return 'idle'
}

function getColorScheme(): 'dark' | 'light' | 'no-preference' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function EnvironmentProvider({ children }: EnvironmentProviderProps) {
  const [state, setState] = useState<EnvironmentProviderState>({
    environment: defaultEnvironment,
    loading: true,
    refreshEnvironment: async () => {},
  })

  const updateEnvironment = () => {
    const env = readEnv()
    const colorScheme = getColorScheme()

    setState((prev) => {
      const newEnv: EnvironmentInfo = {
        ...prev.environment,
        env,
        isConfigured: isConfigured(),
        connectionState: getConnectionState(),
        viewport: { width: window.innerWidth, height: window.innerHeight },
        colorScheme,
        online: navigator.onLine,
      }
      return {
        ...prev,
        environment: newEnv,
      }
    })
  }

  useEffect(() => {
    updateEnvironment()

    const handleResize = () => {
      setState((prev) => {
        const newEnv: EnvironmentInfo = {
          ...prev.environment,
          viewport: { width: window.innerWidth, height: window.innerHeight },
        }
        return {
          ...prev,
          environment: newEnv,
        }
      })
    }

    const handleOnline = () => {
      setState((prev) => {
        const newEnv: EnvironmentInfo = {
          ...prev.environment,
          online: true,
        }
        return {
          ...prev,
          environment: newEnv,
        }
      })
    }

    const handleOffline = () => {
      setState((prev) => {
        const newEnv: EnvironmentInfo = {
          ...prev.environment,
          online: false,
        }
        return {
          ...prev,
          environment: newEnv,
        }
      })
    }

    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setState((prev) => {
        const newEnv: EnvironmentInfo = {
          ...prev.environment,
          colorScheme: e.matches ? 'dark' : 'light',
        }
        return {
          ...prev,
          environment: newEnv,
        }
      })
    }

    const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)')
    colorSchemeMedia.addEventListener('change', handleColorSchemeChange)

    window.addEventListener('resize', handleResize)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      colorSchemeMedia.removeEventListener('change', handleColorSchemeChange)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const refreshEnvironment = async () => {
    updateEnvironment()
  }

  return (
    <EnvironmentContext.Provider
      value={{
        ...state,
        refreshEnvironment,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironmentInfo() {
  return useEnvironment()
}