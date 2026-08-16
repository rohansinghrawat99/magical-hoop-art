import { Link, type LinkProps } from 'react-router-dom';

import { cn } from '@/lib/cn';

export type BackLinkProps = LinkProps & {
  density?: 'desktop' | 'mobile';
};

/**
 * The "← All collections" / "← {category}" link above a page heading.
 *
 * The mobile variant is 44px tall to meet the minimum touch target, which the
 * design achieves through its own inline height.
 */
export function BackLink({ className, density = 'desktop', children, ...rest }: BackLinkProps) {
  return (
    <Link
      className={cn(
        'text-ink-faint uppercase transition-colors hover:text-accent',
        density === 'mobile'
          ? 'inline-flex h-11 items-center gap-2 text-[11px] tracking-[.18em]'
          : 'inline-block text-[12px] tracking-[.2em]',
        className,
      )}
      {...rest}
    >
      <span aria-hidden="true">←</span> {children}
    </Link>
  );
}
