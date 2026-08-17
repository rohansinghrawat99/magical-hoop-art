# Design system

Everything visual comes from `src/styles/index.css`. Change a token there and
the whole site re-themes. Write a hex anywhere else and the build fails.

## Palette

| Token                  | Value     | Used for                             |
| ---------------------- | --------- | ------------------------------------ |
| `--color-canvas`       | `#FFFFFF` | Page background                      |
| `--color-soft`         | `#FCE7EC` | Section fills, card backdrops, chips |
| `--color-accent`       | `#D4667F` | Primary action, script text, figures |
| `--color-accent-hover` | `#B34F66` | Link hover                           |
| `--color-gold`         | `#E9A9B8` | Hoop rings, hairlines                |
| `--color-gold-tint`    | `#F7D8E0` | Hoop ring gradient end               |
| `--color-ink`          | `#3A2A2F` | Text, the dark button                |

### Ink alphas

The design uses ink at **eight** context-specific opacities. They are tokens,
not ad-hoc `rgb(… / …)` calls:

`--color-ink-strong` .78 · `--color-ink-body` .76 · `--color-ink-muted` .7 ·
`--color-ink-soft` .68 · `--color-ink-dim` .65 · `--color-ink-faint` .6 ·
`--color-ink-subtle` .58 · `--color-ink-label` .55 · `--color-ink-ghost` .45

This is why shadcn's `--muted-foreground` model was not adopted: there is no
single "muted". Each alpha is a deliberate choice at a specific place.

Lines (`--color-line*`, `--color-field`, `--color-outline`) and translucent
surfaces (`--color-veil*`, `--color-scrim`) follow the same pattern.

## Typography

| Token            | Family                         | Role                                |
| ---------------- | ------------------------------ | ----------------------------------- |
| `--font-display` | Cormorant Garamond 300/400/500 | Headings, figures, prices           |
| `--font-body`    | Jost 300/400/500               | Body, UI, labels                    |
| `--font-script`  | Parisienne                     | Wordmark, artwork titles, signature |
| `--font-mono`    | ui-monospace                   | Placeholder captions                |

Body weight is **300** globally. Headings are 300 (light) except collection card
titles, which are 400.

### Fluid sizes

| Token               | Value                      |
| ------------------- | -------------------------- |
| `--text-hero`       | `clamp(46px, 5.6vw, 84px)` |
| `--text-section`    | `clamp(34px, 4vw, 54px)`   |
| `--text-section-sm` | `clamp(30px, 3.4vw, 46px)` |
| `--text-page`       | `clamp(38px, 5vw, 66px)`   |
| `--text-detail`     | `clamp(36px, 4.4vw, 58px)` |

Mobile headings are **fixed** sizes (44px, 36px, 34px, 33px, 30px), not clamps —
the mobile tree targets a narrow range and the design pinned them.

## Motion

One easing curve, `--ease-hoop: cubic-bezier(.2,.8,.2,1)`, drives everything.

Six keyframes, ported byte-for-byte: `riseIn`, `fadeIn`, `ringIn`, `sheetUp`,
`drift`, `fallPetal`.

Desktop hovers **lift** (`-translate-y`); mobile presses **scale down**
(`active:scale-[.97]`). That split is in the design and is intentional.

`prefers-reduced-motion: reduce` collapses all durations and drops the petal
field entirely.

## Fidelity rules

The design source is in `design-reference/` (gitignored). When touching
anything visual:

1. **Take numbers verbatim.** `15.5px` stays `15.5px`. `tracking-[.28em]` stays
   `.28em`. Do not round to Tailwind's scale.
2. **Pills use `rounded-[100px]`**, not `rounded-full`. The design says 100px,
   and the two diverge once an element passes 200px tall.
3. **Check both trees.** A change to a shared primitive affects desktop and
   mobile; verify at 1440 and 390.
4. **Check the switch point.** 859px must render mobile, 860px desktop.
5. **Do not add dark mode.** The design specifies light only; inventing a dark
   palette means inventing colours that match nothing.

### Verifying

```bash
pnpm dev
```

Open `design-reference/Magical Hoop Art.dc.html` beside the dev server at
1440 / 1280 / 860 / 859 / 390 px and compare.

### Departures from the design

Deliberate, owner-requested, and **not** drift to be corrected on the next
pixel-diff pass:

- **Photos are full-bleed, not framed in a hoop.** The design puts every
  photo inside an embroidery hoop — a gradient ring on the hero and piece page,
  a gold border on both card thumbnails. Only the home hero still does. Card
  thumbnails and the piece page fill their panel edge to edge, so the work is
  shown as large as the layout allows.
- The weave backdrop stays behind those photos even though an opaque photo
  hides it: it is what the placeholder state sits on when a piece has no
  photo yet.
- The artwork card's price strip fades from `0.96` white and holds until past
  its text, rather than fading across the full strip. The design's value was
  legible over the pale weave; over a photograph it was not.

## Why not shadcn/ui

shadcn covers ~6 of the ~20 primitives here, and for `Button`, `Input`,
`Textarea` and `Badge` its entire variant table and token references would be
deleted on arrival — leaving the `cva` skeleton we write anyway. Its `Card`
doesn't match structurally. Thirteen primitives (`HoopFrame`, `StitchBackdrop`,
`PetalField`, `Eyebrow`, `Brandmark`, `SpecList`, `Stat`, `ThumbnailStrip`, …)
have no equivalent at all.

Its semantic token model (`--primary` / `--primary-foreground`,
`--muted-foreground`, `--radius`) does not fit a design built on eight ink
alphas and 100px pills. Running both vocabularies is where drift starts.

So: **Radix for behaviour, shadcn's architecture, our own visual layer.**
Do not run `npx shadcn add`.
