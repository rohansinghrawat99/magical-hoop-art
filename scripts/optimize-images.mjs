#!/usr/bin/env node
/**
 * Convert dropped photo originals into web-ready WebP.
 *
 *   1. Put originals in  assets-src/<categoryId>/  (gitignored)
 *   2. Run                pnpm images:optimize
 *   3. Optimised files land in  src/assets/artworks/<categoryId>/
 *
 * Name each file after its piece — the script slugifies it with the same rule
 * that produces an artwork's `id`, so `Memory Hoop.HEIC` becomes
 * `memory-hoop.webp` and is picked up automatically by src/lib/images.ts.
 * HEIC straight off an iPhone is handled natively.
 *
 * Pass `--from <dir>` to convert from somewhere other than assets-src/.
 * See docs/CONTENT_GUIDE.md.
 */

import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { basename, extname, join, relative } from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

import { slugify } from './slugify.mjs';

const run = promisify(execFile);

const args = process.argv.slice(2);
const fromFlag = args.indexOf('--from');
const SOURCE_DIR = fromFlag === -1 ? 'assets-src' : (args[fromFlag + 1] ?? 'assets-src');

const OUTPUT_DIR = join('src', 'assets', 'artworks');
const HERO_OUTPUT_DIR = join('src', 'assets', 'hero');

/**
 * Square crop at 1400px covers the largest hoop on a 2× display. The photo is
 * shown inside a circular mask, so it is cropped from the centre.
 */
const MAX_WIDTH = 1400;
const QUALITY = 82;

const INPUT_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.tif',
  '.tiff',
  '.heic',
  '.heif',
]);

/** Map a source folder name onto a categoryId. Accepts either spelling. */
const FOLDER_ALIASES = {
  photoframes: 'photo-frames',
  'photo-frames': 'photo-frames',
  somethoughts: 'thoughts',
  thoughts: 'thoughts',
  calendarwishes: 'calendar',
  calendar: 'calendar',
  weddinganniversaryandengagement: 'wedding',
  wedding: 'wedding',
  'name&initials': 'names',
  nameinitials: 'names',
  names: 'names',
  homedecor: 'decor',
  decor: 'decor',
  babyandmotherhood: 'baby',
  'baby&motherhood': 'baby',
  baby: 'baby',
  hero: 'hero',
};

function toCategoryId(folder) {
  const key = folder.toLowerCase().replace(/[\s_-]+/g, '');
  return FOLDER_ALIASES[key] ?? FOLDER_ALIASES[folder.toLowerCase()] ?? slugify(folder);
}

/** Strip the double extensions the source files sometimes carry. */
function stripExtensions(fileName) {
  let name = fileName;
  for (let i = 0; i < 2; i += 1) {
    const ext = extname(name);
    if (INPUT_EXTENSIONS.has(ext.toLowerCase())) name = basename(name, ext);
    else break;
  }
  return name;
}

async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (INPUT_EXTENSIONS.has(extname(entry.name).toLowerCase())) files.push(path);
  }

  return files;
}

async function toWebp(source, target) {
  await sharp(source)
    .rotate() // honour EXIF orientation
    .resize({ width: MAX_WIDTH, height: MAX_WIDTH, fit: 'cover', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(target);
}

/**
 * Convert one photo, decoding HEIC through macOS `sips` when sharp cannot.
 *
 * sharp reads HEIC metadata but its bundled libheif ships no decoder for the
 * HEVC-encoded HEIC an iPhone actually produces, so it fails at pixel access.
 * `sips` uses the OS codecs and handles every file in practice.
 */
async function convert(source, target) {
  try {
    await toWebp(source, target);
    return;
  } catch (error) {
    const ext = extname(source).toLowerCase();
    if (ext !== '.heic' && ext !== '.heif') throw error;
  }

  const scratch = await mkdtemp(join(tmpdir(), 'hoop-heic-'));
  const intermediate = join(scratch, 'frame.png');

  try {
    await run('sips', ['-s', 'format', 'png', source, '--out', intermediate]);
    await toWebp(intermediate, target);
  } catch (error) {
    throw new Error(
      `Could not decode ${source}.\n` +
        `sharp's libheif lacks an HEVC decoder and the macOS \`sips\` fallback ` +
        `also failed. Convert it to JPEG by hand and drop that in instead.\n` +
        `Original error: ${error instanceof Error ? error.message : String(error)}`,
    );
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

async function main() {
  try {
    await stat(SOURCE_DIR);
  } catch {
    console.error(
      `No ${SOURCE_DIR}/ directory found.\n\n` +
        `Create it and drop your photos into per-collection folders, e.g.\n` +
        `  ${SOURCE_DIR}/wedding/Engagement Theme.jpg\n` +
        `  ${SOURCE_DIR}/hero/hero-hoop.jpg\n\n` +
        `Or point at another folder:  pnpm images:optimize --from ~/Downloads/Artworks\n\n` +
        `See docs/CONTENT_GUIDE.md for the naming convention.`,
    );
    process.exitCode = 1;
    return;
  }

  const files = await collect(SOURCE_DIR);

  if (files.length === 0) {
    console.log(`No images found in ${SOURCE_DIR}/. Nothing to do.`);
    return;
  }

  // Two pieces in the source share a name (they are genuinely different
  // artworks); the second gets a -2 suffix, matching the ids in artworks.ts.
  const used = new Map();
  let converted = 0;
  let skipped = 0;

  for (const file of files.sort()) {
    const rel = relative(SOURCE_DIR, file);
    const segments = rel.split(/[/\\]/);
    const folder = segments.length > 1 ? segments[0] : '';

    // Without a collection folder there is no category, and the file would be
    // written to a path `resolveArtworkImage` can never look up — the script
    // would report success while the piece kept its placeholder.
    if (!folder) {
      console.warn(
        `  SKIPPED  ${rel}\n` +
          `    Put it in a collection folder, e.g. ${SOURCE_DIR}/wedding/${basename(file)}`,
      );
      skipped += 1;
      continue;
    }

    const categoryId = toCategoryId(folder);

    const slug = slugify(stripExtensions(basename(file)));
    const key = `${categoryId}/${slug}`;
    const n = (used.get(key) ?? 0) + 1;
    used.set(key, n);
    const name = `${n === 1 ? slug : `${slug}-${n}`}.webp`;

    const targetDir = categoryId === 'hero' ? HERO_OUTPUT_DIR : join(OUTPUT_DIR, categoryId);
    await mkdir(targetDir, { recursive: true });
    const target = join(targetDir, name);

    await convert(file, target);
    converted += 1;
    console.log(`  ${rel}\n    -> ${target}`);
  }

  console.log(`\nConverted ${String(converted)} image(s).`);
  if (skipped > 0) {
    console.warn(`Skipped ${String(skipped)} file(s) that were not in a collection folder.`);
    process.exitCode = 1;
  }
  console.log('Each filename must match an artwork id in src/constants/artworks.ts.');
}

await main();
