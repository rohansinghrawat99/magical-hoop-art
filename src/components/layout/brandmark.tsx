import { Link } from 'react-router-dom';

import { SITE } from '@/constants/site';
import { cn } from '@/lib/cn';

export interface BrandmarkProps {
  density?: 'desktop' | 'mobile';
  className?: string;
}

/**
 * The ring-and-dot logo beside the two-part wordmark, linking home.
 *
 * The ring echoes the hoop; the dot is the accent. Purely decorative, so it is
 * hidden from assistive tech — the wordmark beside it carries the name.
 */
export function Brandmark({ density = 'desktop', className }: BrandmarkProps) {
  const isMobile = density === 'mobile';

  return (
    <Link
      to="/"
      aria-label={`${SITE.name} — home`}
      className={cn(
        'flex items-center text-ink hover:text-ink',
        isMobile ? 'gap-[10px]' : 'gap-[14px]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full border-2 border-gold',
          isMobile ? 'size-[30px]' : 'size-[34px]',
        )}
      >
        <span className={cn('rounded-full bg-accent', isMobile ? 'size-[13px]' : 'size-4')} />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            'block font-display tracking-[.16em] uppercase',
            isMobile ? 'text-[16px]' : 'text-[22px]',
          )}
        >
          {SITE.wordmarkTop}
        </span>
        <span
          className={cn(
            'block font-script text-accent',
            isMobile ? 'mt-px text-[15px]' : 'mt-[2px] text-[19px]',
          )}
        >
          {SITE.wordmarkBottom}
        </span>
      </span>
    </Link>
  );
}
