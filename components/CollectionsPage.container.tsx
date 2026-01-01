
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CollectionsPageView } from './CollectionsPage.view';
import { Collection, Product } from '../types';
import { useCollections } from '../hooks/useCollections';
import { useCollection } from '../hooks/useCollection';

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

  // Fetch all collections for the grid
  const { collections, loading: collectionsLoading, error: collectionsError } = useCollections();

  // Fetch individual collection with products if a handle is selected
  const { data: selectedCollection, loading: collectionLoading, error: collectionError } = useCollection(handle || '');

  // Collection products come from the selectedCollection.products array (fetched by useCollection)
  const collectionProducts = useMemo(() => {
    if (!selectedCollection) return [];
    return selectedCollection.products || [];
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

  // Loading state
  const isLoading = collectionsLoading || (handle && collectionLoading);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary font-mono">LOADING COLLECTIONS...</div>
      </div>
    );
  }

  // Error state
  const error = collectionsError || collectionError;
  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary font-mono">
          {error instanceof Error ? error.message : String(error)}
        </div>
      </div>
    );
  }

  return (
    <CollectionsPageView
      collections={collections}
      selectedCollection={selectedCollection || null}
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
