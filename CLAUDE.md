# CLAUDE.md

## Review policy (Brett approved 2026-11-12)

- Copy and content changes (text, images, blog posts, metadata) merge once the checks pass and the Claude review raises nothing.
- Product, pricing and checkout changes (offers, prices, payment links, Stripe, forms that take money, what the product includes) need Brett's review before merge.
- When unsure which kind a change is, treat it as product.
- Work happens on a branch with a pull request. Do not push to main directly or force-push.

## Project context in Drive (Brett approved 2026-11-12)

Every session, local or cloud, records this project's context in Drive while it works, so Grok can read it.

- Folder: `Context/Lanes/Podcast Network/projects/<Project name>/`. Create it if new.
- Each update is a new file named `<YYYY-MM-DD HHMM> <start|milestone|end>` (Eastern time). Do not edit earlier ones.
- Write at the start, at each milestone, and at the end: goal, status, decisions with who and when, open items with an owner, links (PRs, deploys, Drive files).
- Local: write `.md` under `/Users/brett/Context/`. Cloud: use the Google Drive connector; find the lane folder with `search_files` under the Context folder (id `18BMeu4K3eAo9f9YNFesDApgq3Ju4yHHW`), then `create_file`. If Drive is unreachable, say so at the start.
