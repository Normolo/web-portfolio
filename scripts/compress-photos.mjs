#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const photosDir = path.join(repoRoot, 'public', 'photos');
const thumbsDir = path.join(photosDir, '_thumbs');

const THUMB_WIDTH = 640;

const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);
const quality = Number(process.env.PHOTO_COMPRESS_QUALITY ?? '82');
const webpQuality = Number(process.env.PHOTO_COMPRESS_WEBP_QUALITY ?? String(quality));
const avifQuality = Number(process.env.PHOTO_COMPRESS_AVIF_QUALITY ?? '52');
const thumbQuality = Number(process.env.PHOTO_COMPRESS_THUMB_QUALITY ?? '75');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function encoderForExt(transformer, ext) {
  if (ext === '.jpg' || ext === '.jpeg') {
    return transformer.jpeg({ quality: clamp(quality, 1, 100), mozjpeg: true });
  }
  if (ext === '.png') {
    return transformer.png({ quality: clamp(quality, 1, 100), compressionLevel: 9, effort: 8 });
  }
  if (ext === '.webp') {
    return transformer.webp({ quality: clamp(webpQuality, 1, 100), effort: 6 });
  }
  if (ext === '.avif') {
    return transformer.avif({ quality: clamp(avifQuality, 1, 100), effort: 5 });
  }
  if (ext === '.tif' || ext === '.tiff') {
    return transformer.tiff({ quality: clamp(quality, 1, 100), compression: 'jpeg' });
  }
  return null;
}

async function generateThumb(name) {
  const ext = path.extname(name).toLowerCase();
  const stem = path.basename(name, ext);
  const thumbPath = path.join(thumbsDir, `${stem}.webp`);
  const sourcePath = path.join(photosDir, name);

  try {
    const [sourceStat, thumbStat] = await Promise.all([fs.stat(sourcePath), fs.stat(thumbPath)]);
    if (thumbStat.mtimeMs >= sourceStat.mtimeMs) {
      return { name, generated: false };
    }
  } catch {
    // thumb does not exist yet — fall through to generate
  }

  await sharp(sourcePath, { failOn: 'none' })
    .rotate()
    .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: clamp(thumbQuality, 1, 100), effort: 6 })
    .toFile(thumbPath);

  return { name, generated: true };
}

async function listPhotoFiles() {
  await fs.mkdir(photosDir, { recursive: true });
  const entries = await fs.readdir(photosDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => supportedExtensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

async function compressPhoto(name) {
  const ext = path.extname(name).toLowerCase();
  const filePath = path.join(photosDir, name);
  const original = await fs.readFile(filePath);
  const encoder = encoderForExt(sharp(original, { failOn: 'none' }).rotate(), ext);

  if (!encoder) {
    return { name, optimized: false, originalSize: original.length, optimizedSize: original.length };
  }

  const optimized = await encoder.toBuffer();
  if (optimized.length >= original.length) {
    return { name, optimized: false, originalSize: original.length, optimizedSize: optimized.length };
  }

  await fs.writeFile(filePath, optimized);
  return { name, optimized: true, originalSize: original.length, optimizedSize: optimized.length };
}

async function main() {
  const photoFiles = await listPhotoFiles();
  await fs.mkdir(thumbsDir, { recursive: true });

  let optimizedCount = 0;
  let skippedCount = 0;
  let bytesSaved = 0;
  let thumbsGenerated = 0;
  let thumbsSkipped = 0;

  for (const photoFile of photoFiles) {
    try {
      const result = await compressPhoto(photoFile);
      if (result.optimized) {
        optimizedCount += 1;
        bytesSaved += result.originalSize - result.optimizedSize;
      } else {
        skippedCount += 1;
      }
    } catch (error) {
      skippedCount += 1;
      console.warn(`Skipping compression for ${photoFile}: ${error.message}`);
    }

    try {
      const thumbResult = await generateThumb(photoFile);
      if (thumbResult.generated) {
        thumbsGenerated += 1;
      } else {
        thumbsSkipped += 1;
      }
    } catch (error) {
      thumbsSkipped += 1;
      console.warn(`Skipping thumbnail for ${photoFile}: ${error.message}`);
    }
  }

  const savedMb = (bytesSaved / (1024 * 1024)).toFixed(2);
  console.log(
    `Scanned ${photoFiles.length} files. Optimized ${optimizedCount}, skipped ${skippedCount}, saved ${savedMb} MB (${bytesSaved} bytes).`
  );
  console.log(`Thumbnails: generated ${thumbsGenerated}, up-to-date ${thumbsSkipped}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
