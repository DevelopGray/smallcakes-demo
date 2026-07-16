# Smallcakes Clarksville — Website Concept Directions

Three website design directions for **Smallcakes Cupcakery & Creamery, Clarksville, TN**,
under one hub page. Static HTML/CSS/JS only (GitHub Pages compatible — no build step, no framework).

> **Unofficial concept demos.** Nothing here is live or corporate-approved. Flavors, prices,
> reviews, and claims are illustrative and pending Smallcakes corporate approval. Orders are
> simulated — the demos hand off to Square in a real build; they do not process payments.

## Structure

```
index.html                 Hub / main nav — pick a direction
assets/reset.css           Shared reset + brand color tokens (used by all pages)
mockups/
  a-pink-box/              Direction A — Pink Box, Clarksville (recommended)
  b-celebration-studio/    Direction B — Celebration Studio (premium / events)
  c-sweet-stop/            Direction C — Sweet Stop, Everyday Joy (bright / community)
    index.html · styles.css · app.js   (self-contained per direction)
```

Each direction is its own multi-page mobile-first demo sharing the same store info,
sitemap, and 12-section homepage blueprint — different art direction and audience.

## The three directions

| | A — Pink Box | B — Celebration Studio | C — Sweet Stop |
|---|---|---|---|
| Mood | celebratory, clean, broad | premium, composed | bright, friendly, community |
| Best for | everyday pickup, families, gifts | custom, weddings, events | walk-ins, students, teams |

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
