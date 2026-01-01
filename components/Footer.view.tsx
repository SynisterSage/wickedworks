import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import { ROUTES } from '../utils/routeHelpers';

interface FooterViewProps {
  email: string;
  setEmail: (email: string) => void;
  isSubscribed: boolean;
  onSubscribe: (e: React.FormEvent) => void;
}

export const FooterView: React.FC<FooterViewProps> = ({ 
  email, setEmail, isSubscribed, onSubscribe 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <footer className="bg-bg-tertiary pt-16 pb-8 md:pt-20 md:pb-12 relative z-10 overflow-hidden border-t border-border-color">
      {/* Structural Atmospheric Glow - Ultra low opacity */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neonRed/[0.01] blur-[140px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 lg:gap-x-12 xl:gap-x-20 mb-24 md:mb-32">
          
          <div className="md:col-span-2 lg:col-span-5 flex flex-col items-start">
            <button onClick={() => navigate(ROUTES.HOME)} className="group mb-8 focus:outline-none transition-transform hover:-translate-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-text-primary italic leading-none">
                Wicked<span className="text-neonRed not-italic transition-colors group-hover:text-text-primary">Works.</span>
              </h2>
            </button>
            <p className="text-text-secondary/40 max-w-sm mb-10 text-[10px] md:text-[11px] leading-loose uppercase tracking-[0.3em] font-black italic">
              A curation of technical deployments built for the urban sprawl. <br className="hidden sm:block"/>
              Engineered for precision. Built for the archive.
            </p>
            <div className="flex gap-2">
              {['TW', 'IG', 'YT', 'TK'].map((s) => (
                <a key={s} href="#" className="w-10 h-10 md:w-12 md:h-12 border border-border-color bg-bg-contrast-01 flex items-center justify-center text-[9px] md:text-[10px] font-black text-text-secondary/20 hover:text-neonRed hover:border-neonRed/20 transition-all duration-500 italic">
                  {s}
                </a>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:flex lg:col-span-4 gap-x-8 gap-y-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-4 bg-neonRed shadow-neon"></div>
                <h4 className="text-text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic">Directory</h4>
              </div>
              <ul className="space-y-5">
                {[
                  { label: 'Shop All', path: ROUTES.SHOP }, 
                  { label: 'Collections', path: ROUTES.COLLECTIONS }, 
                  { label: 'Archives', path: ROUTES.ARCHIVES },
                  { label: 'Search', path: ROUTES.SEARCH() },
                  { label: 'The Dispatch', path: ROUTES.BLOG }
                ].map((link) => {
                  const isActive = location.pathname === link.path || 
                    (link.path === ROUTES.SHOP && location.pathname.startsWith('/shop')) ||
                    (link.path === ROUTES.COLLECTIONS && location.pathname.startsWith('/collections')) ||
                    (link.path === ROUTES.SEARCH() && location.pathname.startsWith('/search')) ||
                    (link.path === ROUTES.BLOG && location.pathname.startsWith('/blog'));
                  return (
                    <li key={link.label}>
                      <button 
                        onClick={() => navigate(link.path)} 
                        className={`text-[10px] md:text-[11px] transition-all uppercase tracking-[0.3em] font-black text-left relative group/link italic ${isActive ? 'text-neonRed neon-text-shadow' : 'text-text-secondary/40 hover:text-text-primary'}`}
                      >
                        {link.label}
                        <span className={`absolute -bottom-1 left-0 h-px bg-neonRed transition-all duration-500 shadow-neon ${isActive ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-4 bg-neonRed shadow-neon"></div>
                <h4 className="text-text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic">Protocol</h4>
              </div>
              <ul className="space-y-5">
                {[
                  { label: 'About', path: ROUTES.ABOUT }, 
                  { label: 'Returns', path: ROUTES.RETURNS }, 
                  { label: 'Sizing', path: ROUTES.SIZING }, 
                  { label: 'Contact', path: ROUTES.CONTACT },
                  { label: 'Privacy', path: ROUTES.PRIVACY }
                ].map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.label}>
                      <button 
                        onClick={() => navigate(link.path)} 
                        className={`text-[10px] md:text-[11px] transition-all uppercase tracking-[0.3em] font-black text-left relative group/link italic ${isActive ? 'text-neonRed neon-text-shadow' : 'text-text-secondary/40 hover:text-text-primary'}`}
                      >
                        {link.label}
                        <span className={`absolute -bottom-1 left-0 h-px bg-neonRed transition-all duration-500 shadow-neon ${isActive ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div id="network-access" className="md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-4 bg-neonRed"></div>
              <h4 className="text-text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic">Network</h4>
            </div>
            <p className="text-text-secondary/20 text-[9px] mb-8 uppercase tracking-[0.25em] font-black italic max-w-xs">
              {isSubscribed ? 'SIGNAL STABLE // SECURE' : 'SIGN UP FOR EXCLUSIVE RELEASE UPDATES.'}
            </p>
            <form onSubmit={onSubscribe} className="space-y-4 max-w-md lg:max-w-none">
              <div className="relative group/field">
                <input 
                  type="email" 
                  disabled={isSubscribed} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={isSubscribed ? 'ENCRYPTED_ID' : 'EMAIL@NETWORK.WW'} 
                  className={`w-full bg-bg-secondary border border-border-color px-6 py-4 md:py-5 text-text-primary text-[10px] md:text-[11px] tracking-[0.3em] focus:outline-none focus:ring-0 focus:border-neonRed/30 transition-all uppercase font-black italic placeholder:text-text-secondary/10 ${isSubscribed ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}`} 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubscribed} 
                className={`w-full py-4 md:py-5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] transition-all relative overflow-hidden group/btn active:scale-[0.98] italic ${
                  isSubscribed 
                    ? 'bg-transparent border border-neonRed/40 text-neonRed shadow-neon' 
                    : 'bg-neonRed text-white hover:bg-neonRed shadow-neon hover:shadow-neon-strong'
                }`}
              >
                <span className="relative z-10">{isSubscribed ? 'UPLINK_SECURE' : 'Join the Archive'}</span>
                {!isSubscribed && <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover/btn:left-[150%] transition-all duration-[1200ms]"></div>}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] text-text-secondary/20 uppercase tracking-[0.4em] font-mono italic">
            © 2025 WICKED_WORKS_ARCHIVE // SECURED_NODE
          </p>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
};