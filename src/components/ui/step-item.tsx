import { cn } from '@/lib/cn';
import type { ProcessStep } from '@/types/content';

export interface StepItemProps {
  step: ProcessStep;
  density?: 'desktop' | 'mobile';
}

/** One numbered step in the "How it works" section. */
export function StepItem({ step, density = 'desktop' }: StepItemProps) {
  const isMobile = density === 'mobile';

  return (
    <li
      className={cn('list-none border-t border-line-ink-strong', isMobile ? 'pt-[15px]' : 'pt-5')}
    >
      <div
        className={cn(
          'font-display leading-none text-accent',
          isMobile ? 'mb-2 text-[30px]' : 'mb-3 text-[38px]',
        )}
      >
        {step.n}
      </div>
      <h3 className={cn('m-0 text-[16px] font-normal', isMobile ? 'mb-[5px]' : 'mb-2')}>
        {step.title}
      </h3>
      <p
        className={cn(
          'm-0 text-ink-muted',
          isMobile ? 'text-[13.5px] leading-[1.65]' : 'text-[14px] leading-[1.7]',
        )}
      >
        {step.body}
      </p>
    </li>
  );
}
