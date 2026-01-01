import React from 'react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';
import { Icons } from '../constants';

interface ArchivesPageViewProps {
  upcoming: Product[];
  vaulted: Product[];
  onNotify: (handle: string) => void;
}

export const ArchivesPageView: React.FC<ArchivesPageViewProps> = ({ 
  upcoming, vaulted, onNotify 
}) => {
  const navigate = useNavigate();
  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        {/* Technical Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
          <button onClick={() => navigate(ROUTES.HOME)} className="text-[9px] font-mono text-text-primary/20 tracking-tighter uppercase hover:text-neonRed transition-colors">ROOT</button>
          <span className="text-[9px] text-neonRed font-black">/</span>
          <span className="text-[9px] font-black text-text-primary tracking-[0.2em] uppercase italic">ARCHIVE_DIRECTORY</span>
          <div className="ml-auto flex items-center gap-4 pl-6">
            <span className="text-[9px] font-mono text-text-primary/10 uppercase tracking-widest hidden md:block italic">Partition: SECURE_VAULT_01</span>
            <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest animate-pulse">SYSTEM: ONLINE</span>
          </div>
        </nav>

        {/* Upcoming Drops Section */}
        <div className="mb-32">
          <div className="flex items-center gap-6 mb-16">
            <div className="h-6 w-1.5 bg-neonRed shadow-neon"></div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-text-primary leading-none italic">
              Future <span className="text-neonRed">Signals.</span>
            </h2>
          </div>
          
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {upcoming.map(product => (
                <div key={product.gid} className="group relative bg-bg-secondary border border-border-color overflow-hidden shadow-2xl transition-all hover:border-neonRed/30">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img src={product.featuredImage.url} alt={product.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-all duration-[1500ms] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-6 left-6">
                      <div className="bg-neonRed text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-2 shadow-neon flex items-center gap-3">
                         <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                         Staged Drop
                      </div>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col justify-between">
                    <div className="mb-10">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-text-primary leading-none italic">{product.title}</h3>
                        <span className="text-[10px] font-mono text-neonRed font-black italic">{product.releaseDate ? new Date(product.releaseDate).toLocaleDateString() : 'TBD'}</span>
                      </div>
                      <p className="text-[11px] font-bold text-text-primary/40 uppercase tracking-[0.15em] leading-relaxed line-clamp-2 italic">{product.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 pt-8 border-t border-border-color">
                      <button 
                        onClick={() => onNotify(product.handle)}
                        className="flex-1 bg-text-primary text-bg-primary text-[10px] font-black uppercase tracking-[0.3em] py-4 hover:bg-neonRed hover:text-white transition-all shadow-xl active:scale-95"
                      >
                        Notify Me
                      </button>
                      <button disabled className="flex-1 border border-border-color text-text-primary/20 text-[10px] font-black uppercase tracking-[0.3em] py-4 cursor-not-allowed">
                        Locked // {product.handle}
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
                    <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="p-20 border border-border-color bg-bg-contrast-01 text-center">
                <span className="text-[10px] font-black text-text-primary/10 uppercase tracking-[0.5em]">No Pending Signals Detected</span>
             </div>
          )}
        </div>

        {/* Vaulted Section */}
        <div>
          <div className="flex items-center gap-6 mb-16">
            <div className="h-6 w-1.5 bg-text-primary/20"></div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-text-primary/20 leading-none italic">
              Legacy <span className="text-text-primary/5">Vault.</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {vaulted.map(product => (
              <a 
                key={product.gid} 
                href={`/products/${product.handle}`} 
                rel="noopener"
                onClick={(e) => { e.preventDefault(); navigate(`/shop/${product.handle}`); }}
                className="group relative aspect-[4/5] bg-bg-primary border border-border-color grayscale saturate-0 opacity-60 hover:opacity-100 transition-all duration-700 overflow-hidden"
              >
                <img src={product.featuredImage.url} alt={product.title} className="absolute inset-0 w-full h-full object-cover brightness-[0.4] transition-all group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-2 border-white/10 px-4 py-1">
                  <span className="text-2xl font-black uppercase text-white/10 tracking-[0.2em]">VAULTED</span>
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                   <span className="text-[8px] font-black text-white/20 tracking-[0.4em] uppercase mb-1">REF // {product.handle}</span>
                   <h3 className="text-xl font-black uppercase tracking-tighter text-white/80 group-hover:text-neonRed transition-colors italic leading-none">{product.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Archive Manifesto Footer */}
        <div className="mt-40 pt-20 border-t border-border-color text-center max-w-2xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-primary/10 leading-loose italic">
            ALL ASSETS IN THE VAULT ARE CONSIDERED FINALIZED DEPLOYMENTS. FUTURE SIGNALS ARE SUBJECT TO FIELD INTERFERENCE AND TECHNICAL RE-CALIBRATION. PROCUREMENT IS ONLY POSSIBLE DURING ACTIVE WINDOWS.
          </p>
        </div>
      </div>
    </div>
  );
};