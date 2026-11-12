// Renders the editable pages (home page's Selected work, Work page, case study pages) from content.
// Shared by the live pages (app/[slug]/route.ts), the build script and the admin panel's
// live preview, so all three always produce the same HTML. No Node or browser-only APIs here.

const ARW = (n) =>
  `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>`;

export const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

// Site files are linked from the root (/assets/...); uploads are full https:// URLs
export const src = (v) => {
  const s = String(v ?? '').trim();
  return s && !/^(https?:|data:)/.test(s) ? '/' + s.replace(/^\/+/, '') : s;
};

export const slugify = (v) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const initials = (name) => {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  const caps = (words[0] || '').match(/[A-Z]/g) || [];
  return (caps.length > 1 ? caps.slice(0, 2).join('') : (words[0] || '').slice(0, 1)).toUpperCase();
};

const byOrder = (key) => (a, b) =>
  (Number(a.order) || 999) - (Number(b.order) || 999) || String(a[key]).localeCompare(String(b[key]));

// Cleans content from storage or the editor: valid slugs, sorted by position
export function normalize(content) {
  const cases = (content?.cases || [])
    .map((c) => ({ ...c, slug: slugify(c.slug || c.name) }))
    .filter((c) => c.slug)
    .sort(byOrder('slug'));
  const more = [...(content?.more || [])].sort(byOrder('title'));
  return { cases, more };
}

export function workGrid(cases) {
  return cases
    .filter((c) => c.show_on_work !== false)
    .map(
      (c, i) => `      <a class="wcard" href="/case-study-${c.slug}" data-type="${esc(c.filter)}">
        <img src="${esc(src(c.card_image))}" alt="${esc(c.name)}, ${esc(c.type_label).toLowerCase()} by Novera Labs" width="604" height="415" loading="${i < 2 ? 'eager' : 'lazy'}">
        <span class="info"><span class="txt"><small>${esc(c.number)} · ${esc(c.type_label)}</small><b>${esc(c.name)}</b><p>${esc(c.card_line)}</p></span><span class="circ">${ARW(18)}</span></span>
      </a>`,
    )
    .join('\n');
}

export function moreList(rows) {
  return rows
    .map((r, i) => {
      const inner = `<span class="n">${String(i + 1).padStart(2, '0')}</span><span class="body"><span class="t">${esc(r.title)}</span><span class="d">${esc(r.line)}</span></span><span class="tag">${esc(r.tag)}</span>`;
      const pdf = String(r.pdf || '').trim();
      return pdf
        ? `      <a class="more-row has-pdf" href="${esc(src(pdf))}" target="_blank" rel="noopener">${inner}<span class="pdf">View PDF ↗</span></a>`
        : `      <div class="more-row">${inner}</div>`;
    })
    .join('\n');
}

function caseMain(c) {
  const facts = (c.facts || []).map((f) => `<div><small>${esc(f.label)}</small><b>${esc(f.value)}</b></div>`).join('');
  const hero = src(c.hero_image);
  const media = hero
    ? `<div class="box has-img"><img src="${esc(hero)}" alt="${esc(c.name)}"></div>`
    : '<div class="box"><div class="win"><div class="browser-bar"><i></i><i></i><i></i></div><div class="ph"><span class="ph-label">[Main dashboard screenshot]</span></div></div></div>';
  const feats = (c.features || [])
    .map((f, i) => `        <div class="feat"><span class="n">${String(i + 1).padStart(2, '0')}</span><b>${esc(f.title)}</b><span>${esc(f.text)}</span></div>`)
    .join('\n');
  const screens = (c.screens || []).filter((s) => s.image || s.label).slice(0, 3);
  const shots = screens.length
    ? `<div class="shots n${screens.length}">${screens
        .map((s, i) => {
          const inner = s.image
            ? `<img src="${esc(src(s.image))}" alt="${esc(s.label)}" loading="lazy">`
            : `<span class="ph-label">[${esc(s.label)}]</span>`;
          return `<div${i === 2 ? ' class="phone-shot"' : ''}>${inner}</div>`;
        })
        .join('')}</div>`
    : '';
  const stack = (c.stack || []).filter((x) => String(x).trim()).map((x) => `<span>${esc(x)}</span>`).join('');
  const stackSec = stack
    ? `  <section class="wrap split-07 case-sec">
    <p class="eb">04 · Stack</p>
    <div class="stack-chips">${stack}</div>
  </section>
`
    : '';
  const q = c.quote || {};
  const quote = String(q.text || '').trim()
    ? `<figure class="case-quote">
      <blockquote>“${esc(q.text)}”</blockquote>
      <figcaption><span class="av" aria-hidden="true">${esc(q.initials || initials(q.name || c.name))}</span><span><b>${esc(q.name)}</b><small>${esc(q.role)}</small></span></figcaption>
    </figure>`
    : '';
  const muted = String(c.needed_muted || '').trim() ? ` <span>${esc(c.needed_muted)}</span>` : '';
  return `<main>
  <section class="wrap case-top">
    <p class="crumb"><a href="/work">Work</a> / <b>${esc(c.crumb)}</b></p>
    <h1 class="h1 s92">${esc(c.title_before)} <span class="g">${esc(c.title_highlight)}</span> ${esc(c.title_after)}</h1>
    <div class="facts">${facts}</div>
  </section>

  <section class="wrap-wide case-media" aria-label="${esc(c.name)}">
    ${media}
  </section>

  <section class="wrap split-07 case-sec first">
    <p class="eb">01 · The client</p>
    <p class="story">${esc(c.client)}</p>
  </section>
  <section class="wrap split-07 case-sec s96">
    <p class="eb">02 · What they needed</p>
    <p class="story">${esc(c.needed)}${muted}</p>
  </section>
  <section class="wrap case-sec">
    <div class="split-07">
      <p class="eb">03 · What we built</p>
      <div class="feats">
${feats}
      </div>
    </div>
    ${shots}
  </section>
${stackSec}  <section class="wrap case-sec">
    ${quote}
    <a class="all-projects" href="/work"><b>View All Projects</b><span>${ARW(24)}</span></a>
  </section>
</main>`;
}

export function renderCasePage(template, c) {
  return template
    .replace('{{title}}', () => esc(`Case study: ${c.name} | Novera Labs`))
    .replace('{{description}}', () => esc(c.seo_description || c.card_line))
    .replace('{{main}}', () => caseMain(c));
}

// Fills the space between <!-- cms:name --> and <!-- /cms:name --> in a page
function fill(html, name, body) {
  const re = new RegExp(`(<!-- cms:${name}[^>]*-->\\n)[\\s\\S]*?(\\n\\s*<!-- /cms:${name} -->)`);
  if (!re.test(html)) throw new Error(`Marker cms:${name} not found`);
  return html.replace(re, (_, open, close) => open + body + close);
}

// Home page "Selected work": a list that drives the browser-frame preview beside it
export function homeWork(cases) {
  const shown = cases.filter((c) => c.show_on_home !== false);
  const label = (c) => c.home_label || c.type_label || '';
  const items = shown
    .map(
      (c, i) =>
        `            <li><button type="button" aria-pressed="${i === 0}" data-name="${esc(c.name)}" data-url="${esc(label(c))}" data-img="${esc(src(c.card_image))}" data-line="${esc(c.card_line)}" data-href="/case-study-${c.slug}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="name">${esc(c.name)}</span><span class="type">${esc(c.type_label)}</span></button></li>`,
    )
    .join('\n');
  const f = shown[0];
  const preview = f
    ? `        <div class="work-preview" data-work-preview>
          <div class="frame">
            <div class="browser-bar"><i></i><i></i><i></i><span class="url" data-url>${esc(label(f))}</span></div>
            <img data-img src="${esc(src(f.card_image))}" alt="${esc(f.name)}" width="1280" height="720">
          </div>
          <div class="meta"><p data-line>${esc(f.card_line)}</p><a class="link" data-link href="/case-study-${f.slug}">Case study →</a></div>
        </div>`
    : '';
  return `        <ol class="work-list" data-work-list>
${items}
        </ol>
${preview}`;
}

export function renderHomePage(template, content) {
  return fill(template, 'home-work', homeWork(normalize(content).cases));
}

export function renderWorkPage(template, content) {
  const { cases, more } = normalize(content);
  return fill(fill(template, 'work-grid', workGrid(cases)), 'more-rows', moreList(more));
}
