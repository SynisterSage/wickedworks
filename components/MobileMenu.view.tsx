import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icons } from '../constants';
import { NavItem, Product } from '../types';
import { ROUTES } from '../utils/routeHelpers';

interface MobileMenuViewProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  expandedSection: string | null;
  onToggleSection: (label: string) => void;
  archiveData: {
    upcoming: Product[];
    vaulted: Product[];
    loading: boolean;
  };
}

export const MobileMenuView: React.FC<MobileMenuViewProps> = ({
  isOpen, onClose, navItems, expandedSection, onToggleSection, archiveData
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const supportLinks = [
    { label: 'About Us', path: ROUTES.ABOUT },
    { label: 'Returns', path: ROUTES.RETURNS },
    { label: 'Sizing', path: ROUTES.SIZING },
    { label: 'Contact', path: ROUTES.CONTACT }
  ];

  return (
    <div className={`fixed inset-0 z-[150] transition-all duration-500 ${isOpen ? 'pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Heavy obsidian backdrop */}
      <div className={`absolute inset-0 bg-bg-tertiary/98 backdrop-blur-3xl transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      
      <nav className={`absolute top-0 left-0 w-full h-full bg-bg-secondary transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform shadow-[0_30px_60px_rgba(0,0,0,1)] z-[160] flex flex-col ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        
        {/* Sticky Header */}
        <div className="flex justify-between items-center px-8 pt-8 pb-4 relative z-[170] bg-bg-secondary">
          <div className="flex items-center gap-3">
            <div className="h-4 w-1 bg-neonRed shadow-neon"></div>
            <span className="text-neonRed text-[10px] font-black uppercase tracking-[0.5em] neon-text-shadow italic">
              Terminal_Active
            </span>
          </div>
          
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center text-text-primary/40 hover:text-neonRed transition-colors group"
            aria-label="Close Protocol"
          >
            <div className="relative w-5 h-5">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-current rotate-45 transition-transform group-hover:scale-110"></div>
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-current -rotate-45 transition-transform group-hover:scale-110"></div>
            </div>
          </button>
        </div>

        {/* Atmosphere */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-96 bg-neonRed/5 blur-[120px] rounded-full pointer-events-none opacity-40"></div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 relative z-10">
          <div className="container mx-auto max-w-lg pb-12">
            <div className="flex flex-col">
              {navItems.map((item) => {
                const isArchives = item.label.toLowerCase() === 'archives';
                const canExpand = !!item.dropdownContent || isArchives;
                const isExpanded = expandedSection === item.label;
                
                // Active State Logic - check if current path matches
                const isActive = location.pathname === item.path || 
                  (item.path === ROUTES.SHOP && location.pathname.startsWith('/shop'));

                return (
                  <div key={item.label} className="border-b border-border-color py-6 last:border-0">
                    <div className="flex items-center justify-between group relative">
                      {isActive && (
                        <div className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 w-1 h-8 bg-neonRed shadow-neon animate-in fade-in slide-in-from-left-2 duration-500"></div>
                      )}
                      
                      <button 
                        onClick={() => { navigate(item.path); onClose(); }}
                        className={`text-4xl md:text-5xl font-black uppercase tracking-tighter transition-all italic text-left leading-none ${
                          isActive ? 'text-neonRed' : 'text-text-primary/40 hover:text-text-primary'
                        }`}
                      >
                        {item.label}
                      </button>
                      
                      {canExpand && (
                        <button 
                          onClick={() => onToggleSection(item.label)}
                          className={`w-12 h-12 flex items-center justify-center transition-all duration-300 rounded-full border border-transparent hover:border-border-color ${isExpanded ? 'text-neonRed rotate-180' : 'text-text-primary/20'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Accordion sub-links */}
                    {isExpanded && (
                      <div className="mt-8 mb-4 space-y-12 pl-6 border-l border-neonRed/40 animate-in fade-in slide-in-from-top-4 duration-500">
                        {isArchives ? (
                          <>
                            {/* Future Signals for Mobile Archives */}
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed/50 italic">Future_Signals</h4>
                              <ul className="space-y-5">
                                {archiveData.upcoming.map((product) => (
                                  <li key={product.gid}>
                                    <button 
                                      onClick={() => { navigate(ROUTES.PRODUCT_DETAIL(product.handle)); onClose(); }} 
                                      className="text-xs font-black uppercase tracking-[0.2em] text-text-primary/60 hover:text-text-primary transition-colors text-left"
                                    >
                                      {product.title}
                                    </button>
                                  </li>
                                ))}
                                {archiveData.upcoming.length === 0 && (
                                  <li className="text-text-primary/10 text-[9px] uppercase tracking-widest italic font-black">
                                    {archiveData.loading ? 'Scanning...' : 'No Active Signals'}
                                  </li>
                                )}
                              </ul>
                            </div>
                            {/* Legacy Vault for Mobile Archives */}
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-primary/20 italic">Legacy_Vault</h4>
                              <ul className="space-y-5">
                                {archiveData.vaulted.map((product) => (
                                  <li key={product.gid}>
                                    <button 
                                      onClick={() => { navigate(ROUTES.PRODUCT_DETAIL(product.handle)); onClose(); }} 
                                      className="text-xs font-black uppercase tracking-[0.2em] text-text-primary/40 hover:text-text-primary transition-colors text-left"
                                    >
                                      {product.title}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        ) : (
                          item.dropdownContent?.categories?.map((cat, i) => (
                            <div key={i} className="space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed/50 italic">{cat.title}</h4>
                              <ul className="space-y-5">
                                {cat.links.map((link, j) => (
                                  <li key={j}>
                                    <button onClick={() => { navigate(ROUTES.SHOP); onClose(); }} className="text-xs font-black uppercase tracking-[0.2em] text-text-primary/60 hover:text-text-primary transition-colors text-left">
                                      {link}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Technical Footer Section */}
        <div className="bg-bg-tertiary border-t border-border-color px-8 py-12 md:py-16 relative z-10">
          <div className="container mx-auto max-w-lg">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-6">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-text-primary/20 border-b border-border-color pb-3 block">Support</span>
                <ul className="space-y-4">
                  {supportLinks.map(link => (
                    <li key={link.label}>
                      <button 
                        onClick={() => { navigate(link.path); onClose(); }}
                        className={`text-[11px] font-black uppercase tracking-widest hover:text-neonRed transition-colors text-left italic ${location.pathname === link.path ? 'text-neonRed' : 'text-text-primary/40'}`}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-text-primary/20 border-b border-border-color pb-3 block">Network</span>
                <ul className="space-y-4">
                   <li>
                    <button onClick={() => { navigate(ROUTES.BLOG); onClose(); }} className={`text-[11px] font-black uppercase tracking-widest hover:text-neonRed transition-colors text-left italic ${location.pathname === ROUTES.BLOG ? 'text-neonRed' : 'text-text-primary/40'}`}>
                      The Dispatch
                    </button>
                  </li>
                  <li>
                    <a href="#" className="text-[11px] font-black uppercase tracking-widest text-text-primary/40 hover:text-neonRed transition-colors text-left italic">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate(ROUTES.HOME);
                        onClose();
                        setTimeout(() => {
                          document.getElementById('network-access')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }}
                      className="text-[11px] font-black uppercase tracking-widest text-text-primary/40 hover:text-neonRed transition-colors text-left italic"
                    >
                      Network Access
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-16 flex justify-between items-center text-[8px] font-mono text-text-primary/10 uppercase tracking-[0.4em] border-t border-border-color pt-6">
               <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-neonRed shadow-neon animate-pulse"></span>
                 SYS_ACTIVE: 25.04.X
               </span>
               <span>ZONE: NEO_TK_DEPLOY</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};