import { getImage } from 'astro:assets';

/**
 * The viewport width at which `main` reaches its maximum content width of 1120px
 * (1120px content + 2 × 1.5rem padding = 1168px).  Used in `sizes` attributes to
 * switch from viewport-relative to fixed-pixel widths.
 */
export const CONTENT_MAX_VIEWPORT = 1168;

const srcSetCache = new Map<string, Promise<string | undefined>>();

/**
 * Generate a responsive srcset via Astro's built-in image pipeline.
 * Returns undefined when no widths are provided or a transform cannot be produced.
 */
export async function buildSrcSet(src: string, widths: number[], quality = 85): Promise<string | undefined> {
  if (widths.length === 0) return undefined;

  const normalizedWidths = [...new Set(widths)].sort((a, b) => a - b);
  const cacheKey = `${src}|${quality}|${normalizedWidths.join(',')}`;
  const cached = srcSetCache.get(cacheKey);
  if (cached) return cached;

  const srcSetPromise = getImage({
    src,
    widths: normalizedWidths,
    quality,
    format: 'webp',
    inferSize: true,
  })
    .then((image) => image.srcSet.attribute || undefined)
    .catch((error) => {
      console.warn(
        `Could not generate srcset for "${src}". Check Astro image domain allowlists and ensure the source is compatible with Astro transforms.`,
        error,
      );
      return undefined;
    });

  srcSetCache.set(cacheKey, srcSetPromise);
  return srcSetPromise;
}

/**
 * Return the locally-generated WebP thumbnail path for a `/photos/*` image,
 * or `null` for remote URLs that have no pre-generated thumb.
 */
export function thumbPath(cover: string): string | null {
  if (!cover.startsWith('/photos/')) return null;
  const filename = cover.slice('/photos/'.length);
  const stem = filename.replace(/\.[^.]+$/, '');
  return `/photos/_thumbs/${stem}.webp`;
}
