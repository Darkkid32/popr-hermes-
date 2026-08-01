// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import type { ReactNode } from 'react';
import { ApiKeyTable } from './ApiKeyTable';
import { SecretCards } from './SecretCards';
import { ThreatFeed } from './ThreatFeed';
import { SecurityOverviewCards } from './SecurityOverviewCards';

function render(ui: ReactNode): HTMLElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => {
    root.render(ui);
  });
  return host;
}

describe('security components (smoke)', () => {
  it('renders API key rows with masked prefixes', () => {
    const host = render(<ApiKeyTable />);
    expect(host.querySelectorAll('tbody tr').length).toBeGreaterThan(0);
    expect(host.textContent).toContain('hrs_live');
    act(() => {
      host.remove();
    });
  });

  it('renders secret cards with rotation info', () => {
    const host = render(<SecretCards />);
    expect(host.textContent).toContain('DATABASE_URL');
    expect(host.textContent).toContain('Rotate every');
    act(() => {
      host.remove();
    });
  });

  it('renders the threat feed with severity badges', () => {
    const host = render(<ThreatFeed />);
    expect(host.querySelectorAll('h4').length).toBeGreaterThan(0);
    expect(host.textContent).toContain('Brute force');
    act(() => {
      host.remove();
    });
  });

  it('renders overview stat cards', () => {
    const host = render(<SecurityOverviewCards users={9} keys={4} sessions={6} threats={1} />);
    expect(host.textContent).toContain('Users');
    expect(host.textContent).toContain('9');
    act(() => {
      host.remove();
    });
  });
});
