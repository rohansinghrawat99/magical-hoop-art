# Code review

## Severity

**Blocker** — ship-stopping. Broken behaviour, a visual regression against the
design, an accessibility regression, a layer-boundary violation, content typed
into a component.

**Should fix** — duplication that wants promoting into `components/ui/`, a
missing test on new behaviour, an unexplained magic number.

**Consider** — naming, comment wording, ordering. Never blocks.

State the severity. An unlabelled comment reads as a blocker.

## Checklist

### Fidelity

- [ ] Numbers taken verbatim from the design, not rounded to Tailwind's scale
- [ ] Checked in **both** trees — 1440px and 390px
- [ ] Switch point still correct: 859 mobile, 860 desktop
- [ ] Pills use `rounded-[100px]`, circles use `rounded-full`
- [ ] No new animation curve — `--ease-hoop` drives everything

### Reuse

- [ ] No raw hex colour anywhere (lint catches it, but check tokens are the
      _right_ ones — `ink-label` vs `ink-faint` is a real distinction)
- [ ] A visual appearing a third time has been promoted to `components/ui/`
- [ ] No class string duplicated across desktop and mobile files — that belongs
      in a primitive with a `density` variant
- [ ] New primitive uses `forwardRef`, spreads `...rest`, merges `className` last

### Boundaries

- [ ] `components/ui/**` imports nothing from `features/`, `constants/`, `data/`
- [ ] No `@radix-ui/*` import outside `components/ui/`
- [ ] Content lives in `src/constants/`, not inline
- [ ] Derived figures are computed in `data/`, not stored

### Correctness

- [ ] Array indexing handles `undefined` (`noUncheckedIndexedAccess` is on)
- [ ] No `any`, no non-null `!` outside tests
- [ ] Effects have correct dependencies and clean up
- [ ] Module-level reads of `import.meta.env` avoided — they freeze at import
      time and can't be overridden in tests

### Accessibility

- [ ] Interactive elements are `<button>` or `<a>`, never a clickable `<div>`
- [ ] Anything conveying meaning has an accessible name
- [ ] Decorative elements are `aria-hidden`
- [ ] New modal behaviour keeps the focus trap, Escape and focus restore
- [ ] Touch targets on mobile are at least 44px

### Tests

- [ ] New behaviour has a test; new primitive has a colocated test
- [ ] Tests assert user-visible behaviour, not implementation detail
- [ ] `pnpm verify` passes

## Things worth pushing back on

- **A responsive variant in a feature file.** The trees are separate; a
  `md:` prefix in `features/` usually means someone is rebuilding the wrong
  abstraction.
- **A new hex "just for this one thing."** It is never just one thing.
- **Rounding a design number** because `text-[15.5px]` looks untidy.
- **Reaching for `npx shadcn add`.** See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
- **A jsdom-only assertion about focus or layout.** jsdom has no layout engine;
  verify in a real browser before believing either a pass or a failure.
