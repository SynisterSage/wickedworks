
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CookieConsentView } from './CookieConsent.view';
import { ROUTES } from '../utils/routeHelpers';

const CookieConsentContainer: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ww_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = (type: 'accept' | 'deny') => {
    localStorage.setItem('ww_cookie_consent', type);
    setIsVisible(false);
  };

  return (
    <CookieConsentView 
      isVisible={isVisible}
      onAccept={() => handleAction('accept')}
      onDeny={() => handleAction('deny')}
      onReview={() => navigate(ROUTES.PRIVACY)}
    />
  );
};

export default CookieConsentContainer;
