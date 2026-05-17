# Mahjong Point Counter

A flashy, beginner-friendly responsive web app for learning and counting Hong Kong–style mahjong points.

## Features

- Browse all simplified Hong Kong scoring rules as tile-styled cards
- Guided step-by-step manual point counter with live running total
- Yes/No clicks auto-advance to the next rule
- Multi-select dragon pungs (Red, Green, White) each scoring +1
- Medium and big hands show full 14-tile example hands grouped by set
- Results summary listing every rule that contributed points
- Responsive layout that feels like a polished app on mobile
- 100% client-side — no backend required to host

## Stack

- React 18
- Vite 5
- Plain CSS with a custom neon mahjong theme

## Getting started

```bash
npm install
npm run dev
```

Then open the printed URL (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview   # optional, serves the build locally
```

## Deploying to a static host (PHP-only hosting works too)

`npm run build` produces a fully static bundle in `dist/`:

```
dist/
├── index.html
├── assets/
│   ├── index-<hash>.js
│   └── index-<hash>.css
└── Tiles/
    ├── Bamboo1.png
    └── ...
```

To deploy, upload the **contents** of `dist/` (not the folder itself) into your web root (`public_html/`, `www/`, `htdocs/`, etc.). Any HTTP server that serves static files will work — Apache, nginx, LiteSpeed, IIS, GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, and PHP-only shared hosting all qualify. PHP is never invoked because there is no server-side code; the app runs entirely in the browser.

No `.htaccess` rewrites or SPA fallbacks are needed: the app uses a single page with internal view state (`home` / `counter` / `results`), so the browser only ever requests `/`, `/assets/...`, and `/Tiles/...`.

## Tile assets

Tile images live in `public/Tiles/` and are referenced via `/Tiles/<name>.png`. Missing tile images automatically fall back to a styled placeholder tile.

### Attribution

The mahjong tile images are by Wikipedia user **[Cangjie6](https://commons.wikimedia.org/wiki/User:Cangjie6)** on Wikimedia Commons and are licensed under **[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)**. Per the license, this credit is shown in the footer of every page in the app. If you redistribute or adapt these images, you must do so under the same CC BY-SA 4.0 license.

## Disclaimer

Scoring varies by table. This counter follows the provided simplified Hong Kong–style score sheet and is intended as a beginner aid, not as a universal official rulebook.
