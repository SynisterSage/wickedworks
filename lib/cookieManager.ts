/**
 * Cookie Manager - Handles cookie consent and tracking
 */

// Extend Window type for gtag
declare global {
  interface Window {
    gtag?: any;
    fbq?: any;
    dataLayer?: any;
  }
}

export type CookieCategory = 'necessary' | 'analytics' | 'marketing';

export interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean; // Google Analytics, Hotjar, etc.
  marketing: boolean; // Facebook Pixel, LinkedIn, etc.
}

const STORAGE_KEY = 'ww_cookie_preferences';
const CONSENT_GIVEN_KEY = 'ww_cookie_consent_given';

/**
 * Get default preferences (only necessary cookies)
 */
export const getDefaultPreferences = (): CookiePreferences => ({
  necessary: true,
  analytics: false,
  marketing: false,
});

/**
 * Get current cookie preferences from localStorage
 */
export const getCookiePreferences = (): CookiePreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('[CookieManager] Error parsing stored preferences:', e);
  }
  return getDefaultPreferences();
};

/**
 * Save cookie preferences to localStorage
 */
export const saveCookiePreferences = (preferences: CookiePreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    localStorage.setItem(CONSENT_GIVEN_KEY, new Date().toISOString());
    // Dispatch custom event for other listeners
    window.dispatchEvent(
      new CustomEvent('cookiePreferencesChanged', { detail: preferences })
    );
    console.log('[CookieManager] Preferences saved:', preferences);
  } catch (e) {
    console.error('[CookieManager] Error saving preferences:', e);
  }
};

/**
 * Accept all cookies
 */
export const acceptAllCookies = (): void => {
  saveCookiePreferences({
    necessary: true,
    analytics: true,
    marketing: true,
  });
  initializeTracking();
};

/**
 * Accept only necessary cookies
 */
export const acceptNecessaryOnly = (): void => {
  saveCookiePreferences(getDefaultPreferences());
  disableTracking();
};

/**
 * Check if a cookie category is enabled
 */
export const isCategoryEnabled = (category: CookieCategory): boolean => {
  const prefs = getCookiePreferences();
  return prefs[category];
};

/**
 * Get user's consent status
 */
export const hasConsentBeenGiven = (): boolean => {
  return localStorage.getItem(CONSENT_GIVEN_KEY) !== null;
};

/**
 * Initialize tracking scripts based on user preferences
 */
export const initializeTracking = (): void => {
  const prefs = getCookiePreferences();

  if (prefs.analytics) {
    initializeGoogleAnalytics();
  }

  if (prefs.marketing) {
    initializeMarketingPixels();
  }

  console.log('[CookieManager] Tracking initialized with preferences:', prefs);
};

/**
 * Initialize Google Analytics with consent mode
 */
const initializeGoogleAnalytics = (): void => {
  // Check if Google Analytics is already loaded
  if (window.gtag) {
    console.log('[CookieManager] Google Analytics already initialized');
    return;
  }

  // Create gtag function stub before loading the script
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(arguments);
  }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', import.meta.env.VITE_GA_ID || '', {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID || ''}`;
  script.onload = () => console.log('[CookieManager] Google Analytics loaded');
  script.onerror = () => console.error('[CookieManager] Failed to load Google Analytics');
  document.head.appendChild(script);
};

/**
 * Initialize marketing pixels (Facebook, LinkedIn, etc.)
 */
const initializeMarketingPixels = (): void => {
  // Facebook Pixel
  if (import.meta.env.VITE_FACEBOOK_PIXEL_ID) {
    loadFacebookPixel(import.meta.env.VITE_FACEBOOK_PIXEL_ID);
  }

  // LinkedIn Insight Tag
  if (import.meta.env.VITE_LINKEDIN_TAG_ID) {
    loadLinkedInTag(import.meta.env.VITE_LINKEDIN_TAG_ID);
  }

  console.log('[CookieManager] Marketing pixels initialized');
};

/**
 * Load Facebook Pixel
 */
const loadFacebookPixel = (pixelId: string): void => {
  if ((window as any).fbq) return;

  (window as any).fbq = function () {
    (window as any).fbq.callMethod
      ? (window as any).fbq.callMethod.apply((window as any).fbq, arguments)
      : (window as any).fbq.queue.push(arguments);
  };

  (window as any).fbq.push = (window as any).fbq;
  (window as any).fbq.loaded = true;
  (window as any).fbq.version = '2.0';
  (window as any).fbq.queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  (window as any).fbq('init', pixelId);
  (window as any).fbq('track', 'PageView');
};

/**
 * Load LinkedIn Insight Tag
 */
const loadLinkedInTag = (tagId: string): void => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = `
    _linkedin_partner_id = "${tagId}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
  `;
  document.head.appendChild(script);

  const img = document.createElement('img');
  img.alt = '';
  img.border = '0';
  img.src = `https://dc.ads.linkedin.com/collect/?pid=${tagId}&fmt=gif`;
  img.width = 1;
  img.height = 1;
  img.style.display = 'none';
  document.body.appendChild(img);

  const script2 = document.createElement('script');
  script2.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
  document.head.appendChild(script2);
};

/**
 * Disable tracking by clearing tracking cookies
 */
export const disableTracking = (): void => {
  // Disable Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag('config', import.meta.env.VITE_GA_ID || '', {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }

  // Clear tracking cookies
  clearTrackingCookies();
  console.log('[CookieManager] Tracking disabled');
};

/**
 * Clear all tracking cookies
 */
const clearTrackingCookies = (): void => {
  const cookiesToClear = ['_ga', '_gid', '_gat', 'fr', 'tr'];

  cookiesToClear.forEach((cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  });
};

/**
 * Track page view (if analytics enabled)
 */
export const trackPageView = (pagePath: string, pageTitle: string): void => {
  if (!isCategoryEnabled('analytics')) return;

  if ((window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

/**
 * Track event (if analytics enabled)
 */
export const trackEvent = (
  eventName: string,
  eventData?: Record<string, any>
): void => {
  if (!isCategoryEnabled('analytics')) return;

  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, eventData || {});
  }
};

/**
 * Track conversion (if marketing enabled)
 */
export const trackConversion = (eventName: string, value?: number): void => {
  if (!isCategoryEnabled('marketing')) return;

  // Facebook Pixel conversion
  if ((window as any).fbq) {
    const eventData: any = { value, currency: 'USD' };
    (window as any).fbq('track', eventName, eventData);
  }
};

/**
 * Auto-initialize tracking based on stored preferences
 */
export const autoInitializeTracking = (): void => {
  if (hasConsentBeenGiven()) {
    initializeTracking();
  }
};
