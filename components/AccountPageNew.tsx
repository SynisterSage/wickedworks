import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AccountPage() {
  const navigate = useNavigate();
  const { customer, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 leading-none italic">
              Account<span className="text-neonRed">.</span>
            </h1>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">
              Sign in to access your orders and account details
            </p>
          </div>

          <div className="bg-bg-surface border border-border-color p-8 space-y-6">
            <div className="space-y-4">
              <button
                onClick={login}
                className="w-full bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-4 px-6 transition-all shadow-neon hover:shadow-neon-lg"
              >
                Sign in with Shopify
              </button>
              
              <p className="text-[10px] text-white/40 leading-relaxed">
                You'll be redirected to Shopify's secure login page to authenticate your account.
              </p>
            </div>

            <div className="pt-6 border-t border-border-color">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-4">
                Quick Actions
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full text-left px-4 py-3 bg-bg-secondary hover:bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all text-[10px] font-bold uppercase tracking-widest text-white/80"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/saved')}
                  className="w-full text-left px-4 py-3 bg-bg-secondary hover:bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all text-[10px] font-bold uppercase tracking-widest text-white/80"
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
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 leading-none italic">
            Welcome Back<span className="text-neonRed">.</span>
          </h1>
          <p className="text-sm text-white/60 mb-2">{customer?.displayName}</p>
          <p className="text-xs text-white/40">{customer?.email}</p>
          <div className="h-px bg-gradient-to-r from-neonRed/40 to-transparent w-48 mt-8"></div>
        </div>

        {/* Account Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Orders Card */}
          <div className="bg-bg-surface border border-border-color p-6 hover:border-neonRed/30 transition-all group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                Orders
              </h3>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed mb-4">
              View your order history and track shipments
            </p>
            <div className="text-3xl font-black text-neonRed mb-2">0</div>
            <p className="text-[9px] text-white/40 uppercase tracking-wider">Total Orders</p>
          </div>

          {/* Addresses Card */}
          <div className="bg-bg-surface border border-border-color p-6 hover:border-neonRed/30 transition-all group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                Addresses
              </h3>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed mb-4">
              Manage your shipping and billing addresses
            </p>
            <div className="text-3xl font-black text-neonRed mb-2">0</div>
            <p className="text-[9px] text-white/40 uppercase tracking-wider">Saved Addresses</p>
          </div>

          {/* Profile Card */}
          <div className="bg-bg-surface border border-border-color p-6 hover:border-neonRed/30 transition-all group cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                Profile
              </h3>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed mb-4">
              Update your account information
            </p>
            <button className="text-[10px] font-bold uppercase tracking-widest text-neonRed hover:text-white transition-colors">
              Edit Profile →
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-bg-surface border border-border-color p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                Recent Orders
              </h3>
            </div>
          </div>

          <div className="text-center py-12">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-6">
              No orders yet
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-3 px-8 transition-all shadow-neon hover:shadow-neon-lg inline-block"
            >
              Start Shopping
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={logout}
            className="bg-bg-surface border border-border-color hover:border-neonRed/50 text-white/60 hover:text-white font-bold uppercase tracking-widest text-xs py-3 px-8 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
