
# Archives Migration Plan

1. **GraphQL Fragments**: Update product fragments in your Storefront API queries to include `metafields(identifiers: [{namespace: "release", key: "release_date"}, {namespace: "release", key: "vaulted"}])`.
2. **Shopify Admin**: Add the "release" namespace to Metafield Definitions in Settings > Custom Data > Products.
3. **Automation**: Use a Shopify Flow to automatically toggle the `vaulted` metafield to 'true' when stock reaches 0 or after a specific campaign date.
4. **Collection Strategy**: Create an automated collection in Shopify with handle `archives` that includes all products where `release.release_date` is not empty or `release.vaulted` is true.
5. **Environment**: Ensure the `shopifyClient.ts` is switched from the mock to a real `fetch` call pointing to your authenticated Shopify domain.
6. **Timezones**: Always input release dates in ISO 8601 format (UTC) in the Shopify Admin to ensure the client-side `isUpcoming` logic accurately compares to the user's local time.
