
import { useState, useEffect } from 'react';
import { Collection } from '../types';
import { shopifyClient } from '../lib/shopifyClient';
import { mapCollectionFromGraphQL } from '../adapters/shopifyAdapter';

export function useCollection(handle: string | null) {
  const [data, setData] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    shopifyClient.fetchCollectionByHandle(handle)
      .then(res => {
        if (res.data.collection) {
          setData(mapCollectionFromGraphQL(res.data.collection));
        }
      })
      .finally(() => setLoading(false));
  }, [handle]);

  return { data, loading };
}
