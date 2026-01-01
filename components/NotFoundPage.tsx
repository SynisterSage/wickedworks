
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-12">
        <h1 className="text-[12rem] md:text-[20rem] font-black text-charcoal/5 dark:text-white/[0.03] leading-none select-none tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-12 md:pt-20">
          <span className="text-neonRed font-black text-sm uppercase tracking-[0.5em] mb-4">Signal Lost</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-charcoal dark:text-white">
            Access <span className="text-neonRed">Denied</span>
          </h2>
        </div>
      </div>
      
      <p className="text-charcoal/40 dark:text-white/30 font-bold uppercase tracking-widest text-xs md:text-sm max-w-md mb-12 leading-loose">
        The requested technical asset or directory does not exist within the current archive parameters.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <button 
          onClick={() => navigate('/')}
          className="bg-neonRed text-white px-10 py-5 font-black uppercase tracking-[0.3em] text-[10px] shadow-neon hover:shadow-neon-strong transition-all flex items-center gap-3 active:scale-95"
        >
          <Icons.ArrowLeft /> Return to Base
        </button>
        <button 
          onClick={() => navigate('/shop')}
          className="glass text-charcoal dark:text-white px-10 py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          Explore Archives
        </button>
      </div>
    </div>
  );
}
