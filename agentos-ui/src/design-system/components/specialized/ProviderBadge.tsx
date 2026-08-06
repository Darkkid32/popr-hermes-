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

export type ProviderBadgeSize = 'sm' | 'md' | 'lg'

const STATUS_COLORS = {
  connected: { bg: 'var(--color-success-base)/15', text: 'var(--color-success-base)', dot: 'var(--color-success-base)' },
  disconnected: { bg: 'var(--color-error-base)/15', text: 'var(--color-error-base)', dot: 'var(--color-error-base)' },
  degraded: { bg: 'var(--color-warning-base)/15', text: 'var(--color-warning-base)', dot: 'var(--color-warning-base)' },
}

interface ProviderBadgeProps {
  provider: Provider
  size?: ProviderBadgeSize
  showStatus?: boolean
  showModelCount?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

export function ProviderBadge({
  provider,
  size = 'md',
  showStatus = true,
  showModelCount = true,
  variant = 'default',
}: ProviderBadgeProps) {
  const statusColors = STATUS_COLORS[provider.status]
  const avatarSize = size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'

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
        <Avatar size={avatarSize} name={provider.name} src="" style={{ backgroundColor: provider.iconColor + '22', color: provider.iconColor, borderColor: provider.iconColor + '44' }}>
          {provider.icon}
        </Avatar>
        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body-md)' }}>
          {provider.name}
        </span>
        {showModelCount && (
          <Badge variant="default" size="sm">
            {provider.modelsCount} models
          </Badge>
        )}
        {showStatus && (
          <Badge variant="default" size="sm" dot style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
            {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
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
          <Avatar size="lg" name={provider.name} src="" style={{ backgroundColor: provider.iconColor + '22', color: provider.iconColor, borderColor: provider.iconColor + '44' }}>
            {provider.icon}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-lg)' }}>
              {provider.name}
            </div>
            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
              {provider.modelsCount} models · {provider.apiEndpoint}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
          {showStatus && (
            <Badge variant="default" size="md" dot style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
              {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
            </Badge>
          )}
          {showModelCount && (
            <Badge variant="info" size="md">
              {provider.modelsCount} models
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
      <Avatar size={avatarSize} name={provider.name} src="" style={{ backgroundColor: provider.iconColor + '22', color: provider.iconColor, borderColor: provider.iconColor + '44' }}>
        {provider.icon}
      </Avatar>
      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: size === 'sm' ? 'var(--text-body-sm)' : size === 'md' ? 'var(--text-body-md)' : 'var(--text-body-lg)' }}>
        {provider.name}
      </span>
      {showModelCount && (
        <Badge variant="info" size={size === 'sm' ? 'sm' : 'md'}>
          {provider.modelsCount} models
        </Badge>
      )}
      {showStatus && (
        <Badge variant="default" size={size === 'sm' ? 'sm' : 'md'} dot style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
          {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
        </Badge>
      )}
    </div>
  )
}