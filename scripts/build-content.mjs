// Builds the editable parts of the site from the files the editor (/admin) saves:
//   content/case-studies/*.json -> public/case-study-<slug>.html + the cards on public/work.html
//   content/more-work/*.json    -> the "More we've built" rows on public/work.html
// Runs before every build (npm run build / build:vercel), so nobody has to run it by hand.
// Run it on its own with: node scripts/build-content.mjs
import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const CASES_DIR = path.join(ROOT, 'content', 'case-studies');
const MORE_DIR = path.join(ROOT, 'content', 'more-work');

const ARW = (n) =>
  `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>`;

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

// Site files are linked from the root (/assets/...), so pages also work under /work/<slug>
const src = (v) => {
  const s = String(v ?? '').trim();
  return s && !/^https?:/.test(s) ? '/' + s.replace(/^\/+/, '') : s;
};

const readJson = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .map((f) => ({ file: f, data: JSON.parse(readFileSync(path.join(dir, f), 'utf8')) }))
    : [];

const byOrder = (key) => (a, b) =>
  (Number(a.order) || 999) - (Number(b.order) || 999) || String(a[key]).localeCompare(String(b[key]));

const cases = readJson(CASES_DIR)
  .map(({ file, data }) => ({
    ...data,
    slug: String(data.slug || file.replace(/\.json$/, ''))
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, ''),
  }))
  .sort(byOrder('slug'));

const moreRows = readJson(MORE_DIR)
  .map(({ data }) => data)
  .sort(byOrder('title'));

const initials = (name) => {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  const caps = (words[0] || '').match(/[A-Z]/g) || [];
  return (caps.length > 1 ? caps.slice(0, 2).join('') : (words[0] || '').slice(0, 1)).toUpperCase();
};

function workGrid() {
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

function moreList() {
  return moreRows
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

// Fills the space between <!-- cms:name --> and <!-- /cms:name --> in a page
function fill(html, name, body) {
  const re = new RegExp(`(<!-- cms:${name}[^>]*-->\\n)[\\s\\S]*?(\\n\\s*<!-- /cms:${name} -->)`);
  if (!re.test(html)) throw new Error(`Marker cms:${name} not found`);
  return html.replace(re, (_, open, close) => open + body + close);
}

const template = readFileSync(path.join(ROOT, 'templates', 'case-study.html'), 'utf8');
const slugs = new Set(cases.map((c) => c.slug));

for (const f of readdirSync(PUBLIC)) {
  const m = f.match(/^case-study-(.+)\.html$/);
  if (m && !slugs.has(m[1])) {
    unlinkSync(path.join(PUBLIC, f));
    console.log('removed', f);
  }
}

for (const c of cases) {
  const page = template
    .replace('{{title}}', () => esc(`Case study: ${c.name} | Novera Labs`))
    .replace('{{description}}', () => esc(c.seo_description || c.card_line))
    .replace('{{main}}', () => caseMain(c));
  writeFileSync(path.join(PUBLIC, `case-study-${c.slug}.html`), page);
  console.log('built', `case-study-${c.slug}.html`);
}

const workPath = path.join(PUBLIC, 'work.html');
let work = readFileSync(workPath, 'utf8');
work = fill(work, 'work-grid', workGrid());
work = fill(work, 'more-rows', moreList());
writeFileSync(workPath, work);
console.log('built work.html');

// The app routes check slugs against this list, so new case studies work at /work/<slug> too
writeFileSync(path.join(ROOT, 'lib', 'case-study-slugs.json'), JSON.stringify([...slugs], null, 2) + '\n');
