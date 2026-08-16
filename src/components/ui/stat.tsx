import { cn } from '@/lib/cn';

export interface StatProps {
  /** The figure, e.g. "36+", "5", "7–10". */
  value: string;
  /** The unit beneath it, e.g. "pieces stitched". */
  label: string;
  density?: 'desktop' | 'mobile';
  className?: string;
}

/** One of the three figures beneath the hero. */
export function Stat({ value, label, density = 'desktop', className }: StatProps) {
  const isMobile = density === 'mobile';

  return (
    <div className={cn(isMobile && 'text-center', className)}>
      <div
        className={cn(
          'font-display tracking-normal text-accent',
          isMobile ? 'mb-[2px] text-[26px]' : 'text-[30px]',
        )}
      >
        {value}
      </div>
      {label}
    </div>
  );
}
