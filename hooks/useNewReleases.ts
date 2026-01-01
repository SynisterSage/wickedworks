
import { useState, useEffect } from 'react';
import { Product } from '../types';
import { shopifyClient } from '../lib/shopifyClient';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';

export function useNewReleases(limit: number = 4) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    shopifyClient.fetchNewReleases(limit)
      .then(res => {
        const nodes = res.data.products?.nodes || [];
        setProducts(nodes.map(mapProductFromGraphQL));
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return { products, loading };
}
