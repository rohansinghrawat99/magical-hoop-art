import { vi } from 'vitest';

import { MOBILE_BREAKPOINT } from '@/hooks/use-is-mobile';

/**
 * Drive `useIsMobile` / `usePrefersReducedMotion` in jsdom.
 *
 * jsdom has no layout engine, so `matchMedia` is stubbed rather than real. This
 * evaluates the two queries the app actually uses against a nominal width.
 */
export function setViewport(width: number, { reducedMotion = false } = {}): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => {
      let matches = false;

      if (query.includes('prefers-reduced-motion')) {
        matches = reducedMotion;
      } else if (query.includes('max-width')) {
        const limit = Number(/max-width:\s*(\d+)px/.exec(query)?.[1] ?? '0');
        matches = width <= limit;
      }

      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  );
}

export const DESKTOP_WIDTH = MOBILE_BREAKPOINT;
export const MOBILE_WIDTH = MOBILE_BREAKPOINT - 1;
