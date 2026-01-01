import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FooterView } from './Footer.view';
import { useEmailSubscription } from '../hooks/useEmailSubscription';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'ww_email_subscription';

const FooterContainer: React.FC = () => {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const { subscribe, unsubscribe, fetchSubscription, loading } = useEmailSubscription();
  const { customer } = useAuth();

  useEffect(() => {
    const restoreFromLocal = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setIsSubscribed(true);
        setEmail(saved);
      }
    };

    const hydrateFromSupabase = async () => {
      if (!customer?.email) {
        restoreFromLocal();
        return;
      }

      const record = await fetchSubscription(customer.email);

      if (record) {
        setEmail(record.email || customer.email);

        if (record.is_subscribed) {
          setIsSubscribed(true);
          localStorage.setItem(STORAGE_KEY, (record.email || customer.email).toLowerCase());
        } else {
          setIsSubscribed(false);
          localStorage.removeItem(STORAGE_KEY);
        }

        return;
      }

      // Prefill with customer email even if no record exists
      setEmail(customer.email);

      // If nothing exists server-side, fall back to any local storage entry
      restoreFromLocal();
    };

    hydrateFromSupabase();
  }, [customer?.email, fetchSubscription]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    const result = await subscribe(email);
    if (result) {
      localStorage.setItem(STORAGE_KEY, email.toLowerCase());
      setIsSubscribed(true);
    }
  };

  const handleUnsubscribe = async () => {
    const targetEmail = localStorage.getItem(STORAGE_KEY) || email;
    if (!targetEmail || loading) return;
    const ok = await unsubscribe(targetEmail);
    if (ok) {
      localStorage.removeItem(STORAGE_KEY);
      setIsSubscribed(false);
      setEmail('');
    }
  };

  return (
    <FooterView 
      email={email}
      setEmail={setEmail}
      isSubscribed={isSubscribed}
      onSubscribe={handleSubscribe}
      onUnsubscribe={handleUnsubscribe}
      loading={loading}
    />
  );
};

export default FooterContainer;