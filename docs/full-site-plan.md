# Complete Duelers Guild rebuild

## User-approved direction
Replace all old-store handoffs. Keep the accepted full-bleed hero, DG logo, royal-blue/navy/silver palette, Barlow Condensed and DM Sans, and all 14 game-and-gear photos. Extend that design into a complete local browsing experience rather than a brochure linking to the original store.

## Scope and source of truth
Read-only public capture: `docs/source/public-capture.json`, captured September 16, 2026 Pacific. It contains the complete 1,707-node category tree exposed by the public home page, 80 product examples and 12 individual buylist references. Those examples are NOT a complete inventory migration or live availability. Many public routes returned 502/503; do not infer missing content or retry aggressively.

Create individual category/set pages at every captured category path, with real title, ancestry, subcategories, local search and available sample records. Create a detail page for each captured product, with source-date pricing explicitly described as a sample. Preserve legacy product/category URLs locally. Unimported records must not be invented. Product imagery remains representative unless an actual corresponding product image was acquired.

Create home, shop, all categories, 14 game hubs, search, advanced search, deckbuilder, sell overview, buylist builder, sell-list review, cart, checkout, wishlist, sign-in, registration, password reset, account, order history, events, play/community, about, visit, contact, gallery, news, condition guide, store policies, terms, privacy, sitemap and not-found pages. Also create local equivalents of observed legacy public routes.

## Integration boundary
This is a private review site, not a live replacement of duelersguild.com. No payment, order, offer, account, reservation, support message or password reset will be represented as submitted. Account and checkout pages expose their real integration requirement and do not accept credentials/payment information. The cart, wishlist and card lists are explicitly device-local review tools. Buylist prices require a verified owner-controlled feed; no made-up offers. No fabricated events/dates, real-store photos, shipping rates, privacy processors, discounts or return promises. Policies and terms are concise source-derived summaries for owner review, not newly approved legal terms.

An owner inventory export/API connection is required for ALL product records, current prices/stock, authenticated customer data, order processing, payment collection, buylist offers and publishing actual schedules/photos. Ask for this while independent page work continues.

## Implementation and checks
- [x] First establish a regression check that fails on old-domain navigation.
- [x] Build shared static-page templates extending existing styles; generate all catalog and product pages from the capture and a route manifest.
- [x] Implement local search, category filtering, card-list parsing/export, review cart quantities/removal and saved products; test these with real functions and literal fixtures before wiring pages.
- [x] Replace every home-page old-store link and search action with a local destination; retain social, map, phone and email links.
- [x] Verify every generated HTML link, asset, ID, heading and captured category/product route. Inspect desktop/mobile content, catalog, product, search, cart, checkout, account and tools in-browser without external submissions. See `full-site-verification.md` for evidence and the cart-removal browser limitation.
- [ ] Publish the exact tested revision to the same private review site; preserve current access and real domain.

## Visual thesis
The homepage is the cinematic introduction; shopping pages are useful shelves, not repeated heroes. Navy display type, silver work surfaces and white product stages keep the accepted tabletop identity. A blue section band and real category packaging anchor game hubs. Dense set indexes use compact lists and a searchable sidebar. Product/detail, cart and list tools get restrained two-column working layouts, collapsing into a single readable phone column. No new ornamental motion or competing design system.
