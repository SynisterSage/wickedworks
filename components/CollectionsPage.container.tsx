
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CollectionsPageView } from './CollectionsPage.view';
import { Collection, Product } from '../types';
import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL, mapCollectionFromGraphQL } from '../adapters/shopifyAdapter';

interface CollectionsPageContainerProps {
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
}

const CollectionsPageContainer: React.FC<CollectionsPageContainerProps> = ({ 
  onToggleSave, 
  savedHandles
}) => {
  const navigate = useNavigate();
  const { handle } = useParams<{ handle?: string }>();

  const collections = useMemo(() => MOCK_COLLECTIONS.map(mapCollectionFromGraphQL), []);

  const selectedCollection = useMemo(() => {
    if (!handle) return null;
    return collections.find(c => c.handle === handle) || null;
  }, [handle, collections]);

  const collectionProducts = useMemo(() => {
    if (!selectedCollection) return [];
    // This is mock logic and would be replaced by actual product data from the collection
    const seed = selectedCollection.handle.length;
    return MOCK_PRODUCTS
      .filter((_, idx) => (idx + seed) % 2 === 0 || idx % 3 === 0)
      .map(mapProductFromGraphQL);
  }, [selectedCollection]);
  
  const handleSelectCollection = (collection: Collection) => {
    navigate(`/collections/${collection.handle}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearCollection = () => {
    navigate('/collections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (handle: string) => {
    navigate(`/shop/${handle}`);
  };

  return (
    <CollectionsPageView
      collections={collections}
      selectedCollection={selectedCollection}
      collectionProducts={collectionProducts}
      onSelectCollection={handleSelectCollection}
      onClearCollection={handleClearCollection}
      onViewProduct={handleViewProduct}
      onToggleSave={onToggleSave}
      savedHandles={savedHandles}
    />
  );
};

export default CollectionsPageContainer;
