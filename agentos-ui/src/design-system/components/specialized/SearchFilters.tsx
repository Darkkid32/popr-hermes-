// SearchFilters - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Input } from '../forms/Input'
import { Select } from '../forms/Select'
import { Button } from '../data-display/Button'
import type { SelectOption } from '../forms/Select'

export interface FilterConfig {
  key: string
  label?: string
  type: 'search' | 'select' | 'multiselect' | 'date' | 'boolean'
  placeholder?: string
  options?: SelectOption[]
  defaultValue?: any
}

export interface SearchFiltersProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  className?: string
}

export function SearchFilters({
  filters,
  values,
  onChange,
  searchPlaceholder = 'Search...',
  onSearchChange,
  viewMode = 'grid',
  onViewModeChange,
  className = '',
}: SearchFiltersProps) {
  const searchFilter = filters.find(f => f.type === 'search')
  const selectFilters = filters.filter(f => f.type === 'select' || f.type === 'multiselect')
  const booleanFilters = filters.filter(f => f.type === 'boolean')

  const handleSelectChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value })
  }

  const handleSearchChangeInternal = (value: string) => {
    if (searchFilter) {
      onChange({ ...values, [searchFilter.key]: value })
    }
    onSearchChange?.(value)
  }

  const handleBooleanChange = (key: string, checked: boolean) => {
    onChange({ ...values, [key]: checked })
  }

  return (
    <div className={`search-filters ${className}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center' }}>
      {/* Search Input */}
      {searchFilter && (
        <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-2) var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-quaternary)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16" y2="16"></line>
          </svg>
          <Input
            placeholder={searchPlaceholder}
            value={values[searchFilter.key] || ''}
            onChange={(e) => handleSearchChangeInternal(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}
          />
          <kbd style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)' }}>⌘F</kbd>
        </div>
      )}

      {/* Select Filters */}
      {selectFilters.map((filter) => (
        <Select
          key={filter.key}
          value={values[filter.key] || filter.defaultValue || ''}
          onChangeRaw={(e) => handleSelectChange(filter.key, e.target.value)}
          placeholder={filter.placeholder || filter.label}
          options={filter.options || []}
          size="sm"
          style={{ minWidth: 140, maxWidth: 200 }}
        />
      ))}

      {/* Boolean Filters */}
      {booleanFilters.map((filter) => (
        <label key={filter.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={values[filter.key] || false}
            onChange={(e) => handleBooleanChange(filter.key, e.target.checked)}
            style={{ width: 14, height: 14, accentColor: 'var(--color-primary-base)' }}
          />
          <span>{filter.label}</span>
        </label>
      ))}

      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div style={{ display: 'flex', gap: 'var(--spacing-1)', backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-1)' }}>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            style={{ padding: 'var(--spacing-1) var(--spacing-2)' }}
            aria-pressed={viewMode === 'grid'}
            aria-label="Grid view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            </svg>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            style={{ padding: 'var(--spacing-1) var(--spacing-2)' }}
            aria-pressed={viewMode === 'list'}
            aria-label="List view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </div>
      )}
    </div>
  )
}

// Compound component pattern for more flexibility
SearchFilters.Search = function SearchFiltersSearch({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-2) var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-quaternary)', flexShrink: 0 }}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16" y2="16"></line>
      </svg>
      <Input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 'var(--text-body-sm)' }} />
    </div>
  )
}

SearchFilters.Select = function SearchFiltersSelect({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: SelectOption[]; placeholder: string }) {
  return (
    <Select value={value} onChangeRaw={(e) => onChange(e.target.value)} placeholder={placeholder} options={options} size="sm" style={{ minWidth: 140, maxWidth: 200 }} />
  )
}

SearchFilters.ViewToggle = function SearchFiltersViewToggle({ viewMode, onChange }: { viewMode: 'grid' | 'list'; onChange: (mode: 'grid' | 'list') => void }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-1)', backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-1)' }}>
      <Button variant={viewMode === 'grid' ? 'primary' : 'ghost'} size="sm" onClick={() => onChange('grid')} style={{ padding: 'var(--spacing-1) var(--spacing-2)' }} aria-pressed={viewMode === 'grid'} aria-label="Grid view">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1"></rect>
        </svg>
      </Button>
      <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} size="sm" onClick={() => onChange('list')} style={{ padding: 'var(--spacing-1) var(--spacing-2)' }} aria-pressed={viewMode === 'list'} aria-label="List view">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </Button>
    </div>
  )
}