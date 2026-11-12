// Serves the home page, the Work page and the case study pages from the content saved in /admin.
import defaults from './defaults.json';
import { renderCasePage, renderHomePage, renderWorkPage } from './render.mjs';
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

// Content saved before the home page fields existed takes them from the starting content
export function withHomeFields<T extends { cases: Record<string, any>[] }>(content: T): T {
  const start = new Map(defaults.cases.map((c: Record<string, any>) => [c.slug, c]));
  for (const c of content.cases) {
    const d = start.get(c.slug);
    if (!('show_on_home' in c)) c.show_on_home = d ? d.show_on_home !== false : true;
    if (!('home_label' in c) && d) c.home_label = d.home_label;
  }
  return content;
}

async function content() {
  try {
    return withHomeFields(await getContent());
  } catch (e) {
    // If storage is down, keep the site up with the starting content
    console.error(e);
    const { normalize } = await import('./render.mjs');
    const defaults = (await import('./defaults.json')).default;
    return normalize({ cases: defaults.cases, more: defaults.more });
  }
}

export async function homePage() {
  return html(renderHomePage(templates.home, await content()));
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
