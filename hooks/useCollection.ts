
import { useState, useEffect } from 'react';
import { Collection } from '../types';
import { MOCK_COLLECTIONS, UPCOMING_COLLECTIONS, ARCHIVED_COLLECTIONS } from '../constants';
import { mapCollectionFromGraphQL } from '../adapters/shopifyAdapter';
import { shopifyFetch } from '../lib/shopify/client';
import { COLLECTION_BY_HANDLE_QUERY } from '../lib/shopify/queries';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function useCollection(handle: string | null) {
  const [data, setData] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) {
      // Clear previous collection when navigating back to directory
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    async function fetchCollection() {
      try {
        setLoading(true);
        setError(null);

        if (USE_MOCKS) {
          // Use mock data
          const allCollections = [...MOCK_COLLECTIONS, ...UPCOMING_COLLECTIONS, ...ARCHIVED_COLLECTIONS];
          const mockCollection = allCollections.find(c => c.handle === handle);
          if (mockCollection) {
            setData(mapCollectionFromGraphQL(mockCollection));
          }
        } else {
          // Fetch from Shopify
          const response = await shopifyFetch<{ collection: any }>({
            query: COLLECTION_BY_HANDLE_QUERY,
            variables: { 
              handle,
              first: 50 
            },
          });

          if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Failed to fetch collection');
          }

          if (response.data?.collection) {
            setData(mapCollectionFromGraphQL(response.data.collection));
          }
        }
      } catch (err) {
        console.error('[useCollection] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load collection');
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [handle]);

  return { data, loading, error };
}
