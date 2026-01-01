
import React from 'react';
import { GlassCardView } from './GlassCard.view';
import { Product } from '../types';

interface GlassCardContainerProps {
  product: Product;
  onViewProduct: (handle: string) => void;
  onToggleSave: (handle: string) => void;
  isSaved: boolean;
}

const GlassCardContainer: React.FC<GlassCardContainerProps> = ({ 
  product, 
  onViewProduct, 
  onToggleSave, 
  isSaved 
}) => {
  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(product.handle);
  };

  const handleViewProduct = () => {
    onViewProduct(product.handle);
  };

  return (
    <GlassCardView 
      product={product}
      isSaved={isSaved}
      onViewProduct={handleViewProduct}
      onToggleSave={handleToggleSave}
    />
  );
};

export default GlassCardContainer;
