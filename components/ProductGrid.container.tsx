
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductGridView } from './ProductGrid.view';
import { useNewReleases } from '../hooks/useNewReleases';

interface ProductGridContainerProps {
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
}

const ProductGridContainer: React.FC<ProductGridContainerProps> = (props) => {
  const navigate = useNavigate();
  const { products, loading } = useNewReleases(8);

  if (loading) return (
    <div className="py-24 flex justify-center">
      <div className="w-12 h-1 bg-neonRed animate-width-pulse" />
    </div>
  );

  return (
    <ProductGridView 
      {...props}
      onViewProduct={(handle) => navigate(`/shop/${handle}`)}
      title={<>New <span className="text-neonRed">Arrivals</span></>}
      subtitle="FRESH DEPLOYMENTS FROM THE ARCHIVE."
      products={products}
    />
  );
};

export default ProductGridContainer;
