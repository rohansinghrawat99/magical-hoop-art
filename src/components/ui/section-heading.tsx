import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/ui/eyebrow';
import { cn } from '@/lib/cn';

export interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  /** Supporting copy shown beside the heading on desktop, beneath it on mobile. */
  aside?: string;
  density?: 'desktop' | 'mobile';
  /** Draw the hairline the design puts under the collections header. */
  divider?: boolean;
  headingClassName?: string;
  className?: string;
  children?: ReactNode;
}

/** Eyebrow + heading + optional supporting copy. */
export function SectionHeading({
  eyebrow,
  heading,
  aside,
  density = 'desktop',
  divider = false,
  headingClassName,
  className,
  children,
}: SectionHeadingProps) {
  const isMobile = density === 'mobile';

  if (isMobile) {
    return (
      <div className={className}>
        <Eyebrow density="mobile" className="mb-[10px]">
          {eyebrow}
        </Eyebrow>
        <h2
          className={cn('m-0 font-display text-[33px] leading-[1.08] font-light', headingClassName)}
        >
          {heading}
        </h2>
        {aside ? (
          <p className="mt-2 mb-[26px] text-[14px] leading-[1.65] text-ink-dim">{aside}</p>
        ) : null}
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-end justify-between gap-[30px]',
        divider && 'border-b border-line pb-[22px]',
        className,
      )}
    >
      <div>
        <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
        <h2
          className={cn('m-0 font-display text-section leading-none font-light', headingClassName)}
        >
          {heading}
        </h2>
      </div>
      {aside ? (
        <p className="m-0 max-w-[30ch] text-[14px] leading-[1.6] text-ink-dim">{aside}</p>
      ) : null}
      {children}
    </div>
  );
}
