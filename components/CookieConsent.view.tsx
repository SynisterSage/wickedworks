
import React from 'react';

interface CookieConsentViewProps {
  isVisible: boolean;
  onAccept: () => void;
  onDeny: () => void;
  onReview: () => void;
}

export const CookieConsentView: React.FC<CookieConsentViewProps> = ({ 
  isVisible, onAccept, onDeny, onReview 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-12 md:right-12 z-consent animate-in slide-in-from-bottom-8 duration-1000 flex justify-center md:justify-end">
      <div className="bg-bg-surface/90 backdrop-blur-2xl p-8 md:p-10 w-full max-w-[420px] shadow-2xl relative border-l-4 border-l-neonRed border border-border-color">
        <div className="flex flex-col gap-10 relative z-10">
          <div className="space-y-5">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-text-primary flex items-center gap-3">
              <span className="w-2 h-2 bg-neonRed shadow-neon"></span> Cookie Protocol
            </h4>
            <div className="space-y-4 text-[10px] font-bold text-text-secondary leading-loose uppercase tracking-[0.2em]">
              <p>
                We use essential cookies to ensure the site functions correctly. With your permission, we'll also use analytics to improve your experience and marketing cookies to show relevant content.
              </p>
              <div className="bg-bg-secondary/50 border border-border-color p-3 rounded-sm space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-neonRed flex-shrink-0 mt-1"></span>
                  <span className="text-[9px]">Essential: Required for site functionality</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-neonRed flex-shrink-0 mt-1"></span>
                  <span className="text-[9px]">Analytics: Help us understand how you use the site</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-neonRed flex-shrink-0 mt-1"></span>
                  <span className="text-[9px]">Marketing: Show you relevant promotions and content</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onReview} 
              className="text-[10px] font-black uppercase tracking-[0.3em] text-neonRed hover:text-text-primary transition-all mt-2 inline-flex items-center gap-2 group"
            >
              DETAILED POLICY <span className="text-sm transition-transform group-hover:translate-x-2">→</span>
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <button 
              onClick={onAccept} 
              className="w-full bg-neonRed text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:shadow-neon-strong transition-all active:scale-[0.97] shadow-neon"
            >
              Accept All Cookies
            </button>
            <button 
              onClick={onDeny} 
              className="w-full text-[10px] font-black uppercase tracking-[0.4em] text-text-secondary hover:text-text-primary transition-colors py-2"
            >
              Only Essential
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
