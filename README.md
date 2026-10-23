# IrishCentral Ad Studio

A browser-based banner creative builder, inspired by publisher ad-format catalogs. This is an independent prototype, not affiliated with Broadstreet or integrated with IrishCentral's live website.

## Open the software

Requires Node.js 20 or newer; no npm dependencies or install step.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). Use your hosting environment's port forwarding to access it. This onboarding chat does not provide a public web preview.

To create a portable app that opens directly in a browser:

```sh
npm run build
```

Open `dist/ad-studio.html`. It includes the app, styles and illustration and requires no server or network connection. Browser storage availability depends on browser settings; export HTML creatives to keep portable copies.

## Features

- Seven formats: a live property carousel plus 728×90 leaderboard, 300×250 rectangle, 970×250 billboard, 600×300 native story, 600×300 three-slide carousel, and 320×100 mobile banner.
- Format filters and search, live headline, sponsor, description, button, destination and color editing.
- Campaign image upload (PNG/JPEG/WebP, maximum 4 MB each); separate headlines and optional images for carousel slides two and three.
- Illustrative IrishCentral-style page context preview.
- Save, edit and delete creatives using browser local storage. Drafts are local to the browser, not shared across users or devices. Large images can exceed browser storage; export them instead.
- Self-contained HTML export with embedded images and destination links.

To place an exported creative on a publisher site, upload the HTML creative to an appropriate host or ad server, then insert it in the matching ad slot, typically using an iframe with the format's width and height. Have the publisher's web team configure their ad server, iframe permissions and content security policy. Live IrishCentral placement requires their authorized publishing access.

This version does not serve campaigns, count impressions/clicks, provide client analytics, manage users, schedule inventory or implement Broadstreet's entire format catalog. Do not expose this development server as a production ad service without adding deployment controls.

## Validation

```sh
npm test
npm run build
```

Browser integration checks (requires Python Playwright and Chromium installed, and `npm start` running):

```sh
python3 tests/browser.py
```

They exercise all seven formats, search/filtering, live edits, carousel interaction, URL validation, uploads, save/reload/edit/delete, exports, page context, mobile overflow, and the standalone app.

The original C17 starter is retained: `make`, `make run`, and `make test`.

## Hosting and live property feeds

See [DEPLOY.md](DEPLOY.md) for the exact upload steps, IrishCentral embedding instructions and supported public JSON property feed schema. The property carousel refreshes every five minutes and was tested with controlled feed fixtures. A provider adapter is needed for XML/RSS and private APIs.
