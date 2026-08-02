import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export interface UserPreferences {
  // General
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'

  // UI
  theme: 'dark' | 'light' | 'system'
  animationsEnabled: boolean
  reducedMotion: boolean
  compactMode: boolean
  sidebarCollapsed: boolean

  // Notifications
  notificationsEnabled: boolean
  notificationSounds: boolean
  desktopNotifications: boolean
  notificationDuration: number

  // Behavior
  autoSave: boolean
  confirmDestructiveActions: boolean
  showTooltips: boolean
  keyboardShortcutsEnabled: boolean

  // Privacy
  analyticsOptIn: boolean
  crashReporting: boolean

  // Workspace
  defaultWorkspace: string
  rememberLastWorkspace: boolean
  rememberTabState: boolean

  // Developer
  debugMode: boolean
  showPerformanceMetrics: boolean
}

export interface PreferencesState {
  preferences: UserPreferences
  isLoading: boolean
  lastSynced: number | null
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
  resetPreferences: () => void
  resetToDefaults: () => void
  save: () => Promise<void>
  load: () => Promise<void>
  export: () => string
  import: (json: string) => void
}

const defaultPreferences: UserPreferences = {
  language: 'en-US',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  theme: 'system',
  animationsEnabled: true,
  reducedMotion: false,
  compactMode: false,
  sidebarCollapsed: false,
  notificationsEnabled: true,
  notificationSounds: true,
  desktopNotifications: true,
  notificationDuration: 5000,
  autoSave: true,
  confirmDestructiveActions: true,
  showTooltips: true,
  keyboardShortcutsEnabled: true,
  analyticsOptIn: false,
  crashReporting: true,
  defaultWorkspace: 'mission',
  rememberLastWorkspace: true,
  rememberTabState: true,
  debugMode: false,
  showPerformanceMetrics: false,
}

const STORAGE_KEY = 'hermes-user-preferences'

export const PreferencesContext = createContext<PreferencesState | null>(null)

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }
  return context
}

interface PreferencesProviderProps {
  children: ReactNode
  autoSave?: boolean
  syncInterval?: number
}

export function PreferencesProvider({ children, autoSave = true, syncInterval = 30000 }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load from localStorage on init
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) }
      }
    } catch {
      // Ignore parse errors
    }
    return defaultPreferences
  })
  const [isLoading, setIsLoading] = useState(false)
  const [lastSynced, setLastSynced] = useState<number | null>(null)

  // Load from localStorage
  const load = async () => {
    setIsLoading(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(stored) })
      }
      setLastSynced(Date.now())
    } catch (error) {
      console.error('Failed to load preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save to localStorage
  const save = useCallback(async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
      setLastSynced(Date.now())
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }, [preferences])

  // Auto-save
  useEffect(() => {
    if (!autoSave) return
    const interval = setInterval(() => {
      save()
    }, syncInterval)
    return () => clearInterval(interval)
  }, [autoSave, syncInterval, preferences])

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      save()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [save])

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }))
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
  }

  const resetToDefaults = () => {
    setPreferences(defaultPreferences)
    save()
  }

  const exportPreferences = () => {
    return JSON.stringify(preferences, null, 2)
  }

  const importPreferences = (json: string) => {
    try {
      const imported = JSON.parse(json)
      setPreferences({ ...defaultPreferences, ...imported })
      save()
    } catch (error) {
      throw new Error('Invalid preferences JSON')
    }
  }

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        lastSynced,
        updatePreference,
        updatePreferences,
        resetPreferences,
        resetToDefaults,
        save,
        load,
        export: exportPreferences,
        import: importPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferencesState() {
  return usePreferences()
}