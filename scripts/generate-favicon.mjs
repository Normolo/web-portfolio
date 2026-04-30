/**
 * Generates public/favicon.svg with the profile photo embedded as a base64
 * data URI so browsers can render the circular favicon without making any
 * external requests (SVG favicons cannot load external URLs).
 *
 * Run automatically as part of `npm run build` via the "prebuild" script.
 */

import https from 'https';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Keep in sync with src/lib/site.ts
const PROFILE_PHOTO_SRC =
  'https://github.com/user-attachments/assets/58d44361-7278-401f-a9c1-f78b2f623cd7';

// Fallback: GitHub avatar (no S3 redirect, always accessible)
const AVATAR_FALLBACK = 'https://github.com/Normolo.png?size=128';

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const attempt = (u, redirects = 0) => {
      https
        .get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (favicon-generator)' } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            if (redirects >= 5) return reject(new Error('Too many redirects'));
            return attempt(res.headers.location, redirects + 1);
          }
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () =>
            resolve({ buffer: Buffer.concat(chunks), mime: res.headers['content-type'] ?? 'image/png' }),
          );
          res.on('error', reject);
        })
        .on('error', reject);
    };
    attempt(url);
  });
}

async function buildFaviconSvg(photoUrl) {
  const { buffer, mime } = await fetchBuffer(photoUrl);
  const b64 = buffer.toString('base64');
  const mimeClean = mime.split(';')[0].trim();
  const dataUri = `data:${mimeClean};base64,${b64}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <clipPath id="c">
      <circle cx="16" cy="16" r="16"/>
    </clipPath>
  </defs>
  <image clip-path="url(#c)" href="${dataUri}" x="0" y="0" width="32" height="32" preserveAspectRatio="xMidYMid slice"/>
</svg>
`;
}

const dest = join(__dirname, '..', 'public', 'favicon.svg');

try {
  const svg = await buildFaviconSvg(PROFILE_PHOTO_SRC);
  writeFileSync(dest, svg, 'utf8');
  console.log(`✔ favicon.svg generated from profile photo (${svg.length} bytes)`);
} catch (err) {
  console.warn(`⚠ Could not fetch profile photo (${err.message}), trying GitHub avatar fallback…`);
  try {
    const svg = await buildFaviconSvg(AVATAR_FALLBACK);
    writeFileSync(dest, svg, 'utf8');
    console.log(`✔ favicon.svg generated from GitHub avatar fallback (${svg.length} bytes)`);
  } catch (err2) {
    console.warn(`⚠ Could not fetch GitHub avatar either (${err2.message}), keeping existing favicon.svg`);
  }
}
