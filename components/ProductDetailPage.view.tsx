
import React from 'react';
import { Product, Variant } from '../types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';
import { Icons } from '../constants';

interface NavigationContext {
  sourceView?: string;
  sourceHandle?: string;
  sourceTitle?: string;
}

interface ProductDetailPageViewProps {
  product: Product;
  selectedVariant: Variant | null;
  selectedOptions: Record<string, string>;
  onSelectOption: (name: string, value: string) => void;
  onAddToCart: (variant: Variant) => void;
  context: NavigationContext | null;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const ProductDetailPageView: React.FC<ProductDetailPageViewProps> = ({ 
  product, 
  selectedVariant, 
  selectedOptions,
  onSelectOption,
  onAddToCart,
  context,
  isSaved,
  onToggleSave
}) => {
  const navigate = useNavigate();
  const isVaulted = product.isVaulted;
  const isUpcoming = product.isUpcoming;
  const isAvailable = selectedVariant?.available && !isVaulted && !isUpcoming;

  const getButtonText = () => {
    if (isVaulted) return 'Asset Vaulted // Restricted';
    if (isUpcoming) return `Staged for ${product.releaseDate ? new Date(product.releaseDate).toLocaleDateString() : 'Deployment'}`;
    if (!selectedVariant?.available) return 'Out of Stock';
    return 'Authorize Acquisition';
  };

  const priceStr = selectedVariant 
    ? `${selectedVariant.price.amount.toFixed(2)} ${selectedVariant.price.currencyCode}`
    : `${product.priceRange.minVariantPrice.amount.toFixed(2)} ${product.priceRange.minVariantPrice.currencyCode}`;
    
  const sourceView = context?.sourceView || 'SHOP_ALL';
  const sourceHandle = context?.sourceHandle;
  const sourceTitle = context?.sourceTitle;

  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
          <button 
            onClick={() => navigate(ROUTES.HOME)}
            className="text-[9px] font-mono text-text-primary/20 tracking-tighter uppercase hover:text-neonRed transition-colors"
          >
            ROOT
          </button>
          <span className="text-[9px] text-neonRed font-black">/</span>
          
          {sourceView === 'COLLECTIONS' && sourceHandle && sourceTitle ? (
            <>
              <button 
                onClick={() => navigate(ROUTES.COLLECTIONS)}
                className="text-[9px] font-bold text-text-primary/20 tracking-[0.2em] uppercase hover:text-neonRed transition-colors"
              >
                COLLECTIONS
              </button>
              <span className="text-[9px] text-neonRed font-black">/</span>
              <button 
                onClick={() => navigate(`/collections/${sourceHandle}`)}
                className="text-[9px] font-bold text-text-primary/20 tracking-[0.2em] uppercase hover:text-neonRed transition-colors truncate"
              >
                {sourceTitle}
              </button>
              <span className="text-[9px] text-neonRed font-black">/</span>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate(ROUTES.SHOP)}
                className="text-[9px] font-bold text-text-primary/20 tracking-[0.2em] uppercase hover:text-neonRed transition-colors"
              >
                SHOP_DIRECTORY
              </button>
              <span className="text-[9px] text-neonRed font-black">/</span>
            </>
          )}

          <span className="text-[9px] font-black text-text-primary tracking-[0.2em] uppercase italic truncate">
            {product.handle}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          <div className="lg:w-3/5 space-y-6">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-[3/4] bg-bg-secondary overflow-hidden relative group">
                <img src={img.url} className={`w-full h-full object-cover transition-all duration-700 ${isVaulted ? 'grayscale brightness-50' : 'grayscale hover:grayscale-0'}`} alt={product.title} />
                {isVaulted && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-text-primary/10 px-6 py-2 rotate-[-12deg]">
                      <span className="text-4xl font-black uppercase text-text-primary/10 tracking-[0.3em]">VAULTED</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <aside className="lg:w-2/5 lg:sticky lg:top-32 h-fit space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed block">{product.gid}</span>
                {isVaulted && (
                  <span className="text-[9px] font-black uppercase tracking-widest bg-bg-contrast-10 px-2 py-0.5 text-text-primary/40">Archived_Record</span>
                )}
              </div>
              <h1 className="text-5xl font-black uppercase tracking-tighter text-text-primary mb-4 leading-none italic">
                {product.title}
              </h1>
              <p className={`text-2xl font-black tracking-tighter ${isVaulted ? 'text-text-primary/20' : 'text-neonRed'}`}>{priceStr}</p>
            </div>

            <p className="text-sm font-bold text-text-secondary opacity-50 uppercase tracking-widest leading-relaxed italic">{product.description}</p>

            <div className="space-y-8">
              {product.options.map((opt) => (
                <div key={opt.name}>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary/20 mb-4 border-l-2 border-neonRed pl-3 italic">{opt.name}</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {opt.values.map((val) => (
                      <button
                        key={val}
                        disabled={isVaulted}
                        onClick={() => onSelectOption(opt.name, val)}
                        className={`py-3 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 transform ${
                          selectedOptions[opt.name] === val
                            ? 'bg-neonRed border-neonRed text-white shadow-neon'
                            : `bg-bg-contrast-02 border-border-color text-text-primary/40 hover:border-neonRed/40 hover:text-text-primary/80 hover:-translate-y-0.5`
                        } ${isVaulted ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-stretch gap-3 sm:gap-4">
              <button 
                onClick={() => isAvailable && selectedVariant && onAddToCart(selectedVariant)}
                disabled={!isAvailable}
                className={`flex-1 py-5 sm:py-6 font-black uppercase text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.3em] transition-all flex items-center justify-center group overflow-hidden relative ${
                  isAvailable 
                    ? 'bg-neonRed text-white shadow-neon hover:shadow-neon-strong active:scale-95' 
                    : 'bg-bg-contrast-05 text-text-primary/20 cursor-not-allowed border border-border-color'
                }`}
              >
                <div className="relative z-10 flex items-center gap-3 sm:gap-4 whitespace-nowrap">
                  <span>{getButtonText()}</span>
                  {isAvailable && <Icons.ShoppingBag />}
                </div>
                {isAvailable && (
                  <div className="absolute top-0 -left-[100%] w-[150%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg] transition-all duration-1000 ease-in-out group-hover:left-[100%]" />
                )}
                {!isAvailable && isVaulted && (
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(transparent_50%,black_50%)] bg-[length:100%_4px]"></div>
                )}
              </button>

              <button
                onClick={onToggleSave}
                disabled={isVaulted || isUpcoming}
                className={`w-16 sm:w-20 h-auto flex items-center justify-center transition-all duration-300 border group/save active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed ${
                    isSaved
                    ? 'bg-neonRed/10 border-neonRed text-neonRed shadow-neon'
                    : 'bg-bg-contrast-02 border-border-color text-text-primary/40 hover:border-neonRed/40 hover:text-neonRed'
                }`}
                aria-label={isSaved ? "Remove from archive" : "Save to archive"}
              >
                <div className={`transition-transform duration-300 ${isSaved ? 'scale-110' : 'group-hover/save:scale-110'}`}>
                    <Icons.Heart fill={isSaved ? "currentColor" : "none"} />
                </div>
              </button>
            </div>


            {isVaulted && (
               <div className="p-6 border border-border-color bg-bg-contrast-01 flex items-center gap-4">
                  <div className="text-neonRed/40">
                    <Icons.Shield />
                  </div>
                  <p className="text-[10px] font-black text-text-primary/20 uppercase tracking-widest leading-relaxed italic">
                    This asset has been vaulted. Procurement is restricted to verified legacy holders or via specialized secondary uplink channels.
                  </p>
               </div>
            )}

            <div className="pt-10 border-t border-border-color">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-neonRed mb-6 italic">Technical Specifications</h3>
              <ul className="space-y-4">
                {product.specs?.map((spec, i) => (
                  <li key={i} className="flex gap-4 items-start group text-[10px] font-bold text-text-primary/40 uppercase tracking-widest italic">
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