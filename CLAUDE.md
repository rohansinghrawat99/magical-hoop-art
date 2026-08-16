# Magical Hoop Art

Portfolio and catalogue site for a made-to-order hand-embroidered hoop art
business. Static content, no backend, no CMS — everything the site shows lives
in constant files the owner edits by hand.

Built from a finished Claude Design file. **Visual fidelity to that design is a
hard requirement**, not a preference. Read [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
before changing anything visual.

## Commands

```bash
pnpm dev                 # dev server
pnpm build               # typecheck + production build
pnpm preview             # serve the build
pnpm verify              # typecheck + lint + test + build — run before you finish
pnpm test                # vitest run
pnpm test:watch          # vitest watch
pnpm lint                # eslint, zero warnings tolerated
pnpm format              # prettier write
pnpm images:optimize     # convert assets-src/ drops into WebP
```

## Where things live

| Path                                    | What                                                       |
| --------------------------------------- | ---------------------------------------------------------- |
| `src/constants/`                        | **All site content.** The owner's editing surface.         |
| `src/data/`                             | Read-only selectors and derived stats over the constants.  |
| `src/components/ui/`                    | Shared primitives. Content-agnostic, no app knowledge.     |
| `src/components/layout/`                | Headers, footers, mobile bar and menu.                     |
| `src/components/decor/`                 | Petal field and the fabric backdrop.                       |
| `src/features/<name>/{desktop,mobile}/` | Page bodies, split by breakpoint tree.                     |
| `src/app/`                              | Router, page dispatch, shell.                              |
| `src/lib/`                              | `cn`, `format`, `images`, `petals`.                        |
| `src/styles/index.css`                  | Every design token. Single source of truth.                |
| `src/assets/artworks/`                  | Photo drop zone.                                           |
| `design-reference/`                     | The original design export, for pixel diffing. Gitignored. |

## The five rules

1. **No raw hex colours.** Use a token from `src/styles/index.css`. ESLint fails
   the build otherwise.
2. **No new one-off components.** If a visual repeats, it belongs in
   `components/ui/`. See [docs/ENGINEERING_STANDARDS.md](docs/ENGINEERING_STANDARDS.md).
3. **Desktop and mobile are separate trees**, switched at 860px in JS. This is
   deliberate — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
4. **Content goes in `src/constants/`**, never inline in a component. Counts,
   "from" prices and search tags are all **derived** in `src/data/` and
   `src/lib/tags.ts` — never stored, so adding a piece needs no bookkeeping.
5. **Radix is only imported inside `components/ui/`.** Feature code composes our
   primitives. Enforced by lint.

## Docs

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — layers, data flow, the 860px decision
- [ENGINEERING_STANDARDS.md](docs/ENGINEERING_STANDARDS.md) — how to write code here
- [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — tokens, type scale, fidelity rules
- [CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) — adding pieces and photos
- [CODE_REVIEW.md](docs/CODE_REVIEW.md) — review checklist
- [TESTING.md](docs/TESTING.md) — what to test and how
- [ACCESSIBILITY.md](docs/ACCESSIBILITY.md) — the a11y contract and known deviations
