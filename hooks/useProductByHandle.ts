
import { useState, useEffect, useMemo } from 'react';
import { Product, Variant } from '../types';
import { shopifyClient } from '../lib/shopifyClient';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';

export function useProductByHandle(handle: string | null) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantGid, setSelectedVariantGid] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    shopifyClient.fetchProductByHandle(handle)
      .then(res => {
        if (res.data.product) {
          const mapped = mapProductFromGraphQL(res.data.product);
          setData(mapped);
          setSelectedVariantGid(mapped.variants[0]?.gid || null);
        } else {
          setError('Product not found');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
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
