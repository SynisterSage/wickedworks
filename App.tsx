import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeroContainer from './components/Hero.container';
import ProductGridContainer from './components/ProductGrid.container';
import ProductDetailPageContainer from './components/ProductDetailPage.container';
import HeaderContainer from './components/Header.container';
import ShopPageContainer from './components/ShopPage.container';
import CollectionsPageContainer from './components/CollectionsPage.container';
import ArchivesPageContainer from './components/ArchivesPage.container';
import AccountPageNew from './components/AccountPageNew';
import SavedPageContainer from './components/SavedPage.container';
import AboutPage from './components/AboutPage';
import ReturnsPage from './components/ReturnsPage';
import SizingPage from './components/SizingPage';
import ContactPage from './components/ContactPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import NotFoundPage from './components/NotFoundPage';
import AccessPanel from './components/AccessPanel';
import CartDrawerContainer from './components/CartDrawer.container';
import { CartPage } from './components/CartPage';
import SearchPanelContainer from './components/SearchPanel.container';
import SearchResultsPageContainer from './components/SearchResultsPage.container';
import MobileMenuContainer from './components/MobileMenu.container';
import FooterContainer from './components/Footer.container';
import CookieConsentContainer from './components/CookieConsent.container';
import { TickerBanner } from './components/TickerBanner.view';
import { useCart } from './hooks/useCart';
import { useSaved } from './hooks/useSaved';
import { Product, Variant } from './types';
import Preloader from './components/Preloader';
import BlogPageContainer from './components/BlogPage.container';
import BlogPostPageContainer from './components/BlogPostPage.container';
import AuthCallback from './components/AuthCallback';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    cartCount, 
    cartItems, 
    totalAmount, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    checkoutUrl 
  } = useCart();

  const { savedProducts, savedHandles, toggleSave, loading: savedLoading, error: savedError } = useSaved();
  
  const [isAccessPanelOpen, setIsAccessPanelOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user has visited before for preloader
  useEffect(() => {
    const hasVisited = localStorage.getItem('ww_has_visited');
    
    if (hasVisited) {
      // Skip preloader for returning visitors
      setIsLoading(false);
    } else {
      // Show preloader for first-time visitors
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('ww_has_visited', 'true');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Close overlays on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleAddToCart = (variant: Variant, product: Product) => {
    addToCart(variant, product);
    setIsCartOpen(true);
  };

  const handleAccessSuccess = () => {
    setIsAccessPanelOpen(false);
    navigate('/account');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-bg-primary font-sans text-text-primary transition-colors duration-500 selection:bg-neonRed selection:text-white">
        {isLoading && <Preloader />}
        
        <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <HeaderContainer 
            cartCount={cartCount}
            savedCount={savedHandles.length}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onOpenAccessPanel={() => setIsAccessPanelOpen(true)}
          />

        <main className="pt-24 md:pt-20">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={
              <>
                <HeroContainer />
                <TickerBanner />
                <ProductGridContainer 
                  onToggleSave={toggleSave}
                  savedHandles={savedHandles}
                />
              </>
            } />

            {/* Shop Routes */}
            <Route path="/shop" element={
              <ShopPageContainer 
                onToggleSave={toggleSave} 
                savedHandles={savedHandles}
              />
            } />
            <Route path="/shop/:handle" element={
              <ProductDetailPageContainer 
                onAddToCart={handleAddToCart}
                onToggleSave={toggleSave}
                savedHandles={savedHandles}
              />
            } />

            {/* Collections Routes */}
            <Route path="/collections" element={
              <CollectionsPageContainer 
                onToggleSave={toggleSave}
                savedHandles={savedHandles}
              />
            } />
            <Route path="/collections/:handle" element={
              <CollectionsPageContainer 
                onToggleSave={toggleSave}
                savedHandles={savedHandles}
              />
            } />

            {/* Archives */}
            <Route path="/archives" element={<ArchivesPageContainer />} />

            {/* Account & Saved */}
            <Route path="/account" element={<AccountPageNew />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/saved" element={
              <SavedPageContainer 
                products={savedProducts} 
                onToggleSave={toggleSave}
                loading={savedLoading}
                error={savedError}
              />
            } />

            {/* Cart */}
            <Route path="/cart" element={
              <CartPage
                cartItems={cartItems}
                totalAmount={totalAmount}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
                checkoutUrl={checkoutUrl}
              />
            } />

            {/* Search */}
            <Route path="/search" element={
              <SearchResultsPageContainer 
                onToggleSave={toggleSave}
                savedHandles={savedHandles}
              />
            } />

            {/* Blog Routes */}
            <Route path="/blog" element={<BlogPageContainer />} />
            <Route path="/blog/:slug" element={<BlogPostPageContainer />} />

            {/* Info Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/sizing" element={<SizingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <FooterContainer />
        <CookieConsentContainer />

        {/* Portals / Global UI Overlays */}
        <AccessPanel 
          isOpen={isAccessPanelOpen} 
          onClose={() => setIsAccessPanelOpen(false)} 
          onSuccess={handleAccessSuccess} 
        />
        
        <CartDrawerContainer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cartItems={cartItems}
          totalAmount={totalAmount}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          checkoutUrl={checkoutUrl}
        />

        <SearchPanelContainer 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
        
        <MobileMenuContainer 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        {/* Toast notifications */}
        <ToastContainer 
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
    </AuthProvider>
  );
};

export default App;