# Duelers Guild Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task. The user has authorized planning and building together; proceed inline without an additional design approval gate.

**Goal:** Build a clear, distinctive new website for Duelers Guild that sends visitors to shopping, selling, community, and store information.

**Architecture:** A static one-page site with anchored sections and a native condition-guide dialog. Commerce remains on the existing Crystal Commerce routes. No backend, fake inventory, or duplicate checkout.

**Tech stack:** HTML, CSS, vanilla JavaScript, locally stored fonts and artwork.

**Spec:** ../../design.md

## Global constraints
- Build static HTML/CSS/JavaScript in dist; no application dependencies are required.
- Keep every local image/font inside dist/assets.
- No fabricated dates, hours, prices, photos of the store, credentials, testimonials, or business history.
- Prepare a private review site. Replacing the real domain requires a separate production rollout decision.

## Task 1: Recognizable first preview
Files: dist/index.html, dist/styles.css, dist/assets/logo.png, dist/assets/fonts/*, .openai/hosting.json.
Consumes: verified business facts and the design palette. Produces: working header, hero, original brand mark, shop destination, favicon, and local preview.

- [ ] Author the semantic document and style tokens. Header anchors use #shop, #play, #sell, and #visit. The hero explains the store in plain words.
- [ ] Store the original logo locally and obtain Barlow Condensed and DM Sans fonts, with reliable system fallbacks.
- [ ] Start one retained local HTTP server for dist; request the exact root URL and require HTTP 200.
- [ ] Open the working first preview in the user's Codex panel.

## Task 2: Complete the linked experience
Files: dist/index.html, dist/styles.css, dist/app.js, dist/assets/tabletop.webp, docs/assets.md.
Consumes: the initial document and verified routes. Produces: complete shop/play/sell/visit flow and accessible interactions.

- [ ] Add game rows and direct links to existing Singles/Sealed categories. Inventory search uses `action="https://www.duelersguild.com/products/search"`, `method="get"`, and `name="q"`.
- [ ] Add current-event contact paths rather than unverified event dates.
- [ ] Add the buylist and deckbuilder destinations and a condition guide using `<dialog>` with `.showModal()` and `.close()`.
- [ ] Add address, `tel:2096994106`, `mailto:support@duelersguild.com`, and the verified directions link.
- [ ] Implement mobile navigation with `aria-expanded`, Escape closing, and anchor closing. Implement directory filters without moving keyboard focus.
- [ ] Integrate the single original artwork and record provenance. Honor `prefers-reduced-motion: reduce`.

## Task 3: Verify and deliver
Files: qa/verify.mjs, docs/verification.md, README.md; publication files only if the private hosting path succeeds.
Consumes: the complete static site. Produces: verified review copy and a plain-language handoff.

- [ ] Validate all local asset references and JavaScript syntax. Check all section links resolve, duplicate IDs are absent, and the key business details match the source.
- [ ] Inspect desktop and phone layouts visually; check there is no horizontal overflow at 320px, 390px, 768px, and 1440px.
- [ ] Exercise mobile navigation, directory filters, condition dialog, Escape/focus return, and reduced motion. Do not submit external forms.
- [ ] Repair failures and record actual outcomes and any remaining owner decisions.
- [ ] Package and privately publish the verified source when available; confirm terminal deployment success. Preserve the real business domain.
- [ ] Hand off the working review site and the plan.
