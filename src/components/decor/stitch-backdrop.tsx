import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

/**
 * The fine diagonal weave behind every hoop — a repeating linear gradient that
 * reads as fabric. Appears five times across the design at two angles and four
 * stripe spacings.
 */
const backdropVariants = cva('pointer-events-none absolute inset-0', {
  variants: {
    weave: {
      /** 45° / 11px — artwork cards, desktop. */
      card: 'bg-[repeating-linear-gradient(45deg,transparent_0_11px,rgb(233_169_184_/_0.26)_11px_12px)]',
      /** 45° / 9px — artwork cards, mobile. */
      cardTight:
        'bg-[repeating-linear-gradient(45deg,transparent_0_9px,rgb(233_169_184_/_0.26)_9px_10px)]',
      /** 135° / 12px — collection cards, desktop. */
      collection:
        'bg-[repeating-linear-gradient(135deg,transparent_0_12px,rgb(233_169_184_/_0.28)_12px_13px)]',
      /** 135° / 11px — collection cards, mobile. */
      collectionTight:
        'bg-[repeating-linear-gradient(135deg,transparent_0_11px,rgb(233_169_184_/_0.28)_11px_12px)]',
      /** 45° / 13px — artwork detail, desktop. */
      detail:
        'bg-[repeating-linear-gradient(45deg,transparent_0_13px,rgb(233_169_184_/_0.28)_13px_14px)]',
      /** 45° / 11px @ .28 — artwork detail, mobile. */
      detailTight:
        'bg-[repeating-linear-gradient(45deg,transparent_0_11px,rgb(233_169_184_/_0.28)_11px_12px)]',
    },
  },
  defaultVariants: { weave: 'card' },
});

export type StitchBackdropProps = VariantProps<typeof backdropVariants> & {
  className?: string;
};

export function StitchBackdrop({ weave, className }: StitchBackdropProps) {
  return <div aria-hidden="true" className={cn(backdropVariants({ weave }), className)} />;
}
