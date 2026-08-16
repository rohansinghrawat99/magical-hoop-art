import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { loadEnv, type Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/** Used when VITE_SITE_URL is unset. Deliberately not a real domain. */
const PLACEHOLDER_SITE_URL = 'https://magicalhoopart.example';

/**
 * Substitute `%SITE_URL%` in index.html.
 *
 * Open Graph and Twitter require **absolute** URLs — a relative `og:image`
 * leaves most crawlers with no preview at all — but the canonical domain is a
 * deployment concern, not something to hard-code. Set `VITE_SITE_URL` in the
 * host's environment (or `.env.local`) and every preview tag follows.
 *
 * Builds without it still succeed, but warn: a silently wrong link preview is
 * the kind of thing nobody notices until someone shares the site.
 */
function siteUrl(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const configured = env.VITE_SITE_URL?.trim().replace(/\/+$/, '');

  return {
    name: 'magical-hoop-art:site-url',
    transformIndexHtml(html) {
      if (!configured && mode === 'production') {
        console.warn(
          '\n  ⚠  VITE_SITE_URL is not set, so link previews will point at\n' +
            `     ${PLACEHOLDER_SITE_URL} and will not render when the site is shared.\n` +
            '     Set it to the live domain before deploying. See docs/CONTENT_GUIDE.md.\n',
        );
      }
      return html.replaceAll('%SITE_URL%', configured || PLACEHOLDER_SITE_URL);
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), siteUrl(mode)],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    // Artwork photos are content-hashed by Vite, so they can be served
    // `cache-control: immutable`. See docs/CONTENT_GUIDE.md.
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
    },
  },
}));
