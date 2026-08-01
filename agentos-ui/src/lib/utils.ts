import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(ts: string | null): string {
  if (!ts) return ''
  const diff = (Date.now() - new Date(ts).getTime()) / 1000
  if (diff < 0) return 'just now'
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export function formatPercent(n: number, fraction = 0): string {
  return `${n.toFixed(fraction)}%`
}

export function formatMs(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(2)}s`
  return `${n}ms`
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function relativeTime(label: string): string {
  return label
}

export function agentName(id: string, fallback = id): string {
  return fallback
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}