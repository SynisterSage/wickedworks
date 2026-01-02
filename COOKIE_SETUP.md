# Cookie & Analytics Setup Guide

## Overview

The site now has a complete cookie consent and tracking system that respects user preferences. The system manages three categories of cookies:

1. **Essential/Necessary**: Required for site functionality (always enabled)
2. **Analytics**: Google Analytics for understanding user behavior
3. **Marketing**: Facebook Pixel and LinkedIn Insight Tag for conversion tracking and retargeting

## How It Works

### User Journey

1. **First Visit**: Cookie consent banner appears after 1.5 seconds
2. **Accept All**: User enables all cookie categories → Tracking scripts initialize immediately
3. **Only Essential**: User declines non-essential cookies → Only necessary cookies are used
4. **Return Visit**: User preferences are remembered from localStorage → Tracking initializes automatically

### What Gets Stored

The system stores two pieces of information:

- **`ww_cookie_preferences`**: JSON object with user's cookie choices
  ```json
  {
    "necessary": true,
    "analytics": false,
    "marketing": false
  }
  ```

- **`ww_cookie_consent_given`**: Timestamp of when consent was given

### Cookie Categories

#### Essential Cookies (Always Active)
- Session management
- Security/authentication tokens
- Cart functionality
- Basic site performance

#### Analytics Cookies (if enabled)
- **Google Analytics**: Page views, user behavior, conversion tracking
- Helps understand what content resonates
- No personal data collected (anonymized)

#### Marketing Cookies (if enabled)
- **Facebook Pixel**: Conversion tracking, audience building, retargeting
- **LinkedIn Insight Tag**: B2B lead tracking and retargeting
- Allows showing relevant ads across platforms

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Google Analytics
VITE_GA_ID=G-XXXXXXXXXX

# Facebook Pixel
VITE_FACEBOOK_PIXEL_ID=1234567890

# LinkedIn Insight Tag
VITE_LINKEDIN_TAG_ID=1234567890
```

### 2. Get Your Tracking IDs

#### Google Analytics
1. Go to [Google Analytics 4 Setup](https://analytics.google.com/)
2. Create new property or use existing
3. Get your Measurement ID (format: G-XXXXXXXXXX)

#### Facebook Pixel
1. Go to [Facebook Business Suite](https://business.facebook.com/)
2. Navigate to Data & Privacy → Data Sources
3. Create/select pixel and get Pixel ID

#### LinkedIn Insight Tag
1. Go to [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager/)
2. Navigate to Audience Manager → Matched audiences
3. Create Insight Tag and get Partner ID

### 3. Update Privacy Policy

Add the following to your Privacy Policy page:

```markdown
## Cookies and Tracking

We use cookies and similar technologies to enhance your browsing experience. Cookies help us:

- Keep you logged in and maintain your preferences
- Understand how you use our site (analytics)
- Show you relevant products and ads (marketing)

### Cookie Categories

**Essential Cookies** - Required for basic site functionality:
- User authentication and sessions
- Security tokens and CSRF protection
- Shopping cart data
- Basic performance monitoring

**Analytics Cookies** - Help us improve the site:
- Google Analytics: User behavior and page views
- Pages visited, time spent, bounce rates
- Device and browser information
- Conversion tracking

**Marketing Cookies** - Show you relevant content:
- Facebook Pixel: Conversion tracking and retargeting
- LinkedIn Insight Tag: Professional audience insights
- Allows showing relevant products across platforms

### Your Choices

You can update your cookie preferences anytime by clicking the cookie banner button or contacting us.
```

## Usage in Components

### Track Custom Events

```tsx
import { useTrackEvent } from '../hooks/useCookies';

const MyComponent = () => {
  const trackEvent = useTrackEvent();

  const handleClick = () => {
    // This will only be sent if user enabled analytics
    trackEvent('custom_event', { value: 100 });
  };

  return <button onClick={handleClick}>Track</button>;
};
```

### Track Conversions

```tsx
import { useTrackConversion } from '../hooks/useCookies';

const CheckoutPage = () => {
  const trackConversion = useTrackConversion();

  const handlePurchase = (total: number) => {
    // This will only be sent if user enabled marketing cookies
    trackConversion('purchase', total);
  };

  return <button onClick={() => handlePurchase(99.99)}>Buy</button>;
};
```

### Check Cookie Preferences

```tsx
import { useCookiePreferences } from '../hooks/useCookies';

const CookieStatus = () => {
  const prefs = useCookiePreferences();

  return (
    <div>
      <p>Analytics enabled: {prefs.analytics ? 'Yes' : 'No'}</p>
      <p>Marketing enabled: {prefs.marketing ? 'Yes' : 'No'}</p>
    </div>
  );
};
```

## Implementation Details

### Cookie Manager Functions

The `lib/cookieManager.ts` provides these utilities:

```typescript
// Get current preferences
getCookiePreferences(): CookiePreferences

// Save preferences (shows banner again)
saveCookiePreferences(prefs: CookiePreferences): void

// Quick acceptance
acceptAllCookies(): void
acceptNecessaryOnly(): void

// Check status
isCategoryEnabled(category: 'necessary' | 'analytics' | 'marketing'): boolean
hasConsentBeenGiven(): boolean

// Tracking
trackPageView(path: string, title: string): void
trackEvent(name: string, data?: object): void
trackConversion(name: string, value?: number): void

// Manual control
initializeTracking(): void
disableTracking(): void
```

### Auto-Initialization

The `App.tsx` automatically:
1. Initializes tracking based on stored preferences on app load
2. Tracks page views on route changes
3. Dispatches `cookiePreferencesChanged` events when user updates preferences

## Testing

### Test Analytics Only

```bash
# In browser console
localStorage.setItem('ww_cookie_preferences', JSON.stringify({
  necessary: true, analytics: true, marketing: false
}))
localStorage.setItem('ww_cookie_consent_given', new Date().toISOString())
location.reload()

// Check Google Analytics in Network tab
```

### Test Marketing Only

```bash
localStorage.setItem('ww_cookie_preferences', JSON.stringify({
  necessary: true, analytics: false, marketing: true
}))
location.reload()

// Check for Facebook pixel and LinkedIn tags
```

### Reset Preferences (Clear All)

```bash
localStorage.removeItem('ww_cookie_preferences')
localStorage.removeItem('ww_cookie_consent_given')
location.reload()

// Banner will show again
```

## GDPR/Privacy Compliance

This setup helps with:
- ✅ Explicit user consent before tracking
- ✅ Granular opt-in/opt-out options
- ✅ Easy to withdraw consent
- ✅ No tracking until consent given
- ✅ Clear disclosure in privacy policy

Ensure your Privacy Policy is comprehensive and clearly explains all tracking.

## Monitoring

### Check What's Stored

In browser DevTools → Application → Local Storage:
- `ww_cookie_preferences` - User's choices
- `ww_cookie_consent_given` - Consent timestamp

### Monitor Tracking

- **Google Analytics**: [analytics.google.com](https://analytics.google.com)
- **Facebook Pixel**: Facebook Ads Manager → Analytics
- **LinkedIn**: Campaign Manager → Analytics

## Troubleshooting

### Tracking not working?

1. Check environment variables are set
2. Verify no browser extensions blocking scripts
3. Check browser console for errors
4. Check user's preferences: `localStorage.getItem('ww_cookie_preferences')`

### Banner showing every time?

1. Check `ww_cookie_consent_given` is in localStorage
2. Might be using private/incognito browsing
3. Check localStorage is enabled in browser

### Events not appearing in Google Analytics?

1. Check Analytics property ID is correct (G-XXXXXXXXXX format)
2. Verify `analytics: true` in cookie preferences
3. Wait a few hours for data to appear (not real-time)
4. Check in Google Analytics → Real-time dashboard

## Further Reading

- [GDPR Cookie Compliance](https://gdpr-info.eu/art-7-gdpr/)
- [Google Analytics Privacy](https://support.google.com/analytics/answer/7318509)
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel/)
- [LinkedIn Insight Tag](https://business.linkedin.com/help/linkedin/answer/67009-set-up-the-linkedin-insight-tag)
