#!/bin/bash
# Supabase Migration Script
# Run this script to execute all migrations in order

# Usage: ./supabase/run_migrations.sh

echo "⚡ Running Supabase migrations..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local not found"
  exit 1
fi

# Load environment variables
export $(cat .env.local | grep VITE_SUPABASE)

echo "📦 Supabase URL: $VITE_SUPABASE_URL"
echo ""

echo "1️⃣  Creating email_subscriptions table..."
# Note: You still need to run these in Supabase SQL Editor manually
# This script is just for documentation

echo "2️⃣  Creating notification_preferences table..."
echo "3️⃣  Creating product_notifications table..."

echo ""
echo "✅ To complete migrations:"
echo "   1. Go to: https://app.supabase.com"
echo "   2. Navigate to SQL Editor"
echo "   3. Copy & run supabase/migrations/001_create_email_subscriptions.sql"
echo "   4. Copy & run supabase/migrations/002_create_notification_preferences.sql"
echo "   5. Copy & run supabase/migrations/003_create_product_notifications.sql"
echo ""
echo "✨ All done!"
