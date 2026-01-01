
import React, { useEffect } from 'react';
import { Icons, MOCK_PRODUCTS } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  // Use a subset of mock products for the cart demo
  const cartItems = MOCK_PRODUCTS.slice(0, 2);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop - High Z to cover header */}
      <div 
        className={`fixed inset-0 z-[200] bg-charcoal/40 backdrop-blur-md transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer - Higher Z than backdrop */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] z-[210] bg-white dark:bg-charcoal border-l border-black/5 dark:border-white/5 transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 flex items-center justify-between border-b border-black/5 dark:border-white/5">
            <div>
              <span className="text-neonRed text-[10px] font-black uppercase tracking-[0.3em] mb-1 block">
                Deployment Queue
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-charcoal dark:text-white leading-none">
                Your Payload
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-charcoal/40 dark:text-white/40 hover:text-neonRed transition-colors"
              aria-label="Close Cart"
            >
              <Icons.Close />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {cartItems.length > 0 ? (
              <div className="space-y-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-32 bg-black/5 dark:bg-white/5 overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute inset-0 border border-black/5 dark:border-white/10 group-hover:border-neonRed/30 transition-colors"></div>
                    </div>
                    
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-sm font-black uppercase tracking-tight text-charcoal dark:text-white leading-tight">
                            {item.title}
                          </h3>
                          <button className="text-charcoal/20 dark:text-white/20 hover:text-neonRed transition-colors">
                            <Icons.Close />
                          </button>
                        </div>
                        <p className="text-[10px] font-bold text-charcoal/40 dark:text-white/40 uppercase tracking-widest">
                          {item.category} / Grey
                        </p>
                      </div>

                      <div className="flex justify-between items-end">
                        {/* Refined Industrial Quantity Selector */}
                        <div className="flex items-center border border-black/10 dark:border-white/10 h-9 w-24 overflow-hidden">
                          <button className="flex-1 h-full bg-black/5 dark:bg-white/5 text-charcoal/40 dark:text-white/40 hover:text-neonRed hover:bg-black/10 dark:hover:bg-white/10 transition-all font-black text-sm border-r border-black/5 dark:border-white/5">-</button>
                          <span className="w-8 text-center text-[10px] font-black text-charcoal dark:text-white">1</span>
                          <button className="flex-1 h-full bg-black/5 dark:bg-white/5 text-charcoal/40 dark:text-white/40 hover:text-neonRed hover:bg-black/10 dark:hover:bg-white/10 transition-all font-black text-sm border-l border-black/5 dark:border-white/5">+</button>
                        </div>
                        <span className="text-sm font-black text-neonRed tracking-tight">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-charcoal/20 dark:text-white/20">
                  <Icons.Cart />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-charcoal dark:text-white mb-2">Queue Empty</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40 dark:text-white/40 mb-8">No technical assets staged.</p>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 border border-neonRed text-neonRed font-black uppercase tracking-[0.2em] text-[10px] hover:bg-neonRed hover:text-white transition-all shadow-neon"
                >
                  Return to Store
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-charcoal/40 dark:text-white/40">
                <span>Subtotal</span>
                <span className="text-charcoal dark:text-white">$434.00</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-charcoal/40 dark:text-white/40">
                <span>Shipping</span>
                <span className="text-charcoal dark:text-white">Calculated at dispatch</span>
              </div>
              <div className="h-[1px] bg-black/5 dark:bg-white/10"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-charcoal dark:text-white">Total</span>
                <span className="text-xl font-black text-neonRed tracking-tighter">$434.00</span>
              </div>
            </div>

            <button className="w-full bg-neonRed text-white py-5 font-black uppercase tracking-[0.3em] text-xs shadow-neon hover:shadow-neon-strong transition-all duration-300 relative group/check overflow-hidden">
              <span className="relative z-10">Proceed to Checkout</span>
              <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:check:left-[150%] transition-all duration-1000 ease-in-out"></div>
            </button>
            
            <p className="text-[9px] text-center mt-6 text-charcoal/30 dark:text-white/20 uppercase tracking-[0.1em] font-bold">
              Secure encrypted transaction protocol active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
