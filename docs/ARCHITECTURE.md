# Architecture

## Shape of the thing

A static, client-rendered SPA. No server, no database, no API. Content is
TypeScript constants compiled into the bundle; photos are bundled assets. The
whole site is a folder of files on a CDN.

That constraint is the point. The business is one person making things by hand;
the site has to be free to run, impossible to break, and editable by adding a
line to a file.

## Layers

```
constants/          plain data, no logic          ← the owner edits here
   ↓
data/               selectors, derived stats
   ↓
features/           page bodies, desktop + mobile
   ↓
components/ui/      shared primitives             ← knows nothing about hoops
components/layout/  chrome
   ↓
app/                router, shell, page dispatch
```

Dependencies point **downward only**. Two of those edges are enforced by ESLint
rather than convention:

- `components/ui/**` may not import `@/features/*`, `@/constants/*` or `@/data/*`.
  A primitive that knows what an artwork is has stopped being a primitive.
- `features/**` and `components/layout/**` may not import `@radix-ui/*`. Radix is
  an implementation detail of `components/ui/modal.tsx` and
  `components/ui/option-group.tsx`; swapping it out should touch two files.

Types (`@/types/*`) are exempt — they carry no behaviour.

## The 860px decision

**The design ships two separate DOM trees and swaps them in JavaScript at
`window.innerWidth < 860`. We reproduce that exactly rather than merging them
into one responsive tree.**

This looks like duplication. It is deliberate, and here is why:

The two trees are not the same markup at different sizes. They differ in
_structure_ — mobile has a sticky bottom action bar and a fullscreen hamburger
menu that desktop has no equivalent of; desktop has an inline nav that mobile
has no equivalent of. They differ in _content_ — the mobile hero copy is a
shortened rewrite, not the same string reflowed. They differ in _order_ — the
artwork page puts the size selector above the spec table on mobile and below it
on desktop. And they differ in dozens of small numeric ways: `44px` vs
`clamp(46px, 5.6vw, 84px)` headings, `13.5px` vs `14px` body text, `9.5px` vs
`11px` eyebrows.

Expressing that as one tree means a responsive variant on nearly every element,
and every one of those is a place where a future edit silently drifts from the
design at one breakpoint while looking fine at the other. Two explicit trees
make the difference visible and reviewable.

**What stops it becoming two design systems:** both trees compose the same
primitives from `components/ui/`, passing `density="desktop" | "mobile"`. The
size deltas live inside the primitive, declared once, next to each other. A
feature component never writes a raw padding value.

Implemented by `useIsMobile()` (`src/hooks/use-is-mobile.ts`), which uses
`useSyncExternalStore` over `matchMedia` so the value is read during render —
an effect-based read would flash the desktop tree on mobile first paint.

`MOBILE_BREAKPOINT` in that file and `--breakpoint-hoop` in
`src/styles/index.css` must stay in sync.

## Routing

The design navigates by internal state and has no URLs. We use real routes so
pieces can be linked, bookmarked and shared:

| Route                                 | Page            |
| ------------------------------------- | --------------- |
| `/`                                   | Home            |
| `/collections/:categoryId`            | Collection      |
| `/collections/:categoryId/:artworkId` | Artwork         |
| `*`                                   | Redirect to `/` |

Unknown ids redirect rather than 404, because there is no 404 design and a
wrong URL is almost always a stale link.

`ScrollToTop` replaces the design's `top()` call on every view change. The
in-page smooth scrolls to `#collections` / `#process` are preserved via
`useSmoothScrollTo`, which keeps the design's 70px header offset and 90ms
layout delay.

## Shared state

Exactly one piece: whether the enquiry modal is open and what it is about.
It lives in `EnquiryProvider` because five different places can open it. Every
other piece of state is local to its component.

No Redux, no Zustand, no React Query. There is no server to query and no state
worth centralising.

## Rendering the background

`PetalField` generates ~20 absolutely-positioned gradient shapes from a seeded
RNG ported 1:1 from the design (`src/lib/petals.ts`). Same seeds, same layout.
It is memoised per breakpoint and skipped entirely under
`prefers-reduced-motion`.
