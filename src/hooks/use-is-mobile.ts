import { useSyncExternalStore } from 'react';

/**
 * The desktop/mobile switch point, in pixels.
 *
 * The design ships two distinct component trees rather than one responsive
 * tree, and swaps them in JS at this width. We reproduce that exactly — see
 * docs/ARCHITECTURE.md for why collapsing them would cost pixel fidelity.
 *
 * Kept in sync with `--breakpoint-hoop` in src/styles/index.css.
 */
export const MOBILE_BREAKPOINT = 860;

const QUERY = `(max-width: ${String(MOBILE_BREAKPOINT - 1)}px)`;

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => {
    mql.removeEventListener('change', onChange);
  };
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** Server/prerender default matches the design's initial width of 1280. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * `true` below 860px.
 *
 * Uses `useSyncExternalStore` so the value is read during render rather than in
 * an effect — this avoids a flash of the desktop tree on mobile.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
