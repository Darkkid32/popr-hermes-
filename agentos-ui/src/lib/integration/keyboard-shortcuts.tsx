import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export interface KeyboardShortcut {
  id: string
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  action: () => void
  group: string
  enabled?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface ShortcutGroup {
  id: string
  name: string
  shortcuts: KeyboardShortcut[]
}

export interface KeyboardShortcutsState {
  shortcuts: Map<string, KeyboardShortcut>
  groups: ShortcutGroup[]
  enabled: boolean
  registerShortcut: (shortcut: KeyboardShortcut) => void
  unregisterShortcut: (id: string) => void
  registerGroup: (group: ShortcutGroup) => void
  unregisterGroup: (id: string) => void
  setEnabled: (enabled: boolean) => void
  getShortcut: (id: string) => KeyboardShortcut | undefined
  getGroup: (id: string) => ShortcutGroup | undefined
  getAllShortcuts: () => KeyboardShortcut[]
  getShortcutsByGroup: (groupId: string) => KeyboardShortcut[]
  executeShortcut: (id: string) => boolean
}

const defaultGroups: ShortcutGroup[] = [
  {
    id: 'global',
    name: 'Global',
    shortcuts: [],
  },
  {
    id: 'navigation',
    name: 'Navigation',
    shortcuts: [],
  },
  {
    id: 'editing',
    name: 'Editing',
    shortcuts: [],
  },
  {
    id: 'workspace',
    name: 'Workspace',
    shortcuts: [],
  },
  {
    id: 'system',
    name: 'System',
    shortcuts: [],
  },
]
// eslint-disable-next-line react/only-export-components
export const KeyboardShortcutsContext = createContext<KeyboardShortcutsState | null>(null)

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext)
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider')
  }
  return context
}

interface KeyboardShortcutsProviderProps {
  children: ReactNode
  initialShortcuts?: KeyboardShortcut[]
}

export function KeyboardShortcutsProvider({ children, initialShortcuts = [] }: KeyboardShortcutsProviderProps) {
  const [shortcuts, setShortcuts] = useState<Map<string, KeyboardShortcut>>(
    new Map(initialShortcuts.map(s => [s.id, s]))
  )
  const [groups, setGroups] = useState<ShortcutGroup[]>(defaultGroups)
  const [enabled, setEnabledState] = useState(true)

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Allow shortcuts with ctrl/cmd+meta even in inputs
        if (!event.ctrlKey && !event.metaKey) return
      }

      for (const shortcut of shortcuts.values()) {
        if (!shortcut.enabled) continue

        const ctrlMatch = (shortcut.ctrl ?? false) === event.ctrlKey
        const metaMatch = (shortcut.meta ?? false) === event.metaKey
        const shiftMatch = (shortcut.shift ?? false) === event.shiftKey
        const altMatch = (shortcut.alt ?? false) === event.altKey

        // Normalize key
        const pressedKey = event.key.toLowerCase()
        const shortcutKey = shortcut.key.toLowerCase()

        if (
          pressedKey === shortcutKey &&
          ctrlMatch &&
          metaMatch &&
          shiftMatch &&
          altMatch
        ) {
          if (shortcut.preventDefault) event.preventDefault()
          if (shortcut.stopPropagation) event.stopPropagation()

          try {
            shortcut.action()
          } catch (error) {
            console.error(`Error executing shortcut ${shortcut.id}:`, error)
          }

          if (shortcut.preventDefault || shortcut.stopPropagation) {
            return
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, shortcuts])

  const registerShortcut = (shortcut: KeyboardShortcut) => {
    setShortcuts((prev) => {
      const newMap = new Map(prev)
      newMap.set(shortcut.id, shortcut)
      return newMap
    })
  }

  const unregisterShortcut = (id: string) => {
    setShortcuts((prev) => {
      const newMap = new Map(prev)
      newMap.delete(id)
      return newMap
    })
  }

  const registerGroup = (group: ShortcutGroup) => {
    setGroups((prev) => {
      const existingIndex = prev.findIndex((g) => g.id === group.id)
      if (existingIndex >= 0) {
        const newGroups = [...prev]
        newGroups[existingIndex] = group
        return newGroups
      }
      return [...prev, group]
    })
  }

  const unregisterGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id))
  }

  const setEnabled = (enabled: boolean) => {
    setEnabledState(enabled)
  }

  const getShortcut = (id: string) => {
    return shortcuts.get(id)
  }

  const getGroup = (id: string) => {
    return groups.find((g) => g.id === id)
  }

  const getAllShortcuts = () => {
    return Array.from(shortcuts.values())
  }

  const getShortcutsByGroup = (groupId: string) => {
    return Array.from(shortcuts.values()).filter((s) => s.group === groupId)
  }

  const executeShortcut = (id: string) => {
    const shortcut = shortcuts.get(id)
    if (shortcut && shortcut.enabled) {
      try {
        shortcut.action()
        return true
      } catch (error) {
        console.error(`Error executing shortcut ${id}:`, error)
        return false
      }
    }
    return false
  }

  const value = {
    shortcuts,
    groups,
    enabled,
    registerShortcut,
    unregisterShortcut,
    registerGroup,
    unregisterGroup,
    setEnabled,
    getShortcut,
    getGroup,
    getAllShortcuts,
    getShortcutsByGroup,
    executeShortcut,
  }

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
    </KeyboardShortcutsContext.Provider>
  )
}

export function useKeyboardShortcutsState() {
  return useKeyboardShortcuts()
}

export function registerKeyboardShortcut(_shortcut: KeyboardShortcut) {
  // eslint-disable-next-line react/only-export-components
  // This would need a global registry or context access
  console.warn('registerKeyboardShortcut requires provider context')
}

export function unregisterKeyboardShortcut(_id: string) {
  // eslint-disable-next-line react/only-export-components
  console.warn('unregisterKeyboardShortcut requires provider context')
}