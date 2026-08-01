import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo: _redirectTo = '/' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock authentication - replace with real auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate successful login
      localStorage.setItem('hermes-auth', JSON.stringify({ email, token: 'mock-token' }));
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 w-12 h-12 bg-[var(--color-brand-500)/15] rounded-full flex items-center justify-center">
          <svg className="h-8 w-8 text-[var(--color-brand-500)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-[var(--text-2xl)] font-bold text-[var(--color-text-primary)]">Welcome back</h1>
        <p className="mt-2 text-[var(--color-text-tertiary)]">Sign in to your Hermes account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
            fullWidth
            disabled={isLoading}
          />
        </div>
        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            fullWidth
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  {showPassword ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 5c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                  ) : (
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8c-1.1 0-2.1-.2-3-.57M1 1l22 22" />
                  )}
                </svg>
              </button>
            }
          />
        </div>

        {error && (
          <div className="p-3 bg-[var(--color-status-error-bg)] rounded-[var(--radius-md)] border border-[var(--color-status-error)]">
            <p className="text-[var(--text-sm)] text-[var(--color-status-error)]" role="alert">
              {error}
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Don&apos;t have an account?{' '}
          <a href="#" className="text-[var(--color-brand-500)] hover:underline font-medium">
            Sign up
          </a>
        </p>
        <p className="mt-2 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
          Hermes local authentication only — no external SSO
        </p>
      </div>
    </Card>
  );
}

export default LoginForm;
