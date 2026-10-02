/* Hotel Engel Hamburg — site behaviour */
(() => {
  document.documentElement.classList.add('js');

  // The current site's booking engine (Viato CBE) reads arrival/departure as DD.MM.YYYY.
  const BOOKING_URL = 'https://www.hotel-engel-hamburg.de/buchen/';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: transparent over hero, solid on scroll, hides on scroll down ---------- */
  const header = $('.site-header');
  const subnav = $('.subnav');
  const hasHero = !!$('.hero');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    if (hasHero) header.classList.toggle('is-solid', y > 40);
    const hide = y > 500 && y > lastY && !document.body.classList.contains('menu-open');
    header.classList.toggle('is-hidden', hide);
    if (subnav) subnav.classList.toggle('header-gone', hide);
    lastY = y;
    const mb = $('.mobile-book');
    if (mb) mb.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  };
  if (!hasHero) header.classList.add('is-plain');
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const panel = $('.menu-panel');
  const openMenu = (open) => {
    panel.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    $('.menu-toggle').setAttribute('aria-expanded', String(open));
    if (open) $('.menu-close', panel).focus();
  };
  $('.menu-toggle')?.addEventListener('click', () => openMenu(true));
  $('.menu-close', panel)?.addEventListener('click', () => openMenu(false));
  $$('a', panel).forEach(a => a.addEventListener('click', () => openMenu(false)));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Room rail arrows ---------- */
  $$('[data-rail]').forEach(nav => {
    const rail = $(nav.dataset.rail);
    const step = () => rail.firstElementChild.getBoundingClientRect().width + 24;
    $('[data-dir="prev"]', nav).addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }));
    $('[data-dir="next"]', nav).addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }));
  });

  /* ---------- Booking ---------- */
  const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const DOW = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
  const pad = n => String(n).padStart(2, '0');
  const fmtShort = d => `${WD[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()].slice(0, 3)}`;
  const fmtParam = d => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  const nights = (a, b) => Math.round((b - a) / 864e5);

  function initBooking(form) {
    const cal = $('.cal', form);
    const outA = $('[data-out="arrival"]', form);
    const outD = $('[data-out="departure"]', form);
    const triggers = $$('[data-cal]', form);
    let start = null, end = null, view = new Date(today.getFullYear(), today.getMonth(), 1), picking = 'arrival';

    const render = () => {
      const months = [0, 1].map(o => new Date(view.getFullYear(), view.getMonth() + o, 1));
      $('.cal-months', cal).innerHTML = months.map(m => {
        const first = (m.getDay() + 6) % 7;
        const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
        let cells = DOW.map(d => `<span class="dow">${d}</span>`).join('');
        cells += '<span></span>'.repeat(first);
        for (let i = 1; i <= days; i++) {
          const d = new Date(m.getFullYear(), m.getMonth(), i);
          const cls = ['cal-day'];
          if (sameDay(d, today)) cls.push('is-today');
          if (sameDay(d, start)) cls.push('is-start');
          if (sameDay(d, end)) cls.push('is-end');
          if (start && end && d > start && d < end) cls.push('in-range');
          const label = `${i}. ${MONTHS[m.getMonth()]} ${m.getFullYear()}`;
          cells += `<button type="button" class="${cls.join(' ')}" data-t="${d.getTime()}" aria-label="${label}" ${d < today ? 'disabled' : ''}>${i}</button>`;
        }
        return `<div class="cal-month"><h4>${MONTHS[m.getMonth()]} ${m.getFullYear()}</h4><div class="cal-grid">${cells}</div></div>`;
      }).join('');
      $('[data-cal-prev]', cal).disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
      $('.cal-head p', cal).textContent = picking === 'arrival' ? 'Wählen Sie Ihren Anreisetag' : 'Wählen Sie Ihren Abreisetag';
      const n = start && end ? nights(start, end) : 0;
      $('[data-nights]', cal).textContent = n ? `${n} ${n === 1 ? 'Nacht' : 'Nächte'}` : '';
      outA.textContent = start ? fmtShort(start) : 'Datum wählen';
      outD.textContent = end ? fmtShort(end) : 'Datum wählen';
      outA.classList.toggle('is-empty', !start);
      outD.classList.toggle('is-empty', !end);
    };

    const open = (which) => {
      picking = which === 'departure' && start ? 'departure' : 'arrival';
      if (start) view = new Date(start.getFullYear(), start.getMonth(), 1);
      render();
      cal.classList.add('is-open');
      triggers.forEach(t => t.setAttribute('aria-expanded', String(t.dataset.cal === picking)));
    };
    const close = () => { cal.classList.remove('is-open'); triggers.forEach(t => t.setAttribute('aria-expanded', 'false')); };

    triggers.forEach(t => t.addEventListener('click', (e) => { e.stopPropagation(); cal.classList.contains('is-open') && t.getAttribute('aria-expanded') === 'true' ? close() : open(t.dataset.cal); }));
    cal.addEventListener('click', (e) => {
      e.stopPropagation();
      const b = e.target.closest('.cal-day');
      if (!b || b.disabled) return;
      const d = new Date(+b.dataset.t);
      if (picking === 'arrival' || (start && d <= start)) {
        start = d; end = null; picking = 'departure';
      } else {
        end = d;
        render();
        setTimeout(close, 260);
        return;
      }
      triggers.forEach(t => t.setAttribute('aria-expanded', String(t.dataset.cal === picking)));
      render();
    });
    $('[data-cal-prev]', cal).addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
    $('[data-cal-next]', cal).addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });
    $('[data-cal-reset]', cal).addEventListener('click', () => { start = end = null; picking = 'arrival'; render(); });
    document.addEventListener('click', (e) => { if (!form.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const sel = $('select', form);
    if (sel) sel.addEventListener('change', () => { $('[data-out="guests"]', form).textContent = sel.selectedOptions[0].textContent; });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!start) return open('arrival');
      if (!end) return open('departure');
      const url = `${BOOKING_URL}?arrival=${fmtParam(start)}&departure=${fmtParam(end)}`;
      window.location.href = url;
    });
    render();
  }
  $$('[data-booking]').forEach(initBooking);

  /* Booking dialog — reachable from every page */
  const dlg = $('#book-dialog');
  if (dlg) {
    $$('[data-open-booking]').forEach(b => b.addEventListener('click', (e) => {
      e.preventDefault();
      const room = b.dataset.room;
      $('[data-room-note]', dlg).textContent = room ? `Ihr Zimmerwunsch: ${room}` : 'Direkt beim Hotel buchen und 5 % sparen.';
      dlg.showModal();
    }));
    $('.dlg-close', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- Rooms subnav: highlight the category in view ---------- */
  if (subnav) {
    const links = $$('a', subnav);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(l => { const t = $(l.getAttribute('href')); if (t) spy.observe(t); });
  }

  /* ---------- Easter egg: Familie Engel ---------- */
  const egg = $('#egg');
  if (egg) {
    const openEgg = () => { egg.hidden = false; requestAnimationFrame(() => egg.classList.add('is-open')); document.body.style.overflow = 'hidden'; $('.egg-close', egg).focus(); };
    const closeEgg = () => { egg.classList.remove('is-open'); document.body.style.overflow = ''; setTimeout(() => { egg.hidden = true; }, 500); };
    $$('[data-egg]').forEach(b => b.addEventListener('click', openEgg));
    $('.egg-close', egg).addEventListener('click', closeEgg);
    egg.addEventListener('click', e => { if (e.target === egg) closeEgg(); });
    // Typing "engel" anywhere on the page also opens it
    let typed = '';
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !egg.hidden) return closeEgg();
      if (e.key.length !== 1 || e.target.closest('input, textarea, select')) return;
      typed = (typed + e.key.toLowerCase()).slice(-5);
      if (typed === 'engel' && egg.hidden) openEgg();
    });
  }

  /* ---------- Deep links into the A–Z (from search) ---------- */
  const openFromHash = () => {
    const el = location.hash && document.getElementById(location.hash.slice(1));
    if (el && el.tagName === 'DETAILS') {
      el.open = true;
      el.classList.add('is-flash');
      setTimeout(() => el.classList.remove('is-flash'), 1800);
      requestAnimationFrame(() => el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }));
    }
  };
  addEventListener('hashchange', openFromHash);
  openFromHash();

  /* ---------- Lightbox ---------- */
  const lb = $('.lightbox');
  if (lb) {
    let set = [], idx = 0;
    const img = $('img', lb), count = $('.lb-count', lb);
    const show = () => { img.src = set[idx].dataset.full; img.alt = $('img', set[idx]).alt; count.textContent = `${idx + 1} / ${set.length}`; };
    $$('[data-full]').forEach(b => b.addEventListener('click', () => {
      set = $$('[data-full]', b.closest('[data-gallery]'));
      idx = set.indexOf(b); show();
      lb.classList.add('is-open'); document.body.style.overflow = 'hidden';
      $('.lb-close', lb).focus();
    }));
    const closeLb = () => { lb.classList.remove('is-open'); document.body.style.overflow = ''; };
    const step = d => { idx = (idx + d + set.length) % set.length; show(); };
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', () => step(-1));
    $('.lb-next', lb).addEventListener('click', () => step(1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    let x0 = null;
    lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); x0 = null; });
  }
})();
