# Content guide

This is the manual for keeping the site up to date. Nothing here needs a
developer — it is editing text files and dropping in photos.

Everything lives in **`src/constants/`**.

## Adding a piece

Open [`src/constants/artworks.ts`](../src/constants/artworks.ts) and add an
object to the list, in the section for its collection:

```ts
{
  id: 'rose-gold-initials',      // the title, lowercased and hyphenated
  categoryId: 'names',           // photo-frames | thoughts | calendar | wedding | names | decor
  title: 'Rose Gold Initials',
  options: [
    { label: '10 inch ring', price: 180 },   // price is a number: no $, no quotes
    { label: '12 inch ring', price: 210 },
  ],
},
```

That is the whole job. The piece appears in its collection, gets its own URL at
`/collections/names/rose-gold-initials`, the collection's piece count and "from"
price update on their own, **and it becomes searchable immediately** — its tags
are derived from the title, so there is nothing to tag by hand.

### Sizes and prices

Every piece carries its own `options`, because sizes genuinely vary: most come
in 10 and 12 inch, one is 12 and 14 inch, the handkerchiefs are a single flat
size, and the Mandap piece has four options because the cartoon and 3D couple
versions are priced apart.

- The **first** option is preselected on the artwork page.
- The **cheapest** drives the "from $X" on cards and collection headers.
- A piece with one option is quoted flat rather than "from".

Use the `label` to carry a variant as well as a size when they are priced
separately:

```ts
options: [
  { label: '10 inch ring · cartoon couple', price: 250 },
  { label: '12 inch ring · cartoon couple', price: 300 },
  { label: '10 inch ring · 3D couple', price: 280 },
  { label: '12 inch ring · 3D couple', price: 330 },
],
```

### The id must match the title

`id` is always the slugified title — lowercase, punctuation removed, spaces to
hyphens. A test enforces this, because the id is also the photo's filename.

If two pieces genuinely share a title, the second takes a `-2` suffix (and its
photo file does too).

**Optional:** add `description: '…'` to write the artwork copy yourself. Without
it, copy is generated from `size`. The two kerchief pieces use this because the
generated wording assumes a wooden hoop.

**Optional:** add `tags: ['shiva', 'trishul']` for search keywords the title
cannot imply. Rarely needed — see "Search tags" below.

## Removing or repricing

Delete the object, or change `price`. Counts and "from" prices follow. Do not
edit a count by hand — there isn't one to edit.

## Adding photos

One photo per piece, named exactly after its `id`:

```
src/assets/artworks/<categoryId>/<id>.webp
```

For the example above: `src/assets/artworks/names/rose-gold-initials.webp`.

You do not have to slugify by hand — name the file after the piece
(`Rose Gold Initials.HEIC`) and `pnpm images:optimize` slugifies it for you
using the same rule that produces the id.

The hero photo goes at `src/assets/hero/hero-hoop.webp`.

Nothing else is needed — no imports, no config. A piece with no photo keeps
showing its placeholder hoop, so a half-finished catalogue still looks
deliberate.

A collection's card on the home page uses the first photo it can find among its
pieces.

### Optimising

Put the originals (phone photos, whatever size) in `assets-src/`, in
per-collection folders:

```
assets-src/names/Rose Gold Initials.HEIC
assets-src/hero/hero-hoop.jpg
```

Then:

```bash
pnpm images:optimize

# or convert straight from somewhere else:
pnpm images:optimize --from ~/Downloads/Artworks
```

Files are square-cropped to 1400px from the centre and converted to WebP at
quality 82. **iPhone HEIC is handled** — sharp decodes what it can and falls
back to macOS `sips` for the HEVC-encoded files it cannot.

Folder names are matched loosely, so `PhotoFrames`, `photo-frames` and
`Name&Initials` all land in the right collection.

The current 42 photos come to about 13 MB.

### The photo is shown in a circle

Each hoop is a **circular** mask over a square crop, so the corners of your
photo are always cut off. Shoot or crop with the hoop centred and some room
around it.

### Why photos live in the repository

Bundled photos get content-hashed filenames, which lets them be cached forever
by the browser — faster on repeat visits than any free image host, which also
brings link rot, rate limits and hotlink blocking. Local development works
offline, there is no account to manage, and adding a photo is a file copy rather
than an upload. External hosting only starts to win past a few hundred MB, about
ten times this site's ceiling.

## Adding a collection

1. Add an entry to [`src/constants/categories.ts`](../src/constants/categories.ts).
2. Add its id to the `CategoryId` union in
   [`src/types/content.ts`](../src/types/content.ts).
3. Create `src/assets/artworks/<newId>/`.
4. Add a folder alias in `scripts/optimize-images.mjs` if your photo folder is
   named differently.
5. Add pieces to it in `artworks.ts`.

It appears on the home page, in the mobile menu and in the site's stats
automatically.

## Search tags

Tags are **derived, never written by hand**. `src/lib/tags.ts` reads each
piece's title, its collection and its sizes, and produces:

- **words** from the title — "Rainbow and Cloud Theme" gives `rainbow`, `cloud`
- **concepts** from a curated map, so a shopper's words find a maker's:
  searching _wedding_ finds "Mandap Theme"; _devotional_ finds Swastik, Mahadev,
  Radha Krishna and Makka Madina; _photo_ finds the whole Photo Frames
  collection

Because it is derived, **a piece added tomorrow is searchable the moment it
appears** — there is no tagging step to forget.

Only add a manual `tags: [...]` when a title cannot possibly imply the word
someone would search for (e.g. `shiva` on "Mahadev"). To teach the site a new
concept across many pieces at once, add it to `CONCEPTS` in `src/lib/tags.ts`
instead of tagging each piece.

### Where search appears

- **The overlay** — the "Search" pill in the desktop header, the icon in the
  mobile header, and the "Search" row in the mobile menu. Results are grouped by
  collection with a count per group.
- **The collection filter** — the search pill and sort control on each
  collection page, filtering that collection only.

The chips shown before anything is typed live in `POPULAR_QUERIES`
(`src/features/search/search-context.ts`). A test asserts every chip still
returns at least one piece, so retiring an artwork cannot leave a dead chip
behind.

## Other editable text

| File                      | What                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `constants/site.ts`       | Brand name, taglines, hero copy, section headings, social links, **WhatsApp number** |
| `constants/process.ts`    | The four "How it works" steps                                                        |
| `constants/product.ts`    | Hoop sizes, spec rows, price notes                                                   |
| `constants/navigation.ts` | URL shapes and header links                                                          |

## The link preview

`public/og-image.jpg` is the card shown when the site's URL is shared on
WhatsApp, Facebook, Instagram or iMessage. It is a 1200 × 630 capture of the
homepage hero.

Two things keep it working:

- **`VITE_SITE_URL`** must be set to the live domain in the deployment
  environment. Open Graph requires absolute URLs, so without it the preview
  points at a placeholder and no image appears. `pnpm build` warns when it is
  missing.
- **The image must stay 1200 × 630.** A test checks the file exists, matches the
  dimensions declared in `index.html`, and is small enough for crawlers.

To refresh it after changing the hero, screenshot the homepage at 1440 × 754 and
resize to 1200 × 630:

```bash
pnpm dev
# capture http://localhost:5173 at 1440x754, then:
# sharp(capture).resize(1200, 630).jpeg({ quality: 88 }).toFile('public/og-image.jpg')
```

Changing the logo means regenerating the favicons too — they are
`public/favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` and
`icon-512.png`, all square crops of the same source.

## Contact details

Both live in [`src/constants/site.ts`](../src/constants/site.ts) and are set:

```ts
export const WHATSAPP_NUMBER = '61430610556'; // +61 430 610 556
export const INSTAGRAM_HANDLE = 'magical_hoopart';
```

The WhatsApp number is full international format, digits only — no `+`, no
spaces. An Australian `0430 610 556` becomes `61430610556`. If it is ever
cleared, the enquiry form shows a warning instead of submitting.

The footer's WhatsApp and Instagram links are both built from these, so changing
the number or handle updates every link on the site.

## Checking your work

```bash
pnpm dev
```

Then visit the collection you changed. If something looks wrong, `pnpm verify`
will tell you whether it is a typo (the tests check that every piece has a
unique, URL-safe id and a valid category).
