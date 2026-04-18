#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const photosDir = path.join(repoRoot, 'public', 'photos');
const contentDir = path.join(repoRoot, 'src', 'content', 'photos');
const defaultCategory = process.env.PHOTO_DEFAULT_CATEGORY ?? 'General';
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.heic', '.tif', '.tiff']);

function slugify(value) {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'photo';
}

function titleFromStem(stem) {
  return stem
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase()) || 'Photo';
}

function yamlQuoted(value) {
  return JSON.stringify(String(value));
}

function uniqueSlug(baseSlug, usedSlugs) {
  if (!usedSlugs.has(baseSlug)) {
    usedSlugs.add(baseSlug);
    return baseSlug;
  }
  let i = 2;
  while (usedSlugs.has(`${baseSlug}-${i}`)) i += 1;
  const slug = `${baseSlug}-${i}`;
  usedSlugs.add(slug);
  return slug;
}

function frontmatter({ title, date, cover, category }) {
  return (
    `---\n` +
    `title: ${yamlQuoted(title)}\n` +
    `description: ${yamlQuoted('Imported from local photos folder.')}\n` +
    `date: ${date}\n` +
    `cover: ${yamlQuoted(cover)}\n` +
    `category: ${yamlQuoted(category)}\n` +
    `draft: false\n` +
    `---\n\n` +
    `Auto-generated from \`public/photos\`. Edit this entry to add your own notes.\n`
  );
}

async function ensureDirs() {
  await fs.mkdir(photosDir, { recursive: true });
  await fs.mkdir(contentDir, { recursive: true });
}

async function listImageFiles() {
  const entries = await fs.readdir(photosDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

async function getExistingContentState() {
  const entries = await fs.readdir(contentDir, { withFileTypes: true });
  const mdFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md'));
  const usedSlugs = new Set(mdFiles.map((entry) => path.basename(entry.name, '.md')));
  const existingCovers = new Set();

  await Promise.all(
    mdFiles.map(async (entry) => {
      const mdPath = path.join(contentDir, entry.name);
      const content = await fs.readFile(mdPath, 'utf8');
      const coverMatch = content.match(/^cover:\s*["']?([^"'\n]+)["']?\s*$/m);
      if (coverMatch?.[1]) existingCovers.add(coverMatch[1]);
    })
  );

  return { usedSlugs, existingCovers };
}

async function createEntriesForMissingPhotos() {
  await ensureDirs();

  const [imageFiles, { usedSlugs, existingCovers }] = await Promise.all([listImageFiles(), getExistingContentState()]);
  let created = 0;
  let skipped = 0;

  for (const imageName of imageFiles) {
    const cover = `/photos/${imageName}`;
    if (existingCovers.has(cover)) {
      skipped += 1;
      continue;
    }

    const sourcePath = path.join(photosDir, imageName);
    const stats = await fs.stat(sourcePath);
    const date = stats.mtime.toISOString().slice(0, 10);
    const baseSlug = slugify(path.parse(imageName).name);
    const slug = uniqueSlug(baseSlug, usedSlugs);
    const mdPath = path.join(contentDir, `${slug}.md`);

    await fs.writeFile(
      mdPath,
      frontmatter({
        title: titleFromStem(path.parse(imageName).name),
        date,
        cover,
        category: defaultCategory,
      }),
      'utf8'
    );

    existingCovers.add(cover);
    created += 1;
  }

  console.log(`Scanned ${imageFiles.length} images. Created ${created} markdown entries, skipped ${skipped}.`);
}

createEntriesForMissingPhotos().catch((error) => {
  console.error(error);
  process.exit(1);
});
