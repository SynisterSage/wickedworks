
import React, { useEffect, useState } from 'react';
import { Icons, NAV_ITEMS } from '../constants';
import { NavItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const toggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  return (
    <div 
      className={`fixed inset-0 z-[150] transition-all duration-500 ease-in-out ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-charcoal/80 backdrop-blur-md transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <nav 
        className={`absolute top-0 left-0 w-full h-full bg-white dark:bg-charcoal border-b border-black/5 dark:border-white/10 transition-transform duration-500 ease-in-out transform shadow-2xl z-[160] flex flex-col ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-24 pb-8 px-6">
          <div className="container mx-auto max-w-lg">
            {/* Close Button Positioning */}
            <div className="absolute top-8 right-6">
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-charcoal dark:text-white hover:text-neonRed transition-colors"
              >
                <Icons.Close />
              </button>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neonRed mb-8 block border-l-2 border-neonRed pl-4">
                  Navigation Protocol
                </span>
                
                <div className="flex flex-col">
                  {NAV_ITEMS.map((item: NavItem) => {
                    const hasDropdown = !!item.dropdownContent;
                    const isExpanded = expandedSection === item.label;

                    return (
                      <div key={item.label} className="border-b border-black/5 dark:border-white/5 last:border-0">
                        <div className="flex items-center justify-between py-6">
                          <button 
                            onClick={() => {
                              const route = item.view === 'HOME' ? ROUTES.HOME : 
                                            item.view === 'SHOP_ALL' ? ROUTES.SHOP :
                                            item.view === 'COLLECTIONS' ? ROUTES.COLLECTIONS :
                                            item.view === 'ARCHIVES' ? ROUTES.ARCHIVES : ROUTES.HOME;
                              navigate(route);
                              onClose();
                            }}
                            className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-charcoal dark:text-white hover:text-neonRed transition-all bg-transparent border-none p-0 outline-none text-left"
                          >
                            {item.label}
                          </button>
                          
                          {hasDropdown && (
                            <button 
                              onClick={() => toggleSection(item.label)}
                              className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'text-neonRed rotate-180' : 'text-charcoal/30 dark:text-white/20'}`}
                              aria-label={isExpanded ? "Collapse section" : "Expand section"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Accordion Content */}
                        {hasDropdown && item.dropdownContent && (
                          <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100 mb-8' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="min-h-0 space-y-10 pl-6 border-l border-neonRed/20 ml-2">
                              {item.dropdownContent.categories?.map((cat, cIdx) => (
                                <div key={cIdx} className="space-y-4">
                                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-neonRed/60">
                                    {cat.title}
                                  </h4>
                                  <ul className="space-y-4">
                                    {cat.links.map((link, lIdx) => (
                                      <li key={lIdx}>
                                        <button 
                                          onClick={() => {
                                            navigate(ROUTES.SHOP);
                                            onClose();
                                          }}
                                          className="text-base font-bold uppercase tracking-widest text-charcoal/60 dark:text-white/40 hover:text-neonRed transition-colors block bg-transparent border-none p-0 outline-none"
                                        >
                                          {link}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Improved Footer Section for Secondary Links */}
        <div className="bg-black/5 dark:bg-black/20 border-t border-black/5 dark:border-white/10 p-10">
          <div className="container mx-auto max-w-lg">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-5">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal/30 dark:text-white/20 block border-b border-black/5 dark:border-white/5 pb-2">
                  Support
                </span>
                <ul className="space-y-4">
                  {[
                    { label: 'About Us', view: 'ABOUT' },
                    { label: 'Returns', view: 'RETURNS' },
                    { label: 'Sizing', view: 'SIZING' },
                    { label: 'Contact', view: 'CONTACT' }
                  ].map((link) => (
                    <li key={link.label}>
                      <button 
                        onClick={() => {
                          const route = link.view === 'ABOUT' ? ROUTES.ABOUT :
                                        link.view === 'RETURNS' ? ROUTES.RETURNS :
                                        link.view === 'SIZING' ? ROUTES.SIZING :
                                        link.view === 'CONTACT' ? ROUTES.CONTACT : ROUTES.HOME;
                          navigate(route);
                          onClose();
                        }}
                        className="text-sm font-black uppercase tracking-widest text-charcoal/60 dark:text-white/50 hover:text-neonRed transition-colors bg-transparent border-none p-0 outline-none"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-5">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal/30 dark:text-white/20 block border-b border-black/5 dark:border-white/5 pb-2">
                  Connect
                </span>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="text-sm font-black uppercase tracking-widest text-charcoal/60 dark:text-white/50 hover:text-neonRed transition-colors">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={() => { navigate(ROUTES.ARCHIVES); onClose(); }}
                      className="text-sm font-black uppercase tracking-widest text-charcoal/60 dark:text-white/50 hover:text-neonRed transition-colors bg-transparent border-none p-0 outline-none text-left"
                    >
                      Archives
                    </button>
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
                      className="text-sm font-black uppercase tracking-widest text-charcoal/60 dark:text-white/50 hover:text-neonRed transition-colors bg-transparent border-none p-0 outline-none text-left"
                    >
                      Network Access
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 flex justify-between items-center text-[8px] font-mono text-charcoal/20 dark:text-white/10 uppercase tracking-[0.2em]">
               <span>SYS_STATUS: ACTIVE</span>
               <span>BUILD_ID: 25.04.X</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
