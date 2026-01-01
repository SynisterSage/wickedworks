-- Notification Preferences Table
-- Stores per-customer notification settings (global toggles)
-- RLS: Only authenticated users can view/edit their own preferences

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT NOT NULL UNIQUE,
  notify_new_arrivals BOOLEAN DEFAULT true,
  notify_upcoming_releases BOOLEAN DEFAULT true,
  notify_back_in_stock BOOLEAN DEFAULT true,
  notify_promotions BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on customer_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_preferences_customer_id 
  ON notification_preferences(customer_id);

-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own preferences
CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences
  FOR SELECT
  USING (customer_id = (auth.jwt() ->> 'sub')::text);

-- RLS Policy: Users can only insert their own preferences
CREATE POLICY "Users can create own notification preferences"
  ON notification_preferences
  FOR INSERT
  WITH CHECK (customer_id = (auth.jwt() ->> 'sub')::text);

-- RLS Policy: Users can only update their own preferences
CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences
  FOR UPDATE
  USING (customer_id = (auth.jwt() ->> 'sub')::text);

-- RLS Policy: Prevent deletes (soft delete via is_disabled if needed)
CREATE POLICY "Prevent deletion of notification preferences"
  ON notification_preferences
  FOR DELETE
  USING (false);
