
import React, { useState, useMemo } from 'react';
import { Product, ViewMode, Variant } from '../types';
import { Icons } from '../constants';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (variant: Variant) => void;
  onNavigate: (view: ViewMode) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onAddToCart, onNavigate }) => {
  // Store selected options just like Shopify's VariantSelector
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach(opt => {
      initial[opt.name] = opt.values[0];
    });
    return initial;
  });

  // Find the variant that matches all selected options
  const selectedVariant = useMemo(() => {
    return product.variants.find(v => 
      v.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value)
    ) || product.variants[0];
  }, [product, selectedOptions]);

  const priceStr = `${selectedVariant.price.amount} ${selectedVariant.price.currencyCode}`;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-white/[0.04] pb-4">
          <button 
            onClick={() => onNavigate('HOME')}
            className="text-[9px] font-mono text-white/20 tracking-tighter uppercase hover:text-neonRed transition-colors"
          >
            ROOT
          </button>
          <span className="text-[9px] text-neonRed font-black">/</span>
          <button 
            onClick={() => onNavigate('SHOP_ALL')}
            className="text-[9px] font-bold text-white/20 tracking-[0.2em] uppercase hover:text-neonRed transition-colors"
          >
            SHOP_DIRECTORY
          </button>
          <span className="text-[9px] text-neonRed font-black">/</span>
          <span className="text-[9px] font-black text-white tracking-[0.2em] uppercase italic truncate">
            {product.handle}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          {/* Images */}
          <div className="lg:w-3/5 space-y-6">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-[3/4] bg-charcoal-card overflow-hidden">
                <img src={img.url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={product.title} />
              </div>
            ))}
          </div>

          {/* Details */}
          <aside className="lg:w-2/5 lg:sticky lg:top-32 h-fit space-y-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed block mb-4">
                {product.gid}
              </span>
              <h1 className="text-5xl font-black uppercase tracking-tighter text-white mb-4 leading-none italic">
                {product.title}
              </h1>
              <p className="text-2xl font-black text-neonRed tracking-tighter">{priceStr}</p>
            </div>

            <p className="text-sm font-bold text-white/40 uppercase tracking-widest leading-relaxed italic">
              {product.description}
            </p>

            {/* Shopify-style Option Selectors */}
            <div className="space-y-8">
              {product.options.map((opt) => (
                <div key={opt.name}>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 border-l-2 border-neonRed pl-3 italic">
                    {opt.name}
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {opt.values.map((val) => (
                      <button
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))}
                        className={`py-3 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 transform ${
                          selectedOptions[opt.name] === val
                            ? 'bg-neonRed border-neonRed text-white shadow-neon'
                            : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:border-neonRed/40 hover:text-white/80 hover:-translate-y-0.5'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onAddToCart(selectedVariant)}
              disabled={!selectedVariant.available || product.isUpcoming}
              className={`w-full py-6 font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-95 flex items-center justify-center gap-4 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                product.isUpcoming 
                  ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                  : 'bg-neonRed text-white shadow-neon hover:shadow-neon-strong'
              }`}
            >
              <span className="relative z-10">
                {product.isUpcoming 
                  ? 'Future Signal - Not Available' 
                  : selectedVariant.available 
                    ? 'Authorize Acquisition' 
                    : 'Out of Stock'}
              </span>
              <Icons.ShoppingBag />
            </button>

            <div className="pt-10 border-t border-white/10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-neonRed mb-6 italic">Technical Specifications</h3>
              <ul className="space-y-4">
                {product.specs?.map((spec, i) => (
                  <li key={i} className="flex gap-4 items-start group text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
                    <div className="w-1 h-1 bg-neonRed mt-1.5 shadow-neon"></div>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
