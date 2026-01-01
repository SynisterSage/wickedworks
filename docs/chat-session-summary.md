# Session Summary (Jan 1, 2026)

## Auth & Session
- Added refresh token flow and auto-refresh on load/refreshCustomer to keep Shopify Customer Account sessions valid.
- Logout now stays on /account (no redirect) so the sign-in prompt remains visible.

## Notifications (Account)
- Wired AccountPageNew notification toggles to Supabase `notification_preferences` with proper loading/guards and async updates.
- Added anon RLS allowances (select/insert/update) to unblock client-side prefs.

## Notifications (Back-in-Stock / Emails)
- Added CSV guidance for `product_notifications` testing.
- Clarified test flow: product must be in stock, customer_id must be numeric Shopify ID, and function secrets (Shopify Admin, Resend, service_role) must be set. Provided curl trigger for `notify-back-in-stock`.

## Email Subscriptions (Footer "Network")
- Footer wired to Supabase `email_subscriptions`, persisted via localStorage, with opt-out that marks `is_subscribed=false` and sets `unsubscribed_at`.
- Added loading states and opt-out UI; toasts now auto-theme.

## UI/UX Tweaks
- Toasts follow light/dark via theme="auto".
- Footers updated to © 2026.

## Legal/Content
- Privacy and Terms pages updated (Jan 2026) to reflect Shopify, Supabase (storage), Resend (email), cookies/tracking, rights (GDPR/CCPA), and platform references.

## Known Follow-ups / Testing Notes
- Back-in-stock emails send only when `product.totalInventory > 0`; use a hidden/in-stock test product or add a force flag if needed.
- Ensure Edge Function secrets are populated in Supabase (Shopify Admin token, Resend API key, service_role key).
- For `product_notifications`, use numeric Shopify customer IDs (not GIDs) for email lookup.
