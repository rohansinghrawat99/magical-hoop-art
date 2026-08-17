import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { AppImage } from '@/components/ui/app-image';
import { SLIDE_MS, useCarouselTick } from '@/hooks/use-carousel-tick';
import { useInView } from '@/hooks/use-in-view';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/cn';

export interface ImageCarouselProps extends HTMLAttributes<HTMLDivElement> {
  /** Resolved photo URLs, in display order. */
  images: readonly string[];
  /**
   * Applied to every slide. Pass `''` where the set is decorative — a rotating
   * `alt` would announce a different piece each time the visitor's cursor
   * happened to land, which is noise rather than information.
   */
  alt: string;
  /** Rendered when the set is empty, as a fragment, like `AppImage`'s. */
  fallback: ReactNode;
}

/**
 * A set of photos that slide past on their own, filling a positioned parent.
 *
 * There is deliberately nothing to operate: no arrows, no dots, no dragging and
 * no scroll container. The carousel sits inside a collection card, and the card
 * is a single link — a swipeable strip inside it would compete with the link
 * for the same gesture and swallow taps meant for the collection.
 *
 * Every carousel on the page moves on one shared clock (`useCarouselTick`), so
 * the whole grid turns on the same frame. Which photo is showing is *derived*
 * from that clock rather than counted locally, so a card that sat off screen
 * for a while is still on the same beat as the rest when it comes back.
 *
 * Only two slides are ever mounted: the one on screen and the one behind it.
 * The catalogue runs to ~13MB of photos, so mounting every slide would make the
 * home page download the entire collection before the first frame. The trailing
 * slide mounts a full cycle early, which is long enough for it to decode before
 * it moves.
 *
 * A visitor who has asked for reduced motion gets the first photo, held still —
 * the stylesheet would otherwise collapse the slide to a 0.01ms jump, which is
 * worse than not moving at all.
 */
export const ImageCarousel = forwardRef<HTMLDivElement, ImageCarouselProps>(function ImageCarousel(
  { images, alt, fallback, className, ...rest },
  ref,
) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const inView = useInView(root);
  const prefersReducedMotion = usePrefersReducedMotion();

  const count = images.length;

  /** A single-photo collection and a still visitor both leave the clock alone. */
  const rotates = count > 1 && !prefersReducedMotion;
  const tick = useCarouselTick(rotates);

  /** Hold the root in state for `useInView`, without eating a forwarded ref. */
  const attach = useCallback(
    (element: HTMLDivElement | null) => {
      setRoot(element);
      if (typeof ref === 'function') ref(element);
      else if (ref) ref.current = element;
    },
    [ref],
  );

  // Off screen the photo still changes — it just changes instantly, so a card
  // the visitor never saw does not spend a frame budget sliding.
  const animates = rotates && inView;

  /**
   * Which beat the slides have caught up to. `sliding` is derived from the gap
   * rather than set in an effect: an effect would commit one frame in which the
   * new photo is already centred, so the eye sees it jump into place and *then*
   * slide in from the right.
   */
  const [settled, setSettled] = useState(tick);
  const sliding = animates && settled !== tick;

  useEffect(() => {
    if (settled === tick) return;

    if (!animates) {
      setSettled(tick);
      return;
    }

    const timer = setTimeout(() => {
      setSettled(tick);
    }, SLIDE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [settled, tick, animates]);

  if (count === 0) return <>{fallback}</>;

  const cursor = tick % count;

  // Two slides, always keyed by catalogue position. Idle, the current photo
  // sits centred with the next one parked off to the right; sliding, the pair
  // shifts one place left. The keys are the same across both, so the incoming
  // photo keeps its DOM node when it becomes the current one and never
  // restarts its transition.
  const [front, back] = sliding
    ? [(cursor + count - 1) % count, cursor]
    : [cursor, (cursor + 1) % count];

  // The trailing slide only exists to be moved into place, so a carousel that
  // will never move does not download a second photo.
  const slides = rotates && (inView || sliding) ? [front, back] : [front];

  return (
    <div ref={attach} className={cn('absolute inset-0 overflow-hidden', className)} {...rest}>
      {slides.map((index, slot) => (
        <div
          key={index}
          className={cn(
            // `translate`, not `transform`: Tailwind v4 compiles translate
            // utilities to the standalone property. See src/lib/motion.ts.
            'absolute inset-0 transition-[translate] duration-700 ease-hoop',
            slot === 0 && (sliding ? '-translate-x-full' : 'translate-x-0'),
            slot === 1 && (sliding ? 'translate-x-0' : 'translate-x-full'),
          )}
        >
          <AppImage src={images[index] ?? null} alt={alt} fallback={fallback} />
        </div>
      ))}
    </div>
  );
});
