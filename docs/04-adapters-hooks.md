# 04 — Adapters & Hooks (keep unchanged)

Key idea: adapters (`adapters/shopifyAdapter.ts`) map raw Shopify GraphQL nodes -> internal `types.ts`. Keep these as the contract boundary.

What to check:
- `mapProductFromGraphQL` expects `images`, `variants` as connections (edges/nodes). Ensure live responses match that.
- `utils/flattenConnection.ts` converts `edges/nodes` to arrays — keep using it.

Hooks to review (they call `shopifyClient`):
- `hooks/useProducts.ts` (uses `MOCK_PRODUCTS` now) — can keep using `useProducts` as-is when `shopifyClient` returns `data.products.nodes`.
- `hooks/useProductByHandle.ts` — will receive `res.data.product`; adapter maps it.
- `hooks/useCart.ts` — local only; no change unless integrating real checkout creation.

Recommendation:
- Do not modify hooks. Instead ensure `shopifyClient.live` returns the same `res` object shape as the mock implementation (i.e., `{ data: { product: ... } }`) so adapters/hook consumers work without change.