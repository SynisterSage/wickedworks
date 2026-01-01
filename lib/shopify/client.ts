/**
 * Shopify Storefront API GraphQL Client
 * 
 * This client handles all GraphQL requests to the Shopify Storefront API.
 * It uses environment variables for configuration and supports both
 * mock and live data modes.
 */

const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-04';
const STORE_DOMAIN = import.meta.env.VITE_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_STOREFRONT_TOKEN;
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

interface ShopifyResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

/**
 * Make a GraphQL request to Shopify Storefront API
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<ShopifyResponse<T>> {
  // If mocks are enabled, return empty data and log
  if (USE_MOCKS) {
    console.log('[Shopify Client] Mock mode enabled - returning empty data');
    return { data: {} as T };
  }

  if (!STORE_DOMAIN || !STOREFRONT_TOKEN) {
    console.error('[Shopify Client] Missing credentials:', {
      hasDomain: !!STORE_DOMAIN,
      hasToken: !!STOREFRONT_TOKEN,
    });
    throw new Error('Shopify credentials not configured. Check your .env.local file.');
  }

  const endpoint = `https://${STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('[Shopify Client] GraphQL errors:', json.errors);
    }

    return json;
  } catch (error) {
    console.error('[Shopify Client] Request failed:', error);
    throw error;
  }
}

/**
 * Helper to extract nodes from Shopify's edge/node structure
 */
export function extractNodes<T>(connection: { edges: Array<{ node: T }> } | null | undefined): T[] {
  if (!connection?.edges) return [];
  return connection.edges.map((edge) => edge.node);
}

/**
 * Get configuration info (useful for debugging)
 */
export function getShopifyConfig() {
  return {
    domain: STORE_DOMAIN || 'not configured',
    apiVersion: SHOPIFY_API_VERSION,
    useMocks: USE_MOCKS,
    hasToken: !!STOREFRONT_TOKEN,
  };
}
