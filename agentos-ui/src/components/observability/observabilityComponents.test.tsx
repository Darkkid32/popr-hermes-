// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import type { ReactNode } from 'react';
import { KPICard, GaugeCard, Heatmap } from './index';
import { useObservabilityStore } from '../../stores/observabilityStore';

function render(ui: ReactNode): HTMLElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => {
    root.render(ui);
  });
  return host;
}

describe('observability components (smoke)', () => {
  it('renders KPICard with label and value', () => {
    const host = render(<KPICard label="Services" value="8" delta={2} deltaTone="up" icon="🖥️" />);
    expect(host.textContent).toContain('Services');
    expect(host.textContent).toContain('8');
    act(() => { host.remove(); });
  });

  it('renders GaugeCard without crashing', () => {
    // GaugeCard uses canvas which doesn't render text in jsdom without canvas package
    // Just verify it mounts without crashing
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => {
      root.render(<GaugeCard label="CPU" value={65} min={0} max={100} unit="%" size={120} />);
    });
    // Verify component mounted without error
    expect(host.firstChild).toBeTruthy();
    act(() => {
      root.unmount();
      host.remove();
    });
  });

  it('renders Heatmap with data', () => {
    const data = [
      { x: 'Mon', y: 'Latency', value: 95 },
      { x: 'Tue', y: 'Latency', value: 98 },
      { x: 'Mon', y: 'Errors', value: 0.3 },
    ];
    const host = render(<Heatmap title="Test" data={data} xLabels={['Mon', 'Tue']} yLabels={['Latency', 'Errors']} />);
    expect(host.textContent).toContain('Test');
    act(() => { host.remove(); });
  });

  it('renders service list from store', () => {
    const services = useObservabilityStore.getState().services;
    expect(services.length).toBeGreaterThan(0);
    expect(services[0]).toHaveProperty('name');
    expect(services[0]).toHaveProperty('status');
  });

  it('store selectors work', () => {
    const firing = useObservabilityStore.getState().firingAlerts();
    expect(firing.length).toBeGreaterThan(0);
    expect(firing.every(a => a.state === 'firing')).toBe(true);
  });
});
