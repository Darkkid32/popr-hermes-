// PromptCard - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'
import { ProviderBadge } from './ProviderBadge'

export interface MCPPrompt {
  name: string
  description: string
  arguments: any
  serverId: string
  serverName: string
  serverIcon: string
  serverColor: string
}

export interface PromptCardProps {
  prompt: MCPPrompt
  variant?: 'default' | 'compact' | 'detailed'
  onClick?: () => void
  isSelected?: boolean
}

export function PromptCard({
  prompt,
  variant = 'default',
  onClick,
  isSelected = false,
}: PromptCardProps) {
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
        <span style={{ fontSize: 'var(--text-display-sm)', color: prompt.serverColor }}>
          {prompt.serverIcon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {prompt.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
            <ProviderBadge simpleProvider={{ name: prompt.serverName, status: 'connected', icon: prompt.serverIcon, iconColor: prompt.serverColor }} size="sm" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card variant="elevated">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
          <span style={{ fontSize: 'var(--text-display-md)', color: prompt.serverColor }}>
            {prompt.serverIcon}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--spacing-1)' }}>
              {prompt.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <ProviderBadge simpleProvider={{ name: prompt.serverName, status: 'connected', icon: prompt.serverIcon, iconColor: prompt.serverColor }} size="sm" />
              <Badge variant="info" size="sm">MCP Prompt</Badge>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
          {prompt.description}
        </div>

        <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
          Arguments
        </div>
        <div style={{ backgroundColor: 'var(--color-background-base)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', maxHeight: 300, overflow: 'auto', fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
          {JSON.stringify(prompt.arguments, null, 2)}
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
        <span style={{ fontSize: 'var(--text-display-sm)', color: prompt.serverColor }}>
          {prompt.serverIcon}
        </span>
        <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
          {prompt.name}
        </span>
      </div>
      <div style={{ minWidth: 120 }}>
        <ProviderBadge simpleProvider={{ name: prompt.serverName, status: 'connected', icon: prompt.serverIcon, iconColor: prompt.serverColor }} size="sm" />
      </div>
      <div style={{ flex: 1, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {prompt.description}
      </div>
      <div style={{ minWidth: 200, fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {JSON.stringify(prompt.arguments).slice(0, 100)}...
      </div>
    </div>
  )
}