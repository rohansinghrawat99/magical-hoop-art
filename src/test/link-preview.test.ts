import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * Guards the link preview — the card shown when the URL is shared on WhatsApp,
 * Facebook, Instagram or iMessage.
 *
 * This is worth pinning precisely because it is invisible in normal use: the
 * site looks perfect, and the preview is only discovered to be broken once a
 * customer shares it. Deleting the image, renaming it, or dropping a tag all
 * fail here instead.
 */
const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8');
const OG_IMAGE = resolve(__dirname, '../../public/og-image.jpg');

function content(property: string): string | undefined {
  const pattern = new RegExp(`<meta\\s+(?:property|name)="${property}"\\s+content="([^"]*)"`, 'i');
  // Prettier may wrap long tags, so also allow the attributes on separate lines.
  const multiline = new RegExp(`(?:property|name)="${property}"\\s*\\n?\\s*content="([^"]*)"`, 'i');
  return pattern.exec(html)?.[1] ?? multiline.exec(html)?.[1];
}

describe('open graph tags', () => {
  it.each([
    'og:type',
    'og:site_name',
    'og:url',
    'og:title',
    'og:description',
    'og:image',
    'og:image:width',
    'og:image:height',
    'og:image:alt',
  ])('declares %s', (property) => {
    expect(content(property), `missing <meta property="${property}">`).toBeTruthy();
  });

  it('uses an absolute image URL — relative ones give crawlers no preview', () => {
    const image = content('og:image') ?? '';
    // %SITE_URL% is substituted at build time; what matters is that it is not
    // a bare path.
    expect(image.startsWith('%SITE_URL%/') || /^https?:\/\//.test(image)).toBe(true);
    expect(image).toMatch(/og-image\.jpg$/);
  });

  it('points og:url and og:image at the same origin placeholder', () => {
    expect(content('og:url')).toContain('%SITE_URL%');
    expect(content('og:image')).toContain('%SITE_URL%');
  });

  it('requests a large summary card on Twitter/X', () => {
    expect(content('twitter:card')).toBe('summary_large_image');
    expect(content('twitter:image')).toBe(content('og:image'));
  });
});

describe('the og image file', () => {
  it('exists at the path the tags reference', () => {
    expect(() => statSync(OG_IMAGE)).not.toThrow();
  });

  it('matches the declared 1200×630 dimensions', () => {
    // JPEG SOF0/SOF2 marker: FF C0|C2, length, precision, height, width.
    const buffer = readFileSync(OG_IMAGE);
    let offset = 2;
    let dimensions: { width: number; height: number } | null = null;

    while (offset < buffer.length - 9) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      if (marker !== undefined && (marker === 0xc0 || marker === 0xc2)) {
        dimensions = {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
        break;
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }

    expect(dimensions).toEqual({ width: 1200, height: 630 });
    expect(dimensions?.width).toBe(Number(content('og:image:width')));
    expect(dimensions?.height).toBe(Number(content('og:image:height')));
  });

  it('stays small enough for crawlers to fetch', () => {
    // Several platforms skip images over ~1 MB; well under is safer.
    expect(statSync(OG_IMAGE).size).toBeLessThan(1_000_000);
  });
});
