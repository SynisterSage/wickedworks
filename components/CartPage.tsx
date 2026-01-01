import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../hooks/useCart';
import { Icons } from '../constants';
import { ROUTES } from '../utils/routeHelpers';

interface CartPageProps {
  cartItems: CartItem[];
  totalAmount: number;
  onRemoveItem: (gid: string) => void;
  onUpdateQuantity: (gid: string, quantity: number) => void;
  checkoutUrl: string;
}

export const CartPage: React.FC<CartPageProps> = ({ cartItems, totalAmount, onRemoveItem, onUpdateQuantity, checkoutUrl }) => {
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim()) {
      const discountAmount = totalAmount * 0.10;
      setAppliedDiscount({ code: discountCode.toUpperCase(), amount: discountAmount });
      setDiscountCode('');
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
  };

  const subtotal = totalAmount;
  const discountValue = appliedDiscount?.amount || 0;
  const finalTotal = subtotal - discountValue;

  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
          <button onClick={() => navigate(ROUTES.HOME)} className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors">ROOT</button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black">CART_PAYLOAD</span>
        </nav>

        {cartItems.length > 0 ? (
          <>
            <header className="mb-16">
              <span className="text-neonRed text-[11px] font-black uppercase tracking-[0.5em] mb-6 block italic">
                Secure_Payload
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-text-primary leading-none italic break-words">
                Deployment <span className="text-text-secondary/20">Manifest.</span>
              </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <main className="lg:col-span-8 space-y-6">
                {cartItems.map(item => (
                  <div key={item.variantGid} className="group flex flex-col sm:flex-row gap-6 p-6 bg-bg-secondary border border-border-color hover:border-neonRed/20 transition-all shadow-xl">
                    <button onClick={() => navigate(ROUTES.PRODUCT_DETAIL(item.productHandle))} className="w-full sm:w-32 h-48 sm:h-auto aspect-[4/5] bg-bg-tertiary border border-border-color flex-shrink-0 overflow-hidden cursor-pointer">
                      <img src={item.variant.image?.url || item.productFeaturedImage} alt={item.productTitle} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"/>
                    </button>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <button onClick={() => navigate(ROUTES.PRODUCT_DETAIL(item.productHandle))} className="text-left cursor-pointer">
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-text-primary group-hover:text-neonRed transition-colors italic leading-none">
                              {item.productTitle}
                            </h3>
                          </button>
                          <button onClick={() => onRemoveItem(item.variantGid)} className="text-text-secondary/40 hover:text-neonRed transition-colors -mt-1 flex-shrink-0 p-1"><Icons.Trash /></button>
                        </div>
                        <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest mt-2 block italic">SPEC: {item.variant.title}</span>
                      </div>
                      <div className="flex justify-between items-end mt-6">
                        {/* Refined Legible Quantity Control */}
                        <div className="flex items-center border border-border-color h-10 w-28 overflow-hidden bg-bg-tertiary shadow-inner">
                          <button onClick={() => onUpdateQuantity(item.variantGid, item.quantity - 1)} className="flex-1 h-full text-text-primary/40 hover:text-neonRed hover:bg-bg-contrast-05 transition-all font-black text-sm border-r border-border-color">-</button>
                          <span className="w-10 text-center text-[11px] font-mono font-black text-neonRed bg-bg-secondary h-full flex items-center justify-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.variantGid, item.quantity + 1)} className="flex-1 h-full text-text-primary/40 hover:text-neonRed hover:bg-bg-contrast-05 transition-all font-black text-sm border-l border-border-color">+</button>
                        </div>
                        <span className="text-lg font-black text-text-primary tracking-tighter italic">${(item.variant.price.amount * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </main>

              <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                <div className="bg-bg-secondary border border-border-color p-8 space-y-8 shadow-2xl">
                  <div className="flex items-center gap-4 border-b border-border-color pb-6">
                    <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
                    <h4 className="text-sm font-black text-text-primary uppercase tracking-widest italic">Payload Summary</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary italic"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
                    {appliedDiscount && (
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-neonRed animate-in fade-in duration-300 italic"><p>Discount</p><p>-${discountValue.toFixed(2)}</p></div>
                    )}
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary italic"><p>Shipping</p><p>Calculated</p></div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-border-color">
                    {appliedDiscount ? (
                      <div className="animate-in fade-in duration-300">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary italic block mb-3">Discount_Applied</label>
                        <div className="flex justify-between items-center bg-bg-contrast-02 border border-neonRed/30 px-4 py-3">
                          <span className="text-xs font-bold text-neonRed uppercase tracking-widest">{appliedDiscount.code}</span>
                          <button onClick={handleRemoveDiscount} className="text-text-secondary/50 hover:text-neonRed transition-colors p-1"><Icons.Close /></button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyDiscount} className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary italic">Discount_Code</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="ENTER_CODE" className="flex-1 bg-bg-contrast-02 border border-border-color focus:border-neonRed/30 px-4 py-3 text-xs font-bold text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest" />
                          <button type="submit" className="bg-bg-contrast-05 border border-border-color text-text-secondary px-4 py-3 sm:py-0 text-[10px] font-black uppercase tracking-widest hover:text-text-primary hover:border-text-primary/20 transition-all">Apply</button>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-border-color">
                    <p className="text-sm font-black uppercase tracking-widest text-text-primary italic">Total</p>
                    <p className="text-3xl font-black text-neonRed tracking-tighter">${finalTotal.toFixed(2)}</p>
                  </div>
                  <a href={checkoutUrl} className="!mt-10 block w-full text-center bg-neonRed text-white py-6 font-black uppercase tracking-[0.4em] text-xs shadow-neon hover:shadow-neon-strong transition-all active:scale-95 italic">
                    Proceed to Secure Checkout
                  </a>
                  <button onClick={() => navigate(ROUTES.SHOP)} className="w-full text-center text-text-secondary py-3 text-[10px] font-black uppercase tracking-widest hover:text-text-primary transition-colors italic">
                    Continue Shopping
                  </button>
                </div>
              </aside>
            </div>
          </>
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="relative group overflow-hidden bg-bg-secondary border border-border-color p-12 md:p-20 shadow-2xl transition-all duration-500 hover:border-neonRed/30 w-full max-w-2xl text-center">
              <div className="w-20 h-20 border border-border-color rounded-full flex items-center justify-center mb-10 mx-auto text-text-secondary/20 group-hover:text-neonRed group-hover:border-neonRed/20 transition-all group-hover:shadow-neon">
                <Icons.ShoppingBag />
              </div>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-text-primary mb-6 italic">Payload <span className="text-neonRed">Empty.</span></h3>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-text-secondary mb-12 max-w-sm mx-auto leading-loose italic">
                NO ASSETS STAGED FOR DEPLOYMENT.
              </p>
              <button 
                onClick={() => navigate(ROUTES.SHOP)}
                className="inline-flex items-center gap-4 bg-neonRed text-white px-12 py-6 font-black uppercase tracking-[0.4em] text-[10px] shadow-neon hover:shadow-neon-strong transition-all active:scale-95 group/btn relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-4">
                  Return to Archives
                  <Icons.ArrowRight />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};