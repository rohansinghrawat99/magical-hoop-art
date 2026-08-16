# Magical Hoop Art

Portfolio and catalogue for a made-to-order hand-embroidered hoop art business.
Static site — no backend, no CMS. Content lives in TypeScript constant files.

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router 7 · Radix UI

## Getting started

```bash
pnpm install
pnpm dev
```

## Commands

| Command                | What it does                         |
| ---------------------- | ------------------------------------ |
| `pnpm dev`             | Dev server                           |
| `pnpm build`           | Typecheck + production build         |
| `pnpm preview`         | Serve the production build           |
| `pnpm verify`          | Typecheck + lint + test + build      |
| `pnpm test`            | Run tests                            |
| `pnpm lint`            | ESLint, zero warnings tolerated      |
| `pnpm format`          | Prettier                             |
| `pnpm images:optimize` | Convert `assets-src/` photos to WebP |

## Adding content

Editing the catalogue does not require touching any component. Add an object to
`src/constants/artworks.ts`, drop a photo into `src/assets/artworks/`, done.

Full instructions: **[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)**

## Deploying

Any static host. Build output is `dist/`.

The app uses client-side routing, so the host must rewrite unknown paths to
`index.html`:

- **Netlify** — add `/*  /index.html  200` to `public/_redirects`
- **Vercel** — auto-detected for Vite
- **Cloudflare Pages** — add `/*  /index.html  200` to `public/_redirects`

Serve `dist/assets/*` with `cache-control: public, max-age=31536000, immutable` —
those filenames are content-hashed.

## Documentation

| Doc                                                            | For                                   |
| -------------------------------------------------------------- | ------------------------------------- |
| [CLAUDE.md](CLAUDE.md)                                         | Agent/developer entry point           |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                   | Layers, data flow, the 860px decision |
| [docs/ENGINEERING_STANDARDS.md](docs/ENGINEERING_STANDARDS.md) | How to write code here                |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)                 | Tokens, type scale, fidelity rules    |
| [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)                 | Adding pieces and photos              |
| [docs/CODE_REVIEW.md](docs/CODE_REVIEW.md)                     | Review checklist                      |
| [docs/TESTING.md](docs/TESTING.md)                             | Testing approach                      |
| [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)                 | A11y contract                         |
