# Dr. Matilda A. Evans Educational Foundation Website

A modern, accessible website built with **Remix (React) + TypeScript**, optimized for **Cloudflare Pages**, with content migrated from a **WordPress XML export** into an **MDX** architecture.

## Tech stack

- **Framework**: Remix (Vite) + React 18 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui-style primitives + Framer Motion
- **Content**: generated MDX in `content/pages` + `content/posts`
- **Deployment**: Cloudflare Pages + Pages Functions (`functions/`)

## Local development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Typecheck:

```bash
npm run typecheck
```

## WordPress → MDX migration

The WordPress XML export is the **source of truth**:

- `./drmatildaaevanseducationalfoundation.WordPress.2025-12-29.xml`

Run the migration:

```bash
npm run migrate:wp
```

This generates:

- **Pages**: `content/pages/*.mdx`
- **Posts**: `content/posts/*.mdx` (rendered under `/dr-evans-academy`)
- **Menu**: `content/data/menu.json`
- **Attachment inventory**: `content/data/attachments.json`
- **Migration report**: `content/MIGRATION_REPORT.md`

### Image handling (critical)

- **Do not hotlink WordPress media**.
- Local media source of truth lives in `./images`.
- The migration script rewrites WordPress upload URLs to **`/images/<filename>`** using filename + WordPress-variant matching (`-300x200`, `-scaled`, `-e123`, `(1)`).
- For serving, the migration script copies `./images/*` into `./public/images/*` so the site can reference `/images/...` in production.

## Image audit (CI-friendly)

Run:

```bash
npm run audit:images
```

Outputs:

- `content/IMAGE_AUDIT_REPORT.md`

The audit:

- Reads image attachments from the WordPress XML export
- Scans generated MDX for image references
- Verifies all local `/images/*` references exist in `./images`
- Exits **non-zero** if missing/broken references are detected

You can run migration + audit together:

```bash
npm run migrate:wp:all
```

## Routing

- **Home**: `/` (driven by `content/homepage.json`)
- **Pages**: `/:slug` (from `content/pages/*.mdx`, excluding reserved slugs)
- **Dr. Evans Academy**:
  - Index: `/dr-evans-academy`
  - Post: `/dr-evans-academy/:slug`

Reserved routes (not served by the dynamic `/:slug` page renderer):

- `/dr-evans-academy`
- `/contact`
- `/privacy`
- `/accessibility`
- `/sitemap.xml`
- `/robots.txt`

## Contact form (Cloudflare Pages Function)

- Frontend: `/contact`
- Endpoint: `POST /api/contact` (Cloudflare Pages Function)

Security features:

- **Honeypot** field (`website`)
- **Basic rate limiting** using the edge cache (per IP, short TTL)
- **Server-side validation** with Zod

### Required env vars

Set these in Cloudflare Pages → Project → Settings → Environment variables:

- **CONTACT_TO_EMAIL**: destination inbox
- **CONTACT_FROM_EMAIL**: verified sender address

Choose one provider:

**Resend**

- **RESEND_API_KEY**

**Mailgun**

- **MAILGUN_API_KEY**
- **MAILGUN_DOMAIN**

## Cloudflare Pages deployment

### Build settings

- **Build command**: `npm run build`
- **Build output directory**: `public`

### Preview deployments workflow

- Connect the GitHub repo to Cloudflare Pages
- Enable **Preview deployments**
- Every PR gets a `pages.dev` preview URL

### Go-live checklist (DNS cutover)

- Verify:
  - `/sitemap.xml` and `/robots.txt`
  - Contact form end-to-end (provider configured)
  - Core pages render and navigation is correct
  - Images load from `/images/*`
- Add your custom domain in Cloudflare Pages
- Update DNS according to Cloudflare’s provided records
- Re-verify SSL + redirects

### Rollback plan

- Keep the legacy site DNS configuration documented
- If issues appear after cutover:
  - Revert DNS to the prior origin (or disable the custom domain binding in Pages)
  - Roll back to a known-good deployment (Cloudflare Pages → Deployments)

## Content editing

- **Homepage sections**: edit `content/homepage.json`
- **Pages/Posts**: edit the generated MDX in `content/pages` and `content/posts`
- If you re-run the migration script, it will overwrite generated MDX files.

