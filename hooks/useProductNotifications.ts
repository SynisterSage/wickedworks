/**
 * useProductNotifications Hook
 * Manages per-product notification subscriptions for authenticated users
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { handleError, notifySuccess } from '../lib/toast';

export interface ProductNotification {
  id: string;
  customer_id: string;
  product_handle: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function useProductNotifications(customerId: string | null) {
  const [notifications, setNotifications] = useState<ProductNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all product notifications for customer
  useEffect(() => {
    if (!customerId) return;

    async function fetchNotifications() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('product_notifications')
          .select('*')
          .eq('customer_id', customerId)
          .eq('is_enabled', true);

        if (fetchError) throw fetchError;

        setNotifications(data || []);
      } catch (err) {
        handleError('[useProductNotifications] Fetch failed', err, false);
        setError(err instanceof Error ? err.message : 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [customerId]);

  // Check if customer is notified for specific product
  const isNotifiedForProduct = useCallback((productHandle: string): boolean => {
    return notifications.some(n => n.product_handle === productHandle && n.is_enabled);
  }, [notifications]);

  // Toggle notification for a product
  const toggleProductNotification = useCallback(
    async (productHandle: string, enable: boolean) => {
      if (!customerId) return false;

      try {
        if (enable) {
          // Enable notification (upsert)
          const { data, error: upsertError } = await supabase
            .from('product_notifications')
            .upsert({
              customer_id: customerId,
              product_handle: productHandle,
              is_enabled: true,
            }, {
              onConflict: 'customer_id,product_handle'
            })
            .select();

          if (upsertError) throw upsertError;

          setNotifications(prev => {
            const existing = prev.find(n => n.product_handle === productHandle);
            if (existing) {
              return prev.map(n => n.product_handle === productHandle ? { ...n, is_enabled: true } : n);
            }
            return [...prev, data[0]];
          });

          notifySuccess(`Notifications enabled for ${productHandle}`);
        } else {
          // Disable notification
          const { error: updateError } = await supabase
            .from('product_notifications')
            .update({ is_enabled: false })
            .eq('customer_id', customerId)
            .eq('product_handle', productHandle);

          if (updateError) throw updateError;

          setNotifications(prev =>
            prev.map(n => n.product_handle === productHandle ? { ...n, is_enabled: false } : n)
          );

          notifySuccess(`Notifications disabled for ${productHandle}`);
        }

        return true;
      } catch (err) {
        handleError('[useProductNotifications] Toggle failed', err);
        return false;
      }
    },
    [customerId]
  );

  // Subscribe to product notification
  const subscribeToProduct = useCallback(
    async (productHandle: string) => {
      return toggleProductNotification(productHandle, true);
    },
    [toggleProductNotification]
  );

  // Unsubscribe from product notification
  const unsubscribeFromProduct = useCallback(
    async (productHandle: string) => {
      return toggleProductNotification(productHandle, false);
    },
    [toggleProductNotification]
  );

  return {
    notifications,
    loading,
    error,
    isNotifiedForProduct,
    subscribeToProduct,
    unsubscribeFromProduct,
    toggleProductNotification,
  };
}
