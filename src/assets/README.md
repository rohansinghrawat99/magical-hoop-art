# Photos

Drop artwork photos here. Nothing else is required — no imports, no uploads, no
config. The app picks them up automatically.

## Naming

One photo per piece:

```
src/assets/artworks/<categoryId>/<artworkId>.webp
src/assets/hero/hero-hoop.webp
```

- `<categoryId>` — `photo-frames`, `thoughts`, `calendar`, `wedding`, `names`, `decor`
- `<artworkId>` — the `id` field from `src/constants/artworks.ts`

Example:

```
src/assets/artworks/wedding/blue-lehenga-couple.webp
```

Any piece without a photo keeps showing its placeholder hoop, so a
half-finished catalogue still looks intentional.

## Optimising

Put originals in `assets-src/` (gitignored) mirroring the same folder names,
then:

```bash
pnpm images:optimize
```

Square-crops to 1400px from the centre and converts to WebP at quality 82.
iPhone HEIC is handled. The current 42 photos come to about 13 MB.

Point it elsewhere with `--from`:

```bash
pnpm images:optimize --from ~/Downloads/Artworks
```

Full guide: [`docs/CONTENT_GUIDE.md`](../../docs/CONTENT_GUIDE.md)
