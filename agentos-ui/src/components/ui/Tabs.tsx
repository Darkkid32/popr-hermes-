import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  items,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    const item = items.find(i => i.id === tabId);
    if (item?.disabled) return;
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const containerStyles = {
    default: 'border-b border-[var(--color-surface-border)]',
    pills: '',
    underline: 'border-b border-[var(--color-surface-border)]',
  };

  const tabStyles = {
    default: 'px-4 py-2 text-[var(--text-sm)] font-medium transition-colors ' +
             'text-[var(--color-text-tertiary)] ' +
             'hover:text-[var(--color-text-primary)] ' +
             'data-[state=active]:text-[var(--color-brand-500)] ' +
             'data-[state=active]:font-semibold',
    pills: 'px-3 py-1.5 text-[var(--text-sm)] font-medium rounded-[var(--radius-md)] ' +
           'text-[var(--color-text-tertiary)] ' +
           'hover:bg-[var(--color-surface-hover)] ' +
           'data-[state=active]:bg-[var(--color-brand-500)] ' +
           'data-[state=active]:text-[var(--color-text-inverse)] ' +
           'data-[state=active]:shadow-[var(--shadow-sm)]',
    underline: 'px-4 py-2 text-[var(--text-sm)] font-medium ' +
               'border-b-2 border-transparent ' +
               'text-[var(--color-text-tertiary)] ' +
               'hover:text-[var(--color-text-primary)] ' +
               'data-[state=active]:text-[var(--color-brand-500)] ' +
               'data-[state=active]:font-semibold ' +
               'data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-brand-500)]',
  };

  const badgeVariantStyles = {
    success: 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]',
    warning: 'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)]',
    error: 'bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]',
    info: 'bg-[var(--color-status-info-bg)] text-[var(--color-status-info)]',
    default: 'bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]',
  };

  return (
    <div className={clsx(containerStyles[variant], fullWidth && 'w-full', className)}>
      <div className="flex gap-1" role="tablist" aria-orientation="horizontal">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-disabled={item.disabled}
              disabled={item.disabled}
              onClick={() => handleTabClick(item.id)}
              className={clsx(
                'relative flex items-center gap-1.5 font-medium transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                tabStyles[variant],
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              id={`tab-${item.id}`}
              aria-controls={`panel-${item.id}`}
              data-state={isActive ? 'active' : 'inactive'}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && (
                <span className={clsx(
                  'ml-1.5 px-1.5 py-0.5 text-[var(--text-xs)] font-medium rounded-full',
                  badgeVariantStyles[item.badgeVariant || 'default']
                )}>
                  {item.badge}
                </span>
              )}
              {variant === 'default' && isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand-500)] transition-all duration-200"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Tabs.displayName = 'Tabs';

export default Tabs;
