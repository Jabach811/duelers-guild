# Assets and provenance

## Original business logo
Local file: dist/assets/logo.png. Copied unchanged from the live Duelers Guild site's public brand asset, https://cc-client-assets.cdn.crystalcommerce.com/store/duelersguild/0a46b8c0e94f44f29390ec6b6047c65b/large/Duelers%20logo.png. This is the business's existing logo, not a generated replacement.

## Hero illustration
Local web asset: dist/assets/tabletop.webp. Original PNG is preserved in source-assets/tabletop.png and in the built-in generated image location. Generated once with built-in image_gen, 2026-09-16. It is illustrative product artwork, not a factual photo of the store, its people, or its inventory.

Prompt: Premium studio tabletop still life with cobalt card-sleeve backs, a slate-blue deck box, blue and ivory polyhedral dice, and one unbranded fantasy miniature; silver table, indigo backdrop, cobalt lighting and amber highlights. Landscape 3:2, tactile materials, crisp collectible editorial photography. No text, logos, store interior, people, or watermark.

## Game and gear product images
Added September 16, 2026 at the owner's request. Every one of the 14 categories has a real representative product photo from Duelers Guild's existing catalog or the game's official publisher. The 9 store-catalog sources cover Magic, Pokémon, Lorcana, One Piece, Riftbound, Star Wars Unlimited, dice, miniature games, and paints; official publishers cover Yu-Gi-Oh!, Gundam, Union Arena, Digimon, and Palworld. Original files are preserved in source-assets/games. The full per-image source URLs, exact titles, dimensions, and reuse notes are in docs/game-images.json.

The web copies are local WebP files in dist/assets/games, resized inside a maximum 640×640 area without cropping, distortion, or enlargement. Retaining the original photo proportions keeps tall packs legible in the compact phone layout. All 14 below-fold images use lazy loading and explicit dimensions that match their actual files. Their combined web weight is approximately 702 KB. These are category examples, not live stock or price promises; the page says to check inventory for availability. No image was generated to imitate a licensed game or product. Public/commercial reuse permission has not been established; confirm the owner's catalog image rights and publisher media use before real-domain launch. This deployment remains a private review.

## Fonts
Barlow Condensed 600/700 and DM Sans 400/500/600, retrieved from Google Fonts and stored locally in dist/assets/fonts. Both families are released under the SIL Open Font License. License files are retained alongside the fonts. No external font request is made by the finished site.

## Icons
Small inline SVG interface icons: pin, chevron, external-link direction, phone, mail, search, and calendar. These are functional interface geometry. No representational artwork is constructed with CSS or SVG.
