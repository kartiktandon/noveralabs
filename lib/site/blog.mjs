// Renders the blog: the blog home, category and tag pages, each post, the RSS feed and the sitemap.
// Shared by the live pages (app/blog/*), the build script and the admin panel's live preview.
// No Node or browser-only APIs here.
import { esc, slugify, src } from './render.mjs';

const ARW = (n) =>
  `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>`;

// ---------- Posts ----------
// A post goes live at its publish date and time, in India time (IST). No time means midnight.
export const publishAt = (p) => {
  const time = /^\d{2}:\d{2}$/.test(String(p.time || '')) ? p.time : '00:00';
  return Date.parse(`${String(p.date || '')}T${time}:00+05:30`);
};

export const isLive = (p, now = Date.now()) => p.status === 'published' && publishAt(p) <= now;

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

// Returns { html, toc } — toc lists the H2s and H3s for the table of contents
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
      if (level <= 3) toc.push({ id, level, text: text.replace(/[*_`]/g, '') });
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
const CLOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const SHARE = {
  linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.3l-7.2 8.2L22.3 21h-6.6l-5.2-6.8L4.6 21H1.3l7.7-8.8L.9 3h6.8l4.7 6.2zm-1.2 16h1.8L7.5 4.9H5.6z"/></svg>',
  facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.5v3.6h2.8V21H14v-8.9h2.8l.4-3.6z"/></svg>',
  whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2z"/></svg>',
  link: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
};

// "3 days ago", "1 month ago", from the post's date
export function timeAgo(date, now = new Date()) {
  const d = new Date(String(date || '') + 'T00:00:00+05:30');
  if (Number.isNaN(d.getTime())) return '';
  const days = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 86400000));
  if (days < 1) return 'Today';
  if (days < 7) return days === 1 ? 'Yesterday' : `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days < 14 ? '' : 's'} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${days < 60 ? '' : 's'} ago`;
  return `${Math.floor(days / 365)} year${days < 730 ? '' : 's'} ago`;
}

const thumb = (image, alt) =>
  image
    ? `<img src="${esc(src(image))}" alt="${esc(alt)}" loading="lazy" width="128" height="104">`
    : '<span class="ph" aria-hidden="true"></span>';

function sideRelated(p) {
  return `<a class="srow" href="${postUrl(p)}">${thumb(p.cover_image, p.cover_alt || p.title)}<span class="stxt"><span class="smeta"><span class="ago">${CLOCK}${esc(timeAgo(p.date))}</span>${p.category ? `<span class="pill">${esc(p.category)}</span>` : ''}</span><b>${esc(p.title)}</b></span></a>`;
}

function sideWork(c) {
  return `<a class="srow" href="/case-study-${esc(c.slug)}">${thumb(c.card_image, c.name)}<span class="stxt"><span class="smeta"><span class="pill">${esc(c.type_label)}</span></span><b>${esc(c.name)}</b><small>${esc(c.card_line)}</small></span></a>`;
}

export function renderPost(template, post, { origin = '', posts = [], cases = [] } = {}) {
  const p = normalizePosts([post])[0] || post;
  const live = livePosts(posts);
  const { html, toc } = markdown(p.body);
  const mins = readMinutes(p.body);
  const words = String(p.body || '').split(/\s+/).filter(Boolean).length;
  const related = [
    ...live.filter((x) => x.slug !== p.slug && p.category && x.category === p.category),
    ...live.filter((x) => x.slug !== p.slug && x.category !== p.category && x.tags.some((t) => p.tags.includes(t))),
    ...live.filter((x) => x.slug !== p.slug),
  ]
    .filter((x, i, a) => a.indexOf(x) === i)
    .slice(0, 5);
  const idx = live.findIndex((x) => x.slug === p.slug);
  const newer = idx > 0 ? live[idx - 1] : null;
  const older = idx >= 0 && idx < live.length - 1 ? live[idx + 1] : null;
  const work = cases.filter((c) => c.show_on_work !== false && c.card_image).slice(0, 3);
  const faqs = p.faqs || [];
  const takeaways = (p.takeaways || []).map((t) => String(t).trim()).filter(Boolean);
  const path = postUrl(p);
  const url = origin + path;
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
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        articleSection: p.category || undefined,
        keywords: p.tags.join(', ') || undefined,
        abstract: takeaways.length ? takeaways.join(' ') : undefined,
        wordCount: words,
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

  const tocList = toc.length
    ? `<ol>${toc.map((t) => `<li class="l${t.level}"><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol>`
    : '';
  const enc = encodeURIComponent;
  const share = `<div class="bshare" aria-label="Share"><span>Share</span>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">${SHARE.linkedin}</a>
        <a href="https://x.com/intent/post?url=${enc(url)}&amp;text=${enc(p.title)}" target="_blank" rel="noopener" aria-label="Share on X">${SHARE.x}</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${enc(url)}" target="_blank" rel="noopener" aria-label="Share on Facebook">${SHARE.facebook}</a>
        <a href="https://wa.me/?text=${enc(`${p.title} ${url}`)}" target="_blank" rel="noopener" aria-label="Share on WhatsApp">${SHARE.whatsapp}</a>
        <button type="button" data-copy="${esc(url)}" aria-label="Copy link">${SHARE.link}</button>
      </div>`;
  const main = `<main>
  <article class="bpost">
    <header class="bwrap bhead">
      <nav class="bcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/blog">Blog</a>${p.category ? `<span>›</span><a href="${categoryUrl(p.category)}">${esc(p.category)}</a>` : ''}</nav>
      <p class="bmeta">${p.category ? `<a class="cat" href="${categoryUrl(p.category)}">${esc(p.category)}</a>` : ''}<span class="ico">${CLOCK}${mins} min read</span><span>${esc(fmtDate(p.date))}</span><span class="faint">${words} words</span></p>
      <h1>${esc(p.title)}</h1>
      ${p.excerpt ? `<p class="bsum">${esc(p.excerpt)}</p>` : ''}
      <div class="bbar">
        ${p.tags.length ? `<p class="btags">${p.tags.map((t) => `<a href="${tagUrl(t)}">#${esc(t)}</a>`).join('')}</p>` : '<span></span>'}
        ${share}
      </div>
    </header>

    <div class="bwrap bcols">
      <aside class="bleft">
        ${tocList ? `<nav class="btoc" aria-label="Table of contents"><p class="bh">Table of contents</p>${tocList}</nav>` : ''}
      </aside>

      <div class="bmid">
        ${tocList ? `<details class="btoc-m"><summary>Table of contents</summary>${tocList}</details>` : ''}
        ${
          takeaways.length
            ? `<details class="bkey" open><summary>Key takeaways:</summary><ul>${takeaways.map((t) => `<li>${inline(t)}</li>`).join('')}</ul></details>`
            : ''
        }
        <div class="bcard-main">
          ${p.cover_image ? `<img class="bcover" src="${esc(src(p.cover_image))}" alt="${esc(p.cover_alt || p.title)}" width="1600" height="900">` : ''}
          <div class="prose">
${html || '<p>Start writing in the Article box.</p>'}
          </div>
        </div>
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
        <div class="bauthor"><span class="av" aria-hidden="true"><img src="/assets/img/mark-white.png" alt=""></span><span><small>Written by</small><b>${esc(p.author || 'Novera Labs')}</b></span><span><small>Published on</small><b>${esc(fmtDate(p.date))}</b></span></div>
        ${
          newer || older
            ? `<nav class="bnav" aria-label="More articles">${older ? `<a href="${postUrl(older)}"><small>Previous</small><b>${esc(older.title)}</b></a>` : '<span></span>'}${newer ? `<a class="next" href="${postUrl(newer)}"><small>Next</small><b>${esc(newer.title)}</b></a>` : ''}</nav>`
            : ''
        }
      </div>

      <aside class="bright">
        <a class="bpromo" href="#start"><small>Planning something similar?</small><b>Get a free quote</b><span>We reply within one working day.</span><i>${ARW(14)}</i></a>
        ${related.length ? `<section class="bside-list"><p class="bh">Related blogs</p>${related.map(sideRelated).join('')}</section>` : ''}
        ${work.length ? `<section class="bside-list"><p class="bh">Latest work</p>${work.map(sideWork).join('')}<a class="ball" href="/work">View all work →</a></section>` : ''}
      </aside>
    </div>
  </article>
</main>`;
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
