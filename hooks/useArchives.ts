
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { shopifyClient } from '../lib/shopifyClient';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';

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
    setLoading(true);
    shopifyClient.fetchAllProducts(50)
      .then(res => {
        const nodes = res.data.products?.nodes || [];
        const mapped = nodes.map(mapProductFromGraphQL);
        setProducts(mapped);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = useMemo(() => products.filter(p => p.isUpcoming), [products]);
  const vaulted = useMemo(() => products.filter(p => p.isVaulted), [products]);

  return { upcoming, vaulted, loading, error };
}
