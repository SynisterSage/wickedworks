import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchCustomerOrders, ShopifyOrder, getStoredTokens } from '../lib/auth';

// Helper to map Shopify status to display status
const getDisplayStatus = (financialStatus: string, fulfillmentStatus: string): { status: string; color: string; pulseColor: string } => {
  if (fulfillmentStatus === 'FULFILLED') {
    return { 
      status: 'DEPLOYED', 
      color: 'text-emerald-500 dark:text-emerald-400',
      pulseColor: 'bg-emerald-500 dark:bg-emerald-400'
    };
  }
  if (fulfillmentStatus === 'IN_TRANSIT' || fulfillmentStatus === 'PARTIALLY_FULFILLED') {
    return { 
      status: 'IN_TRANSIT', 
      color: 'text-neonRed',
      pulseColor: 'bg-neonRed'
    };
  }
  if (financialStatus === 'PENDING' || fulfillmentStatus === 'UNFULFILLED') {
    return { 
      status: 'STAGED', 
      color: 'text-amber-500 dark:text-amber-400',
      pulseColor: 'bg-amber-500 dark:bg-amber-400'
    };
  }
  return { 
    status: 'PROCESSING', 
    color: 'text-text-secondary',
    pulseColor: 'bg-text-secondary'
  };
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '.');
};

// OrderReceipt Component
const OrderReceipt: React.FC<{ order: ShopifyOrder }> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { status, color, pulseColor } = getDisplayStatus(order.financialStatus, order.fulfillmentStatus);

  return (
    <div className={`border border-border-color transition-all duration-500 bg-bg-secondary ${isOpen ? 'bg-bg-contrast-02' : 'hover:border-text-primary/20'}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="p-5 cursor-pointer flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">
            {formatDate(order.processedAt)}
          </span>
          <h4 className="text-xs font-black text-text-primary tracking-tighter uppercase font-mono truncate">
            {order.name}
          </h4>
        </div>
        <div className="flex items-center gap-3 sm:gap-8 flex-shrink-0">
          <div className="text-right">
            <span className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-0.5">
              STATUS
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pulseColor} ${status === 'IN_TRANSIT' ? 'animate-pulse shadow-neon' : ''}`}></span>
              {status.replace('_', ' ')}
            </span>
          </div>
          <div className={`transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-text-secondary/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] border-t border-border-color opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6">
          <div className="space-y-4 mb-8">
            {order.lineItems.nodes.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="w-12 h-16 bg-bg-tertiary border border-border-color flex-shrink-0">
                  {item.variant.image ? (
                    <img src={item.variant.image.url} alt={item.title} className="w-full h-full object-cover grayscale opacity-60" />
                  ) : (
                    <div className="w-full h-full bg-bg-contrast-05"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[10px] font-black text-text-primary uppercase tracking-wider mb-0.5 truncate">
                    {item.title}
                  </h5>
                  <span className="text-[9px] font-bold text-text-secondary uppercase">
                    QTY: {item.quantity} // ${parseFloat(item.variant.price.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-border-color flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-bold text-text-secondary uppercase">Total</span>
                <span className="text-sm font-black text-neonRed uppercase">
                  ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AccountPage() {
  const navigate = useNavigate();
  const { customer, isAuthenticated, isLoading, login, logout } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch orders when authenticated
  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoadingOrders(true);
        const tokens = getStoredTokens();
        if (!tokens?.accessToken) return;
        
        const customerOrders = await fetchCustomerOrders(tokens.accessToken);
        setOrders(customerOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonRed mx-auto mb-4"></div>
          <p className="text-text-secondary text-xs uppercase tracking-widest">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-text-primary mb-4 leading-none italic">
              Account<span className="text-neonRed">.</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">
              Sign in to access your orders and account details
            </p>
          </div>

          <div className="bg-bg-surface border border-border-color p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <button
                onClick={login}
                className="w-full bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-4 px-6 transition-all shadow-neon hover:shadow-neon-lg"
              >
                Sign in with Shopify
              </button>
              
              <p className="text-[10px] text-text-secondary/60 leading-relaxed">
                You'll be redirected to Shopify's secure login page to authenticate your account.
              </p>
            </div>

            <div className="pt-6 border-t border-border-color">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-4">
                Quick Actions
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full text-left px-4 py-3 bg-bg-secondary hover:bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all text-[10px] font-bold uppercase tracking-widest text-text-primary"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/saved')}
                  className="w-full text-left px-4 py-3 bg-bg-secondary hover:bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all text-[10px] font-bold uppercase tracking-widest text-text-primary"
                >
                  View Saved Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-text-primary mb-4 leading-none italic">
            Welcome Back<span className="text-neonRed">.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mb-2">{customer?.displayName}</p>
          <p className="text-xs sm:text-sm text-text-secondary/60">{customer?.email}</p>
          <div className="h-px bg-gradient-to-r from-neonRed/40 to-transparent w-32 sm:w-48 mt-6 sm:mt-8"></div>
        </div>

        {/* Account Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Orders Card */}
          <div className="bg-bg-surface border border-border-color p-5 sm:p-6 hover:border-neonRed/30 transition-all group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
              <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest italic">
                Orders
              </h3>
            </div>
            <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed mb-4">
              View your order history and track shipments
            </p>
            <div className="text-3xl sm:text-4xl font-black text-neonRed mb-2">{orders.length}</div>
            <p className="text-[9px] sm:text-[10px] text-text-secondary/60 uppercase tracking-wider">Total Orders</p>
          </div>

          {/* Addresses Card */}
          <div className="bg-bg-surface border border-border-color p-5 sm:p-6 hover:border-neonRed/30 transition-all group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
              <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest italic">
                Addresses
              </h3>
            </div>
            <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed mb-4">
              Manage your shipping and billing addresses
            </p>
            <div className="text-3xl sm:text-4xl font-black text-neonRed mb-2">0</div>
            <p className="text-[9px] sm:text-[10px] text-text-secondary/60 uppercase tracking-wider">Saved Addresses</p>
          </div>

          {/* Profile Card */}
          <div className="bg-bg-surface border border-border-color p-5 sm:p-6 hover:border-neonRed/30 transition-all group cursor-pointer sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
              <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest italic">
                Profile
              </h3>
            </div>
            <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed mb-4">
              Update your account information
            </p>
            <button 
              onClick={() => setShowEditProfile(true)}
              className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neonRed hover:text-text-primary transition-colors"
            >
              Edit Profile →
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-bg-surface border border-border-color max-w-md w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
                  <h3 className="text-sm sm:text-base font-black text-text-primary uppercase tracking-widest italic">
                    Edit Profile
                  </h3>
                </div>
                <button 
                  onClick={() => setShowEditProfile(false)}
                  className="text-text-secondary hover:text-neonRed transition-colors text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                    First Name
                  </label>
                  <input 
                    type="text" 
                    defaultValue={customer?.firstName}
                    className="w-full bg-bg-primary border border-border-color px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    defaultValue={customer?.lastName}
                    className="w-full bg-bg-primary border border-border-color px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                    Email
                  </label>
                  <input 
                    type="email" 
                    defaultValue={customer?.email}
                    disabled
                    className="w-full bg-bg-primary/50 border border-border-color px-4 py-3 text-xs text-text-secondary cursor-not-allowed uppercase tracking-wider"
                  />
                  <p className="text-[9px] text-text-secondary/60">Email managed by Shopify</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-bg-primary border border-border-color hover:border-neonRed/30 text-text-primary font-bold uppercase tracking-widest text-xs py-3 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement profile update API call
                    alert('Profile update functionality coming soon!');
                    setShowEditProfile(false);
                  }}
                  className="flex-1 bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-3 transition-all shadow-neon hover:shadow-neon-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-bg-surface border border-border-color p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
              <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest italic">
                Recent Orders
              </h3>
            </div>
          </div>

          {loadingOrders ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neonRed mx-auto mb-4"></div>
              <p className="text-text-secondary text-xs uppercase tracking-wider">Loading orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <OrderReceipt key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-6">
                No orders yet
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-3 px-6 sm:px-8 transition-all shadow-neon hover:shadow-neon-lg inline-block"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={logout}
            className="bg-bg-surface border border-border-color hover:border-neonRed/50 text-text-secondary hover:text-text-primary font-bold uppercase tracking-widest text-xs py-3 px-6 sm:px-8 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
