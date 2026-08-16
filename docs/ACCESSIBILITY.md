# Accessibility

## The one deliberate deviation from the design

**The design uses clickable `<div>`s for every interactive element** — nav
items, buttons, cards, back links, the hamburger, menu entries, the modal close.
Roughly thirty of them.

We ship real `<button>` and `<a>` elements instead.

This is invisible at rest: identical layout, identical colours, identical
spacing. What changes is that the site becomes usable without a mouse. A
clickable `<div>` is not in the tab order, is not announced as interactive, and
does not respond to Enter or Space. For a site whose entire purpose is taking
enquiries, that is not a stylistic choice.

The only visible difference is a focus ring, which appears solely on
`:focus-visible` — keyboard navigation, not clicks — and is styled in the accent
colour.

## Contract

Every primitive in `components/ui/` owns its own accessibility behaviour, so
feature code cannot forget it.

| Concern        | How it is handled                                                                       |
| -------------- | --------------------------------------------------------------------------------------- |
| Focus ring     | Global `:focus-visible` rule, accent, 2px, 3px offset                                   |
| Skip link      | `.skip-link` in the shell, revealed on focus, targets `#main`                           |
| Modal          | Radix Dialog: focus trap, Escape, scroll lock, `aria-modal`, portal                     |
| Focus restore  | Explicit `onCloseAutoFocus` in `Modal` — see below                                      |
| Size selector  | Radix ToggleGroup: radiogroup semantics, arrow-key roving tabindex                      |
| Form fields    | Visually-hidden `<label>`, `aria-invalid`, `aria-describedby`, `role="alert"` on errors |
| Spec table     | `<dl>` / `<dt>` / `<dd>`, so values are read as belonging to their labels               |
| Process steps  | `<ol>` / `<li>`                                                                         |
| Decoration     | Petal field, hoop rings, weave backdrops and arrows are `aria-hidden`                   |
| Touch targets  | Mobile controls are ≥44px; the bottom bar button is 48px                                |
| Reduced motion | All durations collapsed; the petal field is not rendered at all                         |

### Focus restore

Radix restores focus to its own `Dialog.Trigger`. This modal is opened from
state — the header, the footer, the mobile bar, the mobile menu and the artwork
page can all open it — so there is no Trigger, and focus was landing on
`<body>`. `Modal` now records `document.activeElement` when it opens and
restores it in `onCloseAutoFocus`.

**Verified in Chromium, not just jsdom.** See [TESTING.md](TESTING.md) on why
that distinction matters.

## Labelling notes

- The design's form shows placeholders only. Placeholders are not labels — they
  vanish on input and are not reliably announced. Each field carries a
  visually-hidden `<label>`, so the visual is unchanged.
- Artwork photos take the piece's title as alt text. Collection cover photos are
  `alt=""` — the card's heading already names the collection, so alt text would
  be duplication.
- Placeholder hoops are text, not images, so they are read naturally.
- The brandmark's ring-and-dot is `aria-hidden`; the wordmark beside it carries
  the name, and the link is labelled "Magical Hoop Art — home".

## Known gaps

- **Colour contrast.** `--color-ink-ghost` (ink at 45%) on white is roughly
  3.4:1 — below WCAG AA's 4.5:1 for body text. It is used only on placeholder
  captions and thumbnail slot labels, which are scaffolding rather than content
  and disappear once photos are added. Worth revisiting if any of those alphas
  are ever used for real copy.
- **No automated axe run.** Worth adding if the site grows.

## Checking

Keyboard-only walk, no mouse:

1. Tab from load — the skip link should appear first
2. Reach and activate a collection card, then a piece
3. Open the enquiry modal; Tab must cycle within it; Escape must close it and
   return focus to the button that opened it
4. On mobile, the same for the hamburger menu
5. Background must not scroll while either is open
