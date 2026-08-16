/**
 * One hover/press motion for the whole app.
 *
 * Every lifting or pressing surface — collection cards, artwork cards, solid
 * buttons, detail thumbnails — uses `LIFT`, so the site moves with a single
 * consistent feel rather than four slightly different ones.
 *
 * ---------------------------------------------------------------------------
 * ⚠️ `translate` MUST stay in the property list.
 *
 * Tailwind v4 compiles `-translate-y-*` to the standalone CSS `translate`
 * property, NOT to `transform`. A hand-written list like
 * `transition-[transform,box-shadow]` therefore transitions the shadow but
 * leaves the lift completely untransitioned — the element snaps to its hovered
 * position on the first frame while the shadow drifts in behind it. That reads
 * as "janky" even though no frames are dropped.
 *
 * This bug shipped in three components before it was caught by measuring the
 * computed `translate` value over time. `src/lib/motion.test.ts` guards it.
 *
 * Prefer this constant over writing a `transition-[…]` list by hand.
 * ---------------------------------------------------------------------------
 */
export const LIFT = [
  'transition-[translate,scale,box-shadow,background-color,border-color]',
  'duration-500 ease-hoop',
].join(' ');

/**
 * How far each surface travels. Sizes differ with the element — a card lifts
 * further than a button — but the duration and easing above are shared.
 */
export const LIFT_DISTANCE = {
  card: 'hover:-translate-y-2',
  artworkCard: 'hover:-translate-y-[7px]',
  button: 'hover:-translate-y-[3px]',
} as const;

/** Touch feedback. Mobile presses inward instead of lifting. */
export const PRESS = {
  card: 'active:scale-[.985]',
  button: 'active:scale-[.97]',
} as const;
