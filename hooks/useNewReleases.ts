
import { useState, useEffect } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';
import { shopifyFetch, extractNodes } from '../lib/shopify/client';
import { PRODUCTS_QUERY } from '../lib/shopify/queries';
import { handleError } from '../lib/toast';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function useNewReleases(limit: number = 4) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNewReleases() {
      try {
        setLoading(true);

        if (USE_MOCKS) {
          // Use mock data - filter for new products
          const newProducts = MOCK_PRODUCTS
            .filter(p => p.isNew)
            .slice(0, limit)
            .map(mapProductFromGraphQL);
          setProducts(newProducts);
        } else {
          // Fetch from Shopify - get latest products
          const response = await shopifyFetch<{ products: { edges: Array<{ node: any }> } }>({
            query: PRODUCTS_QUERY,
            variables: {
              first: limit,
              sortKey: 'CREATED_AT',
              reverse: true,
            },
          });

          if (response.errors) {
            handleError('[useNewReleases]', response.errors[0]?.message || 'Failed to fetch releases');
          }

          const nodes = extractNodes(response.data?.products);
          setProducts(nodes.map(mapProductFromGraphQL));
        }
      } catch (err) {
        handleError('[useNewReleases]', err);
        // Fallback to mocks on error
        setProducts(MOCK_PRODUCTS.filter(p => p.isNew).slice(0, limit).map(mapProductFromGraphQL));
      } finally {
        setLoading(false);
      }
    }

    fetchNewReleases();
  }, [limit]);

  return { products, loading };
}
