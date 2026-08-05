// CommandPalette Component - Fixed
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '../../utils';
import { Portal } from '../feedback/Portal';

interface Command {
  id: string;
  label: string;
  description?: string;
  category: string;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen?: boolean;
  onClose: () => void;
  commands?: Array<Command>;
  placeholder?: string;
}

const DEFAULT_COMMANDS: Array<Command> = [
  { id: 'nav-mission-control', label: 'Mission Control', description: 'Go to Mission Control dashboard', category: 'Navigation', action: () => {}, keywords: ['mission', 'control', 'dashboard', 'home'] },
  { id: 'nav-organization', label: 'Organization', description: 'Manage organization, teams, users', category: 'Navigation', action: () => {}, keywords: ['organization', 'teams', 'users', 'rbac'] },
  { id: 'nav-security', label: 'Security', description: 'Security posture, threats, vulnerabilities', category: 'Navigation', action: () => {}, keywords: ['security', 'threats', 'vulnerabilities', 'compliance'] },
  { id: 'nav-observability', label: 'Observability', description: 'Metrics, logs, traces, alerts', category: 'Navigation', action: () => {}, keywords: ['observability', 'metrics', 'logs', 'traces', 'alerts'] },
  { id: 'nav-automation', label: 'Automation', description: 'Workflows, templates, execution history', category: 'Navigation', action: () => {}, keywords: ['automation', 'workflows', 'templates'] },
  { id: 'nav-models', label: 'Models', description: 'Model catalog, benchmarks, routing', category: 'Navigation', action: () => {}, keywords: ['models', 'catalog', 'benchmarks', 'routing'] },
  { id: 'nav-memory', label: 'Memory & Knowledge', description: 'Knowledge graph, vector search, notes', category: 'Navigation', action: () => {}, keywords: ['memory', 'knowledge', 'graph', 'search', 'notes'] },
  { id: 'nav-plugins', label: 'Plugins', description: 'Plugin marketplace, installed plugins', category: 'Navigation', action: () => {}, keywords: ['plugins', 'marketplace', 'installed'] },
  { id: 'nav-skills', label: 'Skills', description: 'Skill marketplace, builder, templates', category: 'Navigation', action: () => {}, keywords: ['skills', 'builder', 'templates'] },
  { id: 'nav-mcp', label: 'MCP', description: 'MCP servers, tools, resources, prompts', category: 'Navigation', action: () => {}, keywords: ['mcp', 'servers', 'tools', 'resources'] },
  { id: 'nav-settings', label: 'Settings', description: 'General, appearance, integrations, privacy', category: 'Navigation', action: () => {}, keywords: ['settings', 'preferences', 'appearance', 'integrations'] },
];

export const CommandPalette = ({
  isOpen = true,
  onClose,
  commands = DEFAULT_COMMANDS,
  placeholder = 'Type a command or search...',
}: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      const grouped: Record<string, any[]> = {};
      commands.forEach(cmd => {
        if (!grouped[cmd.category]) grouped[cmd.category] = [];
        grouped[cmd.category].push(cmd);
      });
      return Object.entries(grouped).flatMap(([category, cmds]) => [
        { type: 'category' as const, category },
        ...cmds.map(cmd => ({ type: 'command' as const, command: cmd }))
      ]);
    }

    const lowerQuery = query.toLowerCase();
    return commands
      .filter(cmd =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.description?.toLowerCase().includes(lowerQuery) ||
        cmd.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
      )
      .map(cmd => ({ type: 'command' as const, command: cmd }));
  }, [commands, query]);

  const commandItems = filteredCommands.filter(item => item.type === 'command') as Array<{ type: 'command'; command: any }>;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (commandItems[selectedIndex]) {
      const element = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
      element?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, commandItems]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, commandItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (commandItems[selectedIndex]) {
          commandItems[selectedIndex].command.action();
          onClose();
        }
        break;
    }
  };

  const handleCommandClick = (command: any) => {
    command.action();
    onClose();
  };

  if (!isOpen) return null;

  const renderCommandItem = (item: any, index: number) => {
    if (item.type === 'category') {
      return (
        <li key={item.category} className="px-4 py-2 text-[var(--text-label-caps)] text-[var(--color-text-tertiary)] bg-[var(--color-surface-container-low)] border-b border-[var(--color-border-primary)]">
          {item.category}
        </li>
      );
    }

    const cmd = item.command;
    return (
      <li
        key={cmd.id}
        role="option"
        aria-selected={selectedIndex === index}
        data-index={index}
        className={cn(
          'px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors',
          'hover:bg-[var(--color-surface-container-low)]',
          selectedIndex === index && 'bg-[var(--color-primary-glow)]'
        )}
        onClick={() => handleCommandClick(cmd)}
        onMouseEnter={() => setSelectedIndex(index)}
      >
        {cmd.icon && (
          <span className="w-5 h-5 flex-shrink-0 text-[var(--color-text-tertiary)]">
            {cmd.icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium text-[var(--text-body-sm)] truncate',
            selectedIndex === index && 'text-[var(--color-primary-base)]'
          )}>
            {cmd.label}
          </p>
          {cmd.description && (
            <p className="text-[var(--text-body-xs)] text-[var(--color-text-tertiary)] truncate mt-0.5">
              {cmd.description}
            </p>
          )}
        </div>
        {cmd.shortcut && (
          <kbd className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-tertiary)] bg-[var(--color-surface-container-high)] rounded-[var(--radius-sm)]">
            {cmd.shortcut.meta && <span className="uppercase">⌘</span>}
            {cmd.shortcut.ctrl && <span className="uppercase">Ctrl</span>}
            {cmd.shortcut.shift && <span className="uppercase">⇧</span>}
            {cmd.shortcut.alt && <span className="uppercase">Alt</span>}
            <span className="uppercase">{cmd.shortcut.key}</span>
          </kbd>
        )}
      </li>
    );
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[var(--z-command-palette)] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-3xl animate-scale-in">
          <div className="bg-[var(--color-surface-container)] border border-[var(--color-border-primary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-level4)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-border-primary)]">
              <div className="relative">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16" y2="16"></line>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-background-base)] border border-[var(--color-border-primary)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] text-[var(--text-body-md)]"
                  autoFocus
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-mono text-[var(--color-text-tertiary)] bg-[var(--color-surface-container-high)] rounded-[var(--radius-sm)]">
                  <span className="uppercase">⌘</span>K
                </kbd>
              </div>
            </div>

            <ul ref={listRef} className="max-h-[400px] overflow-auto" role="listbox" aria-label="Commands">
              {filteredCommands.length === 0 ? (
                <li className="px-4 py-8 text-center text-[var(--color-text-tertiary)]">
                  No commands found
                </li>
              ) : (
                filteredCommands.map((item, index) => renderCommandItem(item, index))
              )}
            </ul>

            <div className="px-4 py-3 border-t border-[var(--color-border-primary)] text-center">
              <p className="text-[var(--text-label-md)] text-[var(--color-text-tertiary)]">
                {commandItems.length} command{commandItems.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

CommandPalette.displayName = 'CommandPalette';