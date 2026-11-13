// Serves the home page, the Work page, the case study pages and the blog from the content saved in /admin.
import defaults from './defaults.json';
import { renderBlogIndex, renderPost, renderRobots, renderRss, renderSitemap, isLive, normalizePosts } from './blog.mjs';
import { normalize, renderCasePage, renderHomePage, renderWorkPage } from './render.mjs';
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
    return { ...normalize({ cases: defaults.cases, more: defaults.more }), posts: defaults.posts as Record<string, any>[] };
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

// ---------- Blog ----------
// The site's address for links Google sees (canonical, sitemap, RSS). Set SITE_URL in Vercel once
// the domain is final, e.g. https://www.noveralabs.com; until then the address of the request is used.
const siteOrigin = (request: Request) => (process.env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, '');

function notFound(request: Request) {
  return Response.redirect(new URL('/blog', request.url), 302);
}

export async function blogPage(request: Request, filter: { category?: string; tag?: string } = {}) {
  const { posts } = await content();
  const page = renderBlogIndex(templates.blog, posts, { origin: siteOrigin(request), ...filter });
  return page ? html(page) : notFound(request);
}

export async function postPage(slug: string, request: Request) {
  const { posts, cases } = await content();
  const post = normalizePosts(posts).find((p) => p.slug === slug);
  // Drafts, scheduled and deleted posts are not public
  if (!post || !isLive(post)) return notFound(request);
  return html(renderPost(templates.blog, post, { origin: siteOrigin(request), posts, cases }));
}

const text = (body: string, type: string) =>
  new Response(body, { headers: { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'public, max-age=0, s-maxage=300' } });

export async function rssFeed(request: Request) {
  return text(renderRss((await content()).posts, siteOrigin(request)), 'application/rss+xml');
}

export async function sitemap(request: Request) {
  return text(renderSitemap(await content(), siteOrigin(request)), 'application/xml');
}

export function robots(request: Request) {
  return text(renderRobots(siteOrigin(request)), 'text/plain');
}
