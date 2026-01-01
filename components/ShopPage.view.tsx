import React from 'react';
import { Icons } from '../constants';
import GlassCardContainer from './GlassCard.container';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';
import { Product } from '../types';

interface ShopPageViewProps {
  products: Product[];
  onViewProduct: (handle: string) => void;
  onToggleSave: (handle: string) => void;
  savedHandles: string[];

  searchQuery: string;
  onSearchChange: (query: string) => void;
  
  filterOptions: {
    categories: string[];
    sizes: string[];
    colors: string[];
  };
  selectedFilters: {
    categories: string[];
    sizes: string[];
    colors: string[];
  };
  onFilterChange: (type: 'categories' | 'sizes' | 'colors', value: string) => void;
  clearFiltersAndSearch: () => void;
  
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

export const ShopPageView: React.FC<ShopPageViewProps> = ({
  products, onViewProduct, onToggleSave, savedHandles,
  searchQuery, onSearchChange,
  filterOptions, selectedFilters, onFilterChange, clearFiltersAndSearch,
  isFilterOpen, setIsFilterOpen,
}) => {
  const navigate = useNavigate();
  
  const FilterGroup = ({ title, options, current, type }: { title: string, options: string[], current: string[], type: 'categories' | 'sizes' | 'colors' }) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-primary italic">
          {title}
        </h4>
      </div>
      <div className="space-y-3.5">
        {options.map(opt => {
          const isActive = current.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onFilterChange(type, opt)}
              className="group flex items-center w-full gap-4 text-left"
            >
              <div className={`w-3.5 h-3.5 border transition-all duration-300 flex items-center justify-center ${
                isActive ? 'bg-neonRed border-neonRed shadow-neon' : 'border-border-color group-hover:border-neonRed/50'
              }`}>
                {isActive && <div className="w-1 h-1 bg-white rotate-45" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                isActive ? 'text-text-primary' : 'text-text-primary/20 group-hover:text-text-primary/40'
              }`}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const hasActiveFilters = selectedFilters.categories.length > 0 || selectedFilters.sizes.length > 0 || selectedFilters.colors.length > 0;

  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
          <button onClick={() => navigate(ROUTES.HOME)} className="text-[9px] font-mono text-text-primary/20 tracking-tighter uppercase hover:text-neonRed transition-colors">ROOT</button>
          <span className="text-[9px] text-neonRed font-black">/</span>
          <span className="text-[9px] font-black text-text-primary tracking-[0.2em] uppercase italic">SHOP_DIRECTORY</span>
          <div className="ml-auto flex items-center gap-4 pl-6">
            <span className="text-[9px] font-mono text-text-primary/10 uppercase tracking-widest hidden md:block italic">ACTIVE_MODULES: {products.length.toString().padStart(2, '0')}</span>
            <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest animate-pulse">UPLINK: STABLE</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-text-primary italic">Filters.</h3>
              {hasActiveFilters && (
                <button onClick={clearFiltersAndSearch} className="text-[8px] font-black uppercase tracking-widest text-neonRed hover:text-text-primary transition-colors">RESET_ALL</button>
              )}
            </div>
            <FilterGroup title="CLASS_CATEGORY" options={filterOptions.categories} current={selectedFilters.categories} type="categories" />
            <FilterGroup title="SPEC_SIZE" options={filterOptions.sizes} current={selectedFilters.sizes} type="sizes" />
            <FilterGroup title="COLOR_PROTOCOL" options={filterOptions.colors} current={selectedFilters.colors} type="colors" />
          </aside>

          <main className="lg:col-span-9">
            <header className="mb-16">
               <div className="flex items-center justify-between mb-8 lg:hidden">
                  <div className="flex items-center gap-4"><div className="h-8 w-1.5 bg-neonRed shadow-neon"></div><h2 className="text-4xl font-black uppercase tracking-tighter text-text-primary italic leading-none">Shop_All</h2></div>
                  <button onClick={() => setIsFilterOpen(true)} className="w-12 h-12 flex items-center justify-center bg-bg-secondary border border-border-color text-text-primary hover:text-neonRed hover:border-neonRed transition-all shadow-lg active:scale-95 group" aria-label="Filter Configuration">
                    <div className="group-hover:scale-110 transition-transform duration-300"><Icons.Adjustments /></div>
                  </button>
               </div>
               <div className="hidden lg:flex items-center gap-6 mb-10">
                  <div className="h-10 w-2 bg-neonRed shadow-neon flex-shrink-0"></div>
                  <h2 className="text-7xl xl:text-8xl font-black uppercase tracking-tighter text-text-primary leading-none italic">ACTIVE <span className="text-neonRed drop-shadow-[0_0_30px_rgba(255,0,60,0.3)]">INVENTORY.</span></h2>
               </div>
            </header>

            <div className="relative mb-16 group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary/20 group-focus-within:text-neonRed transition-colors pointer-events-none"><Icons.Search /></div>
              <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="SCAN INVENTORY..." className="w-full bg-bg-secondary border border-border-color text-xl font-black uppercase tracking-tighter text-text-primary focus:outline-none focus:border-neonRed/30 transition-colors py-6 pl-16 pr-16 placeholder:text-text-primary/10" />
              {searchQuery && (<button onClick={() => onSearchChange('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-text-secondary/40 hover:text-neonRed transition-colors" aria-label="Clear search"><Icons.Close /></button>)}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neonRed scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                {products.map((product: Product) => (<GlassCardContainer key={product.gid} product={product} onViewProduct={onViewProduct} isSaved={savedHandles.includes(product.handle)} onToggleSave={onToggleSave} />))}
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center bg-bg-contrast-01 border border-dashed border-border-color p-12">
                <span className="text-neonRed font-black text-6xl mb-6 italic drop-shadow-neon">404</span>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-text-primary mb-4">Zero Matches Found</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-primary/20 mb-10 max-w-xs leading-loose italic">ADJUST FILTERS OR SEARCH QUERY TO LOCATE DEPLOYMENTS.</p>
                <button onClick={clearFiltersAndSearch} className="px-10 py-5 bg-neonRed text-white font-black uppercase tracking-[0.4em] text-[10px] shadow-neon hover:shadow-neon-strong transition-all active:scale-95">Clear Selection</button>
              </div>
            )}
          </main>
        </div>
      </div>

      <div className={`fixed inset-0 z-[250] transition-all duration-500 lg:hidden ${isFilterOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/90 backdrop-blur-3xl transition-opacity duration-500 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsFilterOpen(false)} />
        <aside className={`absolute bottom-0 left-0 w-full h-[85vh] bg-bg-secondary border-t border-border-color transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform shadow-2xl p-8 overflow-y-auto custom-scrollbar ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1 bg-text-primary/10 rounded-full mx-auto mb-10" />
          <div className="flex justify-between items-center mb-12"><h3 className="text-3xl font-black uppercase tracking-tighter text-text-primary italic">Configuration.</h3><button onClick={() => setIsFilterOpen(false)} className="text-text-primary/40 p-2"><Icons.Close /></button></div>
          <FilterGroup title="CLASS_CATEGORY" options={filterOptions.categories} current={selectedFilters.categories} type="categories" />
          <FilterGroup title="SPEC_SIZE" options={filterOptions.sizes} current={selectedFilters.sizes} type="sizes" />
          <FilterGroup title="COLOR_PROTOCOL" options={filterOptions.colors} current={selectedFilters.colors} type="colors" />
          <div className="sticky bottom-0 left-0 right-0 pt-4 bg-gradient-to-t from-bg-secondary via-bg-secondary to-transparent"><button onClick={() => setIsFilterOpen(false)} className="w-full bg-neonRed text-white py-6 font-black uppercase tracking-[0.4em] text-xs shadow-neon active:scale-95">Apply Settings</button></div>
        </aside>
      </div>
    </div>
  );
};