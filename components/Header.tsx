import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons, NAV_ITEMS } from '../constants';
import { AccountSection, NavItem } from '../types';
import { ROUTES } from '../utils/routeHelpers';

interface MegaMenuProps {
  item: NavItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: () => void;
}

const HeaderMegaMenu: React.FC<MegaMenuProps> = ({ item, isOpen, onMouseEnter, onMouseLeave, onNavigate }) => {
  if (!item.dropdownContent) return null;

  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 w-full glass transition-all duration-500 origin-top z-30 ${
        isOpen 
          ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
          : 'opacity-0 -translate-y-4 pointer-events-none invisible'
      }`}
      style={{
        maxHeight: '85vh',
        top: '100%',
        paddingTop: '1px' 
      }}
    >
      <div className="overflow-y-auto max-h-[calc(85vh-2rem)] custom-scrollbar">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-12">
              {item.dropdownContent.categories?.map((cat, idx) => (
                <div key={idx} className="space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed border-l-2 border-neonRed pl-4">
                    {cat.title}
                  </h4>
                  <ul className="space-y-5">
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

            <div className="md:col-span-4 flex gap-8">
              {item.dropdownContent.featured?.map((feat, idx) => (
                <div 
                  key={idx} 
                  onClick={onNavigate}
                  className="flex-1 group/feat cursor-pointer relative overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={feat.image} 
                      alt={feat.title} 
                      className="w-full h-full object-cover grayscale group-hover/feat:grayscale-0 group-hover/feat:scale-110 transition-all duration-1000 opacity-80"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent opacity-60 group-hover/feat:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-neonRed text-white px-3 py-1 mb-3 inline-block shadow-neon">
                      {feat.tag}
                    </span>
                    <h5 className="text-white font-black uppercase tracking-tighter text-xl leading-none">
                      {feat.title}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 pt-10 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex gap-10">
               <span className="text-[9px] font-mono text-charcoal/20 dark:text-white/20 uppercase tracking-[0.3em]">Protocol: VIS_DEPLOY_{item.label.toUpperCase()}</span>
               <span className="text-[9px] font-mono text-charcoal/20 dark:text-white/20 uppercase tracking-[0.3em] hidden sm:inline">Status: SECURE</span>
            </div>
            <button 
              onClick={onNavigate}
              className="text-charcoal/60 dark:text-white/40 hover:text-neonRed text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 bg-transparent border-none p-0 outline-none group"
            >
              View All {item.label} <span className="text-xl leading-none mt-[-2px] transition-transform group-hover:translate-x-2">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HeaderProps {
  cartCount: number;
  savedCount: number;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenMobileMenu: () => void;
  onOpenAccessPanel: () => void;
}

const Header: React.FC<HeaderProps> = ({
  cartCount,
  savedCount,
  onOpenSearch,
  onOpenCart,
  onOpenMobileMenu,
  onOpenAccessPanel,
}) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const menuTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuEnter = (index: number) => {
    if (menuTimeoutRef.current) window.clearTimeout(menuTimeoutRef.current);
    setActiveMenuIndex(index);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = window.setTimeout(() => {
      setActiveMenuIndex(null);
    }, 150);
  };

  // Ensure header background perfectly matches theme and current scroll state
  const headerBgClass = isScrolled || activeMenuIndex !== null
    ? 'bg-white dark:bg-charcoal border-black/5 dark:border-white/10 shadow-lg' 
    : 'bg-transparent border-transparent';

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-[100] header-transition border-b transition-colors duration-500 ${headerBgClass} ${isScrolled ? 'py-4' : 'py-8'}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center relative z-[110]">
          <div className="flex items-center gap-2 md:gap-6 lg:gap-10">
            <button 
              onClick={onOpenMobileMenu}
              className="lg:hidden text-charcoal dark:text-white hover:text-neonRed transition-all duration-300 hover:scale-110 flex items-center justify-center w-10 h-10" 
              aria-label="Toggle Menu"
            >
              <Icons.Menu />
            </button>

            <button onClick={() => navigate(ROUTES.HOME)} className="group cursor-pointer bg-transparent border-none p-0 outline-none">
              <h1 className="text-2xl font-black uppercase tracking-[-0.1em] text-charcoal dark:text-white leading-none">
                <span className="md:hidden">W.W</span>
                <span className="hidden md:inline">Wicked<span className="group-hover:text-neonRed transition-colors duration-300">Works</span></span>
              </h1>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-8 lg:gap-10">
            <nav className="hidden lg:flex items-center gap-10 h-full">
              {NAV_ITEMS.map((item, idx) => (
                <div 
                  key={item.label}
                  onMouseEnter={() => handleMenuEnter(idx)}
                  onMouseLeave={handleMenuLeave}
                  className="relative flex items-center py-2"
                >
                  <button 
                    onClick={() => navigate(item.path)}
                    className={`text-[11px] font-black uppercase tracking-[0.4em] transition-colors relative group/nav ${
                      activeMenuIndex === idx ? 'text-neonRed' : 'text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-2 left-0 h-[1.5px] bg-neonRed transition-all duration-500 shadow-neon ${activeMenuIndex === idx ? 'w-full' : 'w-0 group-hover/nav:w-full'}`}></span>
                  </button>
                </div>
              ))}
            </nav>
            
            <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 hidden lg:block"></div>

            <div className="flex items-center gap-1 md:gap-3">
              <button 
                onClick={onOpenSearch}
                className="text-charcoal dark:text-white hover:text-neonRed transition-all duration-300 relative hover:scale-110 group/search w-10 h-10 flex items-center justify-center" 
                aria-label="Search Archives"
              >
                <Icons.Search />
              </button>

              <button 
                onClick={() => navigate(ROUTES.SAVED)}
                className="text-charcoal dark:text-white hover:text-neonRed transition-all duration-300 relative hover:scale-110 group/saved w-10 h-10 flex items-center justify-center" 
                aria-label="View Saved Archive"
              >
                <Icons.Heart />
                {savedCount > 0 && (
                  <span className="absolute top-1 right-1 bg-neonRed text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full text-white shadow-neon leading-none pt-[1px]">
                    {savedCount}
                  </span>
                )}
              </button>

              <button 
                onClick={onOpenCart}
                className="text-charcoal dark:text-white hover:text-neonRed transition-all duration-300 relative hover:scale-110 group/cart w-10 h-10 flex items-center justify-center" 
                aria-label="View Cart"
              >
                <Icons.Cart />
                <span className="absolute top-1 right-1 bg-neonRed text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full text-white shadow-neon leading-none pt-[1px] transition-all group-active/cart:scale-125">
                  {cartCount}
                </span>
              </button>
              
              <button 
                onClick={onOpenAccessPanel}
                className="transition-all duration-300 relative hover:scale-110 w-10 h-10 flex items-center justify-center text-charcoal dark:text-white hover:text-neonRed" 
                aria-label="Account Dashboard"
              >
                <Icons.User />
              </button>
            </div>
          </div>
        </div>

        {NAV_ITEMS.map((item, idx) => (
          <HeaderMegaMenu 
            key={`dropdown-${idx}`}
            item={item} 
            isOpen={activeMenuIndex === idx}
            onMouseEnter={() => handleMenuEnter(idx)}
            onMouseLeave={handleMenuLeave}
            onNavigate={() => {
              navigate(item.path);
              setActiveMenuIndex(null);
            }}
          />
        ))}
      </header>

      {/* Shared high-opacity backdrop for mega menus to block background UI noise */}
      <div 
        className={`fixed inset-0 bg-charcoal/95 dark:bg-charcoal/95 backdrop-blur-3xl z-[90] transition-opacity duration-700 ${activeMenuIndex !== null ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
    </>
  );
};

export default Header;