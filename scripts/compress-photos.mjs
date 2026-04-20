#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const photosDir = path.join(repoRoot, 'public', 'photos');

const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);
const quality = Number(process.env.PHOTO_COMPRESS_QUALITY ?? '82');
const webpQuality = Number(process.env.PHOTO_COMPRESS_WEBP_QUALITY ?? String(quality));
const avifQuality = Number(process.env.PHOTO_COMPRESS_AVIF_QUALITY ?? '52');

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
  let optimizedCount = 0;
  let skippedCount = 0;
  let bytesSaved = 0;

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
      console.warn(`Skipping ${photoFile}: ${error.message}`);
    }
  }

  const savedMb = (bytesSaved / (1024 * 1024)).toFixed(2);
  console.log(
    `Scanned ${photoFiles.length} files. Optimized ${optimizedCount}, skipped ${skippedCount}, saved ${savedMb} MB (${bytesSaved} bytes).`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
