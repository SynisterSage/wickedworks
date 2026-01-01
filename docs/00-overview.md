# Migration Overview

Purpose: migrate the prototype from local/mock Shopify data to the real Shopify Storefront API without breaking the existing UI or developer workflow.

Goals:
- Keep current mock behavior as a safe fallback.
- Wire client code to the Storefront GraphQL endpoint using a client-safe Storefront token (`VITE_STOREFRONT_TOKEN`).
- Keep Admin/private tokens server-side only.
- Minimal changes to existing hooks/components by swapping the `lib/shopifyClient` implementation.

Structure of this docs folder:
- `01-prereqs.md` — prerequisites and credentials
- `02-env.md` — environment variables conventions
- `03-shopify-client.md` — non-breaking replacement strategy for `lib/shopifyClient.ts`
- `04-adapters-hooks.md` — how adapters and hooks are used and kept unchanged
- `05-checkout.md` — implementing a real checkout/cart flow
- `06-testing.md` — local and production testing steps, sharing/debugging tools
- `07-deploy.md` — deployment and env management notes
- `08-rollback.md` — rollback plan and token rotation guidance
- `checklist.md` — quick checklist to follow

Audience: frontend devs, ops, and LLMs that will automate parts of the migration. Each file is intentionally short, prescriptive, and includes explicit snippets.