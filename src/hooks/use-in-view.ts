import { useEffect, useState } from 'react';

/**
 * Start a little before the element actually appears, so a collection card has
 * loaded its next photo by the time the visitor reaches it.
 */
const ROOT_MARGIN = '200px';

/**
 * `true` while `element` is on (or near) the screen.
 *
 * Takes the element itself rather than a ref object on purpose: a ref's
 * `.current` is populated after render without notifying anyone, so an effect
 * keyed on the ref would run before the node exists. Hold the node in state
 * with a callback ref and this hook re-runs the moment it is attached.
 *
 * Falls back to `true` where `IntersectionObserver` is missing (jsdom), so a
 * component gated on this still renders its content under test.
 */
export function useInView(element: Element | null): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry?.isIntersecting ?? false);
      },
      { rootMargin: ROOT_MARGIN },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return inView;
}
