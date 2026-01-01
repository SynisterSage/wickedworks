import React from 'react';
import { Icons } from '../constants';
import { Product } from '../types';

interface SearchPanelViewProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
  results: Product[];
  suggested: Product[];
  onResultClick: (handle: string) => void;
  onViewAll: (e: React.FormEvent) => void;
}

export const SearchPanelView: React.FC<SearchPanelViewProps> = ({
  isOpen, onClose, query, setQuery, results, suggested, onResultClick, onViewAll
}) => {
  return (
    <div 
      className={`fixed inset-0 z-[300] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'
      }`}
    >
      <div 
        className="absolute inset-0 bg-bg-primary/90 backdrop-blur-2xl transition-opacity duration-300" 
        onClick={onClose} 
      />

      <div className="relative z-10 flex flex-col h-full container mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 max-w-7xl">
        
        <div className="flex flex-col mb-10 md:mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-neonRed shadow-neon animate-pulse"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-text-primary tracking-[0.4em] uppercase">Archive_Search</span>
                <span className="text-[7px] font-mono text-text-secondary uppercase tracking-[0.2em] hidden xs:block">Secure_Terminal_WW_25</span>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="group flex items-center gap-3 text-text-secondary hover:text-text-primary transition-all bg-bg-secondary px-4 py-2 border border-border-color hover:border-neonRed/40"
              aria-label="Exit Terminal"
            >
              <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">Abort_Scan</span>
              <div className="transition-transform duration-500 group-hover:rotate-90">
                <Icons.Close />
              </div>
            </button>
          </div>

          <form onSubmit={onViewAll} className="relative group">
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-neonRed hidden xl:block opacity-40 group-focus-within:opacity-100 transition-opacity">
              <Icons.Search />
            </div>
            <input 
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SCAN_RECORDS..."
              className="w-full bg-transparent border-none text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-text-primary focus:outline-none placeholder:text-text-primary/5 italic"
            />
            
            <div className="mt-4 md:mt-6 h-[1px] w-full bg-border-color relative overflow-hidden">
              <div 
                className={`h-full bg-neonRed transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] shadow-neon ${
                  query.trim() ? 'w-full' : 'w-0'
                }`} 
              />
            </div>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 pb-12">
          {!query.trim() ? (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-4 h-[1px] bg-neonRed"></div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-secondary">Priority_Deployments</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {suggested.map((item) => (
                  <button 
                    key={item.gid} 
                    onClick={() => onResultClick(item.handle)} 
                    className="group text-left bg-bg-secondary border border-border-color hover:border-neonRed/30 transition-all duration-500 relative overflow-hidden flex flex-col h-full shadow-2xl"
                  >
                    <div className="aspect-[4/5] bg-bg-primary overflow-hidden relative">
                      <img 
                        src={item.featuredImage.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="p-6">
                      <span className="text-[9px] font-black text-neonRed uppercase tracking-widest block mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        REF // {item.handle}
                      </span>
                      <h5 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tighter group-hover:text-neonRed transition-colors leading-none italic">
                        {item.title}
                      </h5>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-border-color pb-6">
                <div className="flex flex-col gap-1">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-text-primary">Archive_Matches</h4>
                  <span className="text-[8px] font-mono text-text-secondary uppercase tracking-widest">Sector_Scan: {results.length} results</span>
                </div>
                {results.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest animate-pulse">Extraction_Ready</span>
                  </div>
                )}
              </div>

              {results.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.slice(0, 6).map((item) => (
                      <button 
                        key={item.gid} 
                        onClick={() => onResultClick(item.handle)} 
                        className="group flex items-center gap-6 p-4 bg-bg-secondary border border-border-color hover:border-neonRed/50 transition-all text-left relative overflow-hidden shadow-xl"
                      >
                        <div className="w-16 h-20 sm:w-20 sm:h-24 bg-bg-primary flex-shrink-0 relative overflow-hidden border border-border-color">
                          <img 
                            src={item.featuredImage.url} 
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" 
                            alt="" 
                          />
                        </div>
                        <div className="flex-1 min-w-0 pr-12">
                          <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-2">
                            {item.category}
                          </span>
                          <h5 className="text-xl sm:text-2xl font-black text-text-primary uppercase tracking-tighter truncate leading-none group-hover:text-neonRed transition-colors italic">
                            {item.title}
                          </h5>
                        </div>
                        <div className="text-text-secondary group-hover:text-neonRed transition-all transform group-hover:translate-x-2">
                          <Icons.ArrowRight />
                        </div>
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neonRed scale-y-0 group-hover:scale-y-100 transition-transform duration-300 shadow-neon" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-4 py-20 min-h-[40vh]">
                  <div className="relative flex items-center justify-center">
                    <div className="text-neonRed/10 text-[25vw] sm:text-[12rem] font-black select-none leading-none tracking-tighter italic">
                      404
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <h5 className="text-sm xs:text-base sm:text-xl md:text-2xl font-black text-text-primary uppercase tracking-[0.2em] sm:tracking-[0.5em] whitespace-nowrap drop-shadow-2xl">
                         Zero_Asset_Match
                       </h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto py-8 border-t border-border-color">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-12 text-[8px] sm:text-[9px] font-mono text-text-secondary/50 uppercase tracking-[0.4em]">
            <div className="flex flex-wrap justify-center sm:justify-start gap-6">
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-neonRed/30 rounded-full animate-pulse shadow-neon"></span>
                Node: WW_25_ARCHIVE
              </span>
              <span className="hidden sm:inline opacity-20">|</span>
              <span className="whitespace-nowrap opacity-60">Status: Link_Stable</span>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-end gap-6 sm:gap-10">
              <span className="whitespace-nowrap opacity-40">Encryption: AES_256_RSA</span>
              <span className="text-neonRed/40 font-black whitespace-nowrap">Protocol: SECURE_SCAN_V4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};