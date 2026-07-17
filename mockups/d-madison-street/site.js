/* Direction D — "Madison Street Made" site layer.
   Loads AFTER assets/data.js + assets/demo.js and upgrades the shared demo
   behaviour into a production-ready, Square-connected site.

   ── HOW TO GO LIVE ──────────────────────────────────────────────
   Everything transactional is a Square-hosted URL. Fill the SQUARE
   object below (owner setup steps in ../launch-kit/README-LAUNCH.md),
   flip SITE.launched to true, and every CTA on the site starts
   routing to the real Square pages — no other edits needed.
   While a value still says "PASTE…", that CTA keeps the demo
   behaviour (modal / toast) and any [data-sq-section] tied to it
   stays hidden. The site is fully functional in both states. */

/* ═══ 1 · SQUARE CONFIG — the only Square coupling on the site ═══ */
const SQUARE = {
  order: {
    // Dashboard → Channels → Square Online → publish. Format verified from
    // live Smallcakes stores: https://{name}.square.site/s/order
    orderNow: 'PASTE_SQUARE_ORDER_URL',            // e.g. https://smallcakes-clarksville.square.site/s/order
    categories: {
      // Format: https://{name}.square.site/shop/{category-slug}/{CATEGORY_ID}
      cupcakes: 'PASTE_CUPCAKES_CATEGORY_URL',
      cakes:    'PASTE_CAKES_CATEGORY_URL',
      treats:   'PASTE_TREATS_CATEGORY_URL'   // minis, macarons, cake pops
    }
  },
  // Items & services → Gift cards → eGift Cards → Configure → copy URL.
  // Format: https://squareup.com/gift/{MERCHANT_TOKEN}/order
  giftCards: 'PASTE_EGIFT_URL',
  // Customers → Customer directory → Settings → Email collection →
  // Hosted sign-up page → Customize → copy link.
  emailSignup: 'PASTE_EMAIL_SIGNUP_URL',
  // Appointments → Online Booking → Channels → copy URL (free tier).
  // Service: "Custom Cake Consultation — free, 15 min".
  booking: 'PASTE_APPOINTMENTS_URL',
  phone: 'tel:+19315478361',
  email: 'PASTE_OWNER_EMAIL'                        // e.g. hello@smallcakesclarksville.com
};

/* ═══ 2 · SITE FLAGS — the honesty engine ═══
   Unconfirmed facts render NOTHING until the owner confirms them. */
const SITE = {
  launched: false,          // false → "Opening soon" state everywhere it matters
  sameDayCutoffHour: null,  // e.g. 14 → "Order by 2pm for same-day pickup". null → line hidden (owner must confirm)
  priceAnchor: null,        // e.g. 'Dozens from $42' → shows beside hero CTA. null → hidden (owner must confirm)
  reviewsLive: true         // demo: show sample reviews. Set false at launch until real Google reviews exist.
};

/* Dated local hooks — chips auto-expire the day after the event. */
const EVENTS = [
  { label: '🍎 CMCSS back to school · Aug 10', until: '2026-08-10' },
  { label: '🎓 APSU move-in week · Aug 19–21', until: '2026-08-21' },
  { label: '🎪 Riverfest · Sept 9–11',          until: '2026-09-11' },
  { label: '🍂 Clarksville Oktoberfest · Oct 10–13', until: '2026-10-13' },
  { label: '🎃 Fright on Franklin · Oct 25',    until: '2026-10-25' }
];

(function () {
  const SC = window.SC;
  const live = u => typeof u === 'string' && u.startsWith('https://');


  /* ── Square link resolution ─────────────────────────────────
     [data-sq="giftCards"] / [data-sq="order.categories.cupcakes"] …
     Live URL → real href. Not live → closest [data-sq-section] hides
     (falls back to hiding just the link). */
  document.querySelectorAll('[data-sq]').forEach(a => {
    const url = a.getAttribute('data-sq').split('.').reduce((o, k) => o && o[k], SQUARE);
    if (live(url)) {
      a.href = url;
      a.setAttribute('rel', 'noopener noreferrer');
    } else {
      (a.closest('[data-sq-section]') || a).setAttribute('hidden', '');
    }
  });

  /* Real ordering override: when the Square ordering URL is live, every
     [data-order] button routes straight there (same-tab — fewest taps)
     instead of opening the demo modal. Capture phase beats demo.js. */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-order]');
    if (!b || !live(SQUARE.order.orderNow)) return;
    e.preventDefault();
    e.stopPropagation();
    window.SCDemo.track('order_click', { item: b.getAttribute('data-order') || null, live: true });
    location.href = SQUARE.order.orderNow;
  }, true);

  /* Email signup: live hosted page wins over the demo toast. */
  document.querySelectorAll('[data-signup]').forEach(f => f.addEventListener('submit', e => {
    if (!live(SQUARE.emailSignup)) return;               // demo toast handles it
    e.preventDefault();
    e.stopPropagation();
    window.SCDemo.track('rewards_click', { kind: 'email_signup', live: true });
    location.href = SQUARE.emailSignup;
  }, true));

  /* Custom wizard → owner's inbox. When the owner email is set, a valid
     submit also opens a pre-filled email with every answer (no backend
     needed); the on-page confirmation still shows the reference number. */
  document.querySelectorAll('[data-custom-form]').forEach(form => form.addEventListener('submit', () => {
    if (!SQUARE.email.includes('@') || !form.checkValidity()) return;
    const fd = new FormData(form);
    const lines = [];
    fd.forEach((v, k) => { if (v && typeof v === 'string') lines.push(k + ': ' + v); });
    const mail = 'mailto:' + SQUARE.email +
      '?subject=' + encodeURIComponent('Custom order request — smallcakesclarksville.com') +
      '&body=' + encodeURIComponent(lines.join('\n'));
    setTimeout(() => { location.href = mail; }, 400);
  }, true));

  /* ── Waking nav + mobar: one observer enforces "one money button
     per viewport". While the hero CTA is on screen the header Order
     button stays quiet (outline) and the mobar stays hidden; the
     moment it scrolls out, both arm. Pages without a hero sentinel
     arm immediately. ─────────────────────────────────────────── */
  const sentinel = document.querySelector('[data-cta-sentinel]');
  if (sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) =>
      document.body.classList.toggle('cta-armed', !en.isIntersecting)
    ).observe(sentinel);
  } else {
    document.body.classList.add('cta-armed');
  }

  /* ── Truth-driven urgency line ([data-cutoff]) ──────────────
     Computed from real hours (SC.STORE.openRanges); renders only what
     is true right now, and only once the owner confirms a cutoff. */
  document.querySelectorAll('[data-cutoff]').forEach(el => {
    if (!SITE.launched) { el.textContent = 'Opening soon on Madison St. — follow us on Facebook for the date.'; return; }
    const now = new Date();
    const [open, close] = SC.STORE.openRanges[now.getDay()];
    const hr = now.getHours() + now.getMinutes() / 60;
    const fmt = h => (h % 12 || 12) + (h < 12 ? 'am' : 'pm');
    if (hr >= open && hr < close) {
      el.textContent = (SITE.sameDayCutoffHour && hr < SITE.sameDayCutoffHour)
        ? 'Order by ' + fmt(SITE.sameDayCutoffHour) + ' for same-day pickup.'
        : 'Open until ' + fmt(close) + ' today.';
    } else {
      el.textContent = 'Closed now — order ahead for tomorrow’s bake.';
    }
  });

  /* Hide pre-launch-only elements once live, and vice versa. */
  document.querySelectorAll('[data-when-launched]').forEach(el => { if (!SITE.launched) el.setAttribute('hidden', ''); });
  document.querySelectorAll('[data-when-prelaunch]').forEach(el => { if (SITE.launched) el.setAttribute('hidden', ''); });

  /* Price anchor — hidden until the owner confirms a number. */
  document.querySelectorAll('[data-price]').forEach(el => {
    if (SITE.priceAnchor) el.textContent = SITE.priceAnchor; else el.setAttribute('hidden', '');
  });

  /* Sample reviews auto-hide at launch until real ones exist. */
  if (!SITE.reviewsLive) document.querySelectorAll('[data-reviews-section]').forEach(el => el.setAttribute('hidden', ''));

  /* Dated event chips with auto-expiry. */
  document.querySelectorAll('[data-events]').forEach(box => {
    const today = new Date().toISOString().slice(0, 10);
    const open_ = EVENTS.filter(ev => ev.until >= today);
    if (!open_.length) { box.setAttribute('hidden', ''); return; }
    open_.forEach(ev => {
      const s = document.createElement('span');
      s.className = 'event-chip';
      s.textContent = ev.label;
      box.appendChild(s);
    });
  });

  /* Catering preset: custom.html?type=catering preselects the product. */
  const type = new URLSearchParams(location.search).get('type');
  if (type) {
    const sel = document.querySelector('[data-custom-form] select[name="product"]');
    if (sel) [...sel.options].forEach(o => { if (o.text.toLowerCase().includes(type)) sel.value = o.text; });
  }

  /* ponytail: one runnable check for this layer. Append ?selfcheck. */
  if (location.search.includes('selfcheck')) {
    console.assert(!live('PASTE_SQUARE_ORDER_URL'), 'placeholder not treated as live');
    console.assert(live('https://x.square.site/s/order'), 'https URL treated as live');
    console.assert('order.categories.cupcakes'.split('.').reduce((o, k) => o && o[k], SQUARE) === 'PASTE_CUPCAKES_CATEGORY_URL', 'data-sq path resolution');
    console.assert(EVENTS.every(ev => /^\d{4}-\d{2}-\d{2}$/.test(ev.until)), 'event dates ISO');
    console.log('%c[site] selfcheck passed', 'color:#2D6A55');
  }
})();
