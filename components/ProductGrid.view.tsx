
import React from 'react';
import GlassCardContainer from './GlassCard.container';
import { Product } from '../types';

interface ProductGridViewProps {
  title: React.ReactNode;
  subtitle: string;
  products: Product[];
  onViewProduct: (handle: string) => void;
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
}

export const ProductGridView: React.FC<ProductGridViewProps> = ({ 
  title, subtitle, products, onViewProduct, onToggleSave, savedHandles 
}) => {
  return (
    <section className="py-32 bg-bg-secondary relative overflow-hidden tech-grid">
      {/* Subtle Atmospheric Depth */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neonRed/[0.03] blur-[160px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="mb-24">
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center gap-4">
               <div className="h-4 w-1 bg-neonRed shadow-neon"></div>
               <span className="text-neonRed text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] neon-text-shadow">
                 {subtitle}
               </span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-text-primary leading-[0.85] italic">
              {title}
            </h2>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8 border-t border-border-color mt-4">
              <p className="text-text-primary/40 font-bold text-sm md:text-lg uppercase tracking-[0.1em] max-w-xl leading-relaxed">
                Technical assets currently available for field testing, high-frequency deployment, and urban mobility.
              </p>
              
              <div className="flex items-center gap-12">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-text-primary/10 uppercase tracking-[0.3em] mb-1">ASSETS_STAGED</span>
                   <span className="text-sm font-mono font-black text-neonRed">{products.length.toString().padStart(2, '0')}</span>
                </div>
                <div className="flex flex-col items-end border-l border-border-color pl-12">
                   <span className="text-[8px] font-black text-text-primary/10 uppercase tracking-[0.3em] mb-1">PROTO_STATUS</span>
                   <span className="text-sm font-mono font-black text-text-primary/40">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
          {products.map((product) => (
            <GlassCardContainer 
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