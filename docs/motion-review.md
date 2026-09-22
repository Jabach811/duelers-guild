# Guild motion review — September 16, 2026 Pacific

The accepted logo, full-bleed illustration, blue/navy/silver palette, fonts, real category/product imagery, routes and store boundaries are preserved. The motion direction uses a cinematic tabletop camera and a card-deal rhythm, implemented with native browser animation APIs and CSS. No extra framework, media downloads, fake activity, inventory refresh, account service or payment connection.

## Delivered

- Staggered hero copy/illustration entrance, under 700ms total.
- Slow desktop camera breathing and bounded pointer/scroll response. Camera work is disabled below 761px; pointer/scroll response also requires a fine pointer. The camera loop pauses when the hero is offscreen or the page is hidden.
- Continuous game-name ribbon with one accessible original group and a decorative hidden clone. Pause motion freezes it; reduced motion restores a complete static wrapped list.
- Card-deal entrances for game/product cards, coordinated section/page heading reveals and handling of product cards inserted by search or saved-product rendering.
- Desktop card/packaging hover lift, button press feedback, mobile menu and condition-guide dialog entrances, expandable-text transition, and a reading-progress line.
- One keyboard-accessible motion control on every page. Its preference is device-local, persists across navigation and yields to device reduced motion. Content remains readable without JS, observers or animation support.

## Fresh evidence

- Real-browser pause-control assertion failed against the original site before implementation; pause/resume then passed. Pausing retained fully opaque content and disabled the camera, while resume restarted camera/ribbon animation.
- A phone navigation regression initially swallowed an immediate motion-control click during native cross-document snapshot transitions. It reproduced after completed navigation and persisted despite pointer-event overrides. Removing native snapshot navigation resolved the same test. Those snapshots and unused rules were removed; page/section entrances provide the transition effect without delaying links or controls.
- Modal background-motion assertion failed with a running ribbon because the active-loop selector outweighed the dialog pause selector. Corrected specificity made the same assertion pass. Guide entrance remained animated; no guide content or focus restoration was changed.
- Hovered supplies tile moved up 5px; its packaging image tilted/lifted. Filtering gave 3 tabletop categories and 11 trading-card categories. Scroll-triggered cards received their reveal state. Local search returned one actual Catalyst Stone example, and its newly inserted product card was revealed.
- Offscreen hero check after scrolling settled: hero bottom -2522px, visibility flag false, camera animation paused. Keyboard Enter on the motion button resumed the experience.
- 320px: home, shop, product, cart, account, deckbuilder and search had no horizontal overflow and one motion control.
- 390/768/1440px: home, shop, Magic hub/category, product, search, cart, checkout, account, deckbuilder, buylist and sitemap each had no horizontal overflow and one control. Phone hero/shop and desktop filtered game cards inspected visually.
- Isolated local QA fixture exercised the real script with a simulated device media preference at startup and on change: mode reduced, no camera/ribbon animation, fully opaque content and one visible static ribbon group. Actual OS/browser preference was not changed. Native reduced-motion CSS fallback reviewed; this fixture tests the script's media-query contract, not an actual device preference toggle.
- Browser error logs empty during checked flows. No new cart items, payments, accounts, offers, messages or external forms submitted.
- Final static/HTTP/core checks passed: 1,943 HTML files, 90,808 local references, all captured categories/products, one accessible motion control per HTML file, and every one of the 1,942 generated routes requested individually. Baseline and JavaScript syntax checks passed. Existing parser/search/cart/ancestry function tests passed.

## Unchanged live-store requirements

The catalog is still 80 public examples, not the complete inventory. Real stock, accounts, checkout, buylist offers and event feeds still require owner-controlled connections. This update is for the existing owner-private review Site only; the original business domain is unchanged.
