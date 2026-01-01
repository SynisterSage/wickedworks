# Migration Checklist (quick)

- [ ] Create `VITE_STOREFRONT_TOKEN` and set `VITE_STORE_DOMAIN` in `.env.local`.
- [ ] Add `lib/shopifyClient.live.ts` that implements `graphqlFetch` and the same API as mocks.
- [ ] Update `lib/shopifyClient.ts` to conditionally export live or mock implementation using `VITE_USE_MOCKS` flag.
- [ ] Verify `adapters/shopifyAdapter.ts` maps live GraphQL shapes. Add small unit tests with sample fixture.
- [ ] Implement `createCheckout` call (client or server proxy). Update `useCart` to call it.
- [ ] Verify UI flows: product list, product detail, saved, cart, checkout redirect.
- [ ] Test OG and Twitter images with validators.
- [ ] Add `VITE_USE_MOCKS=false` in staging/prod only after validation.
- [ ] Keep Admin tokens server-side and rotate if accidentally exposed.

If you want, I can create the `lib/shopifyClient.live.ts` skeleton and the conditional loader patch now.