import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ErrorBoundary } from './error-boundary'

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    )
    expect(container.querySelector('div')).toHaveTextContent('Child content')
  })

  it('renders fallback when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }
    
    const { container } = render(
      <ErrorBoundary fallback={<div>Error fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(container.querySelector('div')).toHaveTextContent('Error fallback')
  })
})