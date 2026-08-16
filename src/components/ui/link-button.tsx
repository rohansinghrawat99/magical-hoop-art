import { type VariantProps } from 'class-variance-authority';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/cn';

type ButtonLook = VariantProps<typeof buttonVariants>;

export type RouteButtonProps = LinkProps & ButtonLook;

/**
 * A pill button that navigates. Same visual contract as `Button`, rendered as
 * a router `<Link>` so it is a real anchor: middle-click, ⌘-click and "copy
 * link address" all behave.
 */
export const RouteButton = forwardRef<HTMLAnchorElement, RouteButtonProps>(function RouteButton(
  { className, variant, density, size, fullWidth, children, ...rest },
  ref,
) {
  return (
    <Link
      ref={ref}
      className={cn(buttonVariants({ variant, density, size, fullWidth }), className)}
      {...rest}
    >
      {children}
    </Link>
  );
});

export type ExternalButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonLook;

/** A pill button pointing off-site. Always opens in a new tab, safely. */
export const ExternalButton = forwardRef<HTMLAnchorElement, ExternalButtonProps>(
  function ExternalButton(
    { className, variant, density, size, fullWidth, children, ...rest },
    ref,
  ) {
    return (
      <a
        ref={ref}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(buttonVariants({ variant, density, size, fullWidth }), className)}
        {...rest}
      >
        {children}
      </a>
    );
  },
);
