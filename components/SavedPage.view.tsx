import React, { useState } from 'react';
import { Product } from '../types';
import GlassCardContainer from './GlassCard.container';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';
import { Icons } from '../constants';

interface SavedPageViewProps {
  products: Product[];
  onViewProduct: (handle: string) => void;
  onToggleSave: (handle: string) => void;
  loading: boolean;
  error: string | null;
}

const SavedListItem: React.FC<{ product: Product; onViewProduct: () => void; onToggleSave: () => void }> = ({ product, onViewProduct, onToggleSave }) => {
    const price = `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`;
  
    return (
      <div className="group relative flex flex-col sm:flex-row gap-6 p-5 bg-bg-secondary border border-border-color items-center transition-all duration-500 hover:border-neonRed/30 animate-in slide-in-from-bottom-2 overflow-hidden shadow-2xl">
        <div className="w-full sm:w-32 aspect-[4/5] sm:aspect-square bg-bg-tertiary overflow-hidden flex-shrink-0 relative cursor-pointer" onClick={onViewProduct}>
          <img 
            src={product.featuredImage.url} 
            alt={product.title} 
            className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1000ms]"
          />
          <div className="absolute inset-0 border border-border-color group-hover:border-neonRed/20 transition-colors"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-500 bg-[linear-gradient(transparent_50%,black_50%)] bg-[length:100%_4px]"></div>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6 min-w-0 w-full">
          {/* Constrained Text Section: Enhanced padding to ensure clearance for icons on all breakpoints */}
          <div className="min-w-0 text-left cursor-pointer flex-1 lg:pr-12 md:pr-8" onClick={onViewProduct}>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
               <span className="text-[8px] font-black uppercase tracking-[0.4em] text-text-secondary bg-bg-contrast-05 px-2 py-1 truncate max-w-[140px] sm:max-w-[200px]">
                {product.category}
              </span>
              <span className="hidden md:inline text-[8px] font-mono text-text-secondary/50 uppercase tracking-widest italic">
                // REF: {product.handle}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-text-primary leading-[0.9] group-hover:text-neonRed transition-colors truncate italic">
              {product.title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-12 flex-shrink-0 w-full sm:w-auto">
            <div className="bg-neonRed text-white px-4 py-2 shadow-neon border border-white/10">
              <span className="text-[11px] font-black tracking-widest uppercase block leading-none">
                {price}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-bg-tertiary/60 backdrop-blur-md border border-neonRed/40 text-neonRed shadow-neon group/heart active:scale-90 transition-all"
                aria-label="Remove from Saved"
              >
                <div className="scale-110 transition-transform group-hover/heart:scale-125">
                  <Icons.Heart fill="currentColor" />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
          <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
        </div>
      </div>
    );
  };

export const SavedPageView: React.FC<SavedPageViewProps> = ({ products, onViewProduct, onToggleSave, loading, error }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-1 bg-neonRed animate-width-pulse"></div>
        <div className="text-neonRed font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Accessing Vault...</div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-text-secondary mb-4 italic">Error Accessing Vault</h3>
            <p className="text-[10px] font-bold text-neonRed uppercase tracking-widest mb-8">{error}</p>
            <button onClick={() => navigate(ROUTES.HOME)} className="bg-bg-contrast-05 text-text-secondary px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:text-text-primary transition-colors border border-border-color">Return Home</button>
        </div>
    )
  }
  
  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
          <button 
            onClick={() => navigate(ROUTES.HOME)}
            className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors"
          >
            ROOT
          </button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black">SAVED_ARCHIVE</span>
          <div className="ml-auto flex items-center gap-6 pl-6">
            <span className="text-[9px] font-mono text-text-secondary/20 uppercase tracking-[0.4em] hidden sm:block italic">Partition: SECURE_01</span>
            <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest">ACTIVE_SAVES: {products.length.toString().padStart(2, '0')}</span>
          </div>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
              <span className="text-neonRed text-[11px] font-black uppercase tracking-[0.5em] italic">Identity_Vault</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-text-primary leading-none italic mb-8 whitespace-nowrap">
              Saved <span className="text-text-secondary/20">Archive.</span>
            </h2>
            <p className="text-text-secondary font-bold text-sm md:text-lg uppercase tracking-[0.1em] max-w-xl leading-relaxed italic">
              YOUR CURATED LOADOUT STAGED FOR FIELD DEPLOYMENT. ASSETS ARE SECURED IN YOUR TEMPORARY TERMINAL NODE.
            </p>
          </div>
          
          {products.length > 0 && (
             <div className="flex items-center gap-2 bg-bg-secondary border border-border-color p-1.5 shadow-xl">
               <button 
                 onClick={() => setViewMode('GRID')}
                 className={`p-3 transition-all ${viewMode === 'GRID' ? 'bg-neonRed text-white shadow-neon' : 'text-text-secondary hover:text-neonRed'}`}
                 aria-label="Grid Interface"
               >
                 <Icons.ViewGrid />
               </button>
               <button 
                 onClick={() => setViewMode('LIST')}
                 className={`p-3 transition-all ${viewMode === 'LIST' ? 'bg-neonRed text-white shadow-neon' : 'text-text-secondary hover:text-neonRed'}`}
                 aria-label="List Interface"
               >
                 <Icons.ViewList />
               </button>
             </div>
          )}
        </div>

        {products.length > 0 ? (
          viewMode === 'GRID' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 animate-in fade-in duration-700">
              {products.map((product) => (
                <GlassCardContainer 
                  key={product.gid} 
                  product={product} 
                  onViewProduct={onViewProduct}
                  isSaved={true}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {products.map((product) => (
                <SavedListItem 
                  key={product.gid} 
                  product={product} 
                  onViewProduct={() => onViewProduct(product.handle)}
                  onToggleSave={() => onToggleSave(product.handle)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="relative group overflow-hidden bg-bg-secondary border border-border-color p-12 md:p-20 shadow-2xl transition-all duration-500 hover:border-neonRed/30 w-full max-w-2xl text-center">
              <div className="w-20 h-20 border border-border-color rounded-full flex items-center justify-center mb-10 mx-auto text-text-secondary/20 group-hover:text-neonRed group-hover:border-neonRed/20 transition-all group-hover:shadow-neon">
                <Icons.Heart />
              </div>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-text-primary mb-6 italic">Vault <span className="text-neonRed">Empty.</span></h3>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-text-secondary mb-12 max-w-sm mx-auto leading-loose italic">
                NO TECHNICAL ASSETS HAVE BEEN STAGED FOR YOUR IDENTITY ARCHIVE. SCAN THE NETWORK TO ADD EQUIPMENT.
              </p>
              <button 
                onClick={() => navigate(ROUTES.HOME)}
                className="inline-flex items-center gap-4 bg-neonRed text-white px-12 py-6 font-black uppercase tracking-[0.4em] text-[10px] shadow-neon hover:shadow-neon-strong transition-all active:scale-95 group/btn relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-4">
                  Scan Collection
                  <Icons.ArrowRight />
                </span>
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover/btn:left-[100%] transition-all duration-1000"></div>
              </button>
              
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
                <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};