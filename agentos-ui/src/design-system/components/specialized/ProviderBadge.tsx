// ProviderBadge - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Badge } from '../data-display/Badge'
import { Avatar } from '../data-display/Avatar'

export interface Provider {
  id: string
  name: string
  icon: string
  iconColor: string
  status: 'connected' | 'disconnected' | 'degraded'
  modelsCount: number
  apiEndpoint?: string
}

// Simple provider config for basic usage
export interface SimpleProvider {
  name: string
  status: 'connected' | 'disconnected' | 'degraded' | 'syncing' | 'error' | 'connecting'
  icon?: string
  iconColor?: string
  modelsCount?: number
  label?: string
}

export type ProviderBadgeSize = 'sm' | 'md' | 'lg'

const STATUS_COLORS = {
  connected: { bg: 'var(--color-success-base)/15', text: 'var(--color-success-base)', dot: 'var(--color-success-base)' },
  disconnected: { bg: 'var(--color-error-base)/15', text: 'var(--color-error-base)', dot: 'var(--color-error-base)' },
  degraded: { bg: 'var(--color-warning-base)/15', text: 'var(--color-warning-base)', dot: 'var(--color-warning-base)' },
  syncing: { bg: 'var(--color-warning-base)/15', text: 'var(--color-warning-base)', dot: 'var(--color-warning-base)' },
  error: { bg: 'var(--color-error-base)/15', text: 'var(--color-error-base)', dot: 'var(--color-error-base)' },
  connecting: { bg: 'var(--color-info-base)/15', text: 'var(--color-info-base)', dot: 'var(--color-info-base)' },
}

interface ProviderBadgeProps {
  provider?: Provider
  simpleProvider?: SimpleProvider
  size?: ProviderBadgeSize
  showStatus?: boolean
  showModelCount?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  label?: string
}

export function ProviderBadge({
  provider,
  simpleProvider,
  size = 'md',
  showStatus = true,
  showModelCount = true,
  variant = 'default',
  label,
}: ProviderBadgeProps) {
  const isSimple = !!simpleProvider
  const p = isSimple ? simpleProvider : provider!
  const statusColors = STATUS_COLORS[p.status] || STATUS_COLORS.disconnected
  const avatarSize = size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'
  const icon = isSimple ? p.icon : p.icon
  const iconColor = isSimple ? (p.iconColor || '#9ba4c0') : p.iconColor
  const name = isSimple ? p.name : p.name
  const modelsCount = isSimple ? 0 : p.modelsCount

  if (variant === 'compact') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-1) var(--spacing-2)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-container)',
          border: '1px solid var(--color-border-primary)',
        }}
      >
        <Avatar size={avatarSize} name={name} src="" style={{ backgroundColor: iconColor + '22', color: iconColor, borderColor: iconColor + '44' }}>
          {icon}
        </Avatar>
        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body-md)' }}>
          {name}
        </span>
        {showModelCount && !isSimple && (
          <Badge variant="default" size="sm">
            {modelsCount} models
          </Badge>
        )}
        {label && (
          <Badge variant="default" size="sm">
            {label}
          </Badge>
        )}
        {showStatus && (
          <Badge variant="default" size="sm" dot style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
          </Badge>
        )}
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-3)',
          padding: 'var(--spacing-4)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-surface-container)',
          border: '1px solid var(--color-border-primary)',
          minWidth: 280,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <Avatar size="lg" name={name} src="" style={{ backgroundColor: iconColor + '22', color: iconColor, borderColor: iconColor + '44' }}>
            {icon}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-lg)' }}>
              {name}
            </div>
            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
              {!isSimple && `${modelsCount} models · {provider.apiEndpoint}`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
          {showStatus && (
            <Badge variant="default" size="md" dot style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
              {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
            </Badge>
          )}
          {showModelCount && !isSimple && (
            <Badge variant="info" size="md">
              {modelsCount} models
            </Badge>
          )}
        </div>
      </div>
    )
  }

  // Default variant - horizontal
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
      }}
    >
      <Avatar size={avatarSize} name={name} src="" style={{ backgroundColor: iconColor + '22', color: iconColor, borderColor: iconColor + '44' }}>
        {icon}
      </Avatar>
      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: size === 'sm' ? 'var(--text-body-sm)' : size === 'md' ? 'var(--text-body-md)' : 'var(--text-body-lg)' }}>
        {name}
      </span>
      {showModelCount && !isSimple && (
        <Badge variant="info" size={size === 'sm' ? 'sm' : 'md'}>
          {modelsCount} models
        </Badge>
      )}
      {label && (
        <Badge variant="default" size={size === 'sm' ? 'sm' : 'md'}>
          {label}
        </Badge>
      )}
      {showStatus && (
        <Badge variant="default" size={size === 'sm' ? 'sm' : 'md'} dot style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
        </Badge>
      )}
    </div>
  )
}