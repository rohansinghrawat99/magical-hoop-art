import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

/** The 1180px content column used by every desktop section. */
export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Container({ className, ...rest }, ref) {
    return <div ref={ref} className={cn('mx-auto w-full max-w-page', className)} {...rest} />;
  },
);
