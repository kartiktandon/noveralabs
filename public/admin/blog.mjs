// Renders the blog: the blog home, category and tag pages, each post, the RSS feed and the sitemap.
// Shared by the live pages (app/blog/*), the build script and the admin panel's live preview.
// No Node or browser-only APIs here.
import { esc, slugify, src } from './render.mjs';

const ARW = (n) =>
  `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>`;
const WA = 'https://wa.me/919870443265';

// ---------- Posts ----------
const today = () => new Date().toISOString().slice(0, 10);

export const isLive = (p, now = today()) => p.status === 'published' && String(p.date || '') <= now;

export function normalizePosts(posts) {
  return (posts || [])
    .map((p) => ({
      ...p,
      slug: slugify(p.slug || p.title),
      category: String(p.category || '').trim(),
      tags: (p.tags || []).map((t) => String(t).trim()).filter(Boolean),
      faqs: (p.faqs || []).filter((f) => String(f.q || '').trim()),
    }))
    .filter((p) => p.slug)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || a.slug.localeCompare(b.slug));
}

export const livePosts = (posts) => normalizePosts(posts).filter((p) => isLive(p));

export const readMinutes = (md) => Math.max(1, Math.round(String(md || '').split(/\s+/).filter(Boolean).length / 200));

export const fmtDate = (d) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || ''));
  if (!m) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
};

const catSlug = (c) => slugify(c);
export const postUrl = (p) => `/blog/${p.slug}`;
export const categoryUrl = (c) => `/blog/category/${catSlug(c)}`;
export const tagUrl = (t) => `/blog/tag/${slugify(t)}`;

// ---------- Markdown ----------
// A small, safe Markdown subset: everything is escaped first, then formatted.
function safeHref(url) {
  const u = String(url || '').trim();
  return /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(u) ? u : '';
}

function inline(text) {
  const codes = [];
  let s = esc(text).replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (m, t, url) => {
    const href = safeHref(url.replace(/&amp;/g, '&'));
    if (!href) return t;
    const ext = /^https?:\/\//i.test(href);
    return `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
  });
  s = s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])_([^_\s][^_]*)_(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}

const cells = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

// Returns { html, toc } — toc lists the H2s for "On this page"
export function markdown(md) {
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  const toc = [];
  const ids = new Set();
  const idFor = (t) => {
    let id = slugify(t.replace(/<[^>]+>/g, '')) || 'section';
    for (let n = 2; ids.has(id); n++) id = `${slugify(t)}-${n}`;
    ids.add(id);
    return id;
  };
  let para = [];
  const flush = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (!t) {
      flush();
      continue;
    }
    if (/^```/.test(t)) {
      flush();
      const code = [];
      while (++i < lines.length && !/^```/.test(lines[i].trim())) code.push(lines[i]);
      out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }
    const h = /^(#{1,4})\s+(.+?)\s*#*$/.exec(t);
    if (h) {
      flush();
      const level = Math.min(4, Math.max(2, h[1].length === 1 ? 2 : h[1].length));
      const text = h[2];
      const id = idFor(text);
      if (level === 2) toc.push({ id, text: text.replace(/[*_`]/g, '') });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) {
      flush();
      out.push('<hr>');
      continue;
    }
    const img = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/.exec(t);
    if (img) {
      flush();
      const url = /^(https?:|\/|data:image\/)/.test(img[2]) ? img[2] : src(img[2]);
      out.push(
        `<figure><img src="${esc(url)}" alt="${esc(img[1])}" loading="lazy">${img[3] || img[1] ? `<figcaption>${esc(img[3] || img[1])}</figcaption>` : ''}</figure>`,
      );
      continue;
    }
    if (t.startsWith('|') && /^\|?\s*:?-{2,}/.test((lines[i + 1] || '').trim())) {
      flush();
      const head = cells(t);
      i++;
      const rows = [];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) rows.push(cells(lines[++i]));
      out.push(
        `<div class="table"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows
          .map((r) => `<tr>${head.map((_, j) => `<td>${inline(r[j] || '')}</td>`).join('')}</tr>`)
          .join('')}</tbody></table></div>`,
      );
      continue;
    }
    if (t.startsWith('>')) {
      flush();
      const q = [t.replace(/^>\s?/, '')];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('>')) q.push(lines[++i].trim().replace(/^>\s?/, ''));
      out.push(`<blockquote>${q.join('\n').split(/\n\s*\n/).map((p) => `<p>${inline(p.replace(/\n/g, ' '))}</p>`).join('')}</blockquote>`);
      continue;
    }
    const ul = /^[-*+]\s+/;
    const ol = /^\d+[.)]\s+/;
    if (ul.test(t) || ol.test(t)) {
      flush();
      const re = ul.test(t) ? ul : ol;
      const items = [t.replace(re, '')];
      while (i + 1 < lines.length) {
        const n = lines[i + 1];
        if (re.test(n.trim())) items.push(n.trim().replace(re, ''));
        else if (/^\s{2,}\S/.test(n) && !ul.test(n.trim()) && !ol.test(n.trim())) items[items.length - 1] += ' ' + n.trim();
        else break;
        i++;
      }
      const tag = re === ul ? 'ul' : 'ol';
      out.push(`<${tag}>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</${tag}>`);
      continue;
    }
    para.push(t);
  }
  flush();
  return { html: out.join('\n'), toc };
}

// ---------- Pieces ----------
const imgOr = (p, cls = '') =>
  p.cover_image
    ? `<img${cls ? ` class="${cls}"` : ''} src="${esc(src(p.cover_image))}" alt="${esc(p.cover_alt || p.title)}" loading="lazy" width="1200" height="675">`
    : `<span class="ph${cls ? ` ${cls}` : ''}" aria-hidden="true"><span>${esc(p.category || 'Novera Labs')}</span></span>`;

const metaLine = (p) =>
  `<small>${p.category ? `${esc(p.category)} · ` : ''}${readMinutes(p.body)} min read</small>`;

export function postCard(p) {
  return `<a class="bcard" href="${postUrl(p)}">
        <span class="bimg">${imgOr(p)}</span>
        <span class="btxt">${metaLine(p)}<b>${esc(p.title)}</b><span class="ex">${esc(p.excerpt)}</span><span class="by">${esc(p.author || 'Novera Labs')} · ${esc(fmtDate(p.date))}</span></span>
      </a>`;
}

function featuredCard(p) {
  return `<a class="bfeat" href="${postUrl(p)}">
      <span class="bimg">${imgOr(p)}</span>
      <span class="btxt"><span class="eb gold">Featured</span>${metaLine(p)}<b>${esc(p.title)}</b><span class="ex">${esc(p.excerpt)}</span><span class="more">Read the article<span class="circ">${ARW(18)}</span></span></span>
    </a>`;
}

function categoryChips(posts, active) {
  const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort();
  if (!cats.length) return '';
  return `<nav class="chips bcats" aria-label="Blog categories"><a class="chip" href="/blog" ${!active ? 'aria-current="page"' : ''}>All posts</a>${cats
    .map((c) => `<a class="chip" href="${categoryUrl(c)}" ${active && catSlug(active) === catSlug(c) ? 'aria-current="page"' : ''}>${esc(c)}</a>`)
    .join('')}</nav>`;
}

function topics(posts) {
  const count = new Map();
  posts.forEach((p) => p.tags.forEach((t) => count.set(t, (count.get(t) || 0) + 1)));
  const top = [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 24);
  if (!top.length) return '';
  return `<section class="wrap btopics">
    <p class="eb">Popular topics</p>
    <div class="tagcloud">${top.map(([t]) => `<a href="${tagUrl(t)}">#${esc(t)}</a>`).join('')}</div>
  </section>`;
}

const empty = `<div class="bempty"><b>New articles are on the way.</b><span>In the meantime, see what we've built on the <a href="/work">Work page</a>.</span></div>`;

// ---------- Head tags ----------
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const abs = (origin, path) => (/^https?:/.test(path) ? path : origin + (path.startsWith('/') ? path : '/' + path));

function head({ origin, path, title, description, image, type = 'website', extra = '' }) {
  const url = origin + path;
  const img = image ? abs(origin, src(image)) : `${origin}/novera-og.png`;
  return `<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<link rel="alternate" type="application/rss+xml" title="Novera Labs blog" href="${origin}/blog/rss.xml">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Novera Labs">
<meta property="og:locale" content="en_IN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="index, follow, max-image-preview:large">
${extra}`;
}

const ORG = (origin) => ({
  '@type': 'Organization',
  name: 'Novera Labs',
  url: origin + '/',
  logo: { '@type': 'ImageObject', url: `${origin}/assets/img/logo-novera-labs.png` },
});

const crumbs = (origin, items) =>
  ld({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: origin + path })),
  });

const fill = (template, headHtml, main) => template.replace('{{head}}', () => headHtml).replace('{{main}}', () => main);

// ---------- Blog home, category and tag pages ----------
export function renderBlogIndex(template, allPosts, { origin = '', category = '', tag = '' } = {}) {
  const posts = livePosts(allPosts);
  let list = posts;
  let title = 'Blog: guides on websites, apps, CRMs and AI for Indian businesses | Novera Labs';
  let description =
    'Practical guides from Novera Labs on building websites, mobile apps, CRMs and AI automation for businesses in India: costs, timelines, features and how to choose.';
  let path = '/blog';
  let heading = `Ideas for building <span class="g-bv">better</span> <span class="g-cb">software.</span>`;
  let lead = 'Practical guides on websites, apps, CRMs and automation for businesses in India. What things cost, how long they take, and how to choose.';
  let crumb = '';
  let crumbName = '';
  if (category) {
    const name = posts.find((p) => catSlug(p.category) === catSlug(category))?.category || '';
    list = posts.filter((p) => catSlug(p.category) === catSlug(category));
    if (!name) return null;
    title = `${name} articles | Novera Labs blog`;
    description = `Articles on ${name.toLowerCase()} from Novera Labs: practical guides for businesses in India.`;
    path = categoryUrl(name);
    heading = esc(name);
    lead = `${list.length} ${list.length === 1 ? 'article' : 'articles'} on ${esc(name.toLowerCase())}.`;
    crumb = esc(name);
    crumbName = name;
  }
  if (tag) {
    const name = posts.flatMap((p) => p.tags).find((t) => slugify(t) === slugify(tag));
    if (!name) return null;
    list = posts.filter((p) => p.tags.some((t) => slugify(t) === slugify(tag)));
    title = `${name}: articles | Novera Labs blog`;
    description = `Articles tagged “${name}” on the Novera Labs blog.`;
    path = tagUrl(name);
    heading = `#${esc(name)}`;
    lead = `${list.length} ${list.length === 1 ? 'article' : 'articles'} tagged ${esc(name)}.`;
    crumb = `#${esc(name)}`;
    crumbName = `#${name}`;
  }
  const isHome = !category && !tag;
  const feat = isHome ? list.find((p) => p.featured) || list[0] : null;
  const rest = feat ? list.filter((p) => p !== feat) : list;
  const items = [['Home', '/'], ['Blog', '/blog'], ...(crumbName ? [[crumbName, path]] : [])];
  const headHtml = head({
    origin,
    path,
    title,
    description,
    extra:
      ld({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Novera Labs blog',
        url: origin + path,
        publisher: ORG(origin),
        blogPost: list.slice(0, 20).map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: origin + postUrl(p), datePublished: p.date })),
      }) + crumbs(origin, items),
  });
  const main = `<main>
  <section class="wrap hero btop">
    ${crumb ? `<p class="crumb"><a href="/blog">Blog</a> / <b>${crumb}</b></p>` : '<p class="eb">Blog · Guides · Costs · How-tos</p>'}
    <h1 class="h1 s80">${heading}</h1>
    <p class="lead s20">${lead}</p>
  </section>
${feat ? `  <section class="wrap">\n    ${featuredCard(feat)}\n  </section>\n` : ''}  <section class="wrap blist">
    ${categoryChips(posts, category ? list[0]?.category : '')}
    ${isHome && rest.length ? '<h2 class="h2 s52">Latest articles</h2>' : ''}
    ${rest.length ? `<div class="bgrid">\n      ${rest.map(postCard).join('\n      ')}\n    </div>` : feat ? '' : empty}
  </section>
${isHome ? topics(posts) : ''}
</main>`;
  return fill(template, headHtml, main);
}

// ---------- A post ----------
function workCard(c) {
  return `<a class="bwork" href="/case-study-${esc(c.slug)}"><img src="${esc(src(c.card_image))}" alt="${esc(c.name)}" loading="lazy"><span><small>${esc(c.type_label)}</small><b>${esc(c.name)}</b></span></a>`;
}

export function renderPost(template, post, { origin = '', posts = [], cases = [] } = {}) {
  const p = normalizePosts([post])[0] || post;
  const live = livePosts(posts);
  const { html, toc } = markdown(p.body);
  const mins = readMinutes(p.body);
  const related = [
    ...live.filter((x) => x.slug !== p.slug && p.category && x.category === p.category),
    ...live.filter((x) => x.slug !== p.slug && x.category !== p.category && x.tags.some((t) => p.tags.includes(t))),
    ...live.filter((x) => x.slug !== p.slug),
  ].filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
  const idx = live.findIndex((x) => x.slug === p.slug);
  const newer = idx > 0 ? live[idx - 1] : null;
  const older = idx >= 0 && idx < live.length - 1 ? live[idx + 1] : null;
  const work = cases.filter((c) => c.show_on_work !== false && c.card_image).slice(0, 3);
  const faqs = p.faqs || [];
  const path = postUrl(p);
  const title = p.seo_title || `${p.title} | Novera Labs`;
  const description = p.seo_description || p.excerpt || '';
  const items = [['Home', '/'], ['Blog', '/blog'], ...(p.category ? [[p.category, categoryUrl(p.category)]] : []), [p.title, path]];
  const headHtml = head({
    origin,
    path,
    title,
    description,
    image: p.cover_image,
    type: 'article',
    extra: [
      `<meta property="article:published_time" content="${esc(p.date)}">`,
      p.updated ? `<meta property="article:modified_time" content="${esc(p.updated)}">` : '',
      p.category ? `<meta property="article:section" content="${esc(p.category)}">` : '',
      ...p.tags.map((t) => `<meta property="article:tag" content="${esc(t)}">`),
      ld({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        description,
        image: p.cover_image ? [abs(origin, src(p.cover_image))] : undefined,
        datePublished: p.date,
        dateModified: p.updated || p.date,
        author: p.author && p.author !== 'Novera Labs' ? { '@type': 'Person', name: p.author } : ORG(origin),
        publisher: ORG(origin),
        mainEntityOfPage: { '@type': 'WebPage', '@id': origin + path },
        articleSection: p.category || undefined,
        keywords: p.tags.join(', ') || undefined,
        wordCount: String(p.body || '').split(/\s+/).filter(Boolean).length,
        inLanguage: 'en-IN',
      }),
      crumbs(origin, items),
      faqs.length
        ? ld({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          })
        : '',
    ]
      .filter(Boolean)
      .join('\n'),
  });

  const tocHtml = toc.length
    ? `<nav class="btoc" aria-label="On this page"><p class="eb no-dot">On this page</p><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>`
    : '';
  const idea = `<div class="bidea">
          <p class="t">Got a project in mind?</p>
          <p>Tell us what you want to build. We reply within one working day with questions, an approach and one fixed price.</p>
          <a class="start" href="#start">Get a free quote<span>${ARW(16)}</span></a>
          <a class="wa-row" href="${WA}">WhatsApp us</a>
        </div>`;
  const main = `<main>
  <article class="bpost">
    <header class="wrap bhead">
      <p class="crumb"><a href="/blog">Blog</a>${p.category ? ` / <a href="${categoryUrl(p.category)}"><b>${esc(p.category)}</b></a>` : ''}</p>
      <h1 class="h1">${esc(p.title)}</h1>
      ${p.excerpt ? `<p class="lead s20">${esc(p.excerpt)}</p>` : ''}
      <p class="bmeta"><span>${esc(p.author || 'Novera Labs')}</span><span>${esc(fmtDate(p.date))}</span><span>${mins} min read</span>${p.updated && p.updated !== p.date ? `<span>Updated ${esc(fmtDate(p.updated))}</span>` : ''}</p>
    </header>
    ${p.cover_image ? `<figure class="wrap-wide bcover"><img src="${esc(src(p.cover_image))}" alt="${esc(p.cover_alt || p.title)}" width="1600" height="900"></figure>` : ''}
    <div class="wrap bbody">
      <aside class="bside">
        ${tocHtml ? `<details class="btoc-m"><summary>On this page</summary>${tocHtml}</details>` : ''}
        <div class="bstick">${tocHtml}${idea}</div>
      </aside>
      <div class="prose">
${html || '<p>Start writing in the Article box.</p>'}
        ${
          faqs.length
            ? `<section class="bfaq"><h2 id="faq">Frequently asked questions</h2><div class="faq">${faqs
                .map(
                  (f, i) =>
                    `<div class="faq-item${i === 0 ? ' open' : ''}"><button type="button" aria-expanded="${i === 0}">${esc(f.q)}<span class="icon" aria-hidden="true">+</span></button><p class="answer">${inline(f.a)}</p></div>`,
                )
                .join('')}</div></section>`
            : ''
        }
        ${p.tags.length ? `<p class="btags">${p.tags.map((t) => `<a href="${tagUrl(t)}">#${esc(t)}</a>`).join('')}</p>` : ''}
        <div class="bmobile-idea">${idea}</div>
        ${
          newer || older
            ? `<nav class="bnav" aria-label="More articles">${older ? `<a href="${postUrl(older)}"><small>Previous</small><b>${esc(older.title)}</b></a>` : '<span></span>'}${newer ? `<a class="next" href="${postUrl(newer)}"><small>Next</small><b>${esc(newer.title)}</b></a>` : ''}</nav>`
            : ''
        }
      </div>
    </div>
  </article>
${
  related.length
    ? `  <section class="wrap sec brel">
    <div class="head-row"><div class="stack"><p class="eb">Keep reading</p><h2 class="h2 s52">Related articles</h2></div><a class="ghost" href="/blog">All articles →</a></div>
    <div class="bgrid">
      ${related.map(postCard).join('\n      ')}
    </div>
  </section>
`
    : ''
}${
    work.length
      ? `  <section class="wrap sec brel">
    <div class="head-row"><div class="stack"><p class="eb">Recent work</p><h2 class="h2 s52">What we've built.</h2></div><a class="ghost" href="/work">View all work →</a></div>
    <div class="bworks">${work.map(workCard).join('')}</div>
  </section>
`
      : ''
  }</main>`;
  return fill(template, headHtml, main);
}

// ---------- Feeds ----------
const xml = (s) => esc(s).replace(/&#x27;/g, '&apos;');

export function renderRss(allPosts, origin) {
  const posts = livePosts(allPosts).slice(0, 30);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Novera Labs blog</title>
<link>${origin}/blog</link>
<atom:link href="${origin}/blog/rss.xml" rel="self" type="application/rss+xml"/>
<description>Guides on websites, apps, CRMs and AI automation for businesses in India.</description>
<language>en-IN</language>
${posts
  .map(
    (p) => `<item>
<title>${xml(p.title)}</title>
<link>${origin}${postUrl(p)}</link>
<guid>${origin}${postUrl(p)}</guid>
<pubDate>${new Date(p.date + 'T09:00:00+05:30').toUTCString()}</pubDate>
${p.category ? `<category>${xml(p.category)}</category>` : ''}
<description>${xml(p.excerpt || '')}</description>
</item>`,
  )
  .join('\n')}
</channel>
</rss>`;
}

const STATIC_PAGES = ['/', '/services', '/how-we-work', '/contact', '/work', '/service-websites', '/service-web-apps', '/service-mobile-apps', '/service-crms', '/service-ecommerce', '/service-ai-automation'];

export function renderSitemap({ posts: allPosts = [], cases = [] }, origin) {
  const posts = livePosts(allPosts);
  const urls = [
    ...STATIC_PAGES.map((p) => [p, '']),
    ...cases.map((c) => [`/case-study-${c.slug}`, '']),
    ...(posts.length ? [['/blog', posts[0].updated || posts[0].date]] : []),
    ...posts.map((p) => [postUrl(p), p.updated || p.date]),
    ...[...new Set(posts.map((p) => p.category).filter(Boolean))].map((c) => [categoryUrl(c), '']),
    ...[...new Set(posts.flatMap((p) => p.tags).map((t) => slugify(t)))].map((t) => [`/blog/tag/${t}`, '']),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `<url><loc>${origin}${u}</loc>${d ? `<lastmod>${xml(d)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>`;
}

export function renderRobots(origin) {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`;
}
