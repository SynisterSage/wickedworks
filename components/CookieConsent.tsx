
import React, { useState, useEffect } from 'react';
import { ViewMode } from '../types';

interface CookieConsentProps {
  onNavigate?: (view: ViewMode) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ww_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = (type: 'accept' | 'deny') => {
    localStorage.setItem('ww_cookie_consent', type);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-[180] animate-in slide-in-from-bottom-8 duration-1000">
      <div className="glass p-10 max-w-[380px] shadow-2xl relative border-l-4 border-l-neonRed">
        <div className="flex flex-col gap-10 relative z-10">
          <div className="space-y-5">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-[var(--text-primary)] flex items-center gap-3">
              <span className="w-2 h-2 bg-neonRed shadow-neon"></span>
              Protocol
            </h4>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] leading-loose uppercase tracking-[0.2em]">
              WE USE TECHNICAL COOKIES TO OPTIMIZE YOUR BROWSING EXPERIENCE AND MANAGE STAGING PAYLOADS. 
            </p>
            <button 
              onClick={() => onNavigate?.('PRIVACY')}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-neonRed hover:text-[var(--text-primary)] transition-all mt-2 inline-flex items-center gap-2 group"
            >
              REVIEW DETAILS <span className="text-sm transition-transform group-hover:translate-x-2">→</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => handleAction('accept')}
              className="w-full bg-neonRed text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-neonRed-glow transition-all active:scale-[0.97] shadow-neon"
            >
              Accept Protocol
            </button>
            <button 
              onClick={() => handleAction('deny')}
              className="w-full text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
            >
              Necessary Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
