import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import { cn } from '@/lib/cn';
import { LIFT, LIFT_DISTANCE, PRESS } from '@/lib/motion';

/**
 * The collection card.
 *
 * Always a link — the whole card is the target — so keyboard users reach it in
 * tab order and get the focus ring for free. Desktop lifts on hover, mobile
 * scales down on press, matching the design's split behaviour.
 *
 * Motion comes from `LIFT` so the card rises with the same timing as artwork
 * cards and buttons.
 */
const cardVariants = cva(
  [
    'group flex flex-col overflow-hidden rounded-[18px] border border-line bg-white',
    'text-left text-ink',
    LIFT,
  ],
  {
    variants: {
      density: {
        desktop: [
          'shadow-[0_18px_40px_-32px_rgb(58_42_47_/_0.5)]',
          LIFT_DISTANCE.card,
          'hover:shadow-[0_34px_60px_-34px_rgb(58_42_47_/_0.4)]',
        ],
        mobile: ['shadow-[0_14px_30px_-24px_rgb(58_42_47_/_0.6)]', PRESS.card],
      },
    },
    defaultVariants: { density: 'desktop' },
  },
);

export type CardLinkProps = LinkProps & VariantProps<typeof cardVariants>;

export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { className, density, ...rest },
  ref,
) {
  return <Link ref={ref} className={cn(cardVariants({ density }), className)} {...rest} />;
});
