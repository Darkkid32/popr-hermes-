/**
 * Input validation and sanitization utilities
 * Provides safe rendering and XSS prevention helpers
 */

// HTML escaping to prevent XSS
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;')
    .replace(/\//g, '&#x2F;')
}

// Safe text content for React (already auto-escaped by React)
export function safeText(text: string): string {
  return text
}

// URL validation - only allow safe protocols
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['https:', 'http:', 'mailto:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// Sanitize URL for href attributes
export function sanitizeUrl(url: string): string {
  if (!isSafeUrl(url)) {
    return '#'
  }
  return url
}

// Input sanitization for text inputs
export function sanitizeInput(input: string, maxLength = 1000): string {
  return input
    .slice(0, maxLength)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, '') // Remove control characters
    .trim()
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// UUID validation
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Path traversal prevention
export function sanitizePath(path: string): string {
  return path
    .replace(/\.\./g, '') // Remove directory traversal
    .replace(/\/+/g, '/') // Normalize slashes
    .replace(/^\/+/, '/') // Ensure leading slash
}

// JSON sanitization - safe stringify
export function safeStringify(obj: unknown): string {
  const seen = new WeakSet()
  
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]'
      }
      seen.add(value)
    }
    if (typeof value === 'function') {
      return '[Function]'
    }
    if (typeof value === 'symbol') {
      return '[Symbol]'
    }
    return value
  })
}

// Safe object merge (shallow, no prototype pollution)
export function safeMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target }
  const safeKeys = Object.keys(source).filter(
    (key) => !['__proto__', 'constructor', 'prototype'].includes(key)
  )
  
  for (const key of safeKeys) {
    (result as Record<string, unknown>)[key] = (source as Record<string, unknown>)[key]
  }
  
  return result
}

// Content type validation
export function isAllowedContentType(contentType: string, allowed: string[]): boolean {
  return allowed.some((type) => contentType.startsWith(type))
}

// Rate limiting key generator (for API protection)
export function generateRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${identifier}:${action}:${Math.floor(Date.now() / 60000)}`
}

// CSP nonce generator (for inline scripts/styles if needed)
export function generateCspNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}

// Safe attribute setter for DOM elements
export function setSafeAttribute(
  element: HTMLElement,
  attribute: string,
  value: string
): void {
  const safeAttributes = [
    'id',
    'class',
    'style',
    'data-*',
    'aria-*',
    'role',
    'tabindex',
    'title',
    'alt',
    'href',
    'src',
    'type',
    'name',
    'value',
    'placeholder',
    'disabled',
    'readonly',
    'required',
    'checked',
    'selected',
  ]
  
  const isSafe = safeAttributes.some((safe) => 
    safe.endsWith('*') ? attribute.startsWith(safe.slice(0, -1)) : attribute === safe
  )
  
  if (isSafe) {
    element.setAttribute(attribute, value)
  }
}

// XSS-safe dangerouslySetInnerHTML alternative
export function createSafeHtml(html: string): { __html: string } {
  // In production, use DOMPurify or similar
  // For now, basic sanitization
  const sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
  
  return { __html: sanitized }
}