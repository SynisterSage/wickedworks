
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedPageView } from './SavedPage.view';
import { Product } from '../types';

interface SavedPageContainerProps {
  products: Product[];
  onToggleSave: (handle: string) => void;
  loading: boolean;
  error: string | null;
}

const SavedPageContainer: React.FC<SavedPageContainerProps> = ({ 
  products, 
  onToggleSave,
  loading,
  error
}) => {
  const navigate = useNavigate();
  const handleViewProduct = (handle: string) => {
    navigate(`/shop/${handle}`);
  };

  return (
    <SavedPageView
      products={products}
      onViewProduct={handleViewProduct}
      onToggleSave={onToggleSave}
      loading={loading}
      error={error}
    />
  );
};

export default SavedPageContainer;
