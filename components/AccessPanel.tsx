import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

interface AccessPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthMode = 'ACCESS' | 'JOIN';

const AccessPanel: React.FC<AccessPanelProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('ACCESS');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    onSuccess();
  };

  const tabs: AuthMode[] = ['ACCESS', 'JOIN'];

  return (
    <>
      {/* Backdrop - Increased Z and refined light-mode opacity to prevent darkening reported by user */}
      <div 
        className={`fixed inset-0 z-[4999] bg-white/40 dark:bg-black/90 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Access Panel - Elevated Z-index to 5000 to bypass all other layouts */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] z-[5000] border-l transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isOpen 
            ? 'translate-x-0 visible shadow-[-40px_0_100px_rgba(0,0,0,0.05)] dark:shadow-[-50px_0_100px_rgba(0,0,0,1)]' 
            : 'translate-x-full invisible shadow-none'
        } bg-bg-secondary border-border-color`}
      >
        <div className="flex flex-col h-full relative z-10">
          {/* Header - Glass overlay using semantic depth */}
          <div className="p-8 md:p-10 flex items-center justify-between border-b bg-bg-primary/40 border-border-color backdrop-blur-sm">
            <div className="flex items-center gap-4">
               <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
               <div>
                  <span className="text-neonRed text-[9px] font-black uppercase tracking-[0.4em] mb-1 block neon-text-shadow italic">
                    Security_Protocol
                  </span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-text-primary leading-none italic">
                    Verification.
                  </h2>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="text-text-primary/20 hover:text-neonRed transition-all p-2 group"
              aria-label="Abort Access"
            >
              <div className="scale-110 group-hover:rotate-90 transition-transform duration-500">
                <Icons.Close />
              </div>
            </button>
          </div>

          <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar">
            {/* Tab Switcher - Industrial recessed depth */}
            <div className="relative mb-12 flex h-12 overflow-hidden shadow-inner border bg-bg-tertiary border-border-color p-1">
              <div 
                className="absolute top-1 bottom-1 bg-neonRed shadow-neon transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0"
                style={{
                  left: `calc(${(tabs.indexOf(mode) / tabs.length) * 100}% + 4px)`,
                  width: `calc(${100 / tabs.length}% - 8px)`
                }}
              />
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setMode(t)}
                  className={`relative z-10 flex-1 h-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${
                    mode === t ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuthorize} className="space-y-10">
              {mode === 'JOIN' && (
                <div className="group relative">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors mb-3 block italic">
                    Operative_Designation
                  </label>
                  <input 
                    type="text"
                    required
                    className="w-full px-5 py-4 text-xs font-black text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest shadow-inner border bg-bg-surface border-border-color group-focus-within:border-neonRed/30"
                    placeholder="ENTER FULL NAME"
                  />
                </div>
              )}

              <div className="group relative">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors mb-3 block italic">
                  Signal_Identifier (Email)
                </label>
                <input 
                  type="email"
                  required
                  className="w-full px-5 py-4 text-xs font-black text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest shadow-inner border bg-bg-surface border-border-color group-focus-within:border-neonRed/30"
                  placeholder="USER@NETWORK.WW"
                />
              </div>

              <div className="group relative">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors block italic">
                    Access_Key
                  </label>
                  {mode === 'ACCESS' && (
                    <button type="button" className="text-[9px] font-black uppercase tracking-widest text-neonRed hover:text-text-primary transition-colors italic">
                      RECOVER?
                    </button>
                  )}
                </div>
                <input 
                  type="password"
                  required
                  className="w-full px-5 py-4 text-xs font-black text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest shadow-inner border bg-bg-surface border-border-color group-focus-within:border-neonRed/30"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div 
                  className="flex items-center gap-4 cursor-pointer group/remember"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <div className={`w-6 h-6 border transition-all duration-300 flex items-center justify-center ${
                    rememberMe 
                      ? 'border-neonRed bg-neonRed shadow-neon' 
                      : 'shadow-inner border bg-bg-tertiary border-border-color group-hover/remember:border-neonRed/30'
                  }`}>
                    {rememberMe && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                    rememberMe ? 'text-neonRed' : 'text-text-secondary group-hover/remember:text-text-primary'
                  }`}>
                    Remember_Terminal
                  </span>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  type="submit"
                  className="w-full bg-neonRed text-white py-6 font-black uppercase tracking-[0.4em] text-xs shadow-neon hover:shadow-neon-strong transition-all duration-300 relative overflow-hidden group/btn active:scale-95 italic"
                >
                  <span className="relative z-10">Authorize_Session</span>
                  <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover/btn:left-[150%] transition-all duration-1000" />
                </button>
              </div>
            </form>

            <div className="mt-20 p-8 border shadow-inner italic bg-bg-tertiary border-border-color relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-neonRed/20 group-hover:bg-neonRed transition-all"></div>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest leading-loose font-black relative z-10">
                AUTHORIZED ACCESS ONLY. BY CONTINUING YOU ACKNOWLEDGE OUR <span className="text-text-primary/60">SECURITY_PROTOCOLS</span> AND <span className="text-text-primary/60">USER_AGREEMENT</span>.
              </p>
            </div>
          </div>
          
          <div className="p-8 md:p-10 flex justify-between items-center text-[8px] font-mono text-text-secondary/20 uppercase tracking-[0.4em] border-t mt-auto bg-bg-primary/10 border-border-color">
             <span>ENCRYPTION_AES_256</span>
             <span>BUILD_REF: WW_25_4</span>
          </div>
        </div>
        
        {/* Bottom Laser Scan Detail */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
          <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
        </div>
      </aside>
    </>
  );
};

export default AccessPanel;