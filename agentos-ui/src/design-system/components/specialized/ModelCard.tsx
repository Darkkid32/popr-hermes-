// ModelCard - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'
import { Button } from '../data-display/Button'
import { ProviderBadge } from './ProviderBadge'
import { ModelCapabilityBadge } from './ModelCapabilityBadge'

export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
  type: 'chat' | 'embedding' | 'completion' | 'multimodal'
  status: 'available' | 'busy' | 'degraded' | 'unavailable' | 'deprecated'
  tags: string[]
  capabilities: string[]
  contextWindow: number
  maxOutput: number
  usage: {
    requests: number
    tokens: number
    cost: string
  }
  lastUsed: string
  pricing?: {
    input: string
    output: string
  } | null
}

export type ModelCardVariant = 'default' | 'compact' | 'detailed'

interface ModelCardProps {
  model: Model
  variant?: ModelCardVariant
  isSelected?: boolean
  onClick?: () => void
  onTest?: () => void
  showActions?: boolean
}

const TYPE_COLORS: Record<string, string> = {
  chat: 'var(--color-info-base)',
  embedding: 'var(--color-purple-base)',
  completion: 'var(--color-warning-base)',
  multimodal: 'var(--color-success-base)',
}

const TYPE_ICONS: Record<string, string> = {
  chat: '◌',
  embedding: '◉',
  completion: '◧',
  multimodal: '◬',
}

const STATUS_BADGE: Record<string, 'warning' | 'info' | 'success' | 'default' | 'error' | 'primary' | 'secondary'> = {
  available: 'success',
  busy: 'warning',
  unavailable: 'error',
  deprecated: 'default',
}

export function ModelCard({
  model,
  variant = 'default',
  isSelected = false,
  onClick,
  onTest,
  showActions = true,
}: ModelCardProps) {
  const typeColor = TYPE_COLORS[model.type] || 'var(--color-text-tertiary)'
  const typeIcon = TYPE_ICONS[model.type] || '◌'
  const statusVariant = STATUS_BADGE[model.status] || 'default'

  if (variant === 'compact') {
    return (
      <div
        className={`model-card-compact ${isSelected ? 'selected' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
          padding: 'var(--spacing-3)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: isSelected ? 'var(--color-primary-glow)' : 'var(--color-surface-container)',
          border: isSelected ? '1px solid var(--color-primary-base)' : '1px solid var(--color-border-primary)',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
        }}
        onClick={onClick}
      >
        <span
          style={{
            fontSize: 'var(--text-display-sm)',
            color: typeColor,
            fontFamily: 'var(--font-heading)',
          }}
        >
          {typeIcon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-md)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {model.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
            <ProviderBadge provider={{ id: model.providerId, name: model.provider, icon: typeIcon, iconColor: typeColor, status: model.status === 'available' ? 'connected' : 'disconnected', modelsCount: 1 }} variant="compact" size="sm" showStatus={false} showModelCount={false} />
            <Badge variant={statusVariant} size="sm" dot>
              {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
            </Badge>
          </div>
        </div>
        {showActions && onTest && (
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onTest() }}>
            Test
          </Button>
        )}
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card
        variant={isSelected ? 'elevated' : 'outlined'}
        className={`model-card-detailed ${isSelected ? 'selected' : ''}`}
        style={{
          borderLeft: `4px solid ${typeColor}`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
        }}
        onClick={onClick}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <span
              style={{
                fontSize: 'var(--text-display-lg)',
                color: typeColor,
                fontFamily: 'var(--font-heading)',
              }}
            >
              {typeIcon}
            </span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-heading)' }}>
                {model.name}
              </div>
              <ProviderBadge
                provider={{
                  id: model.providerId,
                  name: model.provider,
                  icon: typeIcon,
                  iconColor: typeColor,
                  status: model.status === 'available' ? 'connected' : 'disconnected',
                  modelsCount: 1,
                }}
                variant="compact"
                size="sm"
                showStatus={false}
              />
            </div>
          </div>
          <Badge variant={statusVariant} size="md" dot>
            {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
          </Badge>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
          {model.tags.slice(0, 5).map((tag: string) => (
            <span key={tag} style={{ fontSize: 'var(--text-label-xs)', padding: 'var(--spacing-1) var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-primary)' }}>
              #{tag}
            </span>
          ))}
          {model.tags.length > 5 && (
            <span style={{ fontSize: 'var(--text-label-xs)', padding: 'var(--spacing-1) var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border-primary)' }}>
              +{model.tags.length - 5} more
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Context Window
            </div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {model.contextWindow.toLocaleString()} tokens
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Max Output
            </div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {model.maxOutput.toLocaleString()} tokens
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Total Requests
            </div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {model.usage.requests.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Total Cost
            </div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {model.usage.cost}
            </div>
          </div>
        </div>

        {model.capabilities && model.capabilities.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
              Capabilities
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
              {model.capabilities.map((cap: string) => (
                <ModelCapabilityBadge key={cap} capability={cap as any} size="sm" />
              ))}
            </div>
          </div>
        )}

        {model.pricing && (
          <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
              Pricing (per 1K tokens)
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
              <span>Input: {model.pricing.input}</span>
              <span>Output: {model.pricing.output}</span>
            </div>
          </div>
        )}

        {showActions && (
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            {onTest && (
              <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); onTest() }}>
                Test Model
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onClick?.() }}>
              View Details
            </Button>
          </div>
        )}
      </Card>
    )
  }

  // Default variant
  return (
    <Card
      variant={isSelected ? 'elevated' : 'outlined'}
      className={`model-card ${isSelected ? 'selected' : ''}`}
      style={{
        borderLeft: `3px solid ${typeColor}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <span
            style={{
              fontSize: 'var(--text-display-md)',
              color: typeColor,
              fontFamily: 'var(--font-heading)',
            }}
          >
            {typeIcon}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-md)', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {model.name}
            </div>
            <ProviderBadge
              provider={{
                id: model.providerId,
                name: model.provider,
                icon: typeIcon,
                iconColor: typeColor,
                status: model.status === 'available' ? 'connected' : 'disconnected',
                modelsCount: 1,
              }}
              variant="compact"
              size="sm"
              showStatus={false}
              showModelCount={false}
            />
          </div>
        </div>
        <Badge variant={statusVariant} size="sm" dot>
          {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
        </Badge>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-3)' }}>
        {model.tags.slice(0, 4).map((tag: string) => (
          <span key={tag} style={{ fontSize: 'var(--text-label-xs)', padding: 'var(--spacing-1) var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-primary)' }}>
            #{tag}
          </span>
        ))}
        {model.tags.length > 4 && (
          <span style={{ fontSize: 'var(--text-label-xs)', padding: 'var(--spacing-1) var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border-primary)' }}>
            +{model.tags.length - 4}
          </span>
        )}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        <span>ctx: {model.contextWindow.toLocaleString()}</span>
        <span>out: {model.maxOutput.toLocaleString()}</span>
        <span>{model.usage.cost}</span>
        <span>{model.lastUsed}</span>
      </div>

      {model.pricing && (
        <div style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--text-label-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {model.pricing.input} in · {model.pricing.output} out
        </div>
      )}
    </Card>
  )
}