import { useState, useEffect } from 'react';
import { COLLECTIONS_QUERY } from '../lib/shopify/queries';
import { shopifyFetch } from '../lib/shopify/client';
import { mapCollectionFromGraphQL } from '../adapters/shopifyAdapter';
import { handleError } from '../lib/toast';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const MOCK_COLLECTIONS_RESPONSE = {
  data: {
    collections: {
      edges: [
        {
          node: {
            id: 'gid://shopify/Collection/1',
            handle: 'outerwear',
            title: 'Outerwear',
            description: 'Technical shells and jackets for urban environments',
            image: {
              url: 'https://via.placeholder.com/800x600',
              altText: 'Outerwear Collection',
            },
          },
        },
        {
          node: {
            id: 'gid://shopify/Collection/2',
            handle: 'accessories',
            title: 'Accessories',
            description: 'Utility items for the modern operator',
            image: {
              url: 'https://via.placeholder.com/800x600',
              altText: 'Accessories Collection',
            },
          },
        },
      ],
    },
  },
};

export const useCollections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        
        let response: any;
        if (USE_MOCKS) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          response = MOCK_COLLECTIONS_RESPONSE;
        } else {
          response = await shopifyFetch({
            query: COLLECTIONS_QUERY,
            variables: { first: 50 },
          });
        }

        if (response.data?.collections?.edges) {
          const mappedCollections = response.data.collections.edges
            .map((edge: any) => edge?.node)
            .filter(Boolean)
            .map((node: any) => mapCollectionFromGraphQL(node));
          setCollections(mappedCollections);
        }
      } catch (err) {
        const message = handleError('[useCollections]', err);
        setError(new Error(message));
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return { collections, loading, error };
};
