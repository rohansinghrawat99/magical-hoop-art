import { cn } from '@/lib/cn';
import type { Spec } from '@/types/content';

export interface SpecListProps {
  specs: readonly Spec[];
  density?: 'desktop' | 'mobile';
  className?: string;
}

/**
 * The key/value rows on the artwork page.
 *
 * A description list rather than a stack of divs, so assistive tech reads each
 * value as belonging to its label.
 */
export function SpecList({ specs, density = 'desktop', className }: SpecListProps) {
  const isMobile = density === 'mobile';

  return (
    <dl className={cn('grid', isMobile ? 'gap-3' : 'gap-[14px]', className)}>
      {specs.map((spec) => (
        <div
          key={spec.k}
          className={cn(
            'flex justify-between border-b border-line-ink',
            isMobile ? 'gap-4 pb-[11px] text-[13.5px]' : 'gap-5 pb-3 text-[14px]',
          )}
        >
          <dt
            className={cn(
              'text-ink-label uppercase',
              isMobile ? 'text-[10px] tracking-[.14em]' : 'text-[11px] tracking-[.14em]',
            )}
          >
            {spec.k}
          </dt>
          <dd className={cn('m-0', isMobile && 'text-right')}>{spec.v}</dd>
        </div>
      ))}
    </dl>
  );
}
