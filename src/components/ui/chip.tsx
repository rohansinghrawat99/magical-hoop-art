import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';
import { LIFT } from '@/lib/motion';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  density?: 'desktop' | 'mobile';
}

/**
 * A small outlined pill — the suggestion chips in the search overlay and the
 * sort control on a collection page.
 *
 * Same 100px radius and hover fill as the outline `Button`, at a smaller scale,
 * and moving with the shared `LIFT` timing.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { className, density = 'desktop', type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'cursor-pointer rounded-[100px] border border-line-strong bg-white text-ink',
        'hover:border-gold hover:bg-soft',
        LIFT,
        density === 'mobile'
          ? 'min-h-12 px-[18px] py-3 text-[14px]'
          : 'min-h-[52px] px-[22px] py-[13px] text-[15px]',
        className,
      )}
      {...rest}
    />
  );
});
