
import { MOCK_PRODUCTS, MOCK_COLLECTIONS, UPCOMING_COLLECTIONS, ARCHIVED_COLLECTIONS, RAW_MOCK_ARTICLES } from '../constants';

/**
 * Configuration for the Shopify Storefront API.
 * In production, these are populated via environment variables.
 */
const storefrontConfig = {
  domain: process.env.PUBLIC_STORE_DOMAIN || 'wicked-works.myshopify.com',
  token: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
  version: '2025-04',
};

export const shopifyClient = {
  /**
   * Mock of the Storefront API fetcher.
   * Can be swapped with:
   * const response = await fetch(`https://${domain}/api/${version}/graphql.json`, { ... })
   */
  async fetchProductByHandle(handle: string) {
    const rawProduct = MOCK_PRODUCTS.find(p => p.handle === handle);
    return { data: { product: rawProduct || null } };
  },

  async fetchCollectionByHandle(handle: string) {
    const all = [...MOCK_COLLECTIONS, ...UPCOMING_COLLECTIONS, ...ARCHIVED_COLLECTIONS];
    const rawCollection = all.find(c => c.handle === handle);
    return { data: { collection: rawCollection || null } };
  },

  async fetchAllProducts(limit: number = 20) {
    return { data: { products: { nodes: MOCK_PRODUCTS.slice(0, limit) } } };
  },

  async fetchNewReleases(limit: number = 4) {
    return { data: { products: { nodes: MOCK_PRODUCTS.filter(p => p.isNew).slice(0, limit) } } };
  },

  async fetchBlogPosts() {
    // In a real app, you would query the 'articles' connection on the 'blog' object.
    return { data: { blog: { articles: { nodes: RAW_MOCK_ARTICLES } } } };
  },

  async fetchBlogPostBySlug(slug: string) {
    // This is a simplified mock. A real API would filter by handle/slug.
    const rawPost = RAW_MOCK_ARTICLES.find(p => p.handle === slug);
    return { data: { blog: { articleByHandle: rawPost || null } } };
  },
};
