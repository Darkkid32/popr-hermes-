import { useState, useRef, useEffect } from 'react';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';
import { useUIStore } from '../../stores/UIStore';

interface TopNavProps {
  pageName?: string;
  location?: string;
  date?: string;
  systemStatus?: string;
}

export function TopNavigation({
  pageName = 'Machine Control',
  location = 'LOCAL · BANGKOK',
  date,
  systemStatus = 'All Systems'
}: TopNavProps) {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { toggleTheme } = useUIStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  const currentDate = date || new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, ' ').toUpperCase();

  return (
    <header className="header">
      <div className="header-left">
        <span>{location}</span>
        <span className="sep">·</span>
        <span>{currentDate}</span>
        <span className="sep">·</span>
        <span className="page-name">{pageName}</span>
      </div>
      <div className="header-right">
        <button className="sys-pill" aria-label="System status">
          <span className="rainbow-dot" />
          <span>{systemStatus}</span>
        </button>
        <div className="sep">·</div>
        <Tooltip content="Theme" position="bottom">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Toggle theme"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </Tooltip>

        <div className="sep">·</div>

        <Tooltip content="Notifications" position="bottom">
          <button
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors relative"
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-[var(--color-status-error)] text-[var(--color-text-inverse)] text-[var(--text-xs)] font-medium rounded-full flex items-center justify-center">3</span>
          </button>
        </Tooltip>

        <Tooltip content="Settings" position="bottom">
          <button
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Settings"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </Tooltip>

        <div className="sep">·</div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="User menu"
            aria-expanded={showProfile}
            aria-haspopup="true"
          >
            <Avatar
              src="/favicon.svg"
              alt="User avatar"
              fallback="AO"
              size="sm"
              status="online"
            />
            <span className="hidden sm:inline text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
              Alex Operator
            </span>
            <svg className="h-4 w-4 text-[var(--color-text-tertiary)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.707-3.707a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {showProfile && (
            <div
              className="absolute right-0 top-full mt-1 w-48 bg-[var(--color-surface-primary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--color-surface-border)] py-1 animate-in fade-in-0 zoom-in-95 duration-150"
              style={{ zIndex: 1000 }}
            >
              <div className="px-3 py-2 border-b border-[var(--color-surface-border)]">
                <p className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">Alex Operator</p>
                <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">System conductor</p>
              </div>
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-[var(--text-sm)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-[var(--text-sm)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                Settings
              </a>
              <hr className="my-1 border-[var(--color-surface-border)]" />
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-[var(--text-sm)] text-[var(--color-status-error)] hover:bg-[var(--color-status-error-bg)]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavigation;
