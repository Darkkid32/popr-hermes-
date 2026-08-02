import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 6,
    fontWeight: 600,
    fontFamily: 'Inter, system-ui, sans-serif',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all 0.15s',
    opacity: disabled || loading ? 0.6 : 1,
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '4px 10px', fontSize: '10.5px' },
    md: { padding: '6px 14px', fontSize: '11.5px' },
    lg: { padding: '8px 20px', fontSize: '13px' },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #d946ef 0%, #f06292 100%)',
      color: '#fff',
      boxShadow: '0 0 16px rgba(217, 70, 239, 0.30)',
    },
    secondary: {
      background: 'var(--bg-3)',
      color: 'var(--text)',
      border: '1px solid var(--border-2)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-2)',
    },
    danger: {
      background: 'linear-gradient(135deg, #ff4d6d 0%, #ff6b8a 100%)',
      color: '#fff',
      boxShadow: '0 0 16px rgba(255, 77, 109, 0.30)',
    },
  }

  return (
    <button
      className={className}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          width={size === 'sm' ? 12 : size === 'md' ? 14 : 16}
          height={size === 'sm' ? 12 : size === 'md' ? 14 : 16}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
          />
        </svg>
      )}
      {!loading && leftIcon && <span>{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span>{rightIcon}</span>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}