# Duelers Guild — Reimagined

A self-contained private multi-page rebuild. The real business domain remains untouched. All store navigation stays inside this new site; maps, social channels, email and telephone remain intentional external actions.

Serve dist with a static HTTP server. Absolute routes and catalog loading require HTTP; double-clicking HTML is no longer supported. No application dependencies are required. All fonts, logo, artwork and downloaded product photos are local. Run `node scripts/build-pages.mjs` to regenerate catalog/content pages from the captured data.

A separate September 21 visual concept preserves the original project and its deployed blue version. The new identity uses an orange shield mark, Bricolage Grotesque / Outfit typography, and aubergine, orange, lilac and ivory. `dist/brand.css` is the site-wide presentation layer, loaded last by the generator. Brand direction and source notes are in `docs/brand-guidelines.md`.

The homepage has a new image/copy composition and player shortcuts. All 14 game-and-gear photos remain. Individual pages cover all 1,707 publicly exposed categories and sets, game hubs, captured product details, local/advanced search, deckbuilder, sell lists/buylist, saved products, review cart/checkout, account workflows and store-information/footer pages. Exact routes are in `docs/routes.json`; historical coverage is recorded in `docs/full-site-plan.md`.

The public product capture is a sample, NOT a complete inventory migration. Sample prices are dated, not checkout promises. Review carts, saved products and card lists stay on the visitor's device. This preview does not accept orders, payments, offers, registrations, passwords, addresses or support submissions. Service pages explain their missing connection instead of simulating success.

## Motion
`dist/motion.js` and `dist/motion.css` retain the staged hero entrance, desktop camera movement, moving game ribbon, card-deal reveals, hover lift, menu/dialog transitions and reading-progress line. The shared header has a keyboard-accessible Pause motion control; its device-local preference survives navigation. Device reduced motion takes priority, renders a complete static game ribbon and never hides content. Desktop camera work is disabled on phones; offscreen/hidden-page camera loops pause. The new brand layer adjusts movement to the new composition. There is no new animation library or live-store service.

The generator adds versioned motion assets and one control to every page. `qa/motion.browser.js` records the real-browser pause/navigation regression checks. For the isolated reduced-motion contract fixture, run `node qa/reduced-motion-server.mjs` and inspect `http://127.0.0.1:4318/` with the normal browser controls. This fixture simulates a media preference for the real script and does not alter actual device settings or ship with the static site.

Checks: `node qa/verify.mjs`, `node qa/verify-full-site.mjs`, `node qa/store-core.test.cjs` and `node --check dist/store.js`. Image provenance is in `docs/game-images.json` and `docs/product-images.json`. Original downloads remain under `source-assets`.

A verified owner export/API connection is required for ALL product records, current stock/variants, customer accounts/orders, payments, buylist offers and live events. Confirm opening hours, real-store photos, other services, policies and photo-use permissions before real-domain launch. Preserve the existing private Site and audience when publishing review revisions.
