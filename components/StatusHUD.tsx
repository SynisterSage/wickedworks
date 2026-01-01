
import React, { useState, useEffect } from 'react';

const StatusHUD: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
      if (Math.random() > 0.8) setLatency(Math.floor(Math.random() * 15) + 15);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[40] hidden md:flex flex-col items-end pointer-events-none select-none">
      <div className="glass px-4 py-3 border-neonRed/20 flex gap-6 items-center">
        <div className="flex flex-col items-end border-r border-black/5 dark:border-white/5 pr-6">
          <span className="text-[8px] uppercase tracking-widest text-charcoal/40 dark:text-white/30 font-bold mb-1">Local Time</span>
          <span className="text-[10px] font-mono text-charcoal dark:text-white font-bold">{time}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] uppercase tracking-widest text-charcoal/40 dark:text-white/30 font-bold mb-1">Latency</span>
          <span className="text-[10px] font-mono text-charcoal dark:text-white font-bold">{latency}ms</span>
        </div>
      </div>
    </div>
  );
};

export default StatusHUD;
