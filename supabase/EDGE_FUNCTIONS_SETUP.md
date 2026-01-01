# Supabase Edge Functions Setup

## Add Secrets to Supabase

Run these commands to add your secrets to Supabase:

```bash
# Login to Supabase CLI (if not already logged in)
npx supabase login

# Link to your project
npx supabase link --project-ref gpnwfeitrntvdrveyoho

# Add secrets
npx supabase secrets set RESEND_API_KEY=re_jDczvvKv_DnPJu6kW3A3ypv4pR7wxWy53
npx supabase secrets set SHOPIFY_ADMIN_API_TOKEN=YOUR_SHOPIFY_ADMIN_TOKEN
npx supabase secrets set SHOPIFY_STORE_DOMAIN=wicked-works-3.myshopify.com
npx supabase secrets set SUPABASE_URL=https://gpnwfeitrntvdrveyoho.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

## Get Your Service Role Key

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/gpnwfeitrntvdrveyoho
2. Settings → API
3. Copy the **service_role** key (starts with `eyJ...`)

## Deploy Functions

```bash
# Deploy all functions
npx supabase functions deploy notify-new-products
npx supabase functions deploy notify-back-in-stock
npx supabase functions deploy notify-upcoming-releases
```

## Set Up Cron Triggers (via Supabase Dashboard)

1. Go to Database → Extensions → Enable `pg_cron`
2. Go to SQL Editor and run:

```sql
-- New products check (every 6 hours)
SELECT cron.schedule(
  'notify-new-products',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url:='https://gpnwfeitrntvdrveyoho.supabase.co/functions/v1/notify-new-products',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);

-- Back in stock check (every 2 hours)
SELECT cron.schedule(
  'notify-back-in-stock',
  '0 */2 * * *',
  $$
  SELECT net.http_post(
    url:='https://gpnwfeitrntvdrveyoho.supabase.co/functions/v1/notify-back-in-stock',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);

-- Upcoming releases digest (every Monday at 9 AM)
SELECT cron.schedule(
  'notify-upcoming-releases',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url:='https://gpnwfeitrntvdrveyoho.supabase.co/functions/v1/notify-upcoming-releases',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

## Test Functions Manually

```bash
# Test locally
npx supabase functions serve

# Test specific function
curl -i --location --request POST 'http://localhost:54321/functions/v1/notify-new-products' \
  --header 'Authorization: Bearer YOUR_ANON_KEY'

# Test deployed function
curl -i --location --request POST 'https://gpnwfeitrntvdrveyoho.supabase.co/functions/v1/notify-new-products' \
  --header 'Authorization: Bearer YOUR_ANON_KEY'
```
