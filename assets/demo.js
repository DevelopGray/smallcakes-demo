/* Shared demo behaviour for all three concept sites. Classic script.
   Exposes window.SCDemo and auto-wires anything with the data-* hooks below.
   Nothing hits a real backend — it "acts like it works" and logs intent.

   Markup contracts (each site styles the classes however it likes):
   • [data-order]            → button opens the Square handoff modal.
                               optional data-order="Flavor" prefills the item.
   • [data-status]           → filled with a live Open/Closed pill.
   • [data-todays-flavors]   → filled with today's rotating picks.
   • [data-flavors="signature|icecream|seasonal"] → filled with that list.
   • [data-menu]             → container; [data-filter="key"] buttons filter
                               children [data-cat="key"].
   • [data-custom-form]      → <form> with [data-step] sections, [data-next],
                               [data-prev], [data-progress]; submit → ref #.
   • FAQ uses native <details> — no JS needed.
   Append ?selfcheck to any page URL to run the logic asserts in the console. */
window.SCDemo = (function () {
  const SC = window.SC;

  function track(event, detail = {}) { console.log(`[demo] ${event}`, detail); }

  // Deterministic per-day index so "today's flavors" are stable within a day.
  function daySeed() {
    const n = new Date();
    return n.getFullYear() * 372 + n.getMonth() * 31 + n.getDate();
  }
  function pickRotating(list, count, seed = daySeed()) {
    const out = [], used = new Set();
    let i = seed % list.length;
    while (out.length < Math.min(count, list.length)) {
      if (!used.has(i)) { used.add(i); out.push(list[i]); }
      i = (i + 7) % list.length; // 7 is coprime-ish; walks the list
    }
    return out;
  }

  function genRef() {
    const s = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let r = '';
    for (let i = 0; i < 6; i++) r += s[Math.floor(Math.random() * s.length)];
    return 'SC-' + r;
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function toast(msg) {
    let t = document.querySelector('.sc-toast');
    if (!t) { t = el('div', 'sc-toast'); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  /* ── Flavor rendering ─────────────────────────────────────── */
  function flavorCard(f, kind) {
    const c = el('article', 'sc-flavor');
    c.appendChild(el('span', 'sc-flavor__thumb', flavorSwatch(f.name)));
    const b = el('div', 'sc-flavor__body');
    b.appendChild(el('h3', 'sc-flavor__name', f.name));
    b.appendChild(el('p', 'sc-flavor__desc', f.desc));
    const btn = el('button', 'sc-flavor__add', kind === 'icecream' ? 'Order a scoop' : 'Add to order');
    btn.setAttribute('data-order', f.name);
    b.appendChild(btn);
    c.appendChild(b);
    return c;
  }
  // Tiny CSS-drawn cupcake swatch; hue derived from the name so each differs.
  function flavorSwatch(name) {
    let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
    return `<svg viewBox="0 0 48 48" aria-hidden="true" width="48" height="48">
      <path d="M12 22h24l-3 16a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3z" fill="hsl(${h} 45% 78%)"/>
      <path d="M24 6c7 0 12 5 12 11 0 3-3 5-6 5H18c-3 0-6-2-6-5C12 11 17 6 24 6z" fill="hsl(${h} 70% 62%)"/>
      <circle cx="24" cy="7" r="2.4" fill="hsl(${(h + 180) % 360} 80% 60%)"/></svg>`;
  }
  function fillFlavors(container) {
    const kind = container.getAttribute('data-flavors');
    const list = kind === 'icecream' ? SC.ICE_CREAM : kind === 'seasonal' ? SC.SEASONAL : SC.SIGNATURE;
    list.forEach(f => container.appendChild(flavorCard(f, kind)));
  }
  function fillTodays(container) {
    const n = parseInt(container.getAttribute('data-count') || '4', 10);
    const picks = pickRotating(SC.SIGNATURE, n - 1).concat(pickRotating(SC.SEASONAL, 1));
    picks.forEach(f => container.appendChild(flavorCard(f)));
  }

  /* ── Live open/closed status ──────────────────────────────── */
  function fillStatus(node) {
    const now = new Date();
    const [open, close] = SC.STORE.openRanges[now.getDay()];
    const hr = now.getHours() + now.getMinutes() / 60;
    const isOpen = hr >= open && hr < close;
    node.classList.add('sc-status');
    node.classList.toggle('is-open', isOpen);
    node.classList.toggle('is-closed', !isOpen);
    const today = SC.STORE.hours[(now.getDay() + 6) % 7];
    node.innerHTML = `<span class="sc-status__dot"></span>` +
      (isOpen ? `Open now · until ${today.h.split('–')[1].trim()}` : `Closed now · ${today.d} ${today.h}`);
  }

  /* ── Order handoff modal (simulated Square) ───────────────── */
  function modal(html) {
    const wrap = el('div', 'sc-modal');
    wrap.innerHTML = `<div class="sc-modal__scrim" data-close></div>
      <div class="sc-modal__card" role="dialog" aria-modal="true" aria-label="Order for pickup">
        <button class="sc-modal__x" data-close aria-label="Close">×</button>${html}</div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('is-on'));
    const close = () => { wrap.classList.remove('is-on'); setTimeout(() => wrap.remove(), 250); };
    wrap.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
    const first = wrap.querySelector('.sc-modal__card button:not(.sc-modal__x)') || wrap.querySelector('.sc-modal__x');
    if (first) first.focus();
    return { wrap, close };
  }
  function openOrder(item) {
    track('order_click', { item: item || null });
    const line = item
      ? `<p class="sc-modal__lead">Adding <strong>${item}</strong> to your pickup order.</p>`
      : `<p class="sc-modal__lead">Order fresh cupcakes for pickup at <strong>${SC.STORE.address}</strong>.</p>`;
    const m = modal(`<span class="sc-modal__badge">Pickup order</span>
      <h2 class="sc-modal__title">Continue to secure ordering</h2>
      ${line}
      <p class="sc-modal__note">You’re continuing to the official Smallcakes Clarksville ordering page, powered by Square. Your order is confirmed there.</p>
      <button class="sc-btn sc-btn--primary sc-modal__go" data-go>Continue to Square ordering →</button>
      <button class="sc-modal__link" data-close>Keep browsing</button>`);
    m.wrap.querySelector('[data-go]').addEventListener('click', () => {
      const card = m.wrap.querySelector('.sc-modal__card');
      card.innerHTML = `<div class="sc-modal__loading"><span class="sc-spinner"></span>
        <p>Handing off to Square…</p></div>`;
      track('order_handoff', { item: item || null });
      setTimeout(() => {
        card.innerHTML = `<span class="sc-modal__badge">Demo</span>
          <h2 class="sc-modal__title">This is where Square takes over</h2>
          <p class="sc-modal__note">In the live site this opens the store’s real Square pickup checkout — no second cart to keep in sync. Nothing was charged.</p>
          <button class="sc-btn sc-btn--primary" data-close>Got it</button>`;
        card.querySelector('[data-close]').addEventListener('click', m.close);
      }, 1100);
    });
  }

  /* ── Menu filter ──────────────────────────────────────────── */
  function initMenuFilter(root) {
    const items = root.querySelectorAll('[data-cat]');
    root.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-filter');
        root.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', b === btn));
        items.forEach(it => {
          const show = k === 'all' || it.getAttribute('data-cat') === k;
          it.hidden = !show;
        });
        track('menu_filter', { filter: k });
      });
    });
  }

  /* ── Custom-order wizard ──────────────────────────────────── */
  function initCustomForm(form) {
    const steps = [...form.querySelectorAll('[data-step]')];
    const progress = form.querySelector('[data-progress]');
    let i = 0;
    track('custom_form_start');

    function paint() {
      steps.forEach((s, n) => (s.hidden = n !== i));
      if (progress) {
        progress.querySelectorAll('[data-dot]').forEach((d, n) => {
          d.classList.toggle('is-on', n <= i);
          d.setAttribute('aria-current', n === i ? 'step' : 'false');
        });
      }
      const back = form.querySelector('[data-prev]');
      if (back) back.hidden = i === 0;
      steps[i].scrollIntoView({ block: 'nearest' });
      const focusable = steps[i].querySelector('input, select, textarea');
      if (focusable) focusable.focus();
    }
    function valid() {
      for (const f of steps[i].querySelectorAll('[required]')) {
        if (!f.reportValidity()) return false;
      }
      return true;
    }
    form.addEventListener('click', e => {
      if (e.target.matches('[data-next]')) {
        e.preventDefault();
        if (!valid()) return;
        if (i < steps.length - 1) { i++; paint(); }
      }
      if (e.target.matches('[data-prev]')) { e.preventDefault(); if (i > 0) { i--; paint(); } }
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!valid()) return;
      const ref = genRef();
      track('custom_form_submit', { ref });
      const name = (form.querySelector('[name="name"]') || {}).value || 'there';
      const panel = form.querySelector('[data-success]') || form;
      panel.innerHTML = `<div class="sc-success">
        <div class="sc-success__check">✓</div>
        <h2>Request received, ${name.split(' ')[0]}!</h2>
        <p>Your reference number is <strong class="sc-ref">${ref}</strong>. We’ll review availability, design and pricing and reply within <strong>1 business day</strong>.</p>
        <p class="sc-success__fine">This starts a request — it doesn’t reserve your date or confirm an order. Your order is confirmed only after you receive acceptance and complete payment. Urgent? Call <a href="${SC.STORE.phoneHref}">${SC.STORE.phone}</a>.</p>
        <a class="sc-btn sc-btn--primary" href="index.html">Back to home</a></div>`;
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    paint();
  }

  /* ── Auto-wire ────────────────────────────────────────────── */
  function boot() {
    document.querySelectorAll('[data-status]').forEach(fillStatus);
    document.querySelectorAll('[data-todays-flavors]').forEach(fillTodays);
    document.querySelectorAll('[data-flavors]').forEach(fillFlavors);
    document.querySelectorAll('[data-menu]').forEach(initMenuFilter);
    document.querySelectorAll('[data-custom-form]').forEach(initCustomForm);
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-order]');
      if (b) { e.preventDefault(); openOrder(b.getAttribute('data-order') || ''); }
    });
    track('page_view', { path: location.pathname });
    if (location.search.includes('selfcheck')) selfcheck();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // ponytail: one runnable check for the non-trivial logic. Append ?selfcheck.
  function selfcheck() {
    console.assert(/^SC-[A-Z2-9]{6}$/.test(genRef()), 'genRef format');
    console.assert(pickRotating(SC.SIGNATURE, 4, 0).length === 4, 'rotation count');
    console.assert(new Set(pickRotating(SC.SIGNATURE, 4, 0).map(f => f.name)).size === 4, 'rotation unique');
    console.log('%c[demo] selfcheck passed', 'color:#2D6A55');
  }

  return { openOrder, toast, track, genRef, pickRotating, initCustomForm, initMenuFilter };
})();
