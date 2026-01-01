import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { NavItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderViewProps {
  isScrolled: boolean;
  activeMenuIndex: number | null;
  onMenuEnter: (index: number) => void;
  onMenuLeave: () => void;
  cartCount: number;
  savedCount: number;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenMobileMenu: () => void;
  onOpenAccessPanel: () => void;
  navItems: any[];
  children?: React.ReactNode; 
}

export const HeaderView: React.FC<HeaderViewProps> = ({
  isScrolled,
  activeMenuIndex,
  onMenuEnter,
  onMenuLeave,
  cartCount,
  savedCount,
  onOpenSearch,
  onOpenCart,
  onOpenMobileMenu,
  onOpenAccessPanel,
  navItems,
  children
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  
  const headerBgClass = isScrolled || activeMenuIndex !== null
    ? 'bg-bg-primary/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-border-color' 
    : 'bg-transparent border-transparent';

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      login();
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[100] border-b transition-all duration-700 ${headerBgClass} ${isScrolled ? 'py-4' : 'py-8 md:py-10'}`}>
        <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 flex justify-between items-center relative z-[110] gap-x-4">
          {/* Left Side: Hamburger + Logo - Reduced gap on smaller tablets to keep logo left */}
          <div className="flex items-center gap-4 lg:gap-10 shrink-0">
            <button 
              onClick={onOpenMobileMenu} 
              className="lg:hidden text-text-primary hover:text-neonRed transition-all duration-300 w-10 h-10 flex items-center justify-start -ml-2"
              aria-label="Toggle Menu"
            >
              <Icons.Menu />
            </button>
            <button onClick={() => navigate('/')} className="group focus:outline-none flex items-center h-10">
              <h1 className="text-2xl md:text-2xl font-black uppercase tracking-[-0.05em] text-text-primary leading-none italic">
                <span className="md:hidden">W.<span className="text-neonRed not-italic transition-colors duration-300 group-hover:text-text-primary">W</span></span>
                <span className="hidden md:inline">Wicked<span className="group-hover:text-neonRed transition-colors duration-300 not-italic">Works</span></span>
              </h1>
            </button>
          </div>

          {/* Right Side: Desktop Nav + Icons - Responsive gaps to prevent collisions */}
          <div className="flex items-center gap-2 lg:gap-6 xl:gap-10 h-full">
            <nav className="hidden lg:flex items-center gap-6 xl:gap-12">
              {navItems.map((item, idx) => {
                const isHovered = activeMenuIndex === idx;

                return (
                  <div 
                    key={item.label} 
                    onMouseEnter={() => onMenuEnter(idx)} 
                    onMouseLeave={onMenuLeave} 
                    className="relative py-2 cursor-default group h-fit flex items-center"
                  >
                    <button 
                      onClick={() => navigate(item.path)} 
                      className={`text-[11px] font-black uppercase tracking-[0.5em] transition-colors flex items-center outline-none focus:outline-none whitespace-nowrap ${
                        isHovered ? 'text-neonRed' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {item.label}
                      <span className={`absolute -bottom-[2px] left-0 h-[2px] bg-neonRed transition-all duration-500 shadow-neon ${
                        isHovered ? 'w-full' : 'w-0 group-hover/nav:w-full'
                      }`}></span>
                    </button>
                  </div>
                );
              })}
            </nav>
            
            <div className="h-4 w-[1px] bg-border-color hidden lg:block mx-1 xl:mx-2"></div>

            {/* Icons Tray */}
            <div className="flex items-center gap-1 md:gap-3 -mr-2 md:mr-0 shrink-0">
              <button onClick={onOpenSearch} className="text-text-primary hover:text-neonRed transition-all duration-300 w-10 h-10 flex items-center justify-center">
                <Icons.Search />
              </button>
              
              <button 
                onClick={() => navigate('/saved')} 
                className={`text-text-primary hover:text-neonRed transition-all duration-300 relative w-10 h-10 flex items-center justify-center`}
              >
                <Icons.Heart />
                {savedCount > 0 && (
                  <span className="absolute top-1 right-1 bg-neonRed text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full text-white shadow-neon leading-none">
                    {savedCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={onOpenCart} 
                className="text-text-primary hover:text-neonRed transition-all duration-300 relative w-10 h-10 flex items-center justify-center"
              >
                <Icons.Cart />
                <span className="absolute top-1 right-1 bg-neonRed text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full text-white shadow-neon leading-none">
                  {cartCount}
                </span>
              </button>
              
              <button 
                onClick={handleAccountClick} 
                className={`flex text-text-primary hover:text-neonRed transition-all duration-300 relative w-10 h-10 items-center justify-center ${isAuthenticated ? 'text-neonRed' : ''}`}
                aria-label={isAuthenticated ? 'Account Dashboard' : 'Sign In'}
              >
                <Icons.User />
                {isAuthenticated && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-neonRed rounded-full shadow-neon"></span>
                )}
              </button>
            </div>
          </div>
        </div>
        {children}
      </header>
      <div className={`fixed inset-0 bg-bg-primary/80 backdrop-blur-3xl z-[90] transition-opacity duration-700 ${activeMenuIndex !== null ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
    </>
  );
};