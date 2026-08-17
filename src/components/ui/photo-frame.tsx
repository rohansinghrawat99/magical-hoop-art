import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

/**
 * The pink mat a photo sits in — the square successor to `HoopFrame`'s ring.
 *
 * The design framed every photo in an embroidery hoop. The photos are now shown
 * square and full-bleed so the work reads as large as possible, but the gold
 * gradient came with the hoop and the site lost its frame along with it. This
 * puts the same gradient back as a mat around the square.
 *
 * Frame width and corner radius differ per context, so `context` × `density`
 * encodes the six combinations rather than exposing loose numeric props — the
 * same bargain `HoopFrame` makes.
 */
const frameVariants = cva(
  [
    'relative aspect-square overflow-hidden',
    'bg-[linear-gradient(145deg,var(--color-gold),var(--color-gold-tint))]',
  ],
  {
    variants: {
      context: {
        /** Home page, one per collection. The card itself clips the corners. */
        collectionCard: '',
        /** The grid on a collection page. */
        artworkCard: 'rounded-[14px]',
        /** The piece's own page. */
        detail: 'rounded-[20px]',
      },
      /** Only the well changes with density; the mat's gradient does not. */
      density: { desktop: '', mobile: '' },
    },
    defaultVariants: { context: 'artworkCard', density: 'desktop' },
  },
);

/**
 * The well the photo sits in, inset by the mat's width.
 *
 * Absolutely positioned rather than created with padding on the frame: a
 * photo fills its parent with `inset-0`, which resolves against the *padding*
 * box, so padding on the frame would inset the photo twice over. An inset well
 * puts the frame width in one place and lets the photo fill the well exactly.
 *
 * The white band between the mat and the photo is the well's border, not more
 * inset: a border sits inside the well's own box, and `inset-0` resolves
 * against the padding box, so the photo lands inside it without any further
 * arithmetic. The hoop had the same white gap between its gold rim and the
 * fabric, which is where this comes from.
 *
 * It is also the flex column the placeholder needs, for a piece with no photo,
 * and carries `bg-soft` for it to sit on — every call site wanted that, so it
 * belongs here rather than being passed in six times.
 */
const wellVariants = cva(
  'absolute flex flex-col items-center justify-center overflow-hidden border-white bg-soft text-center',
  {
    variants: {
      context: { collectionCard: '', artworkCard: '', detail: '' },
      density: { desktop: '', mobile: '' },
    },
    compoundVariants: [
      {
        context: 'collectionCard',
        density: 'desktop',
        class: 'inset-[8px] gap-[6px] rounded-[12px] border-[14px]',
      },
      {
        context: 'collectionCard',
        density: 'mobile',
        class: 'inset-[5px] gap-[6px] rounded-[10px] border-[10px]',
      },
      {
        context: 'artworkCard',
        density: 'desktop',
        class: 'inset-[7px] gap-[6px] rounded-[10px] border-[12px]',
      },
      {
        context: 'artworkCard',
        density: 'mobile',
        class: 'inset-[4px] gap-1 rounded-[8px] border-[8px]',
      },
      {
        context: 'detail',
        density: 'desktop',
        class: 'inset-[9px] gap-[10px] rounded-[14px] border-[16px]',
      },
      {
        context: 'detail',
        density: 'mobile',
        class: 'inset-[6px] gap-2 rounded-[12px] border-[11px]',
      },
    ],
    defaultVariants: { context: 'artworkCard', density: 'desktop' },
  },
);

type FrameVariants = VariantProps<typeof frameVariants>;

export type PhotoFrameProps = HTMLAttributes<HTMLDivElement> &
  FrameVariants & {
    /** Extra classes for the well, where the photo and any overlays sit. */
    wellClassName?: string;
  };

export const PhotoFrame = forwardRef<HTMLDivElement, PhotoFrameProps>(function PhotoFrame(
  { className, wellClassName, context, density, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(frameVariants({ context, density }), className)} {...rest}>
      <div className={cn(wellVariants({ context, density }), wellClassName)}>{children}</div>
    </div>
  );
});
