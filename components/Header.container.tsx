
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderView } from './Header.view';
import MegaMenuContainer from './MegaMenu.container';
import { NAV_ITEMS } from '../constants';

interface HeaderContainerProps {
  cartCount: number;
  savedCount: number;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenMobileMenu: () => void;
  onOpenAccessPanel: () => void;
}

const HeaderContainer: React.FC<HeaderContainerProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const menuTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu when route changes
  useEffect(() => {
    setActiveMenuIndex(null);
  }, [location.pathname]);

  // Triggered only by nav links: actually opens a menu
  const handleTriggerEnter = (index: number) => {
    if (menuTimeoutRef.current) window.clearTimeout(menuTimeoutRef.current);
    setActiveMenuIndex(index);
  };

  // Triggered by the menu content: only prevents closing, does not initiate opening
  const handleMenuContentEnter = () => {
    if (menuTimeoutRef.current) window.clearTimeout(menuTimeoutRef.current);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = window.setTimeout(() => {
      setActiveMenuIndex(null);
    }, 150);
  };

  const handleMegaMenuNavigate = (handle?: string) => {
    // Close the mega menu on any navigation
    setActiveMenuIndex(null);

    if (!handle) {
      navigate('/collections');
      return;
    }

    if (handle.startsWith('/')) {
      navigate(handle);
    } else {
      navigate(`/shop/${handle}`);
    }
  };

  return (
    <HeaderView 
      {...props}
      isScrolled={isScrolled}
      activeMenuIndex={activeMenuIndex}
      onMenuEnter={handleTriggerEnter}
      onMenuLeave={handleMenuLeave}
      navItems={NAV_ITEMS}
    >
      {NAV_ITEMS.map((item, idx) => (
        <MegaMenuContainer 
          key={idx}
          item={item}
          isOpen={activeMenuIndex === idx}
          onMouseEnter={handleMenuContentEnter}
          onMouseLeave={handleMenuLeave}
          onNavigate={handleMegaMenuNavigate}
        />
      ))}
    </HeaderView>
  );
};

export default HeaderContainer;
