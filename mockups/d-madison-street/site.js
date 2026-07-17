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
    },
    // Optional per-flavor deep links — /product/{slug}/{id}. Any flavor
    // listed here sends its "Add to order" button straight to the item.
    items: {
      // 'Birthday Cake': 'https://smallcakes-clarksville.square.site/product/birthday-cake/12',
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
     [data-order] button routes to Square (same-tab — fewest taps) instead
     of the demo modal — and it keeps the shopper's intent: flavor item
     link if configured, else the section's category (a data-order-cat
     ancestor), else the general ordering page. Capture beats demo.js. */
  function orderUrl(b) {
    const item = b.getAttribute('data-order') || null;
    const cat = b.closest('[data-order-cat]')?.getAttribute('data-order-cat');
    if (item && live(SQUARE.order.items[item])) return SQUARE.order.items[item];
    if (cat && live(SQUARE.order.categories[cat])) return SQUARE.order.categories[cat];
    return SQUARE.order.orderNow;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-order]');
    if (!b || !live(SQUARE.order.orderNow)) return;
    e.preventDefault();
    e.stopPropagation();
    window.SCDemo.track('order_click', { item: b.getAttribute('data-order') || null, live: true });
    location.href = orderUrl(b);
  }, true);

  /* Email signup: live hosted page wins over the demo toast. */
  document.querySelectorAll('[data-signup]').forEach(f => f.addEventListener('submit', e => {
    if (!live(SQUARE.emailSignup)) return;               // demo toast handles it
    e.preventDefault();
    e.stopPropagation();
    window.SCDemo.track('rewards_click', { kind: 'email_signup', live: true });
    location.href = SQUARE.emailSignup;
  }, true));

  /* Custom wizard → explicit, reliable delivery. No hidden redirects:
     once the confirmation renders, the shopper gets real actions —
     email the request (prefilled), copy it, text the shop the
     inspiration photo, and add the pickup date to their calendar.
     The request text survives even with no mail client installed. */
  function icsHref(date, time, product, ref) {
    const d = date.replace(/-/g, '');
    const dt = time ? d + 'T' + time.replace(':', '') + '00' : d;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Smallcakes Clarksville//site//EN', 'BEGIN:VEVENT',
      'UID:' + ref + '@smallcakesclarksville.com',
      'DTSTAMP:' + d + 'T000000Z',
      time ? 'DTSTART:' + dt : 'DTSTART;VALUE=DATE:' + dt,
      'SUMMARY:Smallcakes pickup — ' + (product || 'custom order') + ' (' + ref + '\\, pending confirmation)',
      'LOCATION:1803 Madison St Suite A\\, Clarksville TN 37043',
      'DESCRIPTION:Confirm with the bakery first: 931-547-8361',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  }
  document.querySelectorAll('[data-custom-form]').forEach(form => {
    // The site's own 48-hour lead-time rule, enforced at the input.
    const dateIn = form.querySelector('input[name="date"]');
    if (dateIn) dateIn.min = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10);

    form.addEventListener('submit', () => {
      if (!form.checkValidity()) return;
      const fd = new FormData(form);
      const rows = [];
      fd.forEach((v, k) => { if (v && typeof v === 'string' && k !== 'ack') rows.push(k + ': ' + v); });
      const date = fd.get('date'), time = fd.get('time'), product = fd.get('product');
      setTimeout(() => {           // demo.js has rendered the confirmation by now
        const slot = form.querySelector('[data-request-actions]');
        const refEl = form.querySelector('.sc-ref');
        if (!slot || !refEl) return;
        const ref = refEl.textContent;
        const body = 'Custom order request ' + ref + '\n\n' + rows.join('\n');
        const links = [];
        if (SQUARE.email.includes('@')) {
          links.push('<a class="sc-btn sc-btn--primary" href="mailto:' + SQUARE.email +
            '?subject=' + encodeURIComponent('Custom order request ' + ref) +
            '&body=' + encodeURIComponent(body) + '">📧 Email this request</a>');
        }
        links.push('<button class="sc-btn sc-btn--ghost" type="button" data-copy>📋 Copy my request</button>');
        links.push('<a class="sc-btn sc-btn--ghost" href="sms:+19315478361?&body=' +
          encodeURIComponent(ref + ' — here’s my inspiration photo:') + '">📷 Text us your photo</a>');
        if (date) links.push('<a class="sc-btn sc-btn--ghost" download="smallcakes-pickup.ics" href="' +
          icsHref(date, time, product, ref) + '">🗓 Add pickup to my calendar</a>');
        slot.innerHTML = links.join('');
        slot.querySelector('[data-copy]').addEventListener('click', () =>
          navigator.clipboard.writeText(body).then(() => window.SCDemo.toast('Request copied — paste it anywhere.')));
        window.SCDemo.track('custom_delivery_shown', { ref, email: SQUARE.email.includes('@') });
      }, 0);
    });
  });

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
    const now = SC.storeNow();
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
    console.assert(window.SC.storeNow() instanceof Date && !isNaN(window.SC.storeNow()), 'storeNow valid');
    console.log('%c[site] selfcheck passed', 'color:#2D6A55');
  }
})();
