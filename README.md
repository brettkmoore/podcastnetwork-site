# podcastnetwork.org

Static build of the podcastnetwork.org redesign (Nov 27, 2026): Podcast Network as an independent collective of artist-owned shows. Creators own 100% of their show's IP and keep 90% of revenue; the network keeps 10%.

## Source

The site is built in the **Podcast Network grok.com Build chat** ("Website Build", Grok Build / TanStack Start).
The published Grok preview is https://opal-finch-arrow-brave.grok.me.

This repo holds a static mirror of that preview's output:

- `site/` - server-rendered HTML for `/`, `/shows`, `/about`, `/for-shows`, `/contact`, `/network` (as `index.html`, `shows.html`, ...), plus `assets/`, `__grok/` (icon + manifest), `favicon.svg`, `og.jpg`, `robots.txt`.
- `vercel.json` - `cleanUrls` so `/about` serves `about.html`, plus long cache headers for hashed assets.

Production changes made to the mirror: removed Grok's builder script (`grok.com/grok-app-builder/extensions.js`, which adds the Remix-in-Grok badge) and the grok project-id meta tags, pointed `og:image` at podcastnetwork.org, renamed the manifest from "Grok App" to "Podcast Network".

The contact and pitch forms are client-side only (they show a thank-you message; nothing is sent anywhere yet).

## Vercel

Project `podcastnetwork-site` (team Best Known Brand): Framework preset **Other**, no build or install command, output directory `site`. Git-linked to this repo; a push to `main` deploys `site/` to production as-is.

## Syncing future changes

1. Make changes in the Podcast Network grok.com Build chat and republish the preview.
2. Re-mirror the preview: fetch each route's HTML and every referenced `/assets/*`, `/__grok/*`, `favicon.svg`, `og.jpg` into `site/` (route pages saved as `<route>.html`; delete stale hashed assets).
3. Re-apply the production edits above (strip the Grok builder script and grok meta tags, og:image, manifest name).
4. Check: no `mailto:` or email addresses, JSON-LD founder `{"@id":"https://brettkmoore.com/#person"}`, clean footer, `/network` lists the sister sites.
5. Commit on a branch, check the Vercel preview, merge to `main`.

## Old site

The previous Next.js site (production until Nov 27, 2026) is preserved in tag `pre-redesign-2026-11-27` (d42bec8). Older history: tag `v0-legacy-2026-07-01`.
