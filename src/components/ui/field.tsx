import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

/**
 * Enquiry form controls.
 *
 * The design draws these as placeholder-only inputs. Placeholders are not
 * labels, so we keep the visual exactly as drawn and attach a visually-hidden
 * <label> plus aria-describedby for the error — identical at rest, usable with
 * a screen reader. See docs/ACCESSIBILITY.md.
 *
 * 16px font size is deliberate: anything smaller makes iOS Safari zoom on
 * focus.
 */
const controlClasses = [
  'w-full rounded-xl border border-field bg-transparent px-[17px] py-[15px] text-[16px]',
  'text-ink outline-none transition-colors placeholder:text-ink-label',
  'focus:border-accent aria-[invalid=true]:border-accent',
];

interface FieldShared {
  label: string;
  error?: string | undefined;
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldShared;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div>
      <label htmlFor={fieldId} className="sr-only">
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? errorId : undefined}
        className={cn(controlClasses, 'min-h-[50px]', className)}
        {...rest}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
});

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldShared;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div>
      <label htmlFor={fieldId} className="sr-only">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? errorId : undefined}
        className={cn(controlClasses, 'resize-y', className)}
        {...rest}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
});

function FieldError({ id, error }: { id: string; error: string | undefined }) {
  if (error === undefined) return null;

  return (
    <p id={id} role="alert" className="mt-[6px] px-1 text-[12px] text-accent">
      {error}
    </p>
  );
}
