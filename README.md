# web-portfolio

Personal portfolio site built with [Astro](https://astro.build) and deployed on [Cloudflare Pages](https://pages.cloudflare.com).  
Two sections: **IT Projects** and **Photography**.

## Local development

```bash
npm install
npm run dev      # starts dev server at http://localhost:4321
```

## Build

```bash
npm run build    # outputs static files to dist/
npm run preview  # preview the production build locally
```

## Content

All content lives in `src/content/`:

| Folder | Description |
|---|---|
| `src/content/projects/` | IT project write-ups (Markdown) |
| `src/content/photos/` | Photography entries (Markdown + cover image path) |

Add a new `.md` file to either folder to create a new entry. See existing files for the required frontmatter fields.

**Cover images** for photos go in `public/photos/` and are referenced as `/photos/filename.jpg` in the `cover` frontmatter field.

## Local bulk photo import (no third-party app)

If you want easy bulk uploads without Google Drive integration:

1. Copy photos into `public/photos/`
2. Run:

```bash
npm run photos:import
npm run photos:compress
```

This creates missing Markdown entries in `src/content/photos/` for any image that does not already have a matching `cover` path.
Use `PHOTO_DEFAULT_CATEGORY` to set the generated category (default: `General`).
Compression runs as a separate command so image optimization does not add overhead to `npm run build`.
`photos:compress` also generates 640 px-wide WebP thumbnails in `public/photos/_thumbs/` for use as responsive image sources in the gallery.

## Responsive image handling

This site now uses Astro’s built-in image pipeline (`astro:assets` + Sharp) to generate responsive `srcset` values at build time when sources are compatible with Astro transforms.

## Optional: Automatic photo sync from Google Drive

This repo includes a GitHub Actions workflow at `.github/workflows/sync-photos-from-drive.yml` that can automatically:
- copy images from a Google Drive folder into `public/photos/`
- create matching photo entries in `src/content/photos/` (only for new files)

### Setup

1. Create a Google Cloud service account and enable the **Google Drive API**.
2. Share your target Drive folder with the service account email (`...@...iam.gserviceaccount.com`).
3. In GitHub repository settings, add these **Secrets**:
   - `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON`: full JSON key content for the service account
   - `GOOGLE_DRIVE_FOLDER_ID`: the folder ID from the Drive URL
4. (Optional) Add repository variable `PHOTO_DEFAULT_CATEGORY` (defaults to `General`).

### Usage

- Run manually: **Actions** → **Sync photos from Google Drive** → **Run workflow**
- Scheduled sync: runs hourly by default (`cron: 0 * * * *`)

The workflow commits synced photos and newly generated markdown entries back to the repository automatically.
It also runs `npm run photos:compress` before commit so newly synced images are optimized.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select this repo.
4. Set:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `22` (environment variable `NODE_VERSION=22`)
5. Click **Save and Deploy**.

Every push to `main` will trigger a new deployment automatically.

The `wrangler.toml` in this repo is used for **Workers Assets** deployments (`wrangler versions upload`). It points `[assets] directory` at `./dist` — run `npm run build` first, then `npx wrangler deploy`.

> Update the `site` field in `astro.config.mjs` with your Cloudflare Pages URL once it's assigned.
