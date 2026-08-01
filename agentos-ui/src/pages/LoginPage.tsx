import { LoginForm } from '../lib/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-primary)] p-4">
      <div className="w-full max-w-md">
        <LoginForm onSuccess={() => { window.location.href = '/mission'; }} />
      </div>
    </div>
  );
}

export default LoginPage;
