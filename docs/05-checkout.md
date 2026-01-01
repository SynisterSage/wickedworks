# 05 — Checkout & Cart

Current: `useCart` stores cart in `localStorage` and returns a mock `checkoutUrl: '/checkout'`.

Migration options:
A) Use Storefront Checkout/Create Cart (client-side):
- Use the Storefront `checkoutCreate` mutation (or new Cart APIs) which returns a web_url or checkout URL.
- This can be called directly from the browser using the `VITE_STOREFRONT_TOKEN`.

B) Use a server-side proxy for checkout (recommended for control):
- Implement a server endpoint `/api/checkout/create` that calls the Admin/Storefront API server-side and returns a redirect URL.
- Pros: keep admin tokens private, you can attach server-side logic (discounts, analytics, fraud checks).

Example client flow (simple):
1. User clicks checkout → frontend sends cart items to `shopifyClient.createCheckout(cart)`.
2. `createCheckout` creates a checkout via GraphQL mutation and returns `checkout.webUrl`.
3. Frontend redirects to `checkout.webUrl`.

Server proxy example (Express):
```js
// POST /api/checkout/create
// body: { items: [{ variantId, quantity }] }
const ADMIN_TOKEN = process.env.PRIVATE_STOREFRONT_API_TOKEN;
await fetch(`https://${STORE}/admin/api/${version}/graphql.json`, { headers: { 'X-Shopify-Access-Token': ADMIN_TOKEN } ... })
```

Security note: avoid building Admin functionality into pages that run in the browser. If you must create orders/payments, do it server-side.