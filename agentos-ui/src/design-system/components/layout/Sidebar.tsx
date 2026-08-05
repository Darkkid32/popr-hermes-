// Sidebar Component - Fixed
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { forwardRef, useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  badge?: { label: string; variant: 'success' | 'warning' | 'error' | 'info' };
  children?: Array<{ id: string; label: string; icon?: React.ReactNode; disabled?: boolean }>;
}

interface SidebarProps {
  items: NavItem[];
  activeItem?: string;
  onItemClick: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  user?: { name: string; role: string; avatar?: string };
}

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 280;

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ items, activeItem, onItemClick, collapsed = false, onToggleCollapse: _onToggleCollapse, user: _user }, ref) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
      if (isMobileOpen && activeItem) setIsMobileOpen(false);
    }, [activeItem, isMobileOpen]);

    const handleItemClick = (item: NavItem) => {
      onItemClick(item.id);
    };

    const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

    return (
      <aside
        ref={ref}
        className="flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-out relative z-50"
        style={{ width, minWidth: width, maxWidth: width }}
        role="navigation"
        aria-label="Workspace navigation"
      >
        <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800 flex-shrink-0 transition-opacity duration-150">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-500 font-bold text-white flex-shrink-0">H</div>
          {!collapsed && (
            <>
              <span className="font-semibold text-lg text-white truncate">Hermes</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">AI OS</span>
            </>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1" role="navigation" aria-label="Main navigation">
          {items.map((item, _index) => {
            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  role={item.children && item.children.length > 0 ? 'treeitem' : 'menuitem'}
                  aria-selected={activeItem === item.id}
                  aria-expanded={item.children && item.children.length > 0 ? true : undefined}
                  aria-disabled={item.disabled}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
                  onClick={() => handleItemClick(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onItemClick(item.id); }
                    else if (e.key === 'ArrowDown') e.preventDefault();
                    else if (e.key === 'ArrowUp') e.preventDefault();
                    else if (e.key === 'Escape') { /* handle escape */ }
                  }}
                  disabled={item.disabled}
                  title={collapsed && !item.children ? item.label : undefined}
                >
                  <span className="flex-shrink-0 w-5 h-5" style={{ marginLeft: collapsed ? 'auto' : 0 }}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                </button>
              </div>
            )}
          )}
        </nav>

        <div className="p-3 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-white bg-slate-800 flex-shrink-0">U</div>
            <button
              type="button"
              className="ml-auto p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Collapse sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>

          {typeof window !== 'undefined' && window.innerWidth < 768 && (
            <div className="fixed inset-0 bg-black/90 z-50" onClick={() => setIsMobileOpen(false)} aria-hidden="true" />
          )}
        </div>
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';