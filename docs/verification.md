# Review-site verification

## Browser checks completed 2026-09-16
- Desktop hero and community/selling composition inspected visually.
- Phone hero, shop/search controls, and condition-guide dialog inspected visually at 390px.
- Document width checked at 320px, 390px, 768px, and 1440px: no horizontal overflow.
- Logo, artwork, and local fonts loaded successfully.
- Phone menu opens, exposes the section links, and closes when a section is selected.
- Tabletop filter displays the 3 matching categories and updates the accessible count.
- Condition guide opens with the close control focused. Escape closes it, removes body scroll lock, and returns focus to the opener.
- Anchor positioning uses 110px desktop/85px phone scroll padding to keep content below the sticky header.
- Reduced-motion CSS disables animation and smooth scrolling. OS preference emulation was not available in the browser controls, so this branch was reviewed in source.
- External forms were not submitted, and no messages or purchases were made.

## Static validation
Run `node qa/verify.mjs` and `node --check dist/app.js` from the project folder. The validation checks section targets, duplicate IDs, the static entrypoint, local assets/fonts, image descriptions/dimensions, JavaScript syntax, search routing, actual contact information, and unfinished content.

## Full-bleed hero and photography revision, September 16, 2026
- The image hero spans the actual page width; narrow-phone measurement was left 0/right 305 with a 305px document and no sideways overflow.
- The hero was inspected visually on desktop and at 390px phone width, with readable white type and visible actions over the navy image overlay.
- Every one of the 14 directory categories has an inspected real product image. All 14 local WebP files loaded successfully in the browser.
- Desktop: three photo columns at 1440px. Tablet: two columns at 768px. Phones: compact image-and-text cards at 390px and 320px, with no horizontal overflow and at least 44px-high category links.
- A desktop alignment regression was caught by comparing the card and photo widths. Both now match at 409px on the measured first three cards.
- All, Trading cards, and Tabletop filters display 14, 11, and 3 categories. Query state remains shareable and the matching photos remain visible.
- The phone menu opens and closes correctly on section navigation.
- Final browser error log was empty. External forms were not submitted.
- Fresh Web Interface Guidelines were read from https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md. New imagery has meaningful descriptions, matching explicit dimensions, local optimized files, lazy loading, and uncropped presentation. The hero retains reduced-motion support, readable overlay contrast, and existing safe-area handling.
- `node qa/verify.mjs` passes. `node qa/verify-game-images.mjs PATH_TO_INSTALLED_SHARP` decodes all 14 web images, checks original proportions and matching HTML dimensions, and passes with 701984 total image bytes. The image-dimension check was observed failing before the markup correction, then passing.
- Product image sources and public-use unknowns are retained in docs/game-images.json. The real business domain remains untouched.

## Deliberate product limits
Stock, prices, checkout, buylist offers, and accounts remain on the real store. Current event dates and opening times must be confirmed by the owner; the review site routes visitors to the Guild for those details. All external links were copied from observed store destinations or formed from the confirmed GET inventory-search endpoint. This is a new private review site, not a replacement of the real domain.
