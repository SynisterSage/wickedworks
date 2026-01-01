-- Set up cron jobs to automatically trigger email notification functions
-- Run this SQL in Supabase Dashboard → SQL Editor

-- 1. New products check (every 6 hours)
SELECT cron.schedule(
  'notify-new-products',
  '0 */6 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://gpnwfeitrntvdrveyoho.supabase.co/functions/v1/notify-new-products',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwbndmZWl0cm50dmRydmV5b2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzEwNTIsImV4cCI6MjA4Mjg0NzA1Mn0.6PZW0GBphy3icMtZfLdk8uICvXDBTHYmbH9ibLhnPGQ"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- 2. Back in stock check (every 2 hours)
SELECT cron.schedule(
  'notify-back-in-stock',
  '0 */2 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://gpnwfeitrntvdrveyoho.supabase.co/functions/v1/notify-back-in-stock',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwbndmZWl0cm50dmRydmV5b2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzEwNTIsImV4cCI6MjA4Mjg0NzA1Mn0.6PZW0GBphy3icMtZfLdk8uICvXDBTHYmbH9ibLhnPGQ"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- 3. Upcoming releases digest (every Monday at 9 AM UTC)
SELECT cron.schedule(
  'notify-upcoming-releases',
  '0 9 * * 1',
  $$
  SELECT
    net.http_post(
      url:='https://gpnwfeitrntvdrveyoho.supabase.co/functions/v1/notify-upcoming-releases',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwbndmZWl0cm50dmRydmV5b2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzEwNTIsImV4cCI6MjA4Mjg0NzA1Mn0.6PZW0GBphy3icMtZfLdk8uICvXDBTHYmbH9ibLhnPGQ"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- View all scheduled jobs
SELECT * FROM cron.job;

-- To unschedule a job (if needed):
-- SELECT cron.unschedule('notify-new-products');
-- SELECT cron.unschedule('notify-back-in-stock');
-- SELECT cron.unschedule('notify-upcoming-releases');
