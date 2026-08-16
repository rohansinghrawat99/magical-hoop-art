import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

/**
 * The small uppercase accent label above a heading. Used ~10 times across the
 * design, at two sizes and with an optional leading rule.
 */
const eyebrowVariants = cva('text-accent uppercase', {
  variants: {
    density: {
      desktop: 'text-[11px] tracking-[.3em]',
      mobile: 'text-[9.5px] tracking-[.28em]',
    },
    withRule: {
      true: 'inline-flex items-center',
      false: '',
    },
  },
  compoundVariants: [
    { withRule: true, density: 'desktop', class: 'gap-[10px]' },
    { withRule: true, density: 'mobile', class: 'gap-[9px]' },
  ],
  defaultVariants: { density: 'desktop', withRule: false },
});

export type EyebrowProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof eyebrowVariants>;

export const Eyebrow = forwardRef<HTMLDivElement, EyebrowProps>(function Eyebrow(
  { className, density, withRule, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(eyebrowVariants({ density, withRule }), className)} {...rest}>
      {withRule ? (
        <span
          aria-hidden="true"
          className={cn('h-px bg-gold', density === 'mobile' ? 'w-6' : 'w-[34px]')}
        />
      ) : null}
      {children}
    </div>
  );
});
