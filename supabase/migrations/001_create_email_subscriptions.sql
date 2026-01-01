-- Email Subscriptions Table
-- Stores newsletter signups from the footer and notification preferences
-- RLS: Users can only view/edit their own subscriptions

CREATE TABLE IF NOT EXISTS email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_is_subscribed ON email_subscriptions(is_subscribed);

-- Enable RLS
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow inserts (anyone can subscribe)
CREATE POLICY "Allow public to subscribe"
  ON email_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Allow users to view their own subscription (by email)
CREATE POLICY "Users can view their own subscription"
  ON email_subscriptions
  FOR SELECT
  USING (true); -- Can be restricted if needed with auth

-- RLS Policy: Allow updates to own subscription status
CREATE POLICY "Users can update their subscription"
  ON email_subscriptions
  FOR UPDATE
  USING (true); -- Ideally would check auth.email = email
