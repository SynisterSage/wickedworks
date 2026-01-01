-- Product Notifications Table
-- Stores per-product, per-customer notification settings
-- Allows granular control over which products trigger notifications
-- RLS: Only authenticated users can view/edit their own product notifications

CREATE TABLE IF NOT EXISTS product_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT NOT NULL,
  product_handle TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(customer_id, product_handle)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_product_notifications_customer_id 
  ON product_notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_notifications_product_handle 
  ON product_notifications(product_handle);
CREATE INDEX IF NOT EXISTS idx_product_notifications_is_enabled 
  ON product_notifications(is_enabled);
CREATE INDEX IF NOT EXISTS idx_product_notifications_customer_product 
  ON product_notifications(customer_id, product_handle);

-- Enable RLS
ALTER TABLE product_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own product notifications
CREATE POLICY "Users can view own product notifications"
  ON product_notifications
  FOR SELECT
  USING (customer_id = (auth.jwt() ->> 'sub')::text);

-- RLS Policy: Users can only insert their own product notifications
CREATE POLICY "Users can create own product notifications"
  ON product_notifications
  FOR INSERT
  WITH CHECK (customer_id = (auth.jwt() ->> 'sub')::text);

-- RLS Policy: Users can only update their own product notifications
CREATE POLICY "Users can update own product notifications"
  ON product_notifications
  FOR UPDATE
  USING (customer_id = (auth.jwt() ->> 'sub')::text);

-- RLS Policy: Users can only delete their own product notifications
CREATE POLICY "Users can delete own product notifications"
  ON product_notifications
  FOR DELETE
  USING (customer_id = (auth.jwt() ->> 'sub')::text);
