# Wicked Works Storefront — Phase 1 → Current Summary

## Phase 1 (initial milestone)
- Migrated routing to React Router v6 and shipped the initial navigation shell.
- Established base layout (Header, Footer, global App shell) and Vite build.
- Set up mock data for products/collections plus Shopify adapters and query scaffolding.
- Added core components: product grid/detail pages, cart drawer, saved list, access panel, and archives surface.

## Data & API foundations
- Expanded Shopify adapters to include tags, availability, createdAt, and metafield parsing for release/vault states.
- Updated PRODUCTS_QUERY to carry createdAt and price range; COLLECTIONS_QUERY now fetches lightweight product edges for counts.
- Types updated to reflect new product fields (tags, availability, createdAt) and collection asset counts.

## Catalog filtering & search
- useProducts now supports:
  - Category heuristics (outerwear, bags, accessories, apparel, footwear) using productType/title/tags.
  - Intent filtering via tags, size/color filters, and text search over title/handle.
  - Sorting: featured/best, newest, price low→high, price high→low.
  - Price range filtering with derived min/max from catalog data.
  - Dynamic color facets derived from product options; mock fallbacks when needed.
- Shop page wiring:
  - URL hydration for category/intent/sort/search; prevents filter stacking between navigations.
  - Mobile/desktop filter UI with scrollable size/color lists and price inputs.
  - Sort selector surfaced on all breakpoints; search bar and reset behaviors refined.
  - Price input scroll-jump eliminated by stopping URL writes during typing and keeping preventScrollReset.

## Navigation & Mega Menu
- Mega Menu "Shop All" now drives real filters (category/intent/sort) and shows featured products.
- Added Accessories to Shop All fallback categories.
- Archives panel shows upcoming vs vaulted with featured visuals.
- Header behavior tuned to close menus on navigation and honor scroll state.

## Collections
- Collection cards now compute asset counts from actual product edges (assetCount fallback to product length).
- Collection detail view uses fetched products and shows payload size.

## UI/UX refinements
- Scrollable filter lists for large color/size sets (keeps viewport stable on mobile/desktop).
- Centered dash between price inputs for consistent alignment across breakpoints.
- Prevented filter URL sync from forcing scroll jumps while typing.

## Next ideas
- Add debounce/"Apply" for price filters to further reduce URL churn if desired.
- Enrich product tags to improve intent/category heuristics and mega-menu targeting.
- Add availability and price range chips to the grid toolbar; consider pagination or lazy load.
