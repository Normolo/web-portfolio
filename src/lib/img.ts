/**
 * Image helpers for responsive image delivery via Cloudflare Image Resizing.
 *
 * In production (Cloudflare Pages), `/cdn-cgi/image/` transforms are applied at
 * the edge — serving the correctly-sized WebP/AVIF instead of the full-resolution
 * original. In local dev the original URL is returned unchanged.
 *
 * Requires the "Image Resizing" feature to be enabled on the Cloudflare account.
 */

const IS_DEV = import.meta.env.DEV;

/**
 * The viewport width at which `main` reaches its maximum content width of 860px
 * (860px content + 2 × 1.5rem padding = 908px).  Used in `sizes` attributes to
 * switch from viewport-relative to fixed-pixel widths.
 */
export const CONTENT_MAX_VIEWPORT = 908;

export interface ImgOptions {
  width: number;
  quality?: number;
}

/**
 * Returns a Cloudflare Image Resizing URL that delivers the image at the
 * requested width in the browser's best-supported format (WebP or AVIF).
 * Falls back to the original URL in local development.
 *
 * - Local paths (e.g. `/photos/foo.jpg`): the leading slash is stripped so the
 *   resulting path is `/cdn-cgi/image/…/photos/foo.jpg`.
 * - Remote URLs (e.g. `https://example.com/img.jpg`): passed through unchanged
 *   after the options segment, e.g. `/cdn-cgi/image/…/https://example.com/img.jpg`.
 */
export function cfImg(src: string, { width, quality = 85 }: ImgOptions): string {
  if (IS_DEV) return src;
  // Local paths: strip leading slash — the /cdn-cgi/image/…/path separator provides it.
  // Remote URLs don't start with '/' so they are passed through unchanged.
  const imgPath = src.startsWith('/') ? src.slice(1) : src;
  return `/cdn-cgi/image/width=${width},format=auto,quality=${quality}/${imgPath}`;
}

/**
 * Build a `srcset` string with multiple width variants via cfImg.
 * Returns an empty string in dev so the browser falls back to `src`.
 * Always pair with a matching `sizes` attribute.
 */
export function srcSet(src: string, widths: number[], quality = 85): string {
  if (IS_DEV) return '';
  return widths.map(w => `${cfImg(src, { width: w, quality })} ${w}w`).join(', ');
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
