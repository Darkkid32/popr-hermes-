// ModelCapabilityBadge - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Badge } from '../data-display/Badge'

export type ModelCapability =
  | 'chat'
  | 'embedding'
  | 'completion'
  | 'multimodal'
  | 'reasoning'
  | 'vision'
  | 'audio'
  | 'function-calling'
  | 'tool-use'
  | 'json-mode'

export type ModelCapabilityBadgeSize = 'sm' | 'md'

const CAPABILITY_COLORS: Record<ModelCapability, { bg: string; text: string; dot: string }> = {
  chat: { bg: 'var(--color-info-base)/15', text: 'var(--color-info-base)', dot: 'var(--color-info-base)' },
  embedding: { bg: 'var(--color-purple-base)/15', text: 'var(--color-purple-base)', dot: 'var(--color-purple-base)' },
  completion: { bg: 'var(--color-warning-base)/15', text: 'var(--color-warning-base)', dot: 'var(--color-warning-base)' },
  multimodal: { bg: 'var(--color-success-base)/15', text: 'var(--color-success-base)', dot: 'var(--color-success-base)' },
  reasoning: { bg: 'var(--color-pink-base)/15', text: 'var(--color-pink-base)', dot: 'var(--color-pink-base)' },
  vision: { bg: 'var(--color-orange-base)/15', text: 'var(--color-orange-base)', dot: 'var(--color-orange-base)' },
  audio: { bg: 'var(--color-cyan-base)/15', text: 'var(--color-cyan-base)', dot: 'var(--color-cyan-base)' },
  'function-calling': { bg: 'var(--color-emerald-base)/15', text: 'var(--color-emerald-base)', dot: 'var(--color-emerald-base)' },
  'tool-use': { bg: 'var(--color-emerald-base)/15', text: 'var(--color-emerald-base)', dot: 'var(--color-emerald-base)' },
  'json-mode': { bg: 'var(--color-blue-base)/15', text: 'var(--color-blue-base)', dot: 'var(--color-blue-base)' },
}

const CAPABILITY_LABELS: Record<ModelCapability, string> = {
  chat: 'Chat',
  embedding: 'Embedding',
  completion: 'Completion',
  multimodal: 'Multimodal',
  reasoning: 'Reasoning',
  vision: 'Vision',
  audio: 'Audio',
  'function-calling': 'Function Calling',
  'tool-use': 'Tool Use',
  'json-mode': 'JSON Mode',
}

interface ModelCapabilityBadgeProps {
  capability: ModelCapability
  size?: ModelCapabilityBadgeSize
  showLabel?: boolean
  variant?: 'default' | 'outline'
}

export function ModelCapabilityBadge({
  capability,
  size = 'sm',
  showLabel = true,
  variant = 'default',
}: ModelCapabilityBadgeProps) {
  const colors = CAPABILITY_COLORS[capability]
  const label = showLabel ? CAPABILITY_LABELS[capability] : capability

  if (variant === 'outline') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: size === 'sm' ? 'var(--spacing-1)' : 'var(--spacing-2)',
          padding: size === 'sm' ? 'var(--spacing-1) var(--spacing-2)' : 'var(--spacing-2) var(--spacing-3)',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${colors.text}`,
          backgroundColor: 'transparent',
          color: colors.text,
          fontSize: size === 'sm' ? 'var(--text-label-xs)' : 'var(--text-label-sm)',
          fontWeight: 500,
          fontFamily: 'var(--font-ui)',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
        }}
      >
        <span
          style={{
            width: size === 'sm' ? 6 : 8,
            height: size === 'sm' ? 6 : 8,
            borderRadius: '50%',
            backgroundColor: colors.dot,
          }}
        />
        {label}
      </span>
    )
  }

  return (
    <Badge
      variant="default"
      size={size}
      dot
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 500,
      }}
    >
      {label}
    </Badge>
  )
}