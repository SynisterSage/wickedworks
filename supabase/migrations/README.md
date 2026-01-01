-- Summary of RLS Policies

-- NOTE ON RLS AND AUTHENTICATION
-- The RLS policies use `auth.jwt() ->> 'sub'` which gets the authenticated user ID from Supabase Auth.
-- For this to work, you MUST:
-- 1. Set up Supabase Auth (Google, Email, etc.)
-- 2. Ensure customers are authenticated before accessing notification features
-- 3. Store customer_id as the auth user ID (auth.uid())

-- EMAIL SUBSCRIPTIONS
-- - Public insert (anyone can subscribe)
-- - Public select/update (allow anon for unsubscribe via email link)

-- NOTIFICATION PREFERENCES
-- - Requires auth
-- - customer_id must match authenticated user ID
-- - Users cannot delete their preferences

-- PRODUCT NOTIFICATIONS
-- - Requires auth
-- - customer_id must match authenticated user ID
-- - Users have full CRUD control

-- TO EXECUTE MIGRATIONS:
-- 1. Run 001_create_email_subscriptions.sql first
-- 2. Run 002_create_notification_preferences.sql
-- 3. Run 003_create_product_notifications.sql
-- 4. All in Supabase SQL Editor
