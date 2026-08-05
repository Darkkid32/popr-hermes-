// useKeyboardShortcut Hook
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
  global?: boolean; // If true, works even when inputs are focused
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions): void {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs (unless global)
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;

    for (const shortcut of shortcutsRef.current) {
      if (isInput && !shortcut.global) continue;

      const metaMatch = shortcut.meta ? (event.metaKey || event.ctrlKey) : !(event.metaKey || event.ctrlKey);
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (metaMatch && ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
        break;
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

// Global keyboard shortcuts registry
const globalShortcuts: KeyboardShortcut[] = [];
let isGlobalListenerActive = false;

export function registerGlobalShortcut(shortcut: KeyboardShortcut): () => void {
  // Remove existing with same key combination
  const key = getShortcutKey(shortcut);
  const index = globalShortcuts.findIndex(s => getShortcutKey(s) === key);
  if (index >= 0) {
    globalShortcuts.splice(index, 1);
  }
  globalShortcuts.push(shortcut);

  if (!isGlobalListenerActive) {
    activateGlobalListener();
  }

  return () => unregisterGlobalShortcut(shortcut);
}

export function unregisterGlobalShortcut(shortcut: KeyboardShortcut): void {
  const key = getShortcutKey(shortcut);
  const index = globalShortcuts.findIndex(s => getShortcutKey(s) === key);
  if (index >= 0) {
    globalShortcuts.splice(index, 1);
  }

  if (globalShortcuts.length === 0) {
    deactivateGlobalListener();
  }
}

function getShortcutKey(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  if (shortcut.meta) parts.push('Meta');
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  parts.push(shortcut.key.toUpperCase());
  return parts.join('+');
}

let globalHandler: ((event: KeyboardEvent) => void) | null = null;

function activateGlobalListener(): void {
  if (isGlobalListenerActive) return;
  isGlobalListenerActive = true;

  globalHandler = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;

    for (const shortcut of globalShortcuts) {
      if (isInput && !shortcut.global) continue;

      const metaMatch = shortcut.meta ? (event.metaKey || event.ctrlKey) : !(event.metaKey || event.ctrlKey);
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (metaMatch && ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
        break;
      }
    }
  };

  document.addEventListener('keydown', globalHandler);
}

function deactivateGlobalListener(): void {
  if (!isGlobalListenerActive || !globalHandler) return;
  isGlobalListenerActive = false;
  document.removeEventListener('keydown', globalHandler);
  globalHandler = null;
}

// Predefined shortcuts for Hermes
export const HERMES_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'k', meta: true, action: () => {}, description: 'Open Workspace Switcher', global: true },
  { key: 'p', meta: true, shift: true, action: () => {}, description: 'Open Command Palette', global: true },
  { key: 'n', meta: true, shift: true, action: () => {}, description: 'Open Notifications', global: true },
  { key: '/', meta: true, action: () => {}, description: 'Focus Global Search', global: true },
  { key: 'b', meta: true, action: () => {}, description: 'Toggle Sidebar', global: true },
  { key: ',', meta: true, action: () => {}, description: 'Open Settings', global: true },
  { key: '?', meta: true, shift: true, action: () => {}, description: 'Show Keyboard Shortcuts', global: true },
];

// Hook to register Hermes default shortcuts
export function useHermesShortcuts(actions: {
  openWorkspaceSwitcher?: () => void;
  openCommandPalette?: () => void;
  openNotifications?: () => void;
  focusSearch?: () => void;
  toggleSidebar?: () => void;
  openSettings?: () => void;
  showShortcuts?: () => void;
}): void {
  useKeyboardShortcuts({
    shortcuts: [
      { key: 'k', meta: true, action: actions.openWorkspaceSwitcher || (() => {}), description: 'Workspace Switcher', global: true },
      { key: 'p', meta: true, shift: true, action: actions.openCommandPalette || (() => {}), description: 'Command Palette', global: true },
      { key: 'n', meta: true, shift: true, action: actions.openNotifications || (() => {}), description: 'Notifications', global: true },
      { key: '/', meta: true, action: actions.focusSearch || (() => {}), description: 'Global Search', global: true },
      { key: 'b', meta: true, action: actions.toggleSidebar || (() => {}), description: 'Toggle Sidebar', global: true },
      { key: ',', meta: true, action: actions.openSettings || (() => {}), description: 'Settings', global: true },
      { key: '?', meta: true, shift: true, action: actions.showShortcuts || (() => {}), description: 'Keyboard Shortcuts', global: true },
    ],
  });
}