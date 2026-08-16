import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

/**
 * jsdom implements neither `matchMedia` nor `ResizeObserver`, both of which the
 * app relies on (`useIsMobile`, Radix Dialog). Provide minimal stand-ins.
 *
 * Tests that care about viewport should use the `setViewport` helper in
 * `src/test/viewport.ts` rather than poking at this directly.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Radix Dialog calls these during open/close transitions.
globalThis.HTMLElement.prototype.scrollIntoView = vi.fn();
globalThis.HTMLElement.prototype.releasePointerCapture = vi.fn();
globalThis.HTMLElement.prototype.hasPointerCapture = vi.fn();
