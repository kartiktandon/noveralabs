// Small interactions: chips, FAQ, work preview, filters, goal picker, quote form.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (location.pathname.endsWith('.html')) history.replaceState(null, '', (location.pathname === '/index.html' ? '/' : location.pathname.slice(0, -5)) + location.search + location.hash);

  // Every page opens at the top, unless the link points at a section (#...).
  // scrollIntoView also moves any outer frame the site is shown in (previews, embeds).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function toTop() {
    if (location.hash) return;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    var first = document.body.firstElementChild;
    if (first && first.scrollIntoView) first.scrollIntoView({ block: 'start', behavior: 'instant' });
    root.style.scrollBehavior = '';
  }
  toTop();

  // Loader: hide once the page has loaded, show again while leaving for another page
  function done() { root.classList.add('loaded'); root.classList.remove('leaving'); toTop(); }
  if (document.readyState === 'complete') done(); else window.addEventListener('load', done);
  setTimeout(function () { root.classList.add('loaded'); }, 2500);
  window.addEventListener('pageshow', function (e) { if (e.persisted) done(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (!href.startsWith('/') || href === location.pathname) return;
    e.preventDefault();
    root.classList.add('leaving');
    setTimeout(function () { location.href = a.href; }, reduce ? 0 : 220);
  });

  // Scroll reveal: sections and cards fade up as they come into view
  if (!reduce && 'IntersectionObserver' in window) {
    var sel = ['.hero > *', '.svc-hero > div > *', '.svc-hero .svc-art', '.case-top > *', '.contact-top > *', '.clients', '.clients-band', '.promises > *',
      '.sec .stack', '.sec .head-row > p', '.svc-card', '.wcard', '.combo', '.inc > div', '.gets > div', '.tech > div', '.app-card',
      '.row-item', '.more-row', '.faq-item', '.timeline li', '.statement p', '.quote-card', '.home-pricing .band', '.tcard', '.phone',
      '.picker .band', '.pay-band .band', '.psteps li', '.terms > div', '.case-media', '.story', '.feat', '.shots > div', '.stack-chips',
      '.case-quote', '.all-projects', '.c-card', '.next-steps li', '.others', '.cta .copy', '.cta .form-wrap', '.work-list', '.work-preview',
      '.bhead > *', '.bfeat', '.bcard', '.btopics', '.bcats'];
    var els = document.querySelectorAll(sel.join(','));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--d', Math.min(sib, 6) * 0.07 + 's');
      io.observe(el);
    });
    root.classList.add('anim');
  }

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    var setMenu = function (open) {
      document.documentElement.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    document.querySelectorAll('.mobile-menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  // Single-select chip groups
  document.querySelectorAll('[data-single]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || !group.contains(b)) return;
      group.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      group.dispatchEvent(new CustomEvent('pick', { detail: b }));
    });
  });

  // FAQ accordions: one open at a time per list
  document.querySelectorAll('.faq-item button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = !item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function (x) {
        x.classList.remove('open');
        x.querySelector('button').setAttribute('aria-expanded', 'false');
      });
      if (open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  // Home: selected work list drives the preview
  var list = document.querySelector('[data-work-list]');
  if (list) {
    var show = function (b) {
      list.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var p = document.querySelector('[data-work-preview]');
      p.querySelector('[data-url]').textContent = b.dataset.url;
      p.querySelector('[data-line]').textContent = b.dataset.line;
      var img = p.querySelector('[data-img]');
      img.src = b.dataset.img; img.alt = b.dataset.name;
      p.querySelector('[data-link]').href = b.dataset.href || '/work';
    };
    list.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { show(b); });
      b.addEventListener('mouseenter', function () { show(b); });
    });
  }

  // Blog post: highlight the section being read in "On this page"
  var toc = document.querySelectorAll('.bleft .btoc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var heads = Array.prototype.map.call(toc, function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var mark = function (id) { toc.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + id); }); };
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) mark(en.target.id); });
    }, { rootMargin: '0px 0px -70% 0px' });
    heads.forEach(function (h) { tio.observe(h); });
  }

  // Blog post: copy link
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { b.classList.add('done'); b.setAttribute('aria-label', 'Link copied'); setTimeout(function () { b.classList.remove('done'); b.setAttribute('aria-label', 'Copy link'); }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, function () {});
    });
  });

  // Work: filters
  var filters = document.querySelector('[data-filters]');
  if (filters) {
    filters.addEventListener('pick', function (e) {
      var f = e.detail.textContent.trim();
      document.querySelectorAll('[data-type]').forEach(function (card) {
        card.hidden = !(f === 'All' || card.dataset.type === f);
      });
    });
  }

  // Services: goal picker
  var goals = document.querySelector('[data-goals]');
  if (goals) {
    goals.addEventListener('pick', function (e) {
      var b = e.detail, box = document.querySelector('[data-rec]');
      box.querySelector('[data-t]').textContent = b.dataset.t;
      box.querySelector('[data-why]').textContent = b.dataset.why;
      box.querySelector('[data-pair]').textContent = b.dataset.pair;
      box.querySelector('[data-short]').textContent = 'See ' + b.dataset.short;
      if (b.dataset.href) box.querySelector('[data-rec-link]').href = b.dataset.href;
    });
  }

  // Quote form: basic validation and a thank-you state
  document.querySelectorAll('.quote-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (i) {
        var bad = !i.value.trim();
        i.style.borderColor = bad ? '#E0386B' : '';
        if (bad) ok = false;
      });
      if (!ok) return;
      // Send the enquiry to /api/leads; it shows up under Leads in /admin
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v); });
      form.querySelectorAll('[data-single][data-name]').forEach(function (g) {
        var b = g.querySelector('[aria-pressed="true"]');
        data[g.dataset.name] = b ? b.textContent.trim() : '';
      });
      data.page = location.pathname;
      data.website = (form.querySelector('[name="website"]') || {}).value || '';
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || 'failed'); }); })
        .then(function () { form.classList.add('sent'); })
        .catch(function () {
          if (btn) btn.disabled = false;
          var msg = 'Hi Novera Labs, I\'m ' + (data.name || '') + ' (' + (data.phone || '') + '). I want to build: ' + (data.type || '') + '. ' + (data.message || '');
          var fine = form.querySelector('.fine');
          if (fine) fine.innerHTML = 'That didn\'t go through. Please <a href="https://wa.me/919870443265?text=' + encodeURIComponent(msg) + '" style="color:inherit;font-weight:500">send it on WhatsApp</a> instead.';
        });
    });
  });
  // Phone video autoplay muted + sound toggle + play/pause
  document.querySelectorAll('.phone .screen.has-video').forEach(function (screen) {
    var vid = screen.querySelector('video');
    var soundBtn = screen.querySelector('.sound-toggle');
    var playIcon = screen.querySelector('.play');
    if (!vid) return;

    // Ensure it starts muted and attempts autoplay
    vid.muted = true;
    function tryPlay() {
      var p = vid.play();
      if (p !== undefined) {
        p.then(function () {
          screen.classList.add('is-playing');
        }).catch(function () {});
      }
    }
    tryPlay();

    // In case the browser delays autoplay until in viewport
    if ('IntersectionObserver' in window) {
      var vObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && vid.paused) {
            tryPlay();
          }
        });
      }, { threshold: 0.2 });
      vObs.observe(screen);
    }

    // Toggle mute/unmute
    if (soundBtn) {
      soundBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        vid.muted = !vid.muted;
        var iconMuted = soundBtn.querySelector('.icon-muted');
        var iconUnmuted = soundBtn.querySelector('.icon-unmuted');
        var soundText = soundBtn.querySelector('.sound-text');
        if (vid.muted) {
          soundBtn.classList.remove('is-unmuted');
          if (iconMuted) iconMuted.style.display = '';
          if (iconUnmuted) iconUnmuted.style.display = 'none';
          if (soundText) soundText.textContent = 'Unmute';
          soundBtn.setAttribute('aria-label', 'Unmute video');
        } else {
          soundBtn.classList.add('is-unmuted');
          if (iconMuted) iconMuted.style.display = 'none';
          if (iconUnmuted) iconUnmuted.style.display = '';
          if (soundText) soundText.textContent = 'Mute';
          soundBtn.setAttribute('aria-label', 'Mute video');
        }
      });
    }

    // Click on screen to pause/resume
    screen.addEventListener('click', function (e) {
      if (e.target.closest('.sound-toggle')) return;
      if (vid.paused) {
        vid.play();
      } else {
        vid.pause();
      }
    });

    vid.addEventListener('play', function () {
      screen.classList.add('is-playing');
      if (playIcon) playIcon.style.display = 'none';
    });
    vid.addEventListener('pause', function () {
      screen.classList.remove('is-playing');
      if (playIcon) playIcon.style.display = 'flex';
    });
  });
})();
