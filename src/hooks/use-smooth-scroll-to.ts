import { useCallback } from 'react';

/** Height of the sticky header, so an anchored section is not hidden behind it. */
const HEADER_OFFSET = 70;

/** Matches the design: the jump waits a tick for the target to be laid out. */
const LAYOUT_DELAY = 90;

/**
 * Smooth-scroll to a section id, mirroring the design's `jump()` helper.
 *
 * Returns a stable callback so it can be handed to a button without
 * re-rendering it.
 */
export function useSmoothScrollTo(): (id: string) => void {
  return useCallback((id: string) => {
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      window.scrollTo({ top: el.offsetTop - HEADER_OFFSET, behavior: 'smooth' });
    }, LAYOUT_DELAY);
  }, []);
}
