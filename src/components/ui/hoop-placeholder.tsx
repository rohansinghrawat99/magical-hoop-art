import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

/**
 * What sits inside a hoop before a photo exists.
 *
 * Every piece in the catalogue currently has a photo, so this is the state a
 * newly added piece sits in until its file is dropped into
 * `src/assets/artworks/` — see docs/CONTENT_GUIDE.md.
 *
 * `context` mirrors `HoopFrame`'s: the design uses a slightly different label
 * size and ink alpha in each of the seven places a placeholder appears, and
 * those differences are reproduced rather than averaged.
 */

const labelVariants = cva('font-mono uppercase', {
  variants: {
    context: {
      hero: 'text-[11px] tracking-[.14em] text-ink-label',
      heroMobile: 'text-[9.5px] tracking-[.14em] text-ink-label',
      card: 'text-[10px] tracking-[.12em] text-ink-label',
      cardMobile: 'text-[9px] tracking-[.1em] text-ink-ghost',
      artworkCard: 'text-[10px] tracking-[.12em] text-ink-ghost',
      detail: 'text-[10px] tracking-[.14em] text-ink-ghost',
      detailMobile: 'text-[9px] tracking-[.14em] text-ink-ghost',
    },
  },
  defaultVariants: { context: 'card' },
});

const captionVariants = cva('font-script text-accent', {
  variants: {
    context: {
      hero: 'text-[34px]',
      heroMobile: 'text-[26px]',
      card: 'text-[22px] leading-[1.1]',
      cardMobile: 'text-[15px] leading-[1.15]',
      artworkCard: 'text-[22px] leading-[1.1]',
      detail: 'text-[32px] leading-[1.1]',
      detailMobile: 'text-[24px] leading-[1.1]',
    },
  },
  defaultVariants: { context: 'card' },
});

export interface HoopPlaceholderProps extends VariantProps<typeof labelVariants> {
  /** Small monospace line, e.g. "hero hoop photo" or "photo". */
  label?: string;
  /** Script line, e.g. "drop image here" or the artwork title. */
  caption?: string;
  /** Dimension hint, e.g. "1200 × 1200 · square crop". */
  dims?: string;
  className?: string;
}

/**
 * Renders as a fragment so its lines become direct children of the hoop's flex
 * column, inheriting the gap the design specifies for that context.
 */
export function HoopPlaceholder({
  label,
  caption,
  dims,
  context,
  className,
}: HoopPlaceholderProps) {
  return (
    <>
      {label ? <span className={cn(labelVariants({ context }), className)}>{label}</span> : null}
      {caption ? <span className={captionVariants({ context })}>{caption}</span> : null}
      {dims ? (
        <span className="font-mono text-[10px] tracking-[.1em] text-ink-ghost">{dims}</span>
      ) : null}
    </>
  );
}
