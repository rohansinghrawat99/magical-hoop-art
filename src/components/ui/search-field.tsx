import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useId, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

/**
 * The search input, in both places search appears: the overlay's header row and
 * the pill on a collection page.
 *
 * The leading glyph is the hoop — a ring, echoing the brandmark — rather than a
 * magnifier, so it belongs to this design rather than a generic toolbar.
 *
 * 16px minimum font size on mobile is deliberate: anything smaller makes iOS
 * Safari zoom the whole page on focus.
 */
const fieldVariants = cva('flex w-full items-center gap-3', {
  variants: {
    variant: {
      /** Inside the overlay card: no border, the card supplies the frame. */
      overlay: 'px-5 py-[18px]',
      /** On a collection page: a bordered pill sitting in the flow. */
      pill: 'rounded-[100px] border border-line-strong bg-white px-5 focus-within:border-accent',
    },
    density: { desktop: '', mobile: '' },
  },
  compoundVariants: [
    { variant: 'pill', density: 'desktop', class: 'min-h-[52px] py-[13px]' },
    { variant: 'pill', density: 'mobile', class: 'min-h-12 py-3' },
  ],
  defaultVariants: { variant: 'pill', density: 'desktop' },
});

export interface SearchFieldProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>,
    VariantProps<typeof fieldVariants> {
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name; the design shows only a placeholder. */
  label: string;
  /** Show an × that empties the field. Only rendered when there is text. */
  clearable?: boolean;
  wrapperClassName?: string;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    value,
    onValueChange,
    label,
    clearable = false,
    variant,
    density,
    className,
    wrapperClassName,
    id,
    ...rest
  },
  ref,
) {
  const isOverlay = variant === 'overlay';
  // Without a generated fallback the <label for> points at nothing and the
  // accessible name is lost, since the design shows only a placeholder.
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={cn(fieldVariants({ variant, density }), wrapperClassName)}>
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 rounded-full border-2 border-accent',
          isOverlay ? 'size-[18px]' : 'size-[15px]',
        )}
      />

      <label htmlFor={fieldId} className="sr-only">
        {label}
      </label>

      <input
        ref={ref}
        id={fieldId}
        type="search"
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
        }}
        className={cn(
          'w-full border-none bg-transparent text-ink outline-none placeholder:text-ink-label',
          // 16px floor on mobile keeps iOS from zooming on focus.
          isOverlay ? 'text-[17px]' : 'text-[16px]',
          '[&::-webkit-search-cancel-button]:appearance-none',
          className,
        )}
        {...rest}
      />

      {clearable && value.length > 0 ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onValueChange('');
          }}
          className="shrink-0 cursor-pointer px-1 text-[18px] leading-none text-ink-label transition-colors hover:text-accent"
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
});
