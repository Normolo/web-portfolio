---
title: "Portfolio Website"
description: "A static portfolio site built with Astro and deployed on Cloudflare Pages."
date: 2026-04-18
tags: ["Astro", "Cloudflare", "TypeScript", "CSS"]
repoUrl: "https://github.com/Normolo/web-portfolio"
image: "https://github-readme-stats.vercel.app/api?username=Normolo&show_icons=true&count_private=true&hide_border=true&bg_color=00000000&title_color=6e6e7a&text_color=6e6e7a&icon_color=6e6e7a"
draft: false
---

## Overview

This very site — a fully static portfolio built with **Astro** and deployed to **Cloudflare Pages**. Zero client-side JavaScript frameworks; all pages are pre-rendered at build time into plain HTML, CSS, and a single small module for the email-copy button.

## Stack

- **Astro** — static site generator with content collections and build-time image optimisation
- **TypeScript** — typed content schemas via Zod, utility libs, and Astro frontmatter
- **Cloudflare Pages** — global CDN deployment with automatic previews on each pull request
- **Vanilla CSS** — no utility framework; a single global stylesheet with custom properties

## Features

- Responsive photo gallery with WebP thumbnails generated at build time
- Project pages driven by Markdown content collections
- CV page
- Minimal JS footprint — only one deferred module script ships to the browser

## What I learned

- Structuring Astro content collections for fully type-safe Markdown
- Build-time image optimisation with `getImage` and responsive `srcset` generation
- Zero-overhead CSS architecture without a utility framework
- Cloudflare Pages CI/CD and preview deployments
