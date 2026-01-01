/**
 * useEmailSubscription Hook
 * Manages newsletter email subscription
 */

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { handleError, notifySuccess } from '../lib/toast';

export function useEmailSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('[useEmailSubscription] Subscribing email:', email);

      const { data, error: subscribeError } = await supabase
        .from('email_subscriptions')
        .upsert({
          email: email.toLowerCase(),
          is_subscribed: true,
        }, {
          onConflict: 'email'
        })
        .select();

      console.log('[useEmailSubscription] Subscribe result:', { data, error: subscribeError });

      if (subscribeError) {
        throw subscribeError;
      }

      notifySuccess('Successfully subscribed to newsletter!');
      return data;
    } catch (err) {
      console.error('[useEmailSubscription] Subscribe error:', err);
      const message = handleError('[useEmailSubscription] Subscribe failed', err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: unsubscribeError } = await supabase
        .from('email_subscriptions')
        .update({
          is_subscribed: false,
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('email', email.toLowerCase());

      if (unsubscribeError) {
        throw unsubscribeError;
      }

      notifySuccess('You have been unsubscribed');
      return true;
    } catch (err) {
      const message = handleError('[useEmailSubscription] Unsubscribe failed', err);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { subscribe, unsubscribe, loading, error };
}
