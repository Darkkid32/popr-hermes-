// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import type { ReactNode } from 'react';
import { OrgCard, StatCard } from './OrgCard';
import { ActivityTimeline } from './ActivityTimeline';
import { useOrganizationStore } from '../../stores/organizationStore';

function render(ui: ReactNode): HTMLElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => {
    root.render(ui);
  });
  return host;
}

describe('organization components (smoke)', () => {
  it('renders OrgCard with organization identity', () => {
    const host = render(<OrgCard />);
    expect(host.textContent).toContain('Hermes Systems');
    expect(host.textContent).toContain('Enterprise');
    act(() => {
      host.remove();
    });
  });

  it('renders StatCard with label and value', () => {
    const host = render(<StatCard label="Members" value="12" />);
    expect(host.textContent).toContain('Members');
    expect(host.textContent).toContain('12');
    act(() => {
      host.remove();
    });
  });

  it('renders activity timeline entries from the store', () => {
    const events = useOrganizationStore.getState().activity.slice(0, 3);
    const host = render(<ActivityTimeline events={events} />);
    expect(host.querySelectorAll('li').length).toBe(events.length);
    act(() => {
      host.remove();
    });
  });
});
