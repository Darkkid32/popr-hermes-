import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export interface ThemeConfig {
  theme: Theme
  respectSystemPreference: boolean
  customColors?: Record<string, string>
}

export interface ThemeState {
  theme: Theme
  resolvedTheme: 'dark' | 'light'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setRespectSystemPreference: (respect: boolean) => void
  applyCustomColors: (colors: Record<string, string>) => void
  resetCustomColors: () => void
}

interface ThemeProviderState extends ThemeState {
  config: ThemeConfig
}

export const ThemeContext = createContext<ThemeProviderState | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
  initialTheme?: Theme
  initialConfig?: Partial<ThemeConfig>
}

export function ThemeProvider({ children, initialTheme = 'system', initialConfig = {} }: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>({
    ...{ theme: initialTheme, respectSystemPreference: true },
    ...initialConfig,
  })
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')

  const updateResolvedTheme = () => {
    if (config.theme === 'system') {
      setResolvedTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    } else {
      setResolvedTheme(config.theme)
    }
  }

  useEffect(() => {
    updateResolvedTheme()

    if (config.theme === 'system' && config.respectSystemPreference) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => updateResolvedTheme()
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [config.theme, config.respectSystemPreference])

  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    if (config.customColors) {
      Object.entries(config.customColors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
    }
  }, [resolvedTheme, config.customColors])

  const setTheme = (theme: Theme) => {
    setConfig((prev) => ({ ...prev, theme }))
  }

  const toggleTheme = () => {
    setConfig((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : prev.theme === 'light' ? 'system' : 'dark',
    }))
  }

  const setRespectSystemPreference = (respect: boolean) => {
    setConfig((prev) => ({ ...prev, respectSystemPreference: respect }))
  }

  const applyCustomColors = (colors: Record<string, string>) => {
    setConfig((prev) => ({ ...prev, customColors: colors }))
  }

  const resetCustomColors = () => {
    setConfig((prev) => ({ ...prev, customColors: undefined }))
  }

  const value = {
    theme: config.theme,
    resolvedTheme,
    config,
    setTheme,
    toggleTheme,
    setRespectSystemPreference,
    applyCustomColors,
    resetCustomColors,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeState() {
  return useTheme()
}