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

## Responsive image handling

This site now uses Astro’s built-in image pipeline (`astro:assets` + Sharp) to generate responsive `srcset` values at build time when sources are compatible with Astro transforms.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select this repo.
4. Set:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20` (environment variable `NODE_VERSION=20`)
5. Click **Save and Deploy**.

Every push to `main` will trigger a new deployment automatically.

The `wrangler.toml` in this repo is used for **Workers Assets** deployments (`wrangler versions upload`). It points `[assets] directory` at `./dist` — run `npm run build` first, then `npx wrangler deploy`.

> Update the `site` field in `astro.config.mjs` with your Cloudflare Pages URL once it's assigned.
