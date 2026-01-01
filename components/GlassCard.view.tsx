import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { Icons } from '../constants';

interface GlassCardViewProps {
  product: Product;
  onViewProduct: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
}

export const GlassCardView: React.FC<GlassCardViewProps> = ({ product, onViewProduct, isSaved, onToggleSave }) => {
  const price = `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (cardRef.current) observer.unobserve(cardRef.current);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group cursor-pointer flex flex-col h-full bg-bg-secondary/20 backdrop-blur-md border border-border-color hover:border-neonRed/20 transition-all duration-500 shadow-2xl overflow-hidden" 
      onClick={onViewProduct}
    >
      <div className="aspect-[4/5] overflow-hidden bg-bg-primary relative border-b border-border-color">
        <img 
          src={product.featuredImage.url} 
          alt={product.title} 
          className={`h-full w-full object-cover transition-all duration-[1500ms] grayscale opacity-40 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 ${isInView ? 'grayscale-0 opacity-100 scale-105' : ''}`} 
        />
        
        {/* Subtle Scanline */}
        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] pointer-events-none transition-opacity duration-500 bg-[linear-gradient(transparent_50%,black_50%)] bg-[length:100%_4px]"></div>

        {/* Category Tag: Increased safety margin (88px) to guarantee a visual moat before the Heart button */}
        <div className="absolute top-4 left-4 z-10 max-w-[calc(100%-88px)] flex">
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-text-secondary/40 bg-bg-primary/80 backdrop-blur-sm border border-border-color px-2.5 py-1.5 italic truncate">
            CLASS // {product.category}
          </span>
        </div>

        <button 
          onClick={onToggleSave} 
          className={`absolute top-4 right-4 z-30 transition-all w-10 h-10 flex items-center justify-center rounded-full bg-bg-primary border border-border-color group/save active:scale-90 ${
            isSaved ? 'text-neonRed border-neonRed/20 shadow-neon' : 'text-text-secondary/40 hover:text-text-primary'
          }`}
          aria-label={isSaved ? "Remove from Saved" : "Save Item"}
        >
          <div className={`transition-transform duration-300 ${isSaved ? 'scale-110' : 'group-hover/save:scale-110'}`}>
            <Icons.Heart fill={isSaved ? "currentColor" : "none"} />
          </div>
        </button>

        <div className="absolute bottom-4 right-4 z-20 transition-all duration-500 group-hover:translate-y-[-2px]">
          <div className="bg-neonRed text-white px-4 py-2.5 shadow-neon border border-white/5">
            <span className="text-[11px] font-black tracking-widest uppercase block leading-none italic">
              {price}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 md:p-6 flex-1 flex flex-col bg-bg-secondary/90 backdrop-blur-3xl relative z-10 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)]">
        <div className="mb-4">
          <h3
            className="text-lg md:text-xl font-black uppercase tracking-tight text-text-primary group-hover:text-neonRed transition-colors leading-[1.05] italic"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
            {product.title}
          </h3>
        </div>
        
        <div className="flex justify-between items-end border-t border-border-color pt-4 mt-auto gap-4">
          <div className="min-w-0">
            <span className="block text-[7px] font-black text-text-secondary/30 uppercase tracking-[0.32em] mb-1 italic">Reference</span>
            <span className="block text-[9px] font-mono font-bold text-text-secondary/60 uppercase tracking-[0.12em] truncate">
              #{product.handle}
            </span>
          </div>
          
          <div className="text-text-secondary/30 group-hover:text-neonRed transition-colors flex-shrink-0">
            <Icons.ArrowRight />
          </div>
        </div>
      </div>
      
      <div className="h-[2px] w-full bg-bg-contrast-05 overflow-hidden">
        <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
      </div>
    </div>
  );
};