# Engineering standards

## Naming and files

- Files are `kebab-case.tsx`. Components inside them are `PascalCase`.
- One component per file. Colocate its test as `<name>.test.tsx`.
- Hooks are `use-<thing>.ts`, exporting `useThing`.
- Import via the `@/` alias, never `../../..`.
- `components/ui/` is re-exported through `components/ui/index.ts`. Feature code
  imports from `@/components/ui`, not from the individual file.

## TypeScript

`strict`, plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`noImplicitOverride`, `noUnusedLocals` and `noUnusedParameters`.

- No `any`. No non-null `!` outside tests.
- `interface` for object shapes, `type` for unions and mapped types.
- Prefer `readonly` arrays for constant data.
- Indexing an array gives `T | undefined` — handle it, don't assert it away.

## Components

Every primitive in `components/ui/` follows the same contract:

```tsx
export const Thing = forwardRef<HTMLDivElement, ThingProps>(function Thing(
  { className, variant, ...rest },
  ref,
) {
  return <div ref={ref} className={cn(thingVariants({ variant }), className)} {...rest} />;
});
```

1. `forwardRef` — so it can be measured, focused or portalled into.
2. Spread `...rest` — so a call site can pass `id`, `aria-*`, data attributes.
3. `className` merged **last** through `cn()` — so a call site can adjust it
   without forking the component. `tailwind-merge` makes the override win.
4. Variants through `cva`, never through ad-hoc string concatenation.
5. Interactive primitives own their keyboard, focus and ARIA behaviour so no
   feature component has to remember it.

### Density, not breakpoints

Primitives take `density: 'desktop' | 'mobile'` rather than using Tailwind
responsive prefixes. The app renders two trees (see
[ARCHITECTURE.md](ARCHITECTURE.md)), so a primitive is always rendered by
exactly one of them and knows which. This keeps the two size variants declared
side by side in one `cva` table, where they can be compared.

### Context variants

Where the design specifies genuinely different treatments per usage — the hoop
frame, the placeholder — the variant is named after the _context_
(`hero`, `card`, `cardMobile`, `detail`) rather than exposing a dozen loose
numeric props. `HoopPlaceholder` still carries all seven the design draws.

`HoopFrame` is down to `hero`: the design framed every photo in a hoop, but card
thumbnails and the piece page now show theirs square in `PhotoFrame`'s pink mat,
so only the home hero keeps the ring. The one-member `context` is deliberate — a
second hoop would be another context, not a fork of the component.

## When to make a new component

Promote to `components/ui/` when a visual appears a **third** time, or the
second time if it carries behaviour (focus, keyboard, ARIA).

Do not create a component for a one-off arrangement of existing primitives —
that is what a feature file is for.

## Styling

- **Never write a raw hex colour.** Use a token. ESLint rejects `#RRGGBB`
  literals outside `src/lib/petals.ts` and the stylesheet.
- Use arbitrary values (`text-[15.5px]`, `tracking-[.28em]`) where the design
  specifies an off-scale number. **Do not round to the nearest Tailwind step** —
  that is how pixel drift starts.
- Repeated values belong in `@theme` as tokens.
- No inline `style` except for genuinely computed values (the petal field).

## Content

All copy, prices, names and blurbs live in `src/constants/`. A string that a
visitor reads should never be typed into a component file.

Derived figures — piece counts, "from" prices, totals — are computed in
`src/data/catalogue.ts`, never stored. The design hard-coded a "from $85" for
Calendar Wishes whose cheapest piece is actually $95; deriving it removed the
bug and prevents the next one.

## Comments

Explain **why**, not what. Good reasons to comment here:

- A number is taken verbatim from the design and must not be "tidied"
- A deviation from the design and its justification
- A workaround for a library or browser behaviour

Do not narrate what the code plainly does.

## Commits

Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
`pnpm verify` must pass before you finish. Husky runs lint-staged on commit.
