# 06 — Testing & Validation

Local testing:
- Default: keep `VITE_USE_MOCKS=true` in local dev to avoid rate limits and accidental changes.
- To test live data: set `VITE_USE_MOCKS=false` and ensure `VITE_STORE_DOMAIN` and `VITE_STOREFRONT_TOKEN` are set.

Tools to validate social/SEO assets and GraphQL:
- Facebook Sharing Debugger (OG images)
- Twitter Card Validator
- Shopify GraphiQL / Admin API explorer

Debugging fetches:
- Add logging in `graphqlFetch` and capture `query`/`variables`/`response`.
- Watch devtools network tab for CORS or token errors.

Automated tests (optional):
- Add unit tests for `adapters/shopifyAdapter` to assert mapping from sample GraphQL fixture -> `types.ts` objects.
- Add integration tests that run with a test store credentials and a test token.

Acceptance tests checklist:
- Product details render correctly for live product handles.
- Product grid pagination works.
- Cart add/remove and checkout URL returned by live API.
- Saved items persist and map correctly to live product handles.