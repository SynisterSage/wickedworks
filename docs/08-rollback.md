# 08 — Rollback & Token Rotation

If something goes wrong with live traffic:
1. Flip `VITE_USE_MOCKS=true` in your deployment environment (this is the fastest rollback path).
2. Re-deploy the previous working build (host provider rollback feature).
3. If a private Admin token may have been exposed, revoke it in Shopify Admin immediately and issue a new one.

Token rotation steps (Admin token suspected leaked):
- In Shopify Admin -> Apps -> Manage private apps / API credentials -> revoke the token.
- Update server `.env` with new token and redeploy only server parts.
- Revoke any cached session keys or sign-out admin users if necessary.

Data rollback note:
- Storefront writes (orders, inventory changes) cannot easily be rolled back. Use audit logs to understand impact and notify stakeholders.