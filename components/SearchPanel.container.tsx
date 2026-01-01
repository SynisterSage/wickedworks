
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchPanelView } from './SearchPanel.view';
import { useNewReleases } from '../hooks/useNewReleases';
import { MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';
import { ROUTES } from '../utils/routeHelpers';

interface SearchPanelContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPanelContainer: React.FC<SearchPanelContainerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { products: suggested } = useNewReleases(3);

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
      const timer = setTimeout(() => setQuery(''), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return [];
    
    return MOCK_PRODUCTS
      .filter(p => 
        p.title.toLowerCase().includes(trimmedQuery) || 
        p.productType?.toLowerCase().includes(trimmedQuery) ||
        p.handle.toLowerCase().includes(trimmedQuery)
      )
      .map(mapProductFromGraphQL);
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
      results={results}
      suggested={suggested}
      onResultClick={handleResultClick}
      onViewAll={handleViewAll}
    />
  );
};

export default SearchPanelContainer;