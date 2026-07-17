# Smallcakes Clarksville — Launch Kit (Direction D)

Everything needed to take `mockups/d-madison-street/` from demo to the live site.
The site is a **routing layer over Square** — it never touches payments or PII itself.

## 0 · Step zero (do these first)

- **Remove the `noindex` meta** from every page head (search for `DEMO ONLY`) and delete the repo-root `robots.txt` — the demo ships un-indexable on purpose.
- Remove the demo ribbon (`.demo-ribbon`) from every page and the "demo pricing" notes.
- Update the two static hours tables (English `visit/` + home, Spanish `es/`) if the owner's hours differ from the demo defaults in `site.js` `HOURS`.

## 1 · One-file go-live switch (`site.js`)

Fill the `SQUARE` object and `SITE` flags at the top of `site.js`:

| Key | Where the owner gets it (Square Dashboard) |
|---|---|
| `order.orderNow` | Channels → Square Online → create site → add **Order Online** page → publish. Copy `https://{name}.square.site/s/order` |
| `order.categories.*` | Create item categories (Cupcakes, Cakes, Little Treats) first, then copy each `/shop/{slug}/{ID}` URL from the browser |
| `giftCards` | Items & services → Gift cards → eGift Cards → Configure → enable "Sell eGift Cards online" → copy the URL under the toggle |
| `emailSignup` | Customers → Customer directory → Settings → Email collection → **Hosted sign-up page** → Customize (logo + pink button) → copy link |
| `booking` | Square Appointments (free tier) → add service "Custom Cake Consultation — free, 15 min" → Online Booking → Channels → copy URL |
| `email` | The store's real email — wizard submissions open a pre-filled email to it |
| `SITE.launched` | `true` on opening day — turns on live hours/cutoff lines, turns off "Opening soon" |
| `SITE.sameDayCutoffHour` | e.g. `14` once the owner confirms a same-day cutoff. Stays `null` = line hidden |
| `SITE.priceAnchor` | e.g. `'Dozens from $42'` once pricing is confirmed |
| `SITE.reviewsLive` | `false` at launch (hides sample reviews) until real Google reviews exist |
| `SITE.ga4` | GA4 measurement id (`G-…`) — every tracked intent (order_click, phone_click, custom_form_submit…) flows to Analytics. Create the property at analytics.google.com; add a short "we use Google Analytics" line to the privacy note |
| `HOURS` / `CLOSED_DATES` / `EVENTS` | the owner-editable block right below the flags — hours single-source, holiday closures, dated event chips |

Behavior while placeholders remain: order buttons use the demo modal, gift-card / booking links hide themselves, signup shows a demo toast. Nothing breaks.

## 2 · Domain & hosting

1. Buy `smallcakesclarksville.com` (~$11/yr). A `*.github.io` URL cannot win local SEO.
2. GitHub Pages → custom domain → enforce HTTPS.
3. Directory URLs are already in place (`cupcakes/`, `custom-cakes/`, `catering/`, `visit/`) and the folder is fully self-contained — deploy `mockups/d-madison-street/` as the site root. Un-comment the `<link rel="canonical">` in each page head and fill the remaining JSON-LD LAUNCH TODOs.
4. Copy `sitemap.xml`, `robots.txt`, `404.html` and `llms.txt` from this folder to the site root (fix domain if different).
5. Remove the demo ribbon + demo pricing notes; replace Unsplash photos with the corporate/owner photo set (keep exact `width`/`height` attributes to avoid layout shift; name files like `smallcakes-clarksville-red-velvet-cupcake.jpg`).

## 3 · Google Business Profile (32% of local-pack ranking)

1. Claim GBP with the exact NAP: `Smallcakes Cupcakery & Creamery — Clarksville · 1803 Madison St, Suite A, Clarksville, TN 37043 · (931) 547-8361`.
2. Primary category **Cupcake shop**; secondary: Bakery, Dessert shop, Cake shop, Caterer. *(No ice-cream category — this location bakes only.)*
3. Website field → homepage; menu link → `/cupcakes/`; order link → the Square ordering URL.
4. Exact hours + proactive holiday hours ("open at search time" is a top-5 pack factor).
5. 15+ real photos (storefront, interior, pink box, each signature flavor); post weekly.
6. Review engine: QR code on every pink box + counter card → Google review link. Steady 3–5/week beats spikes. Reply to every review. Then set `SITE.reviewsLive = true` logic aside and quote real reviews on the site.

## 4 · Citations & links (same week as launch)

Apple Business Connect · Bing Places · Yelp · Nextdoor · TripAdvisor · visitclarksvilletn.com · Clarksville Chamber. Ask **ClarksvilleNow** to add the site link to its opening coverage, and **Smallcakes corporate** to link from smallcakescupcakery.com/locations. Create the Instagram handle and add both socials to JSON-LD `sameAs` + GBP.

## 5 · Verify before announcing

- Rich Results Test: LocalBusiness + BreadcrumbList pass, zero errors.
- Lighthouse mobile: Performance ≥95, SEO 100, a11y ≥95.
- Search Console + Bing Webmaster: verify domain, submit sitemap.
- Click every CTA on a phone: Order → Square, Call connects, wizard emails the store, gift card page opens.
- Grep guard: `#D42A78` appears only in the `.sc-btn--primary` block of `styles.css`.

## Content rules (standing)

- **No ice cream/creamery products** — this location bakes only (brand *name* keeps "Creamery" because that's the registered franchise name).
- **No tiered wedding cakes** — say "celebration cakes & cupcake towers"; never copy corporate/press wedding language.
- Allergen wording verbatim from `assets/data.js` — never "nut-free", "gluten-free", or "safe".
- Never claim "award-winning", exact hours, delivery areas, or lead times until owner-confirmed.
- No aggregateRating/review schema. No FAQ schema (rich results deprecated 2026 — visible FAQ text only).

## 6 · Ownership & yearly costs (the year-2 disaster preventer)

Everything must live under accounts **the owner controls** — the developer is a
collaborator, never the owner:

| Asset | Owner account | Developer role |
|---|---|---|
| Domain registrar | Owner's email | tech contact |
| GitHub repo (the site) | Owner's GitHub org/account | collaborator |
| Google Business Profile | Owner = Primary owner | manager |
| Google Analytics + Search Console | Owner's Google account | user |
| Square (everything transactional) | Owner | — |
| Facebook/Instagram pages | Owner | editor |

Yearly cash costs: domain ~$11. Hosting $0 (GitHub Pages). Fonts/images $0
(self-hosted). Square: standard processing rates + optional add-ons
(Marketing, Loyalty) only if chosen. Everything else on this site is code —
no subscriptions to forget.

## 7 · The annual ritual (every January, ~30 minutes)

1. Refresh `EVENTS` in `site.js` with the new year's dates (Riverfest,
   Oktoberfest, APSU calendar, CMCSS calendar, Fright on Franklin).
2. Refresh `CLOSED_DATES` with this year's holidays.
3. Renew the domain (set auto-renew and this is a no-op).
4. Skim GSC: which queries grew? Consider promoting a `/custom-cakes/` H2
   (e.g. Birthday Cakes) to its own page if the data supports it.
5. Re-run Lighthouse (CI does it on every push anyway).

## 8 · Print & paper

`print.html` in this folder generates box stickers (review QR), a table tent
(Flavor Calendar QR) and a counter card — open it with your real links:
`print.html?review=GOOGLE_REVIEW_LINK&signup=SQUARE_SIGNUP_LINK`, then Ctrl+P.
`STAFF-CARD.md` is the counter script; `MARKETING-KIT.md` is 12 months of posts.
