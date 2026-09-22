# Full-site review — September 16, 2026 Pacific

## Delivered page structure
`docs/routes.json` enumerates 1,942 individual routes plus `dist/404.html`: all 1,707 publicly exposed categories/sets, 14 game hubs, 80 captured product records (canonical and legacy-local URLs), 12 individual buylist pages, store information, search/tools, device-local review shopping and explicit account/checkout integration screens. All 67 links in the final original-home-page navigation snapshot resolve locally. Counts include local legacy URLs; they do not imply 1,942 unique editorial pages or a full inventory export.

The old-domain handoff regression failed before implementation. Parser/search/cart/ancestry tests failed before their new implementation. Full-file checks validate every route, local destination, image metadata, unique ID and primary heading, independently requiring every captured category/product. Local HTTP checks individually request every generated route, not just a shared template.

## Browser evidence
- Desktop shop, Magic category/set sidebar and Catalyst Stone detail inspected visually. Real product and packaging images rendered, with dated sample pricing and no live-stock claim.
- Set filter “Odyssey” reduced the Magic sidebar to one matching parent collection.
- Product review cart: 2 Catalyst Stone samples displayed $17.72; changing to 3 updated subtotal to $26.58. Saved-product toggle retained its pressed state across pages.
- Checkout retained the 3-item review and explicitly disabled payment; no payment, address or credential inputs were present.
- Phone menu opened and Account navigation reached the local page. Account showed the missing connection and collected no password.
- Deckbuilder accepted “2x Catalyst Stone,” found one actual captured match, rejected zero quantity and displayed script-tag input as escaped text, not markup.
- Buylist builder retained “3 Umbreon” and “2x Catalyst Stone” across the sell-review page, without quoting prices or submitting a sale.
- Local search for Catalyst Stone returned one sample. Advanced search for Catalyst with sample price $8–$9 returned one match and reflected filters in the URL.
- 390px: shop, Magic hub, Magic category, product, events, gallery, condition guide, sitemap, checkout, account and deckbuilder had no horizontal overflow.
- 320px: home, shop, product, cart, checkout, account, deckbuilder and gallery had no horizontal overflow. Gallery inspected visually.
- 768px: shop, hub, category, product, cart, checkout, account, about, visit, contact, news, condition guide, policies, terms and privacy had no horizontal overflow.
- 1440px: home, shop, every one of the 14 game hubs and the Riftbound singles category loaded individually without horizontal overflow. Source-category fallback correctly grouped captured Riftbound and sealed records when the old markup omitted its category label.
- Browser error log empty during the tested search/shopping flows. No external form, support request, sale, purchase, account creation or payment submitted.
- Final saved-products regression reproduced a saved entry with aria-pressed=false: synchronization had run before rendering its buttons. A real-browser failing assertion preceded the fix. Rendering the list now synchronizes the newly created controls; the same assertion passed after refreshing versioned assets and is retained in `qa/saved-toggle.browser.js`. Removing the test save showed the empty state correctly.
- Updated scripts/styles have content-hash URLs to prevent browsers retaining an earlier release. Duplicate store stylesheet references were removed from generated page heads. Final checks passed: 1,943 HTML files, 86,922 local references, all 1,942 routes individually requested over local HTTP, baseline checks, core function tests and script syntax checks.
- Cart removal reached a native confirmation that the in-app browser controls could not dismiss; its end-to-end removal result is unverified. The remaining device-local QA cart contains three Catalyst Stone samples only, not an order. No user data was cleared to work around this.

## Still required for the complete live store
Owner product export/API connection for ALL inventory records and variants; current stock/prices; secure customer sign-in and orders; payment and fulfillment configuration; actual buylist offers; verified dates/event registrations; real-store photographs; confirmed opening hours and services; owner-approved full policies and photo-use permission. Category pages without imported records explicitly say import is needed, not “out of stock.” The 80 public examples are not a complete inventory migration. Account and checkout integration screens are not completed live services.

The original business domain and customer systems remain unchanged. Publish this review only to the existing owner-private Site.
