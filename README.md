# Novera

Brand-led marketing website for Novera, a technology company creating digital products, custom CRM systems, automation, and connected business platforms.

## Tech stack

- React 19
- TypeScript
- Vinext / Vite
- Framer Motion
- Lucide React

## Brand system

The website follows the supplied brand guidelines: Sora and Inter typography, the official navy/blue/cyan/indigo/violet palette, structured geometry, restrained luminous accents, and clear, confident, progressive, human language.

## Run locally

Node.js 22.13 or newer is required.

```bash
npm install
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001).

## Production build

```bash
npm run build
```

## Project structure

- `app/page.tsx` — page sections, content, and motion behavior
- `app/globals.css` — visual system, responsive layout, and animations
- `app/layout.tsx` — metadata, social sharing, and favicon settings
- `public/` — generated brand artwork and social assets

This repository contains the UI/UX frontend only. It does not include a database or backend service.

## Editing case studies and "More we've built" (no code)

Open `https://<your-domain>/admin` and sign in. There you can add, edit, reorder and delete case
studies (card, page, images, live preview on desktop and phone) and the "More we've built" rows (with
PDF uploads). Saving puts the changes on the site straight away, with no rebuild.

How it works:

- Saves and uploads go to the MySQL database (`lib/site/store.ts`). It creates its tables on first use:
  `site_content` (what the site shows), `site_content_history` (every save, so an older version can be
  restored) and `site_files` (uploaded images and PDFs, served from `/api/files/<id>/<name>`).
- `/work`, `/case-study-<slug>` and `/work/<slug>` are rendered on request from the saved content by
  `app/[slug]/route.ts` and `app/work/[slug]/route.ts`, using `lib/site/render.mjs` and the layouts in
  `templates/`.
- Until the first save, the pages show the starting content in `content/*.json`, packed into
  `lib/site/defaults.json` by `scripts/build-content.mjs` (runs before every build, or `npm run content`).
- The admin panel lives in `public/admin/` and talks to `app/api/admin/*`.

### One-time setup

In the Vercel project, open **Settings → Environment Variables** and add:

- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- `MYSQL_SSL_CA`: the CA certificate from your database host, pasted in full
  (from `-----BEGIN CERTIFICATE-----` to `-----END CERTIFICATE-----`)

Then redeploy. If the database can't be reached, `/admin` shows the database's error message and the
site keeps showing the starting content.

The login is kept in `lib/site/auth.ts` as hashes. To change it, set `ADMIN_USERNAME` and
`ADMIN_PASSWORD` in Vercel's environment variables and redeploy. Uploads are limited to 4.5 MB per file.
