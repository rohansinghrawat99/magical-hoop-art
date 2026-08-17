import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

/**
 * The embroidery hoop — a gradient-padded ring around an inner disc.
 *
 * The design framed every photo this way: the hero, the piece page and both
 * card thumbnails, eight treatments in all. Those photos are now full-bleed, so
 * the home hero is the last hoop standing and `context` is down to one member.
 * It stays as a variant rather than being folded away because the ring is the
 * brand motif, and a second use would be a `context`, not a fork.
 */
const hoopVariants = cva('relative aspect-square rounded-full', {
  variants: {
    context: {
      hero: '',
    },
    density: { desktop: '', mobile: '' },
  },
  compoundVariants: [
    {
      context: 'hero',
      density: 'desktop',
      class: [
        'w-[78%] p-4',
        'bg-[linear-gradient(145deg,var(--color-gold),var(--color-gold-tint))]',
        'shadow-[0_40px_80px_-30px_rgb(58_42_47_/_0.35)]',
      ],
    },
    {
      context: 'hero',
      density: 'mobile',
      class: [
        'w-[82%] p-[13px]',
        'bg-[linear-gradient(145deg,var(--color-gold),var(--color-gold-tint))]',
        'shadow-[0_30px_56px_-26px_rgb(58_42_47_/_0.4)]',
      ],
    },
  ],
  defaultVariants: { context: 'hero', density: 'desktop' },
});

/**
 * The disc is sized `w-full aspect-square`, never `size-full`. WebKit resolves
 * a percentage height against its parent's *border* box, so `height: 100%`
 * inside the padded hoop above makes the disc taller than the ring's content
 * box; it then overflows, stretches the hoop, and both circles render as
 * ovals on iOS Safari. Deriving the height from the disc's own width keeps it
 * square in every engine, and the hoop is square, so the geometry is identical.
 */
const HOOP_DISC = 'w-full aspect-square';

/** The inner disc of a gradient-ring hoop, where the photo or caption sits. */
const hoopFillVariants = cva(
  `relative flex ${HOOP_DISC} flex-col items-center justify-center overflow-hidden rounded-full text-center`,
  {
    variants: {
      fill: {
        /** Striped linen weave, used behind the hero placeholder. */
        striped: '',
        plain: 'bg-white',
      },
      density: { desktop: '', mobile: '' },
    },
    compoundVariants: [
      {
        fill: 'striped',
        density: 'desktop',
        class:
          'gap-[10px] bg-[repeating-linear-gradient(45deg,var(--color-soft)_0_10px,#fff_10px_20px)] p-[30px]',
      },
      {
        fill: 'striped',
        density: 'mobile',
        class:
          'gap-[7px] bg-[repeating-linear-gradient(45deg,var(--color-soft)_0_9px,#fff_9px_18px)] p-6',
      },
      { fill: 'plain', density: 'desktop', class: 'gap-[10px] p-[26px]' },
      { fill: 'plain', density: 'mobile', class: 'gap-2 p-5' },
    ],
    defaultVariants: { fill: 'plain', density: 'desktop' },
  },
);

type HoopVariants = VariantProps<typeof hoopVariants>;

export type HoopFrameProps = HTMLAttributes<HTMLDivElement> &
  HoopVariants & {
    /** Inner disc treatment. */
    fill?: VariantProps<typeof hoopFillVariants>['fill'];
    /** Extra classes for the inner disc. */
    fillClassName?: string;
  };

export const HoopFrame = forwardRef<HTMLDivElement, HoopFrameProps>(function HoopFrame(
  { className, fillClassName, context, density, fill, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(hoopVariants({ context, density }), className)} {...rest}>
      <div className={cn(hoopFillVariants({ fill, density }), fillClassName)}>{children}</div>
    </div>
  );
});
