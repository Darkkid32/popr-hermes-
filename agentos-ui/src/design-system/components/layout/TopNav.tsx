// TopNav Component - Fixed
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import React, { forwardRef, useState, useRef, useEffect } from 'react';

interface TopNavProps {
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string; onClick?: () => void }>;
  actions?: Array<{ label: string; onClick: () => void; variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'; icon?: React.ReactNode; disabled?: boolean }>;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  notifications?: Array<{ id: string; title: string; message?: string; time: string; type: 'info' | 'warning' | 'error' | 'success'; read?: boolean; onClick?: () => void }>;
  onNotificationClick?: (id: string) => void;
  user?: { name: string; email: string; role: string; avatar?: string };
  onUserMenuAction?: (action: string) => void;
}

export const TopNav = forwardRef<HTMLDivElement, TopNavProps>(
  ({ title, breadcrumbs = [], actions = [], searchPlaceholder = 'Search...', onSearch: _onSearch, notifications = [], onNotificationClick, user: _user, onUserMenuAction: _onUserMenuAction }, ref) => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { setSearchOpen(false); setNotificationsOpen(false); setUserMenuOpen(false); }
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') { e.preventDefault(); }
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'N') { e.preventDefault(); setNotificationsOpen(!notificationsOpen); }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (notificationsOpen && notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) setNotificationsOpen(false);
        if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [notificationsOpen, userMenuOpen]);

    useEffect(() => { if (searchOpen && searchInputRef.current) searchInputRef.current.focus(); }, [searchOpen]);

    return (
      <header ref={ref} className="h-11 flex-shrink-0 flex items-center justify-between px-4 lg:px-6 bg-slate-950 border-b border-slate-800 z-30" role="banner">
        <div className="flex items-center gap-3 lg:gap-4 flex-1 lg:flex-none min-w-0">
          <button className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="hidden lg:block">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg transition-all duration-150 hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" aria-haspopup="listbox" aria-expanded={false} aria-label="Switch workspace (⌘K)">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-500 text-white font-bold text-sm flex-shrink-0">H</span>
              <span className="font-medium text-sm text-white truncate max-w-[180px]">Mission Control</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 ml-auto"><polyline points="6 9 12 15 18 9"></polyline></svg>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 rounded-sm"><span>⌘</span>K</kbd>
            </button>
          </div>

          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 ml-4 lg:ml-6" aria-label="Breadcrumb" style={{ maxWidth: '400px' }}>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-1.5">
                  {index > 0 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 flex-shrink-0"><polyline points="9 18 15 12 9 6"></polyline></svg>}
                  {crumb.href ? (
                    <a href={crumb.href} onClick={e => { e.preventDefault(); crumb.onClick?.(); }} className="text-sm font-medium transition-colors hover:text-white">{crumb.label}</a>
                  ) : (
                    <span className="text-sm font-medium text-slate-400">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          <div className="ml-4 lg:ml-6 hidden lg:block" style={{ maxWidth: '500px' }}>
            <h1 className="text-xl font-semibold text-white truncate">{title}</h1>
          </div>
        </div>

        <div className="flex-1 lg:flex-none w-full lg:w-[400px] mx-4 lg:mx-6">
          <div className="relative">
            <button type="button" className="w-full flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg transition-all duration-150 hover:border-slate-600" onClick={() => setSearchOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 flex-shrink-0"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16" y2="16"></line></svg>
              <span className="text-sm text-slate-500 truncate">{searchPlaceholder}</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 rounded-sm"><span>⌘</span>K</kbd>
            </button>

            {searchOpen && (
              <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                <div className="w-full max-w-2xl animate-scale-in">
                  <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                    <input ref={searchInputRef} type="text" placeholder={searchPlaceholder} onChange={() => {}} onBlur={() => setTimeout(() => setSearchOpen(false), 100)} onKeyDown={() => setSearchOpen(false)} className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-base" autoFocus />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-mono text-slate-500 bg-slate-800 rounded-sm"><span>⌘</span>K</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          {actions.map((action, index) => (
            <button key={index} className="px-3 py-2 bg-cyan-500 text-black font-semibold rounded-lg transition-colors hover:bg-cyan-400" onClick={action.onClick} disabled={action.disabled}>
              {action.icon} {action.label}
            </button>
          ))}

          <button className="hidden sm:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" aria-label="Command palette (⌘⇧P)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </button>

          <div className="relative" ref={notificationsRef}>
            <button className="relative p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`} aria-expanded={notificationsOpen} aria-haspopup="true" onClick={() => setNotificationsOpen(!notificationsOpen)}>
              <span className="relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </span>
            </button>

            {notificationsOpen && (
              <div className="fixed right-4 top-full mt-2 z-50 w-96" ref={notificationsRef}>
                <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                    <h3 className="font-semibold text-sm text-white">Notifications</h3>
                    <button className="text-sm text-slate-400 hover:text-white">Mark all read</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">No notifications</div>
                    ) : (
                      <ul role="list" aria-label="Notifications">
                        {notifications.map(notification => (
                          <li key={notification.id} className="px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors" onClick={() => { onNotificationClick?.(notification.id); setNotificationsOpen(false); }}>
                            <div className="flex items-start gap-3">
                              <span className="w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-cyan-400" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{notification.title}</p>
                                {notification.message && <p className="text-xs text-slate-500 mt-0.5 truncate">{notification.message}</p>}
                                <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-slate-700">
                    <button className="w-full text-center text-sm text-cyan-400 hover:text-cyan-300">View all notifications</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-800 transition-colors" onClick={() => setUserMenuOpen(!userMenuOpen)} aria-expanded={userMenuOpen} aria-haspopup="true">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-white bg-slate-800 flex-shrink-0">U</div>
              <span className="hidden md:block text-sm font-medium text-white truncate max-w-[120px]">User</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {userMenuOpen && (
              <div className="fixed right-4 top-full mt-2 z-50 w-56" ref={userMenuRef}>
                <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="font-medium text-sm text-white">User</p>
                    <p className="text-xs text-slate-400">user@example.com</p>
                    <p className="text-xs text-cyan-400">Admin</p>
                  </div>
                  <nav role="menu">
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>Profile & Preferences</button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>Appearance</button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>Keyboard Shortcuts</button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>API Keys</button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>Sessions & Devices</button>
                    <hr className="border-slate-700 mx-2 my-1" />
                    <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-400 transition-colors" onClick={() => setUserMenuOpen(false)}>Sign Out</button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
);

TopNav.displayName = 'TopNav';