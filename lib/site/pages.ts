// Serves the Work page and the case study pages from the content saved in /admin.
import { renderCasePage, renderWorkPage } from './render.mjs';
import { getContent, templates } from './store';

function html(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Short cache, so a save in /admin shows on the site within seconds
      'Cache-Control': 'public, max-age=0, s-maxage=5, stale-while-revalidate=60',
    },
  });
}

async function content() {
  try {
    return await getContent();
  } catch (e) {
    // If storage is down, keep the site up with the starting content
    console.error(e);
    const { normalize } = await import('./render.mjs');
    const defaults = (await import('./defaults.json')).default;
    return normalize({ cases: defaults.cases, more: defaults.more });
  }
}

export async function workPage() {
  return html(renderWorkPage(templates.work, await content()));
}

export async function casePage(slug: string, request: Request) {
  const { cases } = await content();
  const c = cases.find((x) => x.slug === slug);
  // A deleted or mistyped case study goes to the Work page
  if (!c) return Response.redirect(new URL('/work', request.url), 302);
  return html(renderCasePage(templates.case, c));
}
