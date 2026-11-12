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

The case study pages, the project cards on the Work page and the "More we've built" rows are built from
files in `content/`:

- `content/case-studies/*.json` → `public/case-study-<slug>.html` and the cards on `public/work.html`
- `content/more-work/*.json` → the rows under "More we've built" (a row with a PDF opens it in a new tab)

Edit them in the browser at `https://<your-domain>/admin`. Each save commits to `main`, Vercel rebuilds,
and the change is live in a minute or two. `scripts/build-content.mjs` runs before every build; run it by
hand with `npm run content`. Don't hand-edit the generated case study pages or the parts of `work.html`
between the `cms:` comments, since the next build overwrites them. The case study page layout lives in
`templates/case-study.html`.

### One-time setup for the editor login

The editor uses its own username and password (no GitHub account needed to edit).

1. On GitHub, create a fine-grained personal access token (Settings → Developer settings → Personal access
   tokens → Fine-grained tokens). Repository access: only this repository. Permissions: Contents → Read and write.
2. In the Vercel project, add these environment variables, then redeploy:
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD`: the login for `/admin`
   - `GITHUB_TOKEN`: the token from step 1
3. Open `/admin`, click the sign-in button and enter the username and password.

Saves are committed to the repo under the token owner's name. Anyone with the password can edit the site,
so keep it private and change it in Vercel if it leaks.
