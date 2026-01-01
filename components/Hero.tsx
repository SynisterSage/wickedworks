
import React from 'react';
import { Icons } from '../constants';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-neonRed/20 blur-[120px] rounded-full transition-opacity duration-1000"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-neonRed/10 blur-[100px] rounded-full transition-opacity duration-1000"></div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block text-neonRed text-sm font-bold uppercase tracking-[0.3em] mb-6 animate-pulse neon-text-shadow">
            Fall/Winter 2025 Collection
          </span>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none text-charcoal dark:text-white mb-8 transition-colors duration-500">
            Wicked <br />
            <span className="inline-block px-8 py-4 -my-4 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-neonRed to-charcoal dark:from-white dark:via-neonRed dark:to-white bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] overflow-visible">
              Works
            </span>
          </h1>
          
          <div className="glass p-8 md:p-12 max-w-2xl mx-auto relative group overflow-hidden">
            {/* Animated border line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neonRed to-transparent opacity-50"></div>
            
            <p className="text-lg md:text-xl text-charcoal/70 dark:text-white/70 font-black leading-relaxed mb-10 transition-colors duration-500 uppercase tracking-tight">
              Engineered for the daily grind. Technical apparel with zero fluff, built to move from the archive to the street.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="relative overflow-hidden bg-neonRed text-white px-10 py-5 font-extrabold uppercase tracking-widest text-sm shadow-neon hover:shadow-neon-strong transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 group/cta1">
                <span className="relative z-10 flex items-center gap-3">
                  Explore Archives
                  <Icons.ArrowRight />
                </span>
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover/cta1:scale-150 transition-transform duration-700 rounded-full opacity-0 group-hover/cta1:opacity-100 pointer-events-none"></div>
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] group-hover/cta1:left-[150%] transition-all duration-1000 ease-in-out"></div>
              </button>
              
              <button className="relative overflow-hidden glass text-charcoal dark:text-white border-charcoal/20 dark:border-white/20 px-10 py-5 font-extrabold uppercase tracking-widest text-sm hover:bg-charcoal dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 active:scale-95 group/cta2">
                <span className="relative z-10">Full Collection</span>
                <div className="absolute inset-0 bg-neonRed/0 group-hover/cta2:bg-neonRed/5 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neonRed scale-x-0 group-hover/cta2:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative vertical text */}
      <div className="hidden lg:block absolute -left-24 bottom-[-12rem] xl:bottom-[-16rem] rotate-180 [writing-mode:vertical-lr] text-charcoal/[0.03] dark:text-white/[0.03] text-[15rem] xl:text-[20rem] font-black uppercase tracking-widest pointer-events-none transition-colors duration-500 select-none whitespace-nowrap">
        WICKED WORKS
      </div>
    </section>
  );
}
