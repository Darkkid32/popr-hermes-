// Vitest setup: enable React 19 act() environment for jsdom component tests.
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
