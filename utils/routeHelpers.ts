/**
 * Utility functions to help with route navigation
 * Provides type-safe route generation for common navigation patterns
 */

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAIL: (handle: string) => `/shop/${handle}`,
  COLLECTIONS: '/collections',
  COLLECTION_DETAIL: (handle: string) => `/collections/${handle}`,
  ARCHIVES: '/archives',
  ACCOUNT: '/account',
  ACCOUNT_SECTION: (section: string) => `/account/${section.toLowerCase()}`,
  SAVED: '/saved',
  CART: '/cart',
  SEARCH: (query?: string) => query ? `/search?q=${encodeURIComponent(query)}` : '/search',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  ABOUT: '/about',
  RETURNS: '/returns',
  SIZING: '/sizing',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

/**
 * Legacy ViewMode to route path mapping
 * Use this to migrate old onNavigate(view, handle) calls to routes
 */
export function viewModeToPath(view: string, payload?: string): string {
  switch (view) {
    case 'HOME': return ROUTES.HOME;
    case 'SHOP_ALL': return ROUTES.SHOP;
    case 'PRODUCT_DETAIL': return payload ? ROUTES.PRODUCT_DETAIL(payload) : ROUTES.SHOP;
    case 'COLLECTIONS': return ROUTES.COLLECTIONS;
    case 'ARCHIVES': return ROUTES.ARCHIVES;
    case 'ACCOUNT': return ROUTES.ACCOUNT;
    case 'SAVED': return ROUTES.SAVED;
    case 'CART': return ROUTES.CART;
    case 'SEARCH_RESULTS': return payload ? ROUTES.SEARCH(payload) : ROUTES.SEARCH();
    case 'BLOG': return ROUTES.BLOG;
    case 'BLOG_POST': return payload ? ROUTES.BLOG_POST(payload) : ROUTES.BLOG;
    case 'ABOUT': return ROUTES.ABOUT;
    case 'RETURNS': return ROUTES.RETURNS;
    case 'SIZING': return ROUTES.SIZING;
    case 'CONTACT': return ROUTES.CONTACT;
    case 'PRIVACY': return ROUTES.PRIVACY;
    case 'TERMS': return ROUTES.TERMS;
    default: return ROUTES.HOME;
  }
}
