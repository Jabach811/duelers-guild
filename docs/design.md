# Duelers Guild website design

## Outcome
A self-contained private multi-page rebuild for the Tracy gaming store, organized around Shop, Play, Sell, and Visit. The September 16 full-site request supersedes the original front-door-only scope: all store navigation now stays inside the new site. Every captured public category and set receives its own local page; every captured product receives a detail page. Account, payment, live inventory and buylist services are explicitly not connected and must not be represented as functional transactions.

## Visual direction
Modern tabletop guild: bold condensed typography, the supplied blue DG sword logo, cool silver surfaces, royal blue, and an original editorial still life of cards and dice. The image represents tabletop products; it must not be described as a photograph of the real store. The owner-approved September 16 revision uses an edge-to-edge image hero with white overlaid type and a navy readability layer. Keep the blue community section and all existing flows. Avoid faux medieval legal copy, generic storefront banners, carousels, stock metrics, and invented reviews.

Palette: guild blue #2159db; midnight #15253f; silver #edf1f7; white #ffffff; ice #a7e8ff; amber #ffd17a. Display: Barlow Condensed, weight 600/700. Body: DM Sans, weight 400/500/600. Left alignment, 1280px maximum content width except the full-bleed hero, generous whitespace, and expressive title scale. The 14-category directory uses real representative product images, three columns on desktop, two on tablets, and compact image-plus-text rows on phones. Images must remain fully visible rather than cropping packaging or logos.

## Content and behavior
- Header: original logo, local Shop/Play/Sell/Visit pages, mobile navigation, Account and device-local review cart.
- Hero: clear description of the store and two routes into shopping and community.
- Shop: local sample-catalog search and a curated visual directory of all 14 existing game-and-gear categories, with local Singles/Sealed pages and game hubs. Preserve shareable filters. Dated prices are samples, not live inventory. Representative product photos are not an availability promise; retain source/provenance records and confirm reuse permission before real-domain launch.
- Play: confirmed offering of tournaments and casual play; Facebook, Instagram, Discord, and telephone paths for current dates. No manufactured calendar.
- Sell: local list builder/review, explicit live-offer boundary, accessible condition-guide dialog/page and local deckbuilder.
- Visit: 104 W 11th Street, Tracy, CA 95376; (209) 699-4106; support@duelersguild.com; directions. Display Closed Wednesdays and call for today's hours until the conflicting schedules are resolved.
- Footer: local navigation covering store content, tools, account, policies/terms/privacy and the searchable Every page index.

## Implementation constraints
- Build static HTML/CSS/JavaScript in dist; no application dependencies are required.
- Keep every local image/font inside dist/assets.
- Include a specific favicon, metadata, meaningful image text, semantic headings, visible focus, and a skip link.
- Support mobile navigation, keyboard operation, reduced motion, and 320px to 1440px screens.
- No external form submission during QA. Search is local. Review carts, saved products, decklists and sell lists are explicitly stored only on the visitor's device; email/phone links use the visitor's own apps. See `docs/full-site-plan.md` for the updated scope and integration boundary.
- No fabricated dates, hours, prices, photos of the store, credentials, testimonials, or business history.
- Prepare a private review site. Replacing the real domain requires a separate production rollout decision.

## Source baseline
Audited 2026-09-16: https://www.duelersguild.com/, /about, /contact_us, /card_condition_guide, /products/multi_search, /buylist/multi_search, /store_policies, /terms_and_conditions, /photo_gallery, /catalog/magic_the_gathering_singles/8.
Address, phone, email, game categories, and social destinations were observed on the live site. Hours conflict: header 2–9 PM weekdays except Wednesday, 11 AM–10 PM Saturday, noon–8 PM Sunday; About/footer 2–10 PM weekdays except Wednesday, 11 AM–11 PM Saturday, noon–9 PM Sunday.

## Real-domain launch decisions
Confirm the current hours and event source with the owner. Confirm whether axe throwing and batting cages are actual current offerings. Review the full policies/privacy wording and photo permissions with the owner. Import the complete product inventory and connect secure commerce/account/buylist services inside the new experience; the requested direction no longer hands these flows back to the old site. These connections are required before replacing the real business domain, but do not block this private page-structure review.
