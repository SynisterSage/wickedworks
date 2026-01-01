
import React from 'react';
import { NavItem, Product } from '../types';
import { Icons } from '../constants';

interface MegaMenuViewProps {
  item: NavItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: (handle?: string) => void;
  archiveData?: {
    upcoming: Product[];
    vaulted: Product[];
    loading: boolean;
  };
  collectionData?: {
    collections: any[];
    loading: boolean;
  };
  shopAllData?: {
    categories?: Array<{ title: string; links: Array<{ label: string; path: string }> }>;
    featuredProducts?: Product[];
    loading: boolean;
  };
}

export const MegaMenuView: React.FC<MegaMenuViewProps> = ({ 
  item, isOpen, onMouseEnter, onMouseLeave, onNavigate, archiveData, collectionData, shopAllData 
}) => {
  const isArchives = item.label.toLowerCase() === 'archives';
  const isShopAll = item.label.toLowerCase() === 'shop all';

  // Determine which featured product to show in the right column for Archives
  const featuredArchiveProduct = archiveData?.upcoming?.[0] || archiveData?.vaulted?.[0];
  const featuredTag = archiveData?.upcoming?.[0] ? 'LATEST_SIGNAL' : 'VAULTED_LEGACY';

  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 w-full transition-all duration-500 origin-top z-30 border-t border-border-color shadow-2xl ${
        isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'
      }`}
      style={{ 
        maxHeight: '85vh', 
        top: '100%',
        marginTop: '-1px'
      }}
    >
      {/* Main Blurred Content Area */}
      <div className="overflow-y-auto max-h-[calc(85vh-6rem)] custom-scrollbar bg-bg-secondary/95 backdrop-blur-3xl">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-16">
          
          <div className="grid grid-cols-12 gap-16">
            {/* Left Section: Navigation Lists (8 Columns) */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {isArchives ? (
                /* Unified Archives List Layout */
                <>
                  <div className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed border-l-2 border-neonRed pl-4 italic">Future_Signals</h4>
                    <ul className="space-y-5">
                      {archiveData?.upcoming.map((product) => (
                        <li key={product.gid}>
                          <button 
                            onClick={() => onNavigate(product.handle)}
                            className="text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest font-black text-left text-[11px] block"
                          >
                            {product.title}
                          </button>
                        </li>
                      ))}
                      {(!archiveData?.upcoming || archiveData.upcoming.length === 0) && (
                        <li className="text-text-secondary/50 text-[9px] uppercase tracking-widest font-black italic">No Pending Signals</li>
                      )}
                    </ul>
                  </div>
                  <div className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-secondary border-l-2 border-border-color pl-4 italic">Legacy_Vault</h4>
                    <ul className="space-y-5">
                      {archiveData?.vaulted.map((product) => (
                        <li key={product.gid}>
                          <button 
                            onClick={() => onNavigate(product.handle)}
                            className="text-text-secondary/70 hover:text-text-primary transition-colors uppercase tracking-widest font-black text-left text-[11px] block"
                          >
                            {product.title}
                          </button>
                        </li>
                      ))}
                      {(!archiveData?.vaulted || archiveData.vaulted.length === 0) && (
                        <li className="text-text-secondary/50 text-[9px] uppercase tracking-widest font-black italic">Vault Sealed</li>
                      )}
                    </ul>
                  </div>
                </>
              ) : isShopAll && shopAllData?.categories?.length ? (
                /* Shop All categories (broad) */
                shopAllData.categories.map((cat, idx) => (
                  <div key={idx} className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed border-l-2 border-neonRed pl-4 italic">{cat.title}</h4>
                    <ul className="space-y-5">
                      {cat.links.map((link, lIdx) => (
                        <li key={lIdx}>
                          <button 
                            onClick={() => onNavigate(link.path)}
                            className="text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest font-black text-left text-[11px] block"
                          >
                            {link.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : collectionData && collectionData.collections?.length ? (
                /* Live Collections List */
                <div className="space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed border-l-2 border-neonRed pl-4 italic">Active_Collections</h4>
                  <ul className="space-y-5">
                    {collectionData.collections.map((col) => (
                      <li key={col.gid}>
                        <button 
                          onClick={() => onNavigate(`/collections/${col.handle}`)}
                          className="text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest font-black text-left text-[11px] block"
                        >
                          {col.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                /* Fallback to static nav content */
                item.dropdownContent?.categories?.map((cat, idx) => (
                  <div key={idx} className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed border-l-2 border-neonRed pl-4 italic">{cat.title}</h4>
                    <ul className="space-y-5">
                      {cat.links.map((link, lIdx) => (
                        <li key={lIdx}>
                          <button onClick={() => onNavigate(link.toLowerCase().replace(/\s+/g, '-'))} className="text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest font-black text-left text-[11px] block">{link}</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {/* Right Section: Featured Imagery (4 Columns) */}
            <div className="hidden lg:flex col-span-4 gap-8">
              {isArchives ? (
                /* Featured Archive Visual */
                featuredArchiveProduct && (
                  <div 
                    onClick={() => onNavigate(featuredArchiveProduct.handle)}
                    className="flex-1 group/feat cursor-pointer relative overflow-hidden bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all"
                  >
                    <img 
                      src={featuredArchiveProduct.featuredImage.url} 
                      alt={featuredArchiveProduct.title} 
                      className="w-full h-full object-cover grayscale group-hover/feat:grayscale-0 group-hover/feat:scale-110 transition-all duration-[1500ms] opacity-60 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-neonRed text-white px-3 py-1 mb-3 inline-block shadow-neon">
                        {featuredTag}
                      </span>
                      <h5 className="text-white font-black uppercase tracking-tight text-base md:text-lg leading-snug italic drop-shadow-md max-h-[3.6rem] overflow-hidden break-words">
                        {featuredArchiveProduct.title}
                      </h5>
                    </div>
                  </div>
                )
              ) : isShopAll && shopAllData?.featuredProducts?.length ? (
                shopAllData.featuredProducts.slice(0, 2).map((prod) => {
                  const img = prod.featuredImage?.url || prod.images?.[0]?.url;
                  return (
                    <div key={prod.gid} onClick={() => onNavigate(`/shop/${prod.handle}`)} className="flex-1 group/feat cursor-pointer relative overflow-hidden bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all">
                      {img && (
                        <img src={img} alt={prod.title} className="w-full h-full object-cover grayscale group-hover/feat:grayscale-0 group-hover/feat:scale-110 transition-all duration-[1500ms] opacity-60 group-hover:opacity-100" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-neonRed text-white px-3 py-1 mb-3 inline-block shadow-neon">FEATURED</span>
                        <h5 className="text-white font-black uppercase tracking-tight text-base md:text-lg leading-snug italic drop-shadow-md max-h-[3.6rem] overflow-hidden break-words">{prod.title}</h5>
                      </div>
                    </div>
                  );
                })
              ) : collectionData && collectionData.collections?.length ? (
                collectionData.collections.slice(-2).map((col) => {
                  const img = col.image?.url || col.products?.[0]?.featuredImage?.url || col.products?.[0]?.images?.[0]?.url;
                  return (
                    <div key={col.gid} onClick={() => onNavigate(`/collections/${col.handle}`)} className="flex-1 group/feat cursor-pointer relative overflow-hidden bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all">
                      {img && (
                        <img src={img} alt={col.title} className="w-full h-full object-cover grayscale group-hover/feat:grayscale-0 group-hover/feat:scale-110 transition-all duration-[1500ms] opacity-60 group-hover:opacity-100" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-neonRed text-white px-3 py-1 mb-3 inline-block shadow-neon">ACTIVE</span>
                        <h5 className="text-white font-black uppercase tracking-tight text-base md:text-lg leading-snug italic drop-shadow-md max-h-[3.6rem] overflow-hidden break-words">{col.title}</h5>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Static fallback */
                item.dropdownContent?.featured?.map((feat, idx) => (
                  <div key={idx} onClick={() => onNavigate()} className="flex-1 group/feat cursor-pointer relative overflow-hidden bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all">
                    <img src={feat.image} alt={feat.title} className="w-full h-full object-cover grayscale group-hover/feat:grayscale-0 group-hover/feat:scale-110 transition-all duration-[1500ms] opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-neonRed text-white px-3 py-1 mb-3 inline-block shadow-neon">{feat.tag}</span>
                      <h5 className="text-white font-black uppercase tracking-tighter text-xl leading-none italic">{feat.title}</h5>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grounded Footer */}
      <div className="bg-bg-tertiary border-t border-border-color border-b border-border-color relative z-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-8 flex justify-between items-center">
           <div className="flex gap-10 text-[8px] font-mono text-text-secondary/40 uppercase tracking-[0.4em]">
              <span className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-neonRed shadow-neon animate-pulse rounded-full"></span> 
                SIGNAL_STABLE
              </span>
              <span className="hidden sm:inline">PROTOCOL // {isArchives ? 'ARCHIVE_INDEX' : 'COLLECTION_SCAN'}</span>
              <span className="hidden lg:inline">TERMINAL // WW_ALPHA_25</span>
           </div>
           
           <button 
             onClick={() => onNavigate('/collections')}
             className="text-[10px] font-black text-text-secondary hover:text-neonRed uppercase tracking-[0.4em] transition-all flex items-center gap-4 group"
           >
             View Full Directory 
             <span className="transition-transform group-hover:translate-x-2">
               <Icons.ArrowRight />
             </span>
           </button>
        </div>

        {/* Laser-Sharp Bottom Highlight */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neonRed/20">
          <div className="h-full bg-neonRed w-full shadow-neon opacity-50"></div>
        </div>
      </div>
    </div>
  );
};
