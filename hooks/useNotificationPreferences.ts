/**
 * useNotificationPreferences Hook
 * Manages global notification preferences for authenticated users
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { handleError, notifySuccess } from '../lib/toast';

export interface NotificationPreferences {
  id: string;
  customer_id: string;
  notify_new_arrivals: boolean;
  notify_upcoming_releases: boolean;
  notify_back_in_stock: boolean;
  notify_promotions: boolean;
  created_at: string;
  updated_at: string;
}

export function useNotificationPreferences(customerId: string | null) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences on mount
  useEffect(() => {
    if (!customerId) {
      console.log('[useNotificationPreferences] No customer ID provided');
      setLoading(false);
      return;
    }

    async function fetchPreferences() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[useNotificationPreferences] Fetching for customer:', customerId);

        const { data, error: fetchError } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('customer_id', customerId!)
          .single();

        console.log('[useNotificationPreferences] Fetch result:', { data, error: fetchError });

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
          throw fetchError;
        }

        if (data) {
          console.log('[useNotificationPreferences] Found existing preferences:', data);
          setPreferences(data);
        } else {
          // Create default preferences if none exist
          console.log('[useNotificationPreferences] No preferences found, creating defaults');
          const defaultPrefs: Partial<NotificationPreferences> = {
            customer_id: customerId!,
            notify_new_arrivals: true,
            notify_upcoming_releases: true,
            notify_back_in_stock: true,
            notify_promotions: false,
          };

          const { data: newPrefs, error: createError } = await supabase
            .from('notification_preferences')
            .insert([defaultPrefs])
            .select()
            .single();

          console.log('[useNotificationPreferences] Create result:', { data: newPrefs, error: createError });

          if (createError) throw createError;
          setPreferences(newPrefs);
        }
      } catch (err) {
        console.error('[useNotificationPreferences] Error:', err);
        handleError('[useNotificationPreferences] Fetch failed', err, false);
        setError(err instanceof Error ? err.message : 'Failed to load preferences');
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [customerId]);

  const updatePreference = useCallback(
    async (key: keyof Omit<NotificationPreferences, 'id' | 'customer_id' | 'created_at' | 'updated_at'>, value: boolean) => {
      if (!preferences || !customerId) {
        console.log('[useNotificationPreferences] Cannot update - missing data:', { preferences: !!preferences, customerId });
        return false;
      }

      console.log('[useNotificationPreferences] Updating preference:', { key, value, customerId });

      try {
        const { error: updateError } = await supabase
          .from('notification_preferences')
          .update({
            [key]: value,
            updated_at: new Date().toISOString(),
          })
          .eq('customer_id', customerId!);

        console.log('[useNotificationPreferences] Update result:', { error: updateError });

        if (updateError) throw updateError;

        setPreferences({
          ...preferences,
          [key]: value,
          updated_at: new Date().toISOString(),
        });

        notifySuccess('Notification preferences updated');
        return true;
      } catch (err) {
        console.error('[useNotificationPreferences] Update error:', err);
        handleError('[useNotificationPreferences] Update failed', err);
        return false;
      }
    },
    [preferences, customerId]
  );

  return { preferences, loading, error, updatePreference };
}
