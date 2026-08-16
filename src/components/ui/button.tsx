import { type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/cn';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

/** The pill button used for every call to action. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, density, size, fullWidth, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, density, size, fullWidth }), className)}
      {...rest}
    />
  );
});
