
import React from 'react';
import { Product } from '../types';
import { Icons } from '../constants';
import GlassCardContainer from './GlassCard.container';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';

interface SearchResultsPageViewProps {
  query: string;
  filteredProducts: Product[];
  onViewProduct: (handle: string) => void;
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  clearFilters: () => void;
  FilterGroup: React.FC<any>; 
  filterCounts: { categories: number; sizes: number; colors: number; };
  localQuery: string;
  setLocalQuery: (q: string) => void;
  onLocalSearch: (e: React.FormEvent) => void;
}

export const SearchResultsPageView: React.FC<SearchResultsPageViewProps> = ({
  query,
  filteredProducts,
  onViewProduct,
  onToggleSave,
  savedHandles,
  isFilterOpen,
  setIsFilterOpen,
  clearFilters,
  FilterGroup,
  filterCounts,
  localQuery,
  setLocalQuery,
  onLocalSearch
}) => {
  const navigate = useNavigate();
  const totalActiveFilters = filterCounts.categories + filterCounts.sizes + filterCounts.colors;
  
  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
          <button onClick={() => navigate(ROUTES.HOME)} className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors">ROOT</button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black">SEARCH</span>
          {query && !localQuery && (
            <>
              <span className="text-[9px] font-mono text-neonRed font-black">/</span>
              <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black italic truncate max-w-xs">'{query}'</span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-text-primary italic">Filters.</h3>
              {totalActiveFilters > 0 && (
                <button onClick={clearFilters} className="text-[8px] font-black uppercase tracking-widest text-neonRed hover:text-text-primary transition-colors">RESET_ALL</button>
              )}
            </div>
            <FilterGroup />
          </aside>

          <main className="lg:col-span-9">
            <header className="mb-12">
               <div className="flex items-center justify-between gap-6 mb-8 lg:hidden">
                  <div className="flex items-center gap-4 min-w-0">
                      <div className="h-8 w-1.5 bg-neonRed shadow-neon flex-shrink-0"></div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter text-text-primary italic leading-none truncate">
                        Archive_Search
                      </h2>
                  </div>
                  <button onClick={() => setIsFilterOpen(true)} className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-bg-secondary border border-border-color text-text-primary hover:text-neonRed hover:border-neonRed transition-all shadow-lg active:scale-95 group" aria-label="Filter Configuration">
                    <div className="group-hover:scale-110 transition-transform duration-300"><Icons.Adjustments /></div>
                  </button>
               </div>
               
               <div className="hidden lg:block mb-10">
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-neonRed mb-6 block italic">
                    Initiate_Scan_Protocol
                  </span>
                  <h2 className="text-5xl xl:text-7xl font-black uppercase tracking-tighter text-text-primary leading-none italic">
                     Archive Search
                  </h2>
               </div>
            </header>
            
            <form onSubmit={onLocalSearch} className="mb-16 relative group">
              <input 
                autoFocus
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="REFINE SCAN OR ENTER NEW QUERY..."
                className="w-full bg-bg-secondary border border-border-color text-2xl font-black uppercase tracking-tighter text-text-primary focus:outline-none focus:border-neonRed transition-colors py-6 px-8 placeholder:text-text-primary/10"
              />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neonRed scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-center"></div>
            </form>
            
            {localQuery.trim() ? (
              filteredProducts.length > 0 ? (
                <div className="animate-in fade-in duration-500">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary italic pt-6 border-t border-border-color mb-12">
                    {filteredProducts.length} assets found matching your scan protocol.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                    {filteredProducts.map((product: Product) => (
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
              ) : (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center bg-bg-contrast-01 border border-dashed border-border-color p-12 animate-in fade-in duration-500">
                  <span className="text-neonRed font-black text-6xl mb-6 italic drop-shadow-neon">404</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-text-primary mb-4">Zero Matches Found</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-primary/20 mb-10 max-w-xs leading-loose italic">RECONFIGURE FILTERS OR ADJUST SCAN PARAMETERS.</p>
                  <button onClick={clearFilters} className="px-10 py-5 bg-neonRed text-white font-black uppercase tracking-[0.4em] text-[10px] shadow-neon hover:shadow-neon-strong transition-all active:scale-95">Clear Selection</button>
                </div>
              )
            ) : (
              <div className="h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-bg-contrast-01 border border-dashed border-border-color animate-in fade-in duration-500">
                <div className="text-text-primary/10 mb-6"><Icons.Search /></div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-text-primary mb-4 italic">
                  Initiate Scan Protocol
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-primary/20 max-w-xs leading-loose italic">
                  Begin typing in the terminal above to search the archives.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <div className={`fixed inset-0 z-[250] transition-all duration-500 lg:hidden ${isFilterOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/90 backdrop-blur-3xl transition-opacity duration-500 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsFilterOpen(false)} />
        <aside className={`absolute bottom-0 left-0 w-full h-[85vh] bg-bg-secondary border-t border-border-color transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform shadow-2xl p-8 overflow-y-auto custom-scrollbar ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1 bg-text-primary/10 rounded-full mx-auto mb-10" />
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-text-primary italic">Configuration.</h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-text-primary/40 p-2"><Icons.Close /></button>
          </div>
          <FilterGroup />
          <div className="sticky bottom-0 left-0 right-0 pt-4 bg-gradient-to-t from-bg-secondary via-bg-secondary to-transparent">
            <button onClick={() => setIsFilterOpen(false)} className="w-full bg-neonRed text-white py-6 font-black uppercase tracking-[0.4em] text-xs shadow-neon active:scale-95">Apply Settings</button>
          </div>
        </aside>
      </div>
    </div>
  );
};
