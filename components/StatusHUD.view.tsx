
import React from 'react';

interface StatusHUDViewProps {
  time: string;
  latency: number;
}

export const StatusHUDView: React.FC<StatusHUDViewProps> = ({ time, latency }) => {
  return (
    <div className="fixed bottom-6 right-6 z-hud hidden md:flex flex-col items-end pointer-events-none select-none">
      <div className="bg-charcoal-surface/80 backdrop-blur-md px-4 py-3 border border-white/[0.03] flex gap-6 items-center">
        <div className="flex flex-col items-end border-r border-white/5 pr-6">
          <span className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Local Time</span>
          <span className="text-[10px] font-mono text-white font-bold">{time}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Latency</span>
          <span className="text-[10px] font-mono text-neonRed font-black neon-text-shadow">{latency}ms</span>
        </div>
      </div>
    </div>
  );
};
