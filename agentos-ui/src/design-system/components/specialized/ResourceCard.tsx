// ResourceCard - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'
import { ProviderBadge } from './ProviderBadge'

export interface MCPResource {
  uri: string
  name: string
  description: string
  mimeType: string
  serverId: string
  serverName: string
  serverIcon: string
  serverColor: string
}

export interface ResourceCardProps {
  resource: MCPResource
  variant?: 'default' | 'compact' | 'detailed'
  onClick?: () => void
  isSelected?: boolean
}

export function ResourceCard({
  resource,
  variant = 'default',
  onClick,
  isSelected = false,
}: ResourceCardProps) {
  if (variant === 'compact') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-2)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-container)',
          border: '1px solid var(--color-border-primary)',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        <span style={{ fontSize: 'var(--text-display-sm)', color: resource.serverColor }}>
          {resource.serverIcon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {resource.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
            <ProviderBadge simpleProvider={{ name: resource.serverName, status: 'connected', icon: resource.serverIcon, iconColor: resource.serverColor }} size="sm" />
            <Badge variant="default" size="sm">{resource.mimeType}</Badge>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card variant="elevated">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
          <span style={{ fontSize: 'var(--text-display-md)', color: resource.serverColor }}>
            {resource.serverIcon}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--spacing-1)' }}>
              {resource.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <ProviderBadge simpleProvider={{ name: resource.serverName, status: 'connected', icon: resource.serverIcon, iconColor: resource.serverColor }} size="sm" />
              <Badge variant="info" size="sm">MCP Resource</Badge>
              <Badge variant="default" size="sm">{resource.mimeType}</Badge>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
          {resource.description}
        </div>

        <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
          URI
        </div>
        <div style={{ backgroundColor: 'var(--color-background-base)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', wordBreak: 'break-all' }}>
          {resource.uri}
        </div>
      </Card>
    )
  }

  // Default variant - table row style
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-3)',
        padding: 'var(--spacing-2)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isSelected ? 'var(--color-primary-base)/05' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid transparent',
        transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', minWidth: 180 }}>
        <span style={{ fontSize: 'var(--text-display-sm)', color: resource.serverColor }}>
          {resource.serverIcon}
        </span>
        <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {resource.name}
        </span>
      </div>
      <div style={{ minWidth: 120 }}>
        <ProviderBadge simpleProvider={{ name: resource.serverName, status: 'connected', icon: resource.serverIcon, iconColor: resource.serverColor }} size="sm" />
      </div>
      <div style={{ flex: 1, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {resource.description}
      </div>
      <div style={{ minWidth: 150, fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {resource.uri}
      </div>
      <div style={{ minWidth: 100, fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
        {resource.mimeType}
      </div>
    </div>
  )
}