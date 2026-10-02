/* Hotel Engel Hamburg — motion layer
   1. Page transitions: a green curtain closes over the page, the next page opens beneath it.
   2. Scroll: headings rise word by word, images unveil, hero and image bands drift (parallax),
      figures count up, a thin brass line shows reading progress. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const curtain = document.querySelector('.curtain');

  /* ---------- 1. Page transitions ---------- */
  const OUT_MS = 520;
  const isInternal = (a) => {
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.dataset.openBooking !== undefined || a.dataset.openSearch !== undefined) return false;
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/i.test(href)) return false;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname) return false; // same page: let anchors scroll
    return /\.html?$|\/$/.test(url.pathname);
  };

  const leave = (href) => {
    try { sessionStorage.setItem('pt', '1'); } catch (_) {}
    root.classList.add('pt-leaving');
    setTimeout(() => { location.href = href; }, reduced ? 0 : OUT_MS);
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a');
    if (!isInternal(a)) return;
    e.preventDefault();
    leave(a.href);
  });

  // Search results navigate via location.href — route them through the curtain too
  window.engelNavigate = (href) => {
    const url = new URL(href, location.href);
    if (url.pathname === location.pathname) { location.href = href; return; }
    leave(url.href);
  };

  const enter = () => {
    if (!root.classList.contains('pt-enter')) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.classList.add('pt-entering');
      setTimeout(() => root.classList.remove('pt-enter', 'pt-entering'), 900);
    }));
  };
  enter();
  // Coming back via the browser's back button restores a frozen page: open the curtain again
  addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('pt-leaving', 'pt-enter', 'pt-entering'); });

  if (reduced) return;

  /* ---------- 2a. Headings rise word by word ---------- */
  const splitWords = (el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.append(document.createTextNode(p)); return; }
            const w = document.createElement('span'); w.className = 'w';
            const inner = document.createElement('span'); inner.textContent = p; inner.style.setProperty('--i', i++);
            w.append(inner); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    el.classList.add('words');
  };
  const heads = $$('main h2, .page-hero h1').filter(h => !h.closest('dialog, .egg, .cta-band, .know'));
  heads.forEach(splitWords);

  /* ---------- 2b. Images unveil as they enter ---------- */
  const unveil = $$('.intro-media img, .room-card .media, .dine .media, .split-media, .room-gallery, .location-media > img, .quote-media, .ev-img');
  unveil.forEach(el => el.classList.add('unveil'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  [...heads, ...unveil].forEach(el => io.observe(el));

  /* ---------- 2c. Figures count up ---------- */
  const counters = $$('.fact .num');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const node = [...e.target.childNodes].find(n => n.nodeType === 3 && /\d/.test(n.textContent));
      if (!node) return;
      const end = parseInt(node.textContent, 10);
      const start = end > 1000 ? end - 40 : 0; // a year counts only its last stretch
      const dur = 1400, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        node.textContent = String(Math.round(start + (end - start) * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => countIO.observe(el));

  /* ---------- 2d. Parallax + reading progress ---------- */
  const heroImg = document.querySelector('.hero-media img');
  const bands = $$('.cta-band > img');
  const bar = document.querySelector('.progress');
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    if (heroImg && y < vh * 1.2) heroImg.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.06)`;
    bands.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 around the viewport centre
      img.style.transform = `translate3d(0, ${p * -60}px, 0) scale(1.15)`;
    });
    if (bar) {
      const max = document.documentElement.scrollHeight - vh;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
})();
