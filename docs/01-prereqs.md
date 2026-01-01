# 01 — Prerequisites

1. Shopify Store Admin access for the target store.
2. Create a **Storefront access token** (Storefront API) in Shopify Admin -> Apps -> Develop apps -> create token for Storefront usage.
   - This token is safe to use in the browser (client‑scoped), but treat it as semi‑public — rotate if compromised.
3. (Optional) Admin token (`shpat_...`) for server-side admin tasks. Keep this secret and never expose via client env.
4. Local dev environment: Node 18+ recommended, `npm` or `yarn`, Vite dev server.
5. Ensure `.env.local` is in `.gitignore` and you have a `.env.example` in repo.

Quick verification commands:
```bash
# start the app
npm install
npm run dev
# test GraphQL with a curl example (replace domain & token)
curl -s -X POST https://YOUR_STORE_DOMAIN/api/2025-04/graphql.json \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: VITE_STOREFRONT_TOKEN" \
  -d '{"query":"{ shop { name } }"}' | jq
```