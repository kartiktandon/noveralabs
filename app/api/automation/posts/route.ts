// Private endpoint for the blog autopilot (the Google Sheet's script).
// It can list posts, and create, update, schedule or unpublish the posts it created itself.
// Posts written by hand in /admin are never changed from here.
// Protected by BLOG_AUTOMATION_KEY (set it in Vercel): send it as "Authorization: Bearer <key>".
import { json } from '@/lib/site/auth';
import { checkStorage, getContent, saveContent } from '@/lib/site/store';
import { isLive, normalizePosts, publishAt } from '@/lib/site/blog.mjs';
import { slugify } from '@/lib/site/render.mjs';

const SOURCE = 'sheet';
const TEXT = ['title', 'excerpt', 'category', 'author', 'cover_image', 'cover_alt', 'body', 'seo_title', 'seo_description'];

function same(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

function allowed(request: Request) {
  const key = process.env.BLOG_AUTOMATION_KEY || '';
  if (key.length < 24) return 'off';
  const sent = /^Bearer\s+(.+)$/i.exec(request.headers.get('authorization') || '')?.[1]?.trim() || '';
  return same(sent, key) ? 'ok' : 'denied';
}

async function guard(request: Request) {
  const a = allowed(request);
  if (a === 'off') return json({ error: 'The blog autopilot is not switched on. Set BLOG_AUTOMATION_KEY (24+ characters) in Vercel.' }, 503);
  if (a === 'denied') return json({ error: 'Wrong key.' }, 401);
  const problem = await checkStorage();
  if (problem) return json({ error: problem === 'not-set-up' ? 'Saving is not switched on yet.' : `Can't reach the database: ${problem}` }, 503);
  return null;
}

const origin = (request: Request) => new URL(request.url).origin;

function summary(p: Record<string, any>, base: string) {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags,
    status: p.status,
    date: p.date,
    time: p.time || '',
    live: isLive(p),
    source: p.source || 'admin',
    url: `${base}/blog/${p.slug}`,
  };
}

// GET: every post (for internal links and status checks). ?slug=x returns that post in full.
export async function GET(request: Request) {
  const stop = await guard(request);
  if (stop) return stop;
  const posts = normalizePosts((await getContent()).posts);
  const slug = new URL(request.url).searchParams.get('slug');
  if (slug) {
    const p = posts.find((x: Record<string, any>) => x.slug === slug);
    return p ? json({ post: p }) : json({ error: 'No post with that address.' }, 404);
  }
  return json({ posts: posts.map((p: Record<string, any>) => summary(p, origin(request))) });
}

// PUT: create or update one post. Body: { post: { slug, title, body, ..., status, date, time } }
export async function PUT(request: Request) {
  const stop = await guard(request);
  if (stop) return stop;
  const input = ((await request.json().catch(() => null)) as { post?: Record<string, any> } | null)?.post;
  if (!input || typeof input !== 'object') return json({ error: 'Send { post: {...} }.' }, 400);
  const slug = slugify(String(input.slug || input.title || ''));
  if (!slug) return json({ error: 'The post needs a title or a page address.' }, 400);

  const post: Record<string, any> = { slug, source: SOURCE };
  for (const k of TEXT) if (input[k] !== undefined) post[k] = String(input[k] ?? '');
  if (input.tags !== undefined) post.tags = (Array.isArray(input.tags) ? input.tags : String(input.tags).split(',')).map((t: unknown) => String(t).trim()).filter(Boolean);
  if (input.takeaways !== undefined) post.takeaways = (Array.isArray(input.takeaways) ? input.takeaways : []).map(String).filter(Boolean);
  if (input.faqs !== undefined)
    post.faqs = (Array.isArray(input.faqs) ? input.faqs : []).map((f: any) => ({ q: String(f?.q || ''), a: String(f?.a || '') })).filter((f: any) => f.q && f.a);
  if (input.featured !== undefined) post.featured = Boolean(input.featured);
  if (input.status !== undefined) {
    if (!['draft', 'published'].includes(input.status)) return json({ error: 'status must be draft or published.' }, 400);
    post.status = input.status;
  }
  if (input.date !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(input.date))) return json({ error: 'date must look like 2026-11-20.' }, 400);
    post.date = String(input.date);
  }
  if (input.time !== undefined) {
    if (input.time && !/^\d{2}:\d{2}$/.test(String(input.time))) return json({ error: 'time must look like 09:30.' }, 400);
    post.time = String(input.time || '');
  }

  const content = await getContent();
  const posts = [...(content.posts || [])];
  const i = posts.findIndex((p) => slugify(String(p.slug || p.title || '')) === slug);
  if (i >= 0 && posts[i].source !== SOURCE) {
    return json({ error: `"${slug}" is a post written in /admin. The autopilot only changes its own posts. Pick another address.` }, 409);
  }
  const merged: Record<string, any> = { author: 'Novera Labs', status: 'draft', featured: false, ...(i >= 0 ? posts[i] : {}), ...post };
  // Only an edit to a post that is already live counts as an update for Google
  if (i >= 0 && isLive(posts[i])) merged.updated = new Date().toISOString().slice(0, 10);
  if (merged.status === 'published' && !merged.date) return json({ error: 'A published post needs a date.' }, 400);
  if (merged.date && Number.isNaN(publishAt(merged))) return json({ error: 'That date and time is not valid.' }, 400);
  if (i >= 0) posts[i] = merged;
  else posts.push(merged);

  try {
    await saveContent({ cases: content.cases, more: content.more, posts });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
  return json({ ok: true, created: i < 0, post: summary(merged, origin(request)) });
}

// DELETE ?slug=x: take one of the autopilot's posts off the site (it goes back to draft; nothing is deleted)
export async function DELETE(request: Request) {
  const stop = await guard(request);
  if (stop) return stop;
  const slug = new URL(request.url).searchParams.get('slug') || '';
  const content = await getContent();
  const posts = [...(content.posts || [])];
  const i = posts.findIndex((p) => slugify(String(p.slug || p.title || '')) === slug);
  if (i < 0) return json({ error: 'No post with that address.' }, 404);
  if (posts[i].source !== SOURCE) return json({ error: 'Only the autopilot\'s own posts can be unpublished from here.' }, 409);
  posts[i] = { ...posts[i], status: 'draft' };
  try {
    await saveContent({ cases: content.cases, more: content.more, posts });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
  return json({ ok: true });
}
