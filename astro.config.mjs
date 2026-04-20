import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://yoursite.pages.dev', // replace with your Cloudflare Pages URL
  image: {
    domains: ['github.com', 'github-production-user-asset-6210df.s3.amazonaws.com'],
  },
});
