
import React from 'react';
import GlassCard from './GlassCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onViewProduct: (handle: string) => void;
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onViewProduct, onToggleSave, savedHandles }) => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-charcoal dark:text-white mb-4">
              New <span className="text-neonRed">Arrivals</span>
            </h2>
            <div className="h-1 w-20 bg-neonRed mb-6 shadow-neon"></div>
            <p className="text-charcoal/50 dark:text-white/50 font-medium text-lg uppercase tracking-tight">
              FRESH DEPLOYMENTS FROM THE ARCHIVE.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <GlassCard 
              key={product.gid} 
              product={product} 
              onViewProduct={onViewProduct}
              isSaved={savedHandles.includes(product.handle)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
