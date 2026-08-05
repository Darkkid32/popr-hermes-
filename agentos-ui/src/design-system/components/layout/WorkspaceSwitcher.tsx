// WorkspaceSwitcher Component - Fixed
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import React, { useState, useRef, useEffect, useMemo } from 'react';

interface Workspace {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  route: string;
  category: 'core' | 'platform' | 'management' | 'settings';
  comingSoon?: boolean;
}

interface WorkspaceSwitcherProps {
  workspaces?: Workspace[];
  activeWorkspace?: string;
  onSwitch?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
  showRecent?: boolean;
  maxRecent?: number;
}

const DEFAULT_WORKSPACES: Workspace[] = [
  { id: 'mission-control', name: 'Mission Control', icon: '🎯', description: 'System overview & fleet management', route: '/mission-control', category: 'core' },
  { id: 'organization', name: 'Organization', icon: '👥', description: 'Teams, RBAC, audit logs', route: '/organization', category: 'management' },
  { id: 'security', name: 'Security', icon: '🛡️', description: 'Threats, vulnerabilities, compliance', route: '/security', category: 'management' },
  { id: 'observability', name: 'Observability', icon: '📊', description: 'Metrics, logs, traces, alerts', route: '/observability', category: 'platform' },
  { id: 'automation', name: 'Automation', icon: '⚙️', description: 'Workflows, templates, execution', route: '/automation', category: 'platform' },
  { id: 'models', name: 'Models', icon: '🧠', description: 'Catalog, benchmarks, routing, endpoints', route: '/models', category: 'platform' },
  { id: 'memory', name: 'Memory & Knowledge', icon: '🔗', description: 'Graph, vector search, notes, Omi', route: '/memory', category: 'platform' },
  { id: 'plugins', name: 'Plugins', icon: '🔌', description: 'Marketplace, installed, development', route: '/plugins', category: 'platform' },
  { id: 'skills', name: 'Skills', icon: '🎓', description: 'Marketplace, builder, templates', route: '/skills', category: 'platform' },
  { id: 'mcp', name: 'MCP', icon: '🔧', description: 'Servers, tools, resources, prompts', route: '/mcp', category: 'platform' },
  { id: 'settings', name: 'Settings', icon: '⚙️', description: 'General, appearance, integrations, privacy', route: '/settings', category: 'settings' },
];

function renderWorkspaceItem(workspace: Workspace, index: number, activeWorkspace: string | undefined, handleWorkspaceClick: (workspace: Workspace) => void, setSelectedIndex: (index: number) => void) {
  return (
    <li
      key={workspace.id}
      role="option"
      aria-selected={workspace.id === activeWorkspace}
      data-index={index}
      className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors hover:bg-slate-800/50"
      onClick={() => handleWorkspaceClick(workspace)}
      onMouseEnter={() => setSelectedIndex(index)}
    >
      <span className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-slate-400 text-xl flex-shrink-0">
        {workspace.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate text-white">{workspace.name}</p>
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">{workspace.description}</p>
      </div>
      {activeWorkspace === workspace.id && <span className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" aria-hidden="true" />}
    </li>
  );
}

export const WorkspaceSwitcher = ({
  workspaces = DEFAULT_WORKSPACES,
  activeWorkspace,
  onSwitch,
  className: _className,
  style: _style,
  showRecent: _showRecent,
  maxRecent: _maxRecent,
}: WorkspaceSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredWorkspaces = useMemo(() => {
    if (!query.trim()) return workspaces;
    const lowerQuery = query.toLowerCase();
    return workspaces.filter(w =>
      w.name.toLowerCase().includes(lowerQuery) ||
      w.description.toLowerCase().includes(lowerQuery) ||
      w.category.toLowerCase().includes(lowerQuery) ||
      w.id.toLowerCase().includes(lowerQuery)
    );
  }, [workspaces, query]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (filteredWorkspaces[selectedIndex] && listRef.current) {
      const element = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      element?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, filteredWorkspaces]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setQuery('');
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleWorkspaceClick = (workspace: Workspace) => {
    onSwitch?.(workspace.id);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg transition-all duration-150 hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Switch workspace (⌘K)"
      >
        <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-500 text-white font-bold text-sm flex-shrink-0">H</span>
        <span className="font-medium text-sm text-white truncate max-w-[180px]">
          {workspaces.find(w => w.id === activeWorkspace)?.name || 'Workspaces'}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 ml-auto">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 rounded-sm">
          <span>⌘</span>K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-xl animate-scale-in">
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700">
                <div className="relative">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16" y2="16"></line>
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search workspaces..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Escape') setIsOpen(false);
                      if (e.key === 'ArrowDown') e.preventDefault();
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-base"
                    autoFocus
                  />
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-mono text-slate-500 bg-slate-800 rounded-sm">
                    <span>⌘</span>K
                  </kbd>
                </div>
              </div>

              <ul ref={listRef} className="max-h-[400px] overflow-auto" role="listbox" aria-label="Workspaces">
                {workspaces.length === 0 ? (
                  <li className="px-4 py-8 text-center text-slate-500">No workspaces available</li>
                ) : (
                  workspaces.map((workspace, index) => renderWorkspaceItem(workspace, index, activeWorkspace, handleWorkspaceClick, setSelectedIndex))
                )}
              </ul>

              <div className="px-4 py-3 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <kbd className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-slate-500 bg-slate-800 rounded-sm">
                    <span>⌘</span>K
                  </kbd>
                  <span className="text-xs text-slate-500">{filteredWorkspaces.length} workspace{filteredWorkspaces.length !== 1 ? 's' : ''} found</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

WorkspaceSwitcher.displayName = 'WorkspaceSwitcher';