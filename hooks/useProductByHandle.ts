
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';
import { shopifyFetch } from '../lib/shopify/client';
import { PRODUCT_BY_HANDLE_QUERY } from '../lib/shopify/queries';
import { handleError } from '../lib/toast';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function useProductByHandle(handle: string | null) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantGid, setSelectedVariantGid] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        if (USE_MOCKS) {
          // Use mock data
          const mockProduct = MOCK_PRODUCTS.find(p => p.handle === handle);
          if (mockProduct) {
            const mapped = mapProductFromGraphQL(mockProduct);
            setData(mapped);
            setSelectedVariantGid(mapped.variants[0]?.gid || null);
          } else {
            setError('Product not found');
          }
        } else {
          // Fetch from Shopify
          const response = await shopifyFetch<{ product: any }>({
            query: PRODUCT_BY_HANDLE_QUERY,
            variables: { handle },
          });

          if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Failed to fetch product');
          }

          if (response.data?.product) {
            const mapped = mapProductFromGraphQL(response.data.product);
            setData(mapped);
            setSelectedVariantGid(mapped.variants[0]?.gid || null);
          } else {
            setError('Product not found');
            handleError('[useProductByHandle]', 'Product not found');
          }
        }
      } catch (err) {
        const message = handleError('[useProductByHandle]', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [handle]);

  const selectedVariant = useMemo(() => 
    data?.variants.find(v => v.gid === selectedVariantGid) || data?.variants[0] || null,
    [data, selectedVariantGid]
  );

  return { 
    data, 
    loading, 
    error, 
    selectedVariant, 
    selectVariant: (gid: string) => setSelectedVariantGid(gid) 
  };
}
