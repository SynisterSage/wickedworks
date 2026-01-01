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
    const normalizeEmail = (value?: string | null) => value?.trim().toLowerCase() || '';

    const restoreFromLocal = () => {
      const saved = normalizeEmail(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        setIsSubscribed(true);
        setEmail(saved);
      }
      return saved;
    };

    const hydrateFromSupabase = async () => {
      const authEmail = normalizeEmail(customer?.email);
      const saved = restoreFromLocal();
      const targetEmail = authEmail || saved;

      if (!targetEmail) return;

      const record = await fetchSubscription(targetEmail);

      if (record) {
        const recordEmail = normalizeEmail(record.email) || targetEmail;
        setEmail(recordEmail);

        if (record.is_subscribed) {
          setIsSubscribed(true);
          localStorage.setItem(STORAGE_KEY, recordEmail);
        } else {
          setIsSubscribed(false);
          localStorage.removeItem(STORAGE_KEY);
        }
        return;
      }

      if (authEmail) {
        // Prefill with customer email even if no record exists
        setEmail(authEmail);
      }
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