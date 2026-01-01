
import React from 'react';
import { Product } from '../types';
import { Icons } from '../constants';

interface GlassCardProps {
  product: Product;
  onViewProduct: (handle: string) => void;
  isSaved?: boolean;
  onToggleSave?: (handle: string) => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ product, onViewProduct, isSaved, onToggleSave }) => {
  const price = `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`;

  return (
    <div 
      className="group cursor-pointer"
      onClick={() => onViewProduct(product.handle)}
    >
      <div className="aspect-square overflow-hidden bg-charcoal-card relative mb-5">
        <img 
          src={product.featuredImage.url} 
          alt={product.title}
          className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90 drop-shadow-md">
            {product.category || 'W.W'}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 z-20">
          <div className="glass px-3.5 py-1.5 rounded-full border-white/20 flex items-center justify-center">
            <span className="text-neonRed font-black text-[10px] tracking-tight neon-text-shadow">
              {price}
            </span>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.(product.handle);
          }}
          className={`absolute top-4 right-4 z-30 transition-all ${isSaved ? 'text-neonRed drop-shadow-neon' : 'text-white/40 hover:text-white drop-shadow-md'}`}
        >
          <Icons.Heart />
        </button>
      </div>

      <div className="px-1">
        <h3 className="text-sm font-black uppercase tracking-tighter text-white group-hover:text-neonRed transition-colors mb-4">
          {product.title}
        </h3>
        
        <div className="flex justify-between items-center border-t border-white/5 pt-4">
          <span className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest">
            {product.handle}
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white/5 rounded-full group-hover:bg-neonRed transition-colors"></div>
            <div className="w-1 h-1 bg-white/5 rounded-full group-hover:bg-neonRed transition-colors delay-75"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassCard;
