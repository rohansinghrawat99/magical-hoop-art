import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

/** The floating "N pieces" chip on a collection card. */
const badgeVariants = cva('rounded-[100px] uppercase', {
  variants: {
    density: {
      desktop: 'bg-veil-chip px-3 py-[6px] text-[11px] tracking-[.16em]',
      mobile: 'bg-veil-chip px-[11px] py-[5px] text-[10px] tracking-[.14em]',
    },
  },
  defaultVariants: { density: 'desktop' },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, density, ...rest },
  ref,
) {
  return <span ref={ref} className={cn(badgeVariants({ density }), className)} {...rest} />;
});
