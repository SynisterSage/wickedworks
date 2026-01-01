
import React, { useState } from 'react';
import { ViewMode } from '../types';
import ThemeSwitcher from './ThemeSwitcher';

interface FooterProps {
  onNavigate?: (view: ViewMode, handle?: string, section?: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  };

  return (
    <footer className="bg-[#040404] pt-24 pb-12 relative z-10 overflow-hidden">
      {/* Structural Top Border - Dimmed to prevent visual lift */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"></div>
      
      {/* Subtle Atmospheric Glow - Ultra-low opacity to maintain deep charcoal base */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neonRed/5 blur-[160px] rounded-full pointer-events-none opacity-10"></div>
      
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 lg:gap-x-12 xl:gap-x-20 mb-24">
          
          {/* Brand & Manifesto */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <button 
              onClick={() => onNavigate?.('HOME')} 
              className="group mb-10 focus:outline-none transition-transform hover:-translate-y-1"
            >
              <h2 className="text-3xl font-black tracking-tighter uppercase text-white italic leading-none">
                Wicked<span className="text-neonRed not-italic transition-colors group-hover:text-white">Works</span>
              </h2>
            </button>
            <p className="text-white/20 max-w-sm mb-12 text-[10px] leading-loose uppercase tracking-[0.25em] font-black italic">
              Technical deployment for urban operatives. <br/>
              Engineered for the sprawl, built for the archive.
            </p>
            
            {/* Social Matrix */}
            <div className="flex gap-2">
              {['TW', 'IG', 'YT', 'TK'].map((s) => (
                <a 
                  key={s} 
                  href="#" 
                  className="w-10 h-10 border border-white/[0.03] bg-white/[0.01] flex items-center justify-center text-[9px] font-black text-white/10 hover:text-neonRed hover:border-neonRed/20 hover:bg-neonRed/[0.01] transition-all duration-500"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1 h-3 bg-neonRed/60"></div>
              <h4 className="text-white text-[9px] font-black uppercase tracking-[0.4em]">Directory</h4>
            </div>
            <ul className="space-y-5">
              {[
                { label: 'Shop All', view: 'SHOP_ALL' },
                { label: 'Collections', view: 'COLLECTIONS' },
                { label: 'Archives', view: 'ARCHIVES' }
              ].map((link) => (
                <li key={link.label}>
                  <button 
                    onClick={() => onNavigate?.(link.view as ViewMode)}
                    className="text-white/15 hover:text-white text-[10px] transition-all uppercase tracking-[0.3em] font-black text-left relative group/link"
                  >
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-neonRed transition-all duration-500 group-hover/link:w-full"></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1 h-3 bg-white/10"></div>
              <h4 className="text-white text-[9px] font-black uppercase tracking-[0.4em]">Protocol</h4>
            </div>
            <ul className="space-y-5">
              {[
                { label: 'About Us', view: 'ABOUT' },
                { label: 'Returns', view: 'RETURNS' },
                { label: 'Sizing', view: 'SIZING' },
                { label: 'Contact', view: 'CONTACT' }
              ].map((link) => (
                <li key={link.label}>
                  <button 
                    onClick={() => onNavigate?.(link.view as ViewMode)}
                    className="text-white/15 hover:text-white text-[10px] transition-all uppercase tracking-[0.3em] font-black text-left relative group/link"
                  >
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-neonRed transition-all duration-500 group-hover/link:w-full"></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Access */}
          <div id="network-access" className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1 h-3 bg-neonRed"></div>
              <h4 className="text-white text-[9px] font-black uppercase tracking-[0.4em]">Network</h4>
            </div>
            <p className="text-white/15 text-[9px] mb-8 uppercase tracking-[0.2em] font-black">
              {isSubscribed ? 'UPLINK_ESTABLISHED // SECURE' : 'STAGED FOR EXCLUSIVE DEPLOYMENT UPDATES.'}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative group/field">
                <input 
                  type="email" 
                  disabled={isSubscribed}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isSubscribed ? 'ENCRYPTED_ID' : 'USER@NETWORK.WW'} 
                  className={`w-full bg-white/[0.01] border border-white/[0.04] px-6 py-5 text-white text-[10px] tracking-[0.3em] focus:outline-none focus:border-neonRed/20 focus:bg-white/[0.02] transition-all uppercase font-black ${isSubscribed ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}`}
                />
                {!isSubscribed && <div className="absolute left-0 bottom-0 w-0 h-px bg-neonRed group-focus-within/field:w-full transition-all duration-700"></div>}
              </div>
              <button 
                type="submit" 
                disabled={isSubscribed}
                className={`w-full py-5 text-[10px] font-black uppercase tracking-[0.5em] transition-all relative overflow-hidden group/btn active:scale-[0.98] ${
                  isSubscribed 
                    ? 'bg-transparent border border-neonRed/40 text-neonRed shadow-neon' 
                    : 'bg-neonRed text-white hover:bg-neonRed/90 hover:shadow-neon-strong'
                }`}
              >
                <span className="relative z-10">{isSubscribed ? 'NETWORK_CONNECTED' : 'Join Archive'}</span>
                {!isSubscribed && (
                  <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover/btn:left-[150%] transition-all duration-[1200ms]"></div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Technical Footer Metadata */}
        <div className="pt-12 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <p className="text-[9px] text-white/10 uppercase tracking-[0.4em] font-mono">
              © 2025 WICKED_WORKS_LTD // SECURED_NODE
            </p>
            <div className="flex items-center gap-6 text-[8px] font-mono text-white/5 uppercase tracking-[0.3em] hidden lg:flex">
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-neonRed/40 animate-pulse"></span> 
                STABLE_UPLINK
              </span>
              <span>REF_ID: 25.04.X</span>
            </div>
          </div>
          
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
