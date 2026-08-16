import { cva } from 'class-variance-authority';

import { LIFT, LIFT_DISTANCE, PRESS } from '@/lib/motion';

/**
 * The pill button's visual contract, shared by `Button` (a real `<button>`),
 * `RouteButton` (an internal link) and `ExternalButton` (an outbound link).
 *
 * Kept in its own module so the component files export only components — that
 * is what keeps React Fast Refresh working during development.
 *
 * **Only solid buttons move.** The design lifts `accent` and `ink` on hover but
 * changes the *fill* of `outline` instead — "Custom order" and "More like this"
 * stay put while their background warms to `soft`. Lifting them too made every
 * button feel the same and lost that distinction, so the movement lives on
 * `variant`, not on `density`.
 *
 * Timing and easing come from `LIFT`, so buttons move exactly like the cards.
 */
export const buttonVariants = cva(
  // 100px, not rounded-full: matches the design exactly and keeps the corner
  // radius fixed if a button ever grows past 200px tall.
  [
    'inline-flex items-center justify-center rounded-[100px] whitespace-nowrap uppercase',
    LIFT,
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        accent: 'bg-accent text-white',
        ink: 'bg-ink text-white',
        outline: 'border border-outline hover:border-gold hover:bg-soft',
        ghost: 'text-ink',
      },
      density: {
        desktop: 'text-[13px] tracking-[.18em]',
        mobile: 'text-[12px] tracking-[.18em]',
      },
      size: {
        default: '',
        compact: '',
        wide: '',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      // --- Movement: solid variants only ------------------------------------
      { variant: 'accent', density: 'desktop', class: LIFT_DISTANCE.button },
      { variant: 'ink', density: 'desktop', class: LIFT_DISTANCE.button },
      { variant: 'accent', density: 'mobile', class: PRESS.button },
      { variant: 'ink', density: 'mobile', class: PRESS.button },
      // The accent pill also blooms a coloured shadow as it rises.
      {
        variant: 'accent',
        density: 'desktop',
        class: 'hover:shadow-[0_18px_34px_-14px_rgb(212_102_127_/_0.7)]',
      },

      // --- Desktop paddings -------------------------------------------------
      { density: 'desktop', size: 'default', class: 'px-[34px] py-4' },
      {
        density: 'desktop',
        size: 'compact',
        class: 'px-[22px] py-[11px] text-[13px] tracking-[.16em]',
      },
      { density: 'desktop', size: 'wide', class: 'px-[30px] py-[18px]' },

      // --- Mobile paddings --------------------------------------------------
      { density: 'mobile', size: 'default', class: 'p-[17px]' },
      {
        density: 'mobile',
        size: 'compact',
        class: 'min-h-12 px-[26px] py-[15px] text-[11.5px] tracking-[.16em]',
      },
      { density: 'mobile', size: 'wide', class: 'min-h-[52px] p-[17px]' },
    ],
    defaultVariants: {
      variant: 'accent',
      density: 'desktop',
      size: 'default',
      fullWidth: false,
    },
  },
);
