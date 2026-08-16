import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { cn } from '@/lib/cn';

export interface OptionGroupProps<T extends string> {
  /** Accessible name for the group, e.g. "Hoop size". */
  label: string;
  options: readonly T[];
  value: T;
  onValueChange: (value: T) => void;
  density?: 'desktop' | 'mobile';
  className?: string;
}

/**
 * A single-select pill group — the hoop size selector.
 *
 * Radix ToggleGroup supplies roving-tabindex arrow-key navigation and the
 * radio semantics; the styling is entirely ours. Radix's own change event fires
 * with `''` when a pressed item is clicked again, which we swallow so the
 * selection can never be emptied.
 */
export function OptionGroup<T extends string>({
  label,
  options,
  value,
  onValueChange,
  density = 'desktop',
  className,
}: OptionGroupProps<T>) {
  const isMobile = density === 'mobile';

  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      aria-label={label}
      onValueChange={(next) => {
        if (next) onValueChange(next as T);
      }}
      className={cn('flex', isMobile ? 'gap-[9px]' : 'flex-wrap gap-[10px]', className)}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option}
          value={option}
          className={cn(
            'cursor-pointer rounded-[100px] border transition-all duration-[350ms]',
            'border-line-ink-strong bg-transparent text-ink',
            'data-[state=on]:border-accent data-[state=on]:bg-accent data-[state=on]:text-white',
            isMobile
              ? 'flex min-h-12 flex-1 items-center justify-center px-2 py-[13px] text-[13px]'
              : 'px-[22px] py-3 text-[13px] tracking-[.06em]',
          )}
        >
          {option}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
