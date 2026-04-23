---
title: "Portfolio Website"
description: "A static portfolio site built with Astro and deployed on Cloudflare Pages."
date: 2026-04-18
tags: ["Astro", "Cloudflare", "TypeScript", "CSS"]
skills: ["web-application-security"]
repoUrl: "https://github.com/Normolo/web-portfolio"
image: "https://github.com/user-attachments/assets/3f5fbc75-8dae-45e8-8910-1dc7b0466c51"
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

## Cloudflare Security Experiments

Beyond hosting, I used this site as a hands-on testbed for Cloudflare's security controls:

- **WAF custom rules** — wrote and tuned firewall rules to block common attack patterns while keeping legitimate traffic unaffected
- **Bot Management** — explored challenge modes and JavaScript challenges to filter automated scanners
- **Rate limiting** — applied per-IP rate limits to sensitive paths and observed how they interact with CDN caching
- **Security headers** — enforced `Content-Security-Policy`, `Strict-Transport-Security`, and related headers via Cloudflare Transform Rules
- **Access controls** — tested Cloudflare Access for gating preview deployments behind identity checks

## What I learned

- Structuring Astro content collections for fully type-safe Markdown
- Build-time image optimisation with `getImage` and responsive `srcset` generation
- Zero-overhead CSS architecture without a utility framework
- Cloudflare Pages CI/CD and preview deployments
- Practical application of Cloudflare WAF, rate limiting, bot controls, and security headers
