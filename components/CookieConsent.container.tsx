
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CookieConsentView } from './CookieConsent.view';
import { ROUTES } from '../utils/routeHelpers';
import { 
  hasConsentBeenGiven, 
  acceptAllCookies, 
  acceptNecessaryOnly,
  initializeTracking 
} from '../lib/cookieManager';

const CookieConsentContainer: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    if (!hasConsentBeenGiven()) {
      // Show banner after 1.5 seconds if no consent recorded
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      // Initialize tracking based on stored preferences
      initializeTracking();
    }
  }, []);

  const handleAccept = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleDeny = () => {
    acceptNecessaryOnly();
    setIsVisible(false);
  };

  return (
    <CookieConsentView 
      isVisible={isVisible}
      onAccept={handleAccept}
      onDeny={handleDeny}
      onReview={() => navigate(ROUTES.PRIVACY)}
    />
  );
};

export default CookieConsentContainer;
