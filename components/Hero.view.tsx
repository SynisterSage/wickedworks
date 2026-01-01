
import React from 'react';
import { Icons } from '../constants';

interface HeroViewProps {
  onExplore: () => void;
  onFullCollection: () => void;
}

export const HeroView: React.FC<HeroViewProps> = ({ onExplore, onFullCollection }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-32 md:pb-40 overflow-hidden bg-bg-primary">
      {/* Background Atmosphere - Perfectly Centered */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neonRed/10 blur-[160px] rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-neonRed/5 blur-[120px] rounded-full opacity-30"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Centered Signal Tag */}
        <div className="mb-12 md:mb-16 flex items-center justify-center gap-5 w-full">
          <div className="h-[1px] w-6 md:w-12 bg-text-primary/10"></div>
          <span className="text-neonRed text-[9px] md:text-[11px] font-black uppercase tracking-[0.6em] whitespace-nowrap neon-text-shadow italic">
            Archive Deployment // FW2025
          </span>
          <div className="h-[1px] w-6 md:w-12 bg-text-primary/10"></div>
        </div>

        {/* Optical Centering: h1 with slant-correction */}
        <div className="w-full text-center mb-16 md:mb-20 pr-[0.02em]">
          <h1 className="text-7xl sm:text-8xl md:text-[15vw] lg:text-[12rem] xl:text-[14rem] font-black uppercase tracking-tighter leading-[0.8] text-text-primary select-none italic transition-all duration-700">
            Wicked <br />
            <span className="inline-block text-neonRed not-italic drop-shadow-[0_0_40px_rgba(255,0,60,0.4)] mt-2">
              Works.
            </span>
          </h1>
        </div>
        
        {/* Description & CTAs - Perfectly Aligned Vertical Stack */}
        <div className="max-w-3xl w-full flex flex-col items-center text-center">
          <p className="text-[11px] md:text-lg text-text-primary/40 font-bold leading-loose md:leading-relaxed mb-16 uppercase tracking-[0.25em] max-w-xl italic">
            TECHNICAL APPAREL ENGINEERED FOR HIGH-FREQUENCY DEPLOYMENT. <br className="hidden md:block" /> 
            BUILT TO MOVE FROM THE ARCHIVE TO THE SPRAWL.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-lg px-4">
            {/* Primary Button */}
            <button 
              onClick={onExplore}
              className="relative flex-1 overflow-hidden bg-neonRed text-white px-10 py-6 font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] shadow-neon hover:shadow-neon-strong hover:-translate-y-1 transition-all duration-500 flex items-center justify-center active:scale-95 group/explore"
            >
              <span className="relative z-10">
                Explore Archives 
              </span>
              <div className="absolute top-0 -left-[100%] w-[150%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] transition-all duration-1000 ease-in-out group-hover/explore:left-[100%]" />
            </button>
            
            {/* Secondary Button */}
            <button 
              onClick={onFullCollection}
              className="relative flex-1 overflow-hidden bg-bg-contrast-03 backdrop-blur-xl border border-border-color text-text-primary px-10 py-6 font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] hover:bg-bg-contrast-10 hover:border-text-primary/20 hover:-translate-y-1 transition-all duration-500 active:scale-95 flex items-center justify-center group/collection"
            >
              <span className="relative z-10">Full Collection</span>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-neon" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom atmospheric bridge to next section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-bg-secondary to-transparent pointer-events-none" />
      
      {/* Scroll Indicator - Positioned strictly lower for breathing room */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-text-primary vertical-text mb-2 select-none">SCROLL_INIT</span>
        <div className="w-px h-12 bg-gradient-to-b from-neonRed to-transparent shadow-neon animate-pulse"></div>
      </div>
    </section>
  );
};