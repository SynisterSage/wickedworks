
import React from 'react';
import { NavItem } from '../types';

interface MegaMenuProps {
  item: NavItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ item, isOpen, onMouseEnter, onMouseLeave, onNavigate }) => {
  if (!item.dropdownContent) return null;

  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 w-full glass transition-all duration-300 origin-top z-30 ${
        isOpen 
          ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
          : 'opacity-0 -translate-y-2 pointer-events-none invisible'
      }`}
      style={{
        maxHeight: '85vh',
        top: '100%',
        paddingTop: '1px' 
      }}
    >
      <div className="overflow-y-auto max-h-[calc(85vh-2rem)] custom-scrollbar">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {item.dropdownContent.categories?.map((cat, idx) => (
                <div key={idx} className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neonRed border-l-2 border-neonRed pl-3">
                    {cat.title}
                  </h4>
                  <ul className="space-y-4">
                    {cat.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <button 
                          onClick={onNavigate}
                          className="text-charcoal/40 dark:text-white/30 hover:text-neonRed dark:hover:text-neonRed text-[11px] transition-colors duration-300 uppercase tracking-widest font-black inline-block text-left bg-transparent border-none p-0 outline-none"
                        >
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="md:col-span-4 flex gap-6">
              {item.dropdownContent.featured?.map((feat, idx) => (
                <div 
                  key={idx} 
                  onClick={onNavigate}
                  className="flex-1 group/feat cursor-pointer relative overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={feat.image} 
                      alt={feat.title} 
                      className="w-full h-full object-cover grayscale group-hover/feat:grayscale-0 group-hover/feat:scale-105 transition-all duration-700 opacity-80"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/feat:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-neonRed text-white px-2 py-1 mb-2 inline-block shadow-neon">
                      {feat.tag}
                    </span>
                    <h5 className="text-white font-black uppercase tracking-tighter text-lg leading-none">
                      {feat.title}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
               <span className="text-[8px] font-mono text-charcoal/20 dark:text-white/20 uppercase tracking-widest">Protocol: VIS_DEPLOY_{item.label.toUpperCase()}</span>
               <span className="text-[8px] font-mono text-charcoal/20 dark:text-white/20 uppercase tracking-widest hidden sm:inline">Status: ACCESS_GRANTED</span>
            </div>
            <button 
              onClick={onNavigate}
              className="text-charcoal/60 dark:text-white/40 hover:text-neonRed text-[10px] font-black uppercase tracking-[0.3em] transition-colors flex items-center gap-2 bg-transparent border-none p-0 outline-none"
            >
              View All {item.label} <span className="text-lg leading-none mt-[-2px]">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
