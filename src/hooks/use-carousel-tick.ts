import { useSyncExternalStore } from 'react';

/**
 * One full turn: the slide, then the rest before the next one.
 *
 * Kept here rather than in the component because it is the *shared* period —
 * every carousel on the page turns on this beat.
 */
export const CYCLE_MS = 4700;

/**
 * The slide at the head of each cycle; the rest of the cycle holds still.
 *
 * Must stay in step with the `duration-700` class in `ImageCarousel` —
 * Tailwind needs a literal class, so the number cannot be interpolated.
 */
export const SLIDE_MS = 700;

let tick = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

/**
 * A single interval for the whole page, rather than one per carousel.
 *
 * Six cards each running their own timer drift apart within a minute — the
 * timers are started on slightly different frames and are throttled
 * independently when the tab is backgrounded. Sharing one clock is the only way
 * the collection cards actually turn together, and it is cheaper besides.
 */
function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  timer ??= setInterval(() => {
    tick += 1;
    for (const notify of listeners) notify();
  }, CYCLE_MS);

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;

      // Nothing is rotating any more, so the next visit to the home page opens
      // on each collection's first photo instead of resuming mid-rotation.
      tick = 0;
    }
  };
}

function getSnapshot(): number {
  return tick;
}

function getZero(): number {
  return 0;
}

/** Subscribing to nothing, for carousels that have no reason to move. */
function noSubscription(): () => void {
  return () => undefined;
}

/**
 * The beat every carousel advances on, counted from when the first one
 * appeared.
 *
 * Pass `enabled: false` for a carousel that should hold still — a single-photo
 * collection, or a visitor who has asked for reduced motion. It then reads a
 * frozen `0` and does not hold the shared interval open.
 */
export function useCarouselTick(enabled: boolean): number {
  return useSyncExternalStore(
    enabled ? subscribe : noSubscription,
    enabled ? getSnapshot : getZero,
    getZero,
  );
}
