import React from 'react';
import { Icons } from '../constants';
import { CartItem } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';

interface CartDrawerViewProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onRemoveItem: (gid: string) => void;
  onUpdateQuantity: (gid: string, quantity: number) => void;
  checkoutUrl: string;
}

export const CartDrawerView: React.FC<CartDrawerViewProps> = ({
  isOpen, onClose, cartItems, totalAmount, onRemoveItem, onUpdateQuantity, checkoutUrl
}) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Heavy Backdrop - Site-wide consistency at z-4999. Lightened light mode wash for clarity. */}
      <div 
        className={`fixed inset-0 z-[4999] bg-white/40 dark:bg-black/90 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`} 
        onClick={onClose} 
      />
      
      {/* Side Panel - Elevated Z-index 5000 for absolute dominance. Solid bg foundation. */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] z-[5000] border-l transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isOpen 
            ? 'translate-x-0 visible shadow-[-40px_0_100px_rgba(0,0,0,0.05)] dark:shadow-[-50px_0_100px_rgba(0,0,0,1)]' 
            : 'translate-x-full invisible shadow-none'
        } bg-bg-secondary border-border-color`}
      >
        <div className="flex flex-col h-full relative z-10">
          {/* Header Section - Defined technical glass */}
          <div className="p-8 md:p-10 flex items-center justify-between border-b bg-bg-primary/40 border-border-color backdrop-blur-sm">
            <div className="flex items-center gap-4">
               <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
               <div>
                  <span className="text-neonRed text-[9px] font-black uppercase tracking-[0.4em] mb-1 block neon-text-shadow italic text-nowrap">
                    Deployment_Queue
                  </span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-text-primary leading-none italic">
                    Your Payload.
                  </h2>
               </div>
            </div>
            <button onClick={onClose} className="text-text-primary/20 hover:text-neonRed transition-all p-2 group" aria-label="Abort Extraction">
              <div className="scale-110 group-hover:rotate-90 transition-transform duration-500">
                <Icons.Close />
              </div>
            </button>
          </div>

          <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar">
            {cartItems.length > 0 ? (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.variantGid} className="flex gap-6 p-4 border transition-all group relative overflow-hidden shadow-sm bg-bg-tertiary border-border-color hover:border-neonRed/30">
                    <div className="w-20 h-28 overflow-hidden flex-shrink-0 relative border bg-bg-secondary border-border-color">
                      <img 
                        src={item.variant.image?.url || item.productFeaturedImage} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-60 group-hover:opacity-100" 
                        alt={item.productTitle}
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] pointer-events-none transition-opacity duration-500 bg-[linear-gradient(transparent_50%,black_50%)] bg-[length:100%_4px]"></div>
                    </div>
                    
                    <div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
                      <div>
                        <div className="flex justify-between items-start mb-1.5 gap-2">
                          <h3 className="text-[13px] font-black uppercase tracking-tight text-text-primary leading-tight group-hover:text-neonRed transition-colors italic truncate">
                            {item.productTitle}
                          </h3>
                          <button 
                            onClick={() => onRemoveItem(item.variantGid)} 
                            className="text-text-primary/10 hover:text-neonRed transition-colors p-1 -mt-1 -mr-1" 
                            aria-label="Remove Item"
                          >
                            <div className="scale-75">
                                <Icons.Trash />
                            </div>
                          </button>
                        </div>
                        <span className="text-[8px] font-mono font-bold text-text-secondary/40 uppercase tracking-[0.2em] block italic">
                          SPEC: {item.variant.title} // REF: {item.variantGid.split('/').pop()?.slice(-4)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                         {/* Recessed Control Area */}
                         <div className="flex items-center border h-8 w-24 overflow-hidden shadow-inner bg-bg-surface border-border-color">
                            <button 
                              onClick={() => onUpdateQuantity(item.variantGid, item.quantity - 1)}
                              className="flex-1 h-full flex items-center justify-center text-text-primary/40 hover:text-neonRed transition-all font-black text-sm leading-none border-r border-border-color"
                            >
                              -
                            </button>
                            <span className="w-8 flex items-center justify-center text-[10px] font-mono font-black text-neonRed h-full leading-none bg-bg-tertiary">
                                {item.quantity}
                            </span>
                            <button 
                              onClick={() => onUpdateQuantity(item.variantGid, item.quantity + 1)}
                              className="flex-1 h-full flex items-center justify-center text-text-primary/40 hover:text-neonRed transition-all font-black text-sm leading-none border-l border-border-color"
                            >
                              +
                            </button>
                         </div>
                         <span className="text-sm font-black text-text-primary tracking-tight group-hover:text-neonRed transition-colors italic">
                           ${(item.variant.price.amount * item.quantity).toFixed(2)}
                         </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 border rounded-full flex items-center justify-center mb-8 text-text-primary/10 shadow-sm animate-pulse border-border-color">
                  <Icons.Cart />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-text-primary italic leading-none">Queue Empty</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-primary/20 mt-4 leading-loose italic">NO TECHNICAL ASSETS STAGED <br /> FOR DEPLOYMENT.</p>
                <button 
                  onClick={onClose}
                  className="mt-12 px-10 py-5 border border-neonRed/40 text-neonRed font-black uppercase tracking-[0.4em] text-[10px] hover:bg-neonRed hover:text-white transition-all shadow-neon italic"
                >
                  Return_To_Base
                </button>
              </div>
            )}
          </div>

          {/* Footer Checkout Section - Uses themed recessed surfaces */}
          {cartItems.length > 0 && (
            <div className="p-8 md:p-10 border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] bg-bg-tertiary border-border-color">
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-text-secondary/40 italic">
                  <span>Staging_Subtotal</span>
                  <span className="text-text-primary/60">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-text-secondary/40 italic">
                  <span>Shipping_Protocol</span>
                  <span className="text-text-primary/20">CALCULATED_AT_DISPATCH</span>
                </div>
                <div className="pt-6 border-t flex justify-between items-center border-border-color">
                  <span className="text-xs font-black uppercase tracking-widest text-text-primary italic">Total Payload</span>
                  <span className="text-2xl font-black text-neonRed tracking-tighter neon-text-shadow">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                  {checkoutUrl ? (
                    <a 
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-neonRed text-white py-6 font-black uppercase tracking-[0.4em] text-xs shadow-neon hover:shadow-neon-strong transition-all duration-300 relative group overflow-hidden active:scale-95 italic text-center block"
                    >
                      <span className="relative z-10">Authorize Deployment</span>
                      <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1200ms]" />
                    </a>
                  ) : (
                    <button 
                      disabled
                      className="w-full bg-text-secondary/20 text-text-secondary/40 py-6 font-black uppercase tracking-[0.4em] text-xs italic text-center cursor-not-allowed"
                    >
                      <span className="relative z-10">Processing...</span>
                    </button>
                  )}
                  <button onClick={() => navigate(ROUTES.CART)} className="w-full bg-bg-surface text-text-secondary py-4 font-black uppercase tracking-[0.3em] text-[10px] border border-border-color hover:border-text-primary/20 hover:text-text-primary transition-colors italic">
                    Edit Payload
                  </button>
              </div>
              
              <p className="text-[8px] text-center mt-8 text-text-primary/10 uppercase tracking-[0.3em] font-mono italic">
                SECURE_PAYMENT_NODE_ACTIVE // PROTOCOL_V.25
              </p>
            </div>
          )}
        </div>
        
        {/* Bottom Laser Highlight Detail */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
          <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
        </div>
      </aside>
    </>
  );
};