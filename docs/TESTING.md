# Testing

Vitest + React Testing Library + jsdom.

```bash
pnpm test          # once
pnpm test:watch    # watch
pnpm coverage      # with coverage report
```

## What is worth testing here

This is a static content site. The risk is not complex logic — it is content
drift, broken links, and accessibility regressions. Tests are aimed there.

### Content integrity (`src/data/catalogue.test.ts`)

The highest-value tests in the project. They assert that every piece has a
unique, URL-safe id, belongs to a real collection, and has a positive price, and
that derived counts and "from" prices actually match the artworks array.

When the owner adds a piece and fat-fingers the id, this is what catches it.

### Faithfulness (`src/lib/petals.test.ts`)

The petal generator is a port. Its tests pin determinism, shape counts and the
absence of hard-coded hex — so a well-meaning refactor of the "magic numbers"
fails loudly instead of silently changing the background.

### Primitives (`src/components/ui/*.test.tsx`)

Each covers its variants and its accessibility contract: that `Button` renders
a real button and is keyboard-activatable, that `Input` is labelled despite the
design showing only a placeholder, that `OptionGroup` cannot be emptied.

### Flows (`src/features/enquiry/enquiry-modal.test.tsx`)

The one genuinely stateful path: open, validate, submit, close, restore focus.

## Helpers

**`src/test/render.tsx`** — `renderWithProviders(ui, { route })` wraps in a
`MemoryRouter` and `EnquiryProvider`.

**`src/test/viewport.ts`** — `setViewport(width, { reducedMotion })` drives
`useIsMobile` and `usePrefersReducedMotion`. Use `DESKTOP_WIDTH` /
`MOBILE_WIDTH` rather than raw numbers.

```tsx
beforeEach(() => {
  setViewport(MOBILE_WIDTH);
});
```

## Conventions

- Query by role and accessible name. `getByRole('button', { name: 'Enquire' })`
  fails when a button stops being reachable; `getByTestId` does not.
- Test behaviour, not classes. The exception is fidelity assertions
  (`rounded-[100px]`), where the class _is_ the behaviour under test.
- `userEvent`, not `fireEvent`.
- No snapshots. They fail on every intentional change and get regenerated
  without being read.

## jsdom's limits — read this

**jsdom has no layout engine.** It does not compute sizes, positions, or
`matchMedia` against a real viewport. Never trust it for:

- layout, overflow, or anything geometric
- CSS-driven behaviour, animations, transitions
- focus behaviour that depends on visibility

A concrete example from this codebase: the focus-restore test failed in jsdom,
which looked like a jsdom quirk. Checking in real Chromium showed focus was
_genuinely_ landing on `<body>` — a real bug in the modal, now fixed with an
explicit `onCloseAutoFocus` handler. Had the jsdom failure been waved away, the
bug would have shipped.

The rule: **when a test involving focus, layout or media queries fails or passes
surprisingly, verify in a real browser before concluding anything.**

## Verifying in a real browser

Playwright's Chromium is usually already cached on a dev machine. A throwaway
script against `pnpm dev` is enough:

```js
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: /* cached Chrome for Testing */ });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:5173/');
console.log(await p.locator('h1').first().evaluate((el) => getComputedStyle(el).fontSize));
await b.close();
```

This is how the design fidelity was checked — reading computed styles and
comparing them against the design's declared values, rather than eyeballing
screenshots. Eyeballing got the modal scrim wrong; measuring got it right.
