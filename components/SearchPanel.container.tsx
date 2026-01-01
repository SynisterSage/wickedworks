
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchPanelView } from './SearchPanel.view';
import { useNewReleases } from '../hooks/useNewReleases';
import { MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';
import { shopifyFetch, extractNodes } from '../lib/shopify/client';
import { SEARCH_PRODUCTS_QUERY } from '../lib/shopify/queries';
import { ROUTES } from '../utils/routeHelpers';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

interface SearchPanelContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPanelContainer: React.FC<SearchPanelContainerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { products: suggested } = useNewReleases(3);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setQuery('');
        setSearchResults([]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Debounced search effect
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        if (USE_MOCKS) {
          // Use mock data
          const filtered = MOCK_PRODUCTS
            .filter(p => 
              p.title.toLowerCase().includes(trimmedQuery.toLowerCase()) || 
              p.productType?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
              p.handle.toLowerCase().includes(trimmedQuery.toLowerCase())
            )
            .map(mapProductFromGraphQL);
          setSearchResults(filtered);
        } else {
          // Search Shopify
          const response = await shopifyFetch<{ products: { edges: Array<{ node: any }> } }>({
            query: SEARCH_PRODUCTS_QUERY,
            variables: {
              query: trimmedQuery,
              first: 10,
            },
          });

          if (response.data?.products) {
            const nodes = extractNodes(response.data.products);
            setSearchResults(nodes.map(mapProductFromGraphQL));
          }
        }
      } catch (err) {
        console.error('[SearchPanel] Search error:', err);
        // Fallback to mock data
        const filtered = MOCK_PRODUCTS
          .filter(p => 
            p.title.toLowerCase().includes(trimmedQuery.toLowerCase()) || 
            p.productType?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
            p.handle.toLowerCase().includes(trimmedQuery.toLowerCase())
          )
          .map(mapProductFromGraphQL);
        setSearchResults(filtered);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (handle: string) => {
    navigate(ROUTES.PRODUCT_DETAIL(handle));
    onClose();
  };
  
  const handleViewAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
        navigate(ROUTES.SEARCH(query));
        onClose();
    }
  };

  return (
    <SearchPanelView 
      isOpen={isOpen}
      onClose={onClose}
      query={query}
      setQuery={setQuery}
      results={searchResults}
      suggested={suggested}
      onResultClick={handleResultClick}
      onViewAll={handleViewAll}
    />
  );
};

export default SearchPanelContainer;