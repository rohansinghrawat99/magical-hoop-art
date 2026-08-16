import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reset the scroll position on navigation.
 *
 * Replaces the design's `top()` call after every view change. Skipped when the
 * URL carries a hash, so anchor links still work.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}
