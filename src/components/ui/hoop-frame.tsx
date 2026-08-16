import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

/**
 * The embroidery hoop — the core motif, used in eight places across the design.
 *
 * Two ring treatments appear: a gradient-padded ring (hero and artwork detail)
 * and a solid gold border (the card thumbnails). Diameter, padding, border
 * width and shadow all differ per context, so `context` × `density` encodes the
 * exact eight combinations the design specifies rather than exposing a dozen
 * loose numeric props.
 */
const hoopVariants = cva('relative aspect-square rounded-full', {
  variants: {
    context: {
      hero: '',
      categoryCard: 'border-gold bg-white',
      artworkCard: 'border-gold bg-white',
      detail: '',
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
    {
      context: 'detail',
      density: 'desktop',
      class: [
        'w-[76%] p-[14px]',
        'bg-[linear-gradient(145deg,var(--color-gold),var(--color-gold-tint))]',
        'shadow-[0_40px_70px_-34px_rgb(58_42_47_/_0.6)]',
      ],
    },
    {
      context: 'detail',
      density: 'mobile',
      class: [
        'w-[78%] p-[11px]',
        'bg-[linear-gradient(145deg,var(--color-gold),var(--color-gold-tint))]',
        'shadow-[0_26px_46px_-24px_rgb(58_42_47_/_0.65)]',
      ],
    },
    { context: 'categoryCard', density: 'desktop', class: 'w-[62%] border-[6px] p-4' },
    { context: 'categoryCard', density: 'mobile', class: 'w-1/2 border-[5px] p-3' },
    {
      context: 'artworkCard',
      density: 'desktop',
      class: 'w-[74%] border-[7px] p-[18px] shadow-[0_18px_34px_-22px_rgb(58_42_47_/_0.6)]',
    },
    {
      context: 'artworkCard',
      density: 'mobile',
      class: 'w-[76%] border-[5px] p-[10px] shadow-[0_12px_22px_-16px_rgb(58_42_47_/_0.7)]',
    },
  ],
  defaultVariants: { context: 'artworkCard', density: 'desktop' },
});

/** The inner disc of a gradient-ring hoop, where the photo or caption sits. */
const hoopFillVariants = cva(
  'relative flex size-full flex-col items-center justify-center overflow-hidden rounded-full text-center',
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
    /** Inner disc treatment. Only applies to the gradient-ring contexts. */
    fill?: VariantProps<typeof hoopFillVariants>['fill'];
    /** Extra classes for the inner disc. */
    fillClassName?: string;
  };

const GRADIENT_CONTEXTS = new Set(['hero', 'detail']);

export const HoopFrame = forwardRef<HTMLDivElement, HoopFrameProps>(function HoopFrame(
  { className, fillClassName, context, density, fill, children, ...rest },
  ref,
) {
  const hasInnerDisc = GRADIENT_CONTEXTS.has(context ?? 'artworkCard');

  return (
    <div ref={ref} className={cn(hoopVariants({ context, density }), className)} {...rest}>
      {hasInnerDisc ? (
        <div className={cn(hoopFillVariants({ fill, density }), fillClassName)}>{children}</div>
      ) : (
        <div
          className={cn(
            'relative flex size-full flex-col items-center justify-center gap-[6px]',
            'overflow-hidden rounded-full text-center',
            fillClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
});
