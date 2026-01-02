import { useEffect, useState } from 'react';
import { 
  getCookiePreferences, 
  CookiePreferences,
  isCategoryEnabled,
  trackEvent,
  trackConversion
} from '../lib/cookieManager';

/**
 * Hook to access and monitor cookie preferences
 */
export const useCookiePreferences = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(getCookiePreferences());

  useEffect(() => {
    // Listen for cookie preference changes
    const handleChange = (event: any) => {
      setPreferences(event.detail);
    };

    window.addEventListener('cookiePreferencesChanged', handleChange);
    return () => window.removeEventListener('cookiePreferencesChanged', handleChange);
  }, []);

  return preferences;
};

/**
 * Hook to safely track events based on user's analytics preference
 */
export const useTrackEvent = () => {
  return (eventName: string, eventData?: Record<string, any>) => {
    if (isCategoryEnabled('analytics')) {
      trackEvent(eventName, eventData);
    }
  };
};

/**
 * Hook to safely track conversions based on user's marketing preference
 */
export const useTrackConversion = () => {
  return (eventName: string, value?: number) => {
    if (isCategoryEnabled('marketing')) {
      trackConversion(eventName, value);
    }
  };
};

/**
 * Hook to check if a specific cookie category is enabled
 */
export const useCategoryEnabled = (category: 'necessary' | 'analytics' | 'marketing') => {
  const [enabled, setEnabled] = useState(isCategoryEnabled(category));

  useEffect(() => {
    const handleChange = (event: any) => {
      setEnabled(event.detail[category]);
    };

    window.addEventListener('cookiePreferencesChanged', handleChange);
    return () => window.removeEventListener('cookiePreferencesChanged', handleChange);
  }, [category]);

  return enabled;
};
