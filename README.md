# podcastnetwork.org

Static build of the podcastnetwork.org redesign (Nov 27, 2026): Podcast Network as an independent collective of artist-owned shows. Creators own 100% of their show's IP and keep 90% of revenue; the network keeps 10%.

## Source

The site is built in the **Podcast Network grok.com Build chat** ("Website Build", Grok Build / TanStack Start).
The published Grok preview is https://opal-finch-arrow-brave.grok.me.

This repo holds a static mirror of that preview's output:

- `site/` - server-rendered HTML for `/`, `/shows`, `/about`, `/for-shows`, `/contact`, `/network` (as `index.html`, `shows.html`, ...), plus `assets/`, `covers/` (hosted podcast artwork), `__grok/` (icon + manifest), `favicon.svg`, `og.jpg`, `robots.txt`.
- `vercel.json` - `cleanUrls` so `/about` serves `about.html`, plus long cache headers for hashed assets. Framework preset **Other**, empty build and install commands, `outputDirectory` `site`, so every linked Vercel project (including mike-partners/podcastnetwork) builds the static site.

Production changes made to the mirror: removed Grok's builder script (`grok.com/grok-app-builder/extensions.js`, which adds the Remix-in-Grok / "Created with Grok" badge) and the grok project-id meta tags, pointed `og:image` at podcastnetwork.org, renamed the manifest from "Grok App" to "Podcast Network".

The contact and pitch forms are client-side only (they show a thank-you message; nothing is sent anywhere yet).

The current public build (v7) keeps that artwork and H1, with smaller hero tiles, a cinematic gradient, and a mobile fix. The illustration note remains: "Example podcast artwork shown for illustration."

## Vercel

Two Vercel projects are Git-linked to this repo and both deploy on every push:

- `podcastnetwork-site` (team Best Known Brand)
- `podcastnetwork` (team mike-partners) — this one serves the live podcastnetwork.org domain

A push to `main` deploys `site/` to production as-is on both. Do not push to `main` until a preview branch has been checked.

## Syncing future changes

1. Make changes in the Podcast Network grok.com Build chat and republish the preview.
2. Re-mirror the preview: fetch each route's HTML and every referenced `/assets/*`, `/covers/*`, `/__grok/*`, `/fonts/*`, `favicon.svg`, `og.jpg` into `site/` (route pages saved as `<route>.html`; delete stale hashed assets).
3. Re-apply the production edits above (strip the Grok builder script and grok meta tags, og:image, manifest name). Confirm there are no leftover grok.me URLs in the HTML.
4. Check: no `mailto:` or email addresses, JSON-LD founder `{"@id":"https://brettkmoore.com/#person"}`, footer/nav has only this site's links (sister sites stay on `/network`), `/network` lists the sister sites, all six routes return 200, and every `/covers/*` image returns 200.
5. Commit on a branch (never straight to `main`). Confirm both Vercel projects' preview statuses succeed and the branch preview serves all six pages with covers loading. Then merge or fast-forward to `main`.

## Old site / rollback

- `pre-v7-2026-11-27` (96e3650): the v6 production build (real covers and new H1) from just before the v7 hero fixes (smaller tiles, cinematic gradient, mobile). Promote mike-partners deploy `dpl_A3C2T75txc5PuLFroDqcYGh2JGfx`, or revert the v7 commit, or rebuild from this tag.
- `pre-template-2026-11-27` (95e01a4): the static collective redesign that was in production just before the v6 template rebuild.
- `pre-redesign-2026-11-27` (d42bec8): the previous Next.js site. Restoring it also needs the old Next.js Vercel settings.
- Older history: tag `v0-legacy-2026-07-01`.
