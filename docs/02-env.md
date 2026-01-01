# 02 — Environment variables

Use Vite `VITE_` prefix for values intended for the client. Keep secrets server-side.

Recommended `.env.local` keys (client):
```
VITE_STORE_DOMAIN=your-store.myshopify.com
VITE_STOREFRONT_TOKEN=your_public_storefront_token_here
VITE_SHOPIFY_API_VERSION=2025-04
```

Server (server-only `.env` / secrets manager):
```
PRIVATE_STOREFRONT_API_TOKEN=shpat_...   # DO NOT expose to client
SESSION_SECRET=...                       # Server sessions
GEMINI_API_KEY=...                       # if used server-side only
```

Notes:
- Use `import.meta.env.VITE_STORE_DOMAIN` and `import.meta.env.VITE_STOREFRONT_TOKEN` in frontend code.
- Never prefix admin tokens with `VITE_`. If an admin token is discovered in the client bundle, rotate it immediately.
- Keep `.env.example` in repo with placeholders.