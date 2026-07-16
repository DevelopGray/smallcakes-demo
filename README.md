# Smallcakes Clarksville — Website Concept Directions

Three website design directions for **Smallcakes Cupcakery & Creamery, Clarksville, TN**,
under one hub page. Static HTML/CSS/JS only (GitHub Pages compatible — no build step, no framework).

> **Unofficial concept demos.** Nothing here is live or corporate-approved. Flavors, prices,
> reviews, and claims are illustrative and pending Smallcakes corporate approval. Orders are
> simulated — the demos hand off to Square in a real build; they do not process payments.

## Structure

```
index.html                 Hub / main nav — pick a direction
assets/
  reset.css                Shared reset + brand color tokens
  demo.css                 Shared overlay styles (modal, toast, wizard) — themed per site via --sc-* vars
  data.js                  Shared content: 12 signature flavors, ice cream, seasonal, NAP, allergen, FAQ, reviews
  demo.js                  Shared behaviour: order→Square modal, custom wizard, flavor rotation, filter, live status
mockups/
  a-pink-box/              Direction A — Pink Box, Clarksville (recommended)
  b-celebration-studio/    Direction B — Celebration Studio (premium / events)
  c-sweet-stop/            Direction C — Sweet Stop, Everyday Joy (bright / community)
    index.html · menu.html · custom.html · styles.css
```

Each direction is its own multi-page mobile-first site sharing the same store info,
sitemap, and content — but a distinct art direction, layout, type, and audience.

## The three directions

| | A — Pink Box | B — Celebration Studio | C — Sweet Stop |
|---|---|---|---|
| Mood | celebratory, clean, broad | premium, composed, editorial | bright, friendly, community |
| Best for | everyday pickup, families, gifts | custom, weddings, corporate events | walk-ins, students, teams |
| Type | Fraunces + Inter | Playfair Display + Jost | Fredoka + Nunito |
| Signature | box-opening hero, packaging palette | asymmetric magazine grid, gold hairlines | intent-split hero, color-blocked bands |

## What each demo does ("acts like it works")

Every direction has a full homepage, a **Menu & Flavors** page, and a **Custom order** page, all wired to the shared behaviour — no real backend, nothing charged:

- **Order for Pickup** → opens a modal that simulates the hand-off to the store's real Square ordering.
- **Custom order** → a 4-step wizard (fit & timing → scale & budget → creative → contact) that validates, then returns a fake reference number and response-time note.
- **Menu** → filter by cupcakes / cakes / creamery / specialty; every flavor "Add to order" opens the pickup modal.
- **Live open/closed pill**, **daily flavor rotation**, native FAQ accordion, newsletter sign-up, and a sticky mobile action bar (Order / Call / Directions).
- Analytics intent is logged to the browser console (`order_click`, `custom_form_submit`, …). Append **`?selfcheck`** to any URL to run the JS logic asserts.

## Preview locally

Open `index.html` directly, or serve the folder (needed for clean relative paths):

```
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push to GitHub (see privacy note below).
2. Repo **Settings → Pages → Source: `main` branch, `/root`**.
3. Site publishes at `https://<user>.github.io/<repo>/`.

## ⚠️ Privacy note

`docs/` contains **confidential** pricing/profitability material and `RESEARCH_NOTES.md`
holds internal notes. Both are **gitignored** so they never reach the public repo — a
public GitHub repo exposes all committed files, Pages or not. Keep them ignored.

---
Prepared by Stephen C. Gray. Not an official Smallcakes corporate document.
