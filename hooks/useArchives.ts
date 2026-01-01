
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';
import { shopifyFetch, extractNodes } from '../lib/shopify/client';
import { PRODUCTS_QUERY } from '../lib/shopify/queries';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

/**
 * useArchives Hook
 * Fetches products and splits them into 'upcoming' and 'vaulted' buckets.
 * Note: Prefer fetchCollectionByHandle('archives') if a specific automated 
 * collection exists in Shopify Admin for better performance.
 */
export function useArchives() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArchives() {
      try {
        setLoading(true);

        if (USE_MOCKS) {
          // Use mock data
          const mapped = MOCK_PRODUCTS.map(mapProductFromGraphQL);
          setProducts(mapped);
        } else {
          // Fetch from Shopify
          const response = await shopifyFetch<{ products: { edges: Array<{ node: any }> } }>({
            query: PRODUCTS_QUERY,
            variables: {
              first: 50,
              sortKey: 'CREATED_AT',
              reverse: true,
            },
          });

          if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Failed to fetch products');
          }

          const nodes = extractNodes(response.data?.products);
          setProducts(nodes.map(mapProductFromGraphQL));
        }
      } catch (err) {
        console.error('[useArchives] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load archives');
        // Fallback to mocks on error
        setProducts(MOCK_PRODUCTS.map(mapProductFromGraphQL));
      } finally {
        setLoading(false);
      }
    }

    fetchArchives();
  }, []);

  const upcoming = useMemo(() => products.filter(p => p.isUpcoming), [products]);
  const vaulted = useMemo(() => products.filter(p => p.isVaulted), [products]);

  return { upcoming, vaulted, loading, error };
}
