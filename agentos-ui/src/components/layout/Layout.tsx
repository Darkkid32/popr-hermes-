import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Sidebar } from '../Sidebar';
import { TopNavigation } from './TopNavigation';
import { ToastStack } from '../ToastStack';
import { useUIStore } from '../../stores/UIStore';

interface LayoutProps {
  children: React.ReactNode;
  pageName?: string;
  location?: string;
}

export function Layout({ children, pageName, location }: LayoutProps) {
  const { sidebarCollapsed } = useUIStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="app min-h-screen bg-[var(--color-surface-primary)]">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      
      {/* Mobile sidebar overlay */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] bg-black/50 animate-in fade-in duration-200 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-[var(--z-sidebar)] bg-[var(--color-surface-primary)] border-r border-[var(--color-surface-border)]',
          'transition-all duration-300 ease-in-out',
          'flex flex-col',
          sidebarCollapsed ? 'w-16' : 'w-64',
          isMobile && !mobileSidebarOpen && '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Primary navigation"
      >
        <Sidebar />
      </aside>

      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed top-4 left-4 z-[var(--z-sidebar)] p-2 rounded-[var(--radius-md)] bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] shadow-[var(--shadow-lg)] lg:hidden"
          aria-label="Open sidebar"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      )}

      {/* Main content area */}
      <div className={clsx(
        'flex-1 min-h-screen',
        'lg:ml-64',
        'transition-all duration-300'
      )}>
        {/* Top Navigation */}
        <TopNavigation pageName={pageName} location={location || 'LOCAL · BANGKOK'} />
        
        {/* Main content */}
        <main id="main" className="content flex-1" role="main">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <ToastStack />
    </div>
  );
}

export default Layout;
