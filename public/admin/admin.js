// Novera Labs admin panel: sign in, then edit case studies and "More we've built".
// Everything is saved in one go to /api/admin/content; the site shows it straight away.
import { renderCasePage, workGrid, slugify, initials } from '/admin/render.mjs';

const app = document.getElementById('app');
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const I = {
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  ext: '<path d="M7 17L17 7M9 7h8v8"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
  up: '<path d="M18 15l-6-6-6 6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15h6"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name]}</svg>`;

const FILTERS = ['Website', 'Web app', 'Mobile app', 'CRM'];

const state = {
  cases: [],
  more: [],
  templates: null,
  storage: false,
  saved: '',
  saving: false,
  filter: 'All',
  query: '',
  device: 'desktop',
  previewMode: 'page',
};
const slugTouched = new WeakSet();

// ---------- API ----------
async function api(path, opts = {}) {
  const res = await fetch(path, { credentials: 'same-origin', ...opts });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== '/api/admin/login') {
    renderLogin(state.templates ? 'Your session ended. Please sign in again.' : '');
    throw new Error('signed-out');
  }
  if (!res.ok) throw new Error(data.error || `Something went wrong (${res.status}).`);
  return data;
}

const snapshot = () => JSON.stringify({ cases: state.cases, more: state.more });
const isDirty = () => snapshot() !== state.saved;

function updateDirty() {
  const d = isDirty();
  $$('.dirty').forEach((el) => el.classList.toggle('show', d));
  $$('[data-save]').forEach((b) => (b.disabled = state.saving || !d));
}

window.addEventListener('beforeunload', (e) => {
  if (state.templates && isDirty()) e.preventDefault();
});

// ---------- Toasts and modals ----------
function toast(msg, kind = 'ok', ms = 4200) {
  const el = document.createElement('div');
  el.className = `toast${kind === 'err' ? ' err' : ''}`;
  el.innerHTML = `${icon(kind === 'err' ? 'alert' : 'check')}<span>${msg}</span>`;
  $('#toasts').append(el);
  setTimeout(() => el.remove(), ms);
}

function confirmBox({ title, text, ok = 'Delete', danger = true }) {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'modal';
    el.innerHTML = `<div class="box" role="dialog" aria-modal="true" aria-labelledby="m-t"><h3 id="m-t">${title}</h3><p>${text}</p><div class="acts"><button class="btn" data-no>Cancel</button><button class="btn ${danger ? 'danger solid' : 'primary'}" data-yes>${ok}</button></div></div>`;
    const done = (v) => { el.remove(); document.removeEventListener('keydown', key); resolve(v); };
    const key = (e) => e.key === 'Escape' && done(false);
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.closest('[data-no]')) done(false);
      if (e.target.closest('[data-yes]')) done(true);
    });
    document.addEventListener('keydown', key);
    document.body.append(el);
    $('[data-yes]', el).focus();
  });
}

// ---------- Login ----------
function renderLogin(message = '') {
  state.templates = null;
  app.className = '';
  app.innerHTML = `
  <div class="login">
    <div class="login-art">
      <img class="logo" src="/assets/img/logo-novera-labs-white.png" alt="Novera Labs">
      <div>
        <h1>Your work, <span>on screen</span> in minutes.</h1>
        <p>Add case studies, update projects and attach PDFs. Changes go live on the site as soon as you save.</p>
      </div>
    </div>
    <div class="login-side">
      <div class="login-card">
        <p class="eb">Admin</p>
        <h2>Sign in to Novera Labs</h2>
        <form id="login" novalidate>
          <div class="login-err${message ? ' show' : ''}" role="alert">${icon('alert')}<span>${esc(message)}</span></div>
          <div class="field"><label for="u">Username</label><input class="input" id="u" name="username" autocomplete="username" required autofocus></div>
          <div class="field"><label for="p">Password</label><div class="pw"><input class="input" id="p" name="password" type="password" autocomplete="current-password" required><button type="button" data-pw aria-label="Show password">${icon('eye')}</button></div></div>
          <button class="btn primary" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  </div>`;
  const form = $('#login');
  $('[data-pw]').addEventListener('click', (e) => {
    const p = $('#p');
    const show = p.type === 'password';
    p.type = show ? 'text' : 'password';
    e.currentTarget.innerHTML = icon(show ? 'eyeOff' : 'eye');
    e.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('button[type=submit]', form);
    const err = $('.login-err', form);
    btn.disabled = true;
    btn.innerHTML = '<span class="spin"></span>Signing in';
    try {
      await api('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username.value, password: form.password.value }),
      });
      await load();
    } catch (x) {
      err.classList.add('show');
      $('span', err).textContent = x.message;
      btn.disabled = false;
      btn.textContent = 'Sign in';
      form.password.select();
    }
  });
}

// ---------- Data ----------
async function load() {
  const data = await api('/api/admin/content');
  state.cases = data.cases;
  state.more = data.more;
  state.templates = data.templates;
  state.storage = data.storage;
  state.saved = snapshot();
  route();
}

async function save() {
  if (state.saving || !isDirty()) return;
  const bad = state.cases.find((c) => !String(c.name || '').trim() || !c.slug);
  if (bad) return toast('Every case study needs a project name and a page address.', 'err');
  const slugs = state.cases.map((c) => c.slug);
  const dupe = slugs.find((s, i) => slugs.indexOf(s) !== i);
  if (dupe) return toast(`Two case studies use the page address “${esc(dupe)}”. Change one of them.`, 'err');
  state.cases.forEach((c, i) => (c.order = i + 1));
  state.more.forEach((r, i) => (r.order = i + 1));
  state.saving = true;
  $$('[data-save]').forEach((b) => (b.innerHTML = '<span class="spin"></span>Saving'));
  updateDirty();
  try {
    const data = await api('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cases: state.cases, more: state.more }),
    });
    // Keep the same objects (the open editor points at them), only take the server's cleanup
    state.cases.forEach((c, i) => Object.assign(c, data.cases[i]));
    state.saved = snapshot();
    toast('Saved. It’s live on the site now. <a href="/work" target="_blank" rel="noopener">View Work page</a>');
  } catch (x) {
    if (x.message !== 'signed-out') toast(esc(x.message), 'err', 8000);
  } finally {
    state.saving = false;
    $$('[data-save]').forEach((b) => (b.textContent = 'Save changes'));
    updateDirty();
  }
}

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's' && state.templates) {
    e.preventDefault();
    save();
  }
});

// ---------- Uploads ----------
async function upload(file) {
  if (!state.storage) throw new Error('Uploads switch on once a Blob store is connected in Vercel.');
  if (file.size > 4.5 * 1024 * 1024) throw new Error('That file is over 4.5 MB. Please compress it and try again.');
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': file.type || 'application/octet-stream', 'x-filename': file.name },
    body: file,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed.');
  return data.url;
}

const fileName = (url) => decodeURIComponent(String(url || '').split('/').pop().split('?')[0]);
const imgUrl = (v) => (/^https?:/.test(v || '') ? v : v ? '/' + String(v).replace(/^\/+/, '') : '');

// ---------- Shell ----------
function shell(active, content) {
  return `
  <div class="mobile-bar"><img src="/assets/img/logo-novera-labs-white.png" alt="Novera Labs"><button data-menu aria-label="Menu">${icon('menu')}</button></div>
  <div class="shell">
    <aside class="side">
      <div class="logo"><img src="/assets/img/logo-novera-labs-white.png" alt="Novera Labs"></div>
      <p class="tag">Content</p>
      <a class="nav" href="#/cases" ${active === 'cases' ? 'aria-current="page"' : ''}>${icon('grid')}Case studies<span class="count">${state.cases.length}</span></a>
      <a class="nav" href="#/more" ${active === 'more' ? 'aria-current="page"' : ''}>${icon('list')}More we’ve built<span class="count">${state.more.length}</span></a>
      <div class="bottom">
        <div class="status${state.storage ? '' : ' off'}"><b><i></i>${state.storage ? 'Saving is on' : 'Saving is off'}</b>${state.storage ? 'Saves go live on the site straight away.' : 'Connect a Blob store in Vercel to save.'}</div>
        <a class="nav" href="/work" target="_blank" rel="noopener">${icon('ext')}View site</a>
        <button class="nav" data-logout>${icon('out')}Sign out</button>
      </div>
    </aside>
    <div class="main">${content}</div>
  </div>`;
}

const storageBanner = () =>
  state.storage
    ? ''
    : `<div class="banner">${icon('alert')}<div><b>Saving isn’t switched on yet</b>You can look around and edit, but changes can’t be saved until storage is connected. One-time setup in Vercel:<ol><li>Open the project, go to <b>Storage</b> and click <b>Create Database</b>, then pick <b>Blob</b>.</li><li>Connect it to this project, then <b>Redeploy</b>.</li></ol></div></div>`;

function topBar(title, sub, actions, back = '') {
  return `<div class="top">${back}<div class="grow"><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div><div class="actions"><span class="dirty"><i></i>Unsaved changes</span>${actions}<button class="btn primary" data-save disabled>Save changes</button></div></div>`;
}

function bindShell() {
  $('[data-logout]')?.addEventListener('click', async () => {
    if (isDirty() && !(await confirmBox({ title: 'Sign out without saving?', text: 'Your unsaved changes will be lost.', ok: 'Sign out' }))) return;
    await fetch('/api/admin/logout', { method: 'POST' });
    state.saved = snapshot();
    renderLogin();
  });
  $('[data-menu]')?.addEventListener('click', () => $('.side').classList.toggle('open'));
  $$('.side .nav').forEach((a) => a.addEventListener('click', () => $('.side').classList.remove('open')));
  $$('[data-save]').forEach((b) => b.addEventListener('click', save));
  const top = $('.top');
  const onScroll = () => top && top.classList.toggle('stuck', scrollY > 4);
  window.onscroll = onScroll;
  onScroll();
  updateDirty();
}

// ---------- Routing ----------
function route() {
  if (!state.templates) return;
  const [, view, id] = location.hash.split('/');
  window.scrollTo(0, 0);
  if (view === 'more') return renderMore();
  if (view === 'case' && id !== undefined) {
    const c = state.cases.find((x) => x.slug === decodeURIComponent(id)) || state.cases[Number(id)];
    if (c) return renderCase(c);
  }
  renderCases();
}
window.addEventListener('hashchange', route);

// ---------- Case studies list ----------
function renderCases() {
  const q = state.query.toLowerCase();
  const shown = state.cases.filter(
    (c) =>
      (state.filter === 'All' || c.filter === state.filter) &&
      (!q || [c.name, c.type_label, c.card_line, c.slug].join(' ').toLowerCase().includes(q)),
  );
  const canDrag = state.filter === 'All' && !q;
  app.className = '';
  app.innerHTML = shell(
    'cases',
    `${topBar('Case studies', 'Cards on the Work page and their full pages. Drag cards to change the order.', `<button class="btn dark" data-new>${icon('plus')}New case study</button>`)}
    <div class="page">
      ${storageBanner()}
      <div class="toolbar">
        <div class="search">${icon('search')}<input class="input" type="search" placeholder="Search case studies" value="${esc(state.query)}" data-q aria-label="Search case studies"></div>
        <div class="chips">${['All', ...FILTERS].map((f) => `<button class="chip" data-f="${f}" aria-pressed="${state.filter === f}">${f}</button>`).join('')}</div>
      </div>
      ${
        shown.length
          ? `<div class="cards">${shown
              .map((c) => {
                const img = imgUrl(c.card_image);
                const live = c.show_on_work !== false;
                return `<article class="card" data-slug="${esc(c.slug)}" ${canDrag ? 'draggable="true"' : ''} tabindex="0" aria-label="Edit ${esc(c.name)}">
                <div class="thumb" style="${img ? `background-image:url('${esc(img)}')` : ''}">${img ? '' : '<span class="empty">No card image yet</span>'}
                  <span class="badge${live ? '' : ' hidden'}">${live ? 'ON WORK PAGE' : 'HIDDEN'}</span>
                  ${canDrag ? `<span class="handle" title="Drag to reorder">${icon('grip')}</span>` : ''}
                </div>
                <div class="body"><small>${esc(c.number)} · ${esc(c.type_label || 'No type')}</small><b>${esc(c.name || 'Untitled')}</b><p>${esc(c.card_line || 'No card description yet')}</p></div>
              </article>`;
              })
              .join('')}${canDrag ? `<button class="card add" data-new><span class="plus">${icon('plus')}</span>New case study</button>` : ''}</div>`
          : `<div class="empty-state">No case studies match. <button class="btn sm" data-clear>Clear search</button></div>`
      }
    </div>`,
  );
  bindShell();
  $$('[data-new]').forEach((b) => b.addEventListener('click', newCase));
  $('[data-q]').addEventListener('input', (e) => {
    state.query = e.target.value;
    const pos = e.target.selectionStart;
    renderCases();
    const q = $('[data-q]');
    q.focus();
    q.setSelectionRange(pos, pos);
  });
  $$('[data-f]').forEach((b) => b.addEventListener('click', () => ((state.filter = b.dataset.f), renderCases())));
  $('[data-clear]')?.addEventListener('click', () => ((state.query = ''), (state.filter = 'All'), renderCases()));
  $$('.card[data-slug]').forEach((card) => {
    const open = () => (location.hash = `#/case/${encodeURIComponent(card.dataset.slug)}`);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => e.key === 'Enter' && open());
  });
  if (canDrag) sortable($('.cards'), '.card[data-slug]', 'drop', (from, to) => move(state.cases, from, to, renderCases));
}

function move(list, from, to, rerender) {
  if (from === to) return;
  const [x] = list.splice(from, 1);
  list.splice(to, 0, x);
  rerender();
}

// Drag and drop reordering for a list of elements, in the same order as the data
function sortable(root, sel, cls, onMove) {
  let from = null;
  root.addEventListener('dragstart', (e) => {
    const el = e.target.closest(sel);
    if (!el) return;
    from = $$(sel, root).indexOf(el);
    el.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  root.addEventListener('dragend', () => $$(sel, root).forEach((el) => el.classList.remove('dragging', cls)));
  root.addEventListener('dragover', (e) => {
    const el = e.target.closest(sel);
    if (from === null || !el) return;
    e.preventDefault();
    $$(sel, root).forEach((x) => x.classList.toggle(cls, x === el));
  });
  root.addEventListener('drop', (e) => {
    const el = e.target.closest(sel);
    if (from === null || !el) return;
    e.preventDefault();
    const to = $$(sel, root).indexOf(el);
    const f = from;
    from = null;
    onMove(f, to);
  });
}

function newCase() {
  const nums = state.cases.map((c) => parseInt(c.number, 10)).filter((n) => !Number.isNaN(n));
  const c = {
    slug: '',
    name: '',
    show_on_work: true,
    number: String((nums.length ? Math.max(...nums) : 0) + 1).padStart(2, '0'),
    type_label: '',
    filter: 'Website',
    card_image: '',
    card_line: '',
    crumb: '',
    title_before: '',
    title_highlight: '',
    title_after: '',
    facts: [
      { label: 'Industry', value: '' },
      { label: 'What we built', value: '' },
      { label: 'Platform', value: '' },
      { label: 'Delivered in', value: '' },
    ],
    hero_image: '',
    client: '',
    needed: '',
    needed_muted: '',
    features: [{ title: '', text: '' }],
    screens: [],
    stack: [],
    quote: { text: '', name: '', role: '', initials: '' },
    seo_description: '',
  };
  state.cases.push(c);
  c.slug = `new-case-study-${Date.now().toString(36).slice(-4)}`;
  location.hash = `#/case/${c.slug}`;
}

// ---------- Case study editor ----------
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
function set(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, k) => (o[k] ??= /^\d+$/.test(k) ? [] : {}), obj);
  target[last] = value;
}

const input = (c, path, label, { hint = '', placeholder = '', area = false, rows = 3, small = '' } = {}) => `
  <div class="field"><label for="f-${path}">${label}${small ? ` <small>${small}</small>` : ''}</label>
  ${
    area
      ? `<textarea class="textarea" id="f-${path}" data-path="${path}" rows="${rows}" placeholder="${esc(placeholder)}">${esc(get(c, path))}</textarea>`
      : `<input class="input" id="f-${path}" data-path="${path}" value="${esc(get(c, path))}" placeholder="${esc(placeholder)}">`
  }
  ${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;

const imageField = (c, path, label, hint) => {
  const v = get(c, path);
  return `<div class="field"><span class="label">${label}</span>
  <div class="drop" data-image="${path}">
    ${
      v
        ? `<div class="has"><img src="${esc(imgUrl(v))}" alt=""><div><div class="file">${esc(fileName(v))}</div><div class="acts"><button class="btn sm" type="button" data-pick>${icon('upload')}Replace</button><button class="btn sm ghost danger" type="button" data-clear-img>Remove</button></div></div></div>`
        : `<button class="pick" type="button" data-pick>${icon('upload')}<b>Click to upload</b> or drag an image here<span class="hint">${hint}</span></button>`
    }
    <div class="busy"><span><span class="spin"></span>Uploading</span></div>
    <input type="file" accept="image/*" hidden>
  </div></div>`;
};

function renderCase(c) {
  const isNew = c.slug.startsWith('new-case-study-') && !c.name;
  app.className = '';
  app.innerHTML = shell(
    'cases',
    `${topBar(
      esc(c.name || 'New case study'),
      `Page: /case-study-${esc(c.slug)}`,
      `<a class="btn" href="/case-study-${esc(c.slug)}" target="_blank" rel="noopener" title="Open the live page">${icon('ext')}<span>Live page</span></a><button class="btn danger icon" data-del title="Delete case study" aria-label="Delete case study">${icon('trash')}</button>`,
      `<a class="btn ghost icon" href="#/cases" aria-label="Back to case studies">${icon('back')}</a>`,
    )}
    <div class="page">
      ${storageBanner()}
      <div class="editor">
        <form class="form" id="case-form" autocomplete="off" onsubmit="return false">
          <nav class="sections-nav"><a href="#s-card">Card</a><a href="#s-top">Page top</a><a href="#s-story">Story</a><a href="#s-built">What we built</a><a href="#s-screens">Screens</a><a href="#s-quote">Quote</a><a href="#s-seo">Google</a></nav>

          <section class="sec" id="s-card">
            <div class="sec-head"><div><h3>Card on the Work page</h3><p>What people see in the grid before they open the case study.</p></div>
              <label class="switch"><input type="checkbox" data-path="show_on_work" data-bool ${c.show_on_work !== false ? 'checked' : ''}>Show</label></div>
            <div class="stack">
              <div class="grid2">
                ${input(c, 'name', 'Project name', { placeholder: 'e.g. Detailing Adda' })}
                <div class="field"><label for="f-slug">Page address</label><div class="prefix"><span>/case-study-</span><input class="input" id="f-slug" data-path="slug" data-slug value="${isNew ? '' : esc(c.slug)}" placeholder="detailing-adda"></div><p class="hint">Fills in from the name. Changing it later breaks old links.</p></div>
              </div>
              <div class="grid3">
                ${input(c, 'number', 'Card number', { placeholder: '09' })}
                ${input(c, 'type_label', 'Type label', { placeholder: 'e.g. CRM' })}
                <div class="field"><label for="f-filter">Work page filter</label><select class="select" id="f-filter" data-path="filter">${FILTERS.map((f) => `<option ${c.filter === f ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
              </div>
              ${input(c, 'card_line', 'Card description', { area: true, rows: 2, placeholder: 'One or two lines about the project' })}
              ${imageField(c, 'card_image', 'Card image', 'Landscape, about 1200 × 830 px')}
            </div>
          </section>

          <section class="sec" id="s-top">
            <div class="sec-head"><div><h3>Page top</h3><p>The title, the facts row and the big image.</p></div></div>
            <div class="stack">
              ${input(c, 'crumb', 'Breadcrumb', { placeholder: 'e.g. CRM · Car detailing', hint: 'Shown after “Work /” above the title.' })}
              <div class="grid3">
                ${input(c, 'title_before', 'Title, start', { placeholder: 'A CRM that runs' })}
                ${input(c, 'title_highlight', 'Highlighted part', { placeholder: 'Detailing Adda’s', small: 'gradient' })}
                ${input(c, 'title_after', 'Title, end', { placeholder: 'day.' })}
              </div>
              <div class="field"><span class="label">Facts row <small>up to 4</small></span>
                <div class="repeat">${(c.facts || [])
                  .map(
                    (f, i) => `<div class="item"><span class="n">${i + 1}</span><div class="fields grid2"><input class="input" data-path="facts.${i}.label" value="${esc(f.label)}" placeholder="Label" aria-label="Fact ${i + 1} label"><input class="input" data-path="facts.${i}.value" value="${esc(f.value)}" placeholder="Value" aria-label="Fact ${i + 1} value"></div><div class="tools">${itemTools('facts', i, c.facts.length)}</div></div>`,
                  )
                  .join('')}</div>
                ${(c.facts || []).length < 4 ? `<button type="button" class="btn sm add-row" data-add="facts">${icon('plus')}Add fact</button>` : ''}
              </div>
              ${imageField(c, 'hero_image', 'Main image', 'Wide image under the title. Without one, a placeholder shows.')}
            </div>
          </section>

          <section class="sec" id="s-story">
            <div class="sec-head"><div><h3>Story</h3><p>Sections 01 and 02 of the page.</p></div></div>
            <div class="stack">
              ${input(c, 'client', '01 · The client', { area: true, rows: 4 })}
              ${input(c, 'needed', '02 · What they needed', { area: true, rows: 3 })}
              ${input(c, 'needed_muted', 'Grey ending', { small: 'optional', hint: 'Added after “What they needed” in grey.' })}
            </div>
          </section>

          <section class="sec" id="s-built">
            <div class="sec-head"><div><h3>03 · What we built</h3><p>Numbered features, plus an optional Stack section.</p></div></div>
            <div class="stack">
              <div class="repeat">${(c.features || [])
                .map(
                  (f, i) => `<div class="item"><span class="n">${String(i + 1).padStart(2, '0')}</span><div class="fields"><input class="input" data-path="features.${i}.title" value="${esc(f.title)}" placeholder="Feature title" aria-label="Feature ${i + 1} title"><textarea class="textarea" data-path="features.${i}.text" rows="2" placeholder="One line about it" aria-label="Feature ${i + 1} text">${esc(f.text)}</textarea></div><div class="tools">${itemTools('features', i, c.features.length)}</div></div>`,
                )
                .join('')}</div>
              <button type="button" class="btn sm add-row" data-add="features">${icon('plus')}Add feature</button>
              <div class="field"><span class="label">04 · Stack <small>optional, hidden when empty</small></span>
                <div class="tags" data-tags>${(c.stack || []).map((s, i) => `<span>${esc(s)}<button type="button" data-untag="${i}" aria-label="Remove ${esc(s)}">${icon('x')}</button></span>`).join('')}<input placeholder="Type and press Enter, e.g. Next.js" aria-label="Add to stack"></div>
              </div>
            </div>
          </section>

          <section class="sec" id="s-screens">
            <div class="sec-head"><div><h3>Screenshots</h3><p>Up to 3 under “What we built”. The third shows as a phone.</p></div></div>
            <div class="stack">
              <div class="repeat">${(c.screens || [])
                .map(
                  (s, i) => `<div class="item"><span class="n">${i + 1}</span><div class="fields"><input class="input" data-path="screens.${i}.label" value="${esc(s.label)}" placeholder="What the screenshot shows" aria-label="Screenshot ${i + 1} label">${imageField(c, `screens.${i}.image`, '', i === 2 ? 'Tall phone screenshot' : 'Screenshot')}</div><div class="tools">${itemTools('screens', i, c.screens.length)}</div></div>`,
                )
                .join('')}</div>
              ${(c.screens || []).length < 3 ? `<button type="button" class="btn sm add-row" data-add="screens">${icon('plus')}Add screenshot</button>` : ''}
            </div>
          </section>

          <section class="sec" id="s-quote">
            <div class="sec-head"><div><h3>Client quote</h3><p>Only use a real quote the client approved. Leave it empty to hide it.</p></div></div>
            <div class="stack">
              ${input(c, 'quote.text', 'Quote', { area: true, rows: 3 })}
              <div class="grid3">
                ${input(c, 'quote.name', 'Name')}
                ${input(c, 'quote.role', 'Role, company')}
                ${input(c, 'quote.initials', 'Initials', { placeholder: initials(c.quote?.name || c.name) || 'DA', small: 'circle' })}
              </div>
            </div>
          </section>

          <section class="sec" id="s-seo">
            <div class="sec-head"><div><h3>Google description</h3><p>Shown under the page title in search results. About 150 characters.</p></div></div>
            ${input(c, 'seo_description', 'Description', { area: true, rows: 2, small: `<span data-count>${(c.seo_description || '').length}</span>/160` })}
          </section>
        </form>

        <aside class="preview">
          <div class="preview-bar">
            <div class="seg" role="group" aria-label="Preview"><button type="button" data-mode="page" aria-pressed="${state.previewMode === 'page'}">Page</button><button type="button" data-mode="card" aria-pressed="${state.previewMode === 'card'}">Card</button></div>
            <div class="seg" role="group" aria-label="Device" ${state.previewMode === 'card' ? 'hidden' : ''}><button type="button" data-device="desktop" aria-pressed="${state.device === 'desktop'}">Desktop</button><button type="button" data-device="mobile" aria-pressed="${state.device === 'mobile'}">Phone</button></div>
          </div>
          <div data-preview></div>
        </aside>
      </div>
    </div>`,
  );
  bindShell();
  bindCase(c, isNew);
  renderPreview(c, true);
}

const itemTools = (list, i, n) =>
  `<button type="button" class="btn sm ghost icon" data-move="${list}.${i}.-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${icon('up')}</button><button type="button" class="btn sm ghost icon" data-move="${list}.${i}.1" ${i === n - 1 ? 'disabled' : ''} aria-label="Move down">${icon('down')}</button><button type="button" class="btn sm ghost icon danger" data-remove="${list}.${i}" aria-label="Remove">${icon('trash')}</button>`;

function bindCase(c, isNew) {
  const form = $('#case-form');
  if (isNew) slugTouched.delete(c);
  else slugTouched.add(c);
  const rerender = () => {
    const y = scrollY;
    renderCase(c);
    window.scrollTo(0, y);
  };

  form.addEventListener('input', (e) => {
    const el = e.target;
    const path = el.dataset.path;
    if (!path) return;
    let v = el.dataset.bool !== undefined ? el.checked : el.value;
    if (el.dataset.slug !== undefined) {
      v = slugify(v);
      slugTouched.add(c);
    }
    set(c, path, v);
    if (path === 'name') {
      if (!slugTouched.has(c)) {
        c.slug = slugify(v) || c.slug;
        $('#f-slug').value = c.slug;
      }
      $('.top h1').textContent = v || 'New case study';
    }
    if (path === 'name' || path === 'slug') $('.top .sub').textContent = `Page: /case-study-${c.slug}`;
    if (path === 'seo_description') $('[data-count]').textContent = v.length;
    updateDirty();
    renderPreview(c);
  });
  $('#f-slug').addEventListener('blur', (e) => {
    if (!e.target.value) e.target.value = c.slug;
  });

  form.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    const rm = e.target.closest('[data-remove]');
    const mv = e.target.closest('[data-move]');
    if (add) {
      const list = add.dataset.add;
      c[list] = c[list] || [];
      c[list].push(list === 'facts' ? { label: '', value: '' } : list === 'features' ? { title: '', text: '' } : { label: '', image: '' });
      updateDirty();
      rerender();
    }
    if (rm) {
      const [list, i] = rm.dataset.remove.split('.');
      c[list].splice(Number(i), 1);
      updateDirty();
      rerender();
    }
    if (mv) {
      const [list, i, d] = mv.dataset.move.split('.');
      const a = Number(i);
      const b = a + Number(d);
      [c[list][a], c[list][b]] = [c[list][b], c[list][a]];
      updateDirty();
      rerender();
    }
    const untag = e.target.closest('[data-untag]');
    if (untag) {
      c.stack.splice(Number(untag.dataset.untag), 1);
      updateDirty();
      rerender();
    }
  });

  const tagInput = $('[data-tags] input');
  $('[data-tags]').addEventListener('click', () => tagInput.focus());
  tagInput.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.value.trim()) {
      e.preventDefault();
      c.stack = [...(c.stack || []), tagInput.value.trim()];
      updateDirty();
      rerender();
      $('[data-tags] input').focus();
    }
    if (e.key === 'Backspace' && !tagInput.value && c.stack?.length) {
      c.stack.pop();
      updateDirty();
      rerender();
      $('[data-tags] input').focus();
    }
  });

  $$('[data-image]').forEach((drop) => {
    const path = drop.dataset.image;
    const file = $('input[type=file]', drop);
    const go = async (f) => {
      if (!f) return;
      if (!f.type.startsWith('image/')) return toast('Please choose an image file.', 'err');
      drop.classList.add('loading');
      try {
        set(c, path, await upload(f));
        updateDirty();
        rerender();
      } catch (x) {
        toast(esc(x.message), 'err', 7000);
        drop.classList.remove('loading');
      }
    };
    drop.addEventListener('click', (e) => {
      if (e.target.closest('[data-pick]')) file.click();
      if (e.target.closest('[data-clear-img]')) {
        set(c, path, '');
        updateDirty();
        rerender();
      }
    });
    file.addEventListener('change', () => go(file.files[0]));
    drop.addEventListener('dragover', (e) => (e.preventDefault(), drop.classList.add('over')));
    drop.addEventListener('dragleave', () => drop.classList.remove('over'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('over');
      go(e.dataTransfer.files[0]);
    });
  });

  $('[data-del]').addEventListener('click', async () => {
    const ok = await confirmBox({
      title: `Delete ${esc(c.name || 'this case study')}?`,
      text: 'Its card and page come off the site when you save. You can’t undo this from here.',
    });
    if (!ok) return;
    state.cases.splice(state.cases.indexOf(c), 1);
    location.hash = '#/cases';
    updateDirty();
    toast('Deleted. Click Save changes to take it off the site.');
  });

  $$('[data-mode]').forEach((b) =>
    b.addEventListener('click', () => {
      state.previewMode = b.dataset.mode;
      $$('[data-mode]').forEach((x) => x.setAttribute('aria-pressed', x === b));
      $('[aria-label="Device"]').hidden = state.previewMode === 'card';
      renderPreview(c, true);
    }),
  );
  $$('[data-device]').forEach((b) =>
    b.addEventListener('click', () => {
      state.device = b.dataset.device;
      $$('[data-device]').forEach((x) => x.setAttribute('aria-pressed', x === b));
      renderPreview(c, true);
    }),
  );
}

// ---------- Live preview ----------
let previewTimer;
function previewHtml(c) {
  return renderCasePage(state.templates.case, c)
    .replace(/<script[^>]*main\.js[^>]*><\/script>/, '')
    .replace('</head>', '<base target="_blank"><style>.loader{display:none!important}html{scroll-behavior:auto}</style></head>');
}
function cardHtml(c) {
  const head = state.templates.case.split('<body>')[0];
  // Until an image is uploaded, show a placeholder of the same size
  const ph = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="604" height="415"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#19C2FF"/><stop offset=".55" stop-color="#2D5BFF"/><stop offset="1" stop-color="#6B3BF5"/></linearGradient></defs><rect width="604" height="415" fill="url(#g)"/><text x="302" y="214" fill="#fff" font-family="sans-serif" font-size="20" text-anchor="middle" opacity=".85">Card image</text></svg>')}`;
  const card = { ...c, show_on_work: true, card_image: c.card_image || ph };
  return `${head.replace('</head>', '<base target="_blank"><style>body{background:transparent;margin:0}.work-grid{display:block;padding:0;margin:0}.wcard{width:100%!important;margin:0!important}</style></head>')}<body><div class="work-grid">${workGrid([card])}</div></body></html>`;
}

function renderPreview(c, now = false) {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => paintPreview(c), now ? 0 : 250);
}

function paintPreview(c) {
  const box = $('[data-preview]');
  if (!box) return;
  if (state.previewMode === 'card') {
    box.innerHTML = '<div class="card-preview"><iframe title="Card preview" scrolling="no"></iframe></div>';
    const f = $('iframe', box);
    f.addEventListener('load', () => (f.style.height = f.contentDocument.documentElement.scrollHeight + 'px'));
    f.srcdoc = cardHtml(c);
    return;
  }
  const mobile = state.device === 'mobile';
  let frame = $('.frame', box);
  if (!frame || frame.classList.contains('mobile') !== mobile) {
    box.innerHTML = `<div class="frame${mobile ? ' mobile' : ''}"><div class="chrome"><i></i><i></i><i></i><span>noveralabs · /case-study-${esc(c.slug)}</span></div><div class="viewport"><iframe title="Page preview"></iframe></div></div>`;
    frame = $('.frame', box);
  }
  $('.chrome span', frame).textContent = `noveralabs · /case-study-${c.slug}`;
  const vp = $('.viewport', frame);
  const old = $('iframe', vp);
  const y = old?.contentWindow?.scrollY || 0;
  const width = mobile ? vp.clientWidth : 1280;
  const scale = vp.clientWidth / width;
  const f = document.createElement('iframe');
  f.title = 'Page preview';
  f.style.cssText = `width:${width}px;height:${vp.clientHeight / scale}px;transform:scale(${scale});visibility:hidden`;
  f.addEventListener('load', () => {
    f.contentWindow.scrollTo(0, y);
    f.style.visibility = '';
    $$('iframe', vp).forEach((x) => x !== f && x.remove());
  });
  f.srcdoc = previewHtml(c);
  vp.append(f);
}

// ---------- More we've built ----------
function renderMore() {
  app.className = '';
  app.innerHTML = shell(
    'more',
    `${topBar('More we’ve built', 'The list under the project grid on the Work page. A row with a PDF opens it in a new tab.', `<button class="btn dark" data-add-more>${icon('plus')}Add project</button>`)}
    <div class="page">
      ${storageBanner()}
      <div class="rows">${state.more
        .map(
          (r, i) => `<div class="row" data-i="${i}">
          <button class="grip" draggable="true" title="Drag to reorder" aria-label="Drag to reorder">${icon('grip')}</button>
          <span class="num">${String(i + 1).padStart(2, '0')}</span>
          <div class="f">
            <input class="input" data-k="title" value="${esc(r.title)}" placeholder="Project title" aria-label="Title">
            <input class="input" data-k="tag" value="${esc(r.tag)}" placeholder="Tag, e.g. Media" aria-label="Tag">
            <input class="input wide" data-k="line" value="${esc(r.line)}" placeholder="One line about it" aria-label="Description">
            <div class="pdf">${
              r.pdf
                ? `<a class="pdf-pill" href="${esc(imgUrl(r.pdf))}" target="_blank" rel="noopener">${icon('file')}${esc(fileName(r.pdf))}</a><button class="btn sm" data-pdf>${icon('upload')}Replace PDF</button><button class="btn sm ghost danger" data-nopdf>Remove PDF</button>`
                : `<span class="pdf-none">No PDF yet, so the row isn’t clickable.</span><button class="btn sm" data-pdf>${icon('upload')}Upload PDF</button>`
            }<input type="file" accept="application/pdf" hidden><span class="busy-pdf" hidden><span class="spin"></span>Uploading</span></div>
          </div>
          <div class="end"><button class="btn sm ghost icon" data-mv="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${icon('up')}</button><button class="btn sm ghost icon" data-mv="1" ${i === state.more.length - 1 ? 'disabled' : ''} aria-label="Move down">${icon('down')}</button><button class="btn sm ghost icon danger" data-rm aria-label="Delete">${icon('trash')}</button></div>
        </div>`,
        )
        .join('')}</div>
      ${state.more.length ? '' : '<div class="empty-state">Nothing here yet.</div>'}
    </div>`,
  );
  bindShell();
  const rows = $('.rows');
  const rerender = () => {
    const y = scrollY;
    renderMore();
    window.scrollTo(0, y);
  };
  $('[data-add-more]').addEventListener('click', () => {
    state.more.push({ slug: `project-${Date.now().toString(36)}`, title: '', tag: '', line: '', pdf: '' });
    updateDirty();
    rerender();
    $$('.row input[data-k="title"]').pop().focus();
  });
  rows.addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    const r = state.more[Number(e.target.closest('.row').dataset.i)];
    r[k] = e.target.value;
    if (k === 'title' && /^project-/.test(r.slug || '')) r.slug = slugify(r.title) || r.slug;
    updateDirty();
  });
  rows.addEventListener('click', async (e) => {
    const row = e.target.closest('.row');
    if (!row) return;
    const i = Number(row.dataset.i);
    const r = state.more[i];
    if (e.target.closest('[data-mv]')) {
      move(state.more, i, i + Number(e.target.closest('[data-mv]').dataset.mv), rerender);
      updateDirty();
    }
    if (e.target.closest('[data-rm]')) {
      if (!(await confirmBox({ title: `Delete “${esc(r.title || 'this project')}”?`, text: 'It comes off the Work page when you save.' }))) return;
      state.more.splice(i, 1);
      updateDirty();
      rerender();
    }
    if (e.target.closest('[data-nopdf]')) {
      r.pdf = '';
      updateDirty();
      rerender();
    }
    if (e.target.closest('[data-pdf]')) $('input[type=file]', row).click();
  });
  rows.addEventListener('change', async (e) => {
    if (e.target.type !== 'file') return;
    const row = e.target.closest('.row');
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') return toast('Please choose a PDF file.', 'err');
    $('.busy-pdf', row).hidden = false;
    try {
      state.more[Number(row.dataset.i)].pdf = await upload(f);
      updateDirty();
      rerender();
      toast('PDF attached. Save changes to put it on the site.');
    } catch (x) {
      toast(esc(x.message), 'err', 7000);
      $('.busy-pdf', row).hidden = true;
    }
  });
  sortable(rows, '.row', 'drop-target', (from, to) => {
    move(state.more, from, to, rerender);
    updateDirty();
  });
}

// ---------- Start ----------
load().catch((x) => {
  if (x.message !== 'signed-out') renderLogin(x.message === 'Please sign in.' ? '' : x.message);
});
