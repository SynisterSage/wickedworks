# 07 — Deploy & Env management

CI / hosting recommendations:
- Host frontend on Vercel/Netlify (both support Vite builds and easy env management).
- Add `VITE_*` env vars in the host UI (Vercel env variables) — they will be baked into the client bundle at build time.

Important: do NOT set server-only secrets as `VITE_` vars in deployment UI. Instead store Admin tokens in serverless function environment or a separate server.

Build pipeline example (Vercel):
- Set `VITE_STORE_DOMAIN` and `VITE_STOREFRONT_TOKEN` in project settings.
- Add `VITE_USE_MOCKS=false` for preview/prod if you want live data.
- For serverless proxies, set `PRIVATE_STOREFRONT_API_TOKEN` in the serverless function environment (not prefixed with VITE_).

CDN & caching:
- Serve large image assets or OG images from a CDN (Cloudflare, S3+CloudFront).
- Cache GraphQL responses if you have server proxies; otherwise cache on client where appropriate.

Monitoring & logs:
- Add a lightweight logging service for server-side proxy operations (Sentry/Logflare).
- Monitor Shopify Admin audit logs after enabling admin-level integrations.