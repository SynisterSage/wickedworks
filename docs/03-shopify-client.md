# 03 — `lib/shopifyClient` migration (non‑breaking)

Goal: add a *live* implementation using `fetch` while keeping the current mock implementation as a fallback. Toggle via an env flag.

Strategy (safe):
1. Create a new file `lib/shopifyClient.live.ts` that exports the same API surface as the existing `lib/shopifyClient.ts` (fetchProductByHandle, fetchCollectionByHandle, fetchAllProducts, etc.).
2. Update `lib/shopifyClient.ts` to conditionally import and re-export either the `live` or `mock` implementation based on env `VITE_USE_MOCKS` defaulting to `true` in dev.

Example `graphqlFetch` helper (in `lib/shopifyClient.live.ts`):
```ts
const domain = import.meta.env.VITE_STORE_DOMAIN;
const token = import.meta.env.VITE_STOREFRONT_TOKEN;
const version = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-04';
const endpoint = `https://${domain}/api/${version}/graphql.json`;

async function graphqlFetch(query: string, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json;
}
```

Example `fetchProductByHandle` (use the `product-detail.graphql` text):
```ts
import productDetailQuery from '../product-detail.graphql?raw';
export async function fetchProductByHandle(handle: string) {
  return graphqlFetch(productDetailQuery, { handle });
}
```

Conditional re-export in `lib/shopifyClient.ts` (pseudo):
```ts
if (import.meta.env.VITE_USE_MOCKS === 'true') {
  export * from './shopifyClient.mock';
} else {
  export * from './shopifyClient.live';
}
```

Why this is non-breaking:
- Hooks and adapters rely on the `shopifyClient` API shape (same functions and returned GraphQL shape). They don't need changes.
- Developers can flip `VITE_USE_MOCKS` to `false` to test live data.

Edge cases & tips:
- Some mock data fields may differ in shape/keys; use `adapters/shopifyAdapter.ts` to normalize.
- For large queries, prefer `?raw` import of `.graphql` files or store them as JS template strings.
- Add minimal retry/backoff and clear error messages in `graphqlFetch` to aid debugging.