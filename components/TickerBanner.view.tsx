
import React from 'react';

const TICKER_PHRASES = [
  'TECHNICAL_APPARATUS',
  'URBAN_MOBILITY_GEAR',
  'ARCHIVE_DEPLOYMENT',
  'ENGINEERED_FOR_THE_SPRAWL',
  'HIGH_FREQUENCY_USE',
  'WICKED_WORKS_LABS',
  'STEALTH_UTILITY_SYSTEMS'
];

export const TickerBanner: React.FC = () => {
  // Duplicate phrases multiple times to ensure the loop is seamless across ultra-wide displays
  const scrollItems = [...TICKER_PHRASES, ...TICKER_PHRASES, ...TICKER_PHRASES];

  return (
    <div className="w-full bg-bg-tertiary border-y border-border-color overflow-hidden py-5 flex items-center relative z-20 select-none">
      {/* Subtle atmospheric gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-neonRed/[0.02] via-transparent to-neonRed/[0.02] pointer-events-none"></div>
      
      <div className="flex whitespace-nowrap animate-scroll will-change-transform">
        {scrollItems.map((phrase, idx) => (
          <div key={idx} className="flex items-center flex-shrink-0">
            {/* The Separator: W.W Icon Block */}
            <div className="flex items-center gap-3 px-8 md:px-12 lg:px-16">
              <div className="w-1.5 h-1.5 bg-neonRed shadow-neon rotate-45"></div>
              <span className="text-neonRed text-[8px] md:text-[9px] font-black italic tracking-tighter leading-none">
                W.W
              </span>
              <div className="w-1.5 h-1.5 bg-neonRed shadow-neon rotate-45"></div>
            </div>
            
            {/* The Content: Ticker Phrase */}
            <span className="text-[9px] md:text-[10px] font-black text-text-primary/20 uppercase tracking-[0.5em] italic leading-none px-8 md:px-12 lg:px-16 border-l border-border-color">
              {phrase}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};