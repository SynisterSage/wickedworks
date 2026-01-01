
import React, { useState } from 'react';
import { Collection, ViewMode } from '../types';
import { UPCOMING_COLLECTIONS, ARCHIVED_COLLECTIONS, Icons } from '../constants';

const UpcomingCard: React.FC<{ collection: Collection }> = ({ collection }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-[500px] overflow-hidden bg-charcoal cursor-crosshair border border-white/5"
    >
      {/* Background Image with Reveal Blur Effect */}
      <div className="absolute inset-0">
        <img 
          src={collection.image.url} 
          alt={collection.title}
          className={`h-full w-full object-cover transition-all duration-[1.5s] ${
            isHovered ? 'scale-110 blur-0 grayscale-0' : 'scale-105 blur-lg grayscale opacity-40'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      {/* Redacted Overlay */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-neonRed text-white text-[10px] font-black uppercase tracking-[0.6em] px-8 py-4 shadow-neon animate-pulse">
          REDACTED
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-[9px] font-black tracking-[0.3em] text-neonRed uppercase">
             Signal: {collection.series}
          </span>
          <div className="flex-1 h-[1px] bg-neonRed/20"></div>
        </div>

        <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
          {collection.title}
        </h3>

        <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${isHovered ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0'}`}>
          <p className="min-h-0 text-[11px] font-bold text-white/50 uppercase tracking-[0.15em] leading-relaxed">
            {collection.description}
          </p>
        </div>

        <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-2">
          <div className="space-y-1">
            <span className="block text-[8px] font-black text-white/20 uppercase tracking-widest">COORDINATES</span>
            <span className="text-[10px] font-mono text-neonRed font-black">{collection.coordinates || 'UNKNOWN'}</span>
          </div>
          <button className="bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3 hover:bg-neonRed hover:text-white transition-all shadow-neon translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-500">
            Priority Access
          </button>
        </div>
      </div>
      
      {/* Glitch Overlay Effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay">
           <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uWUPr9WUM/giphy.gif')] bg-cover opacity-20"></div>
        </div>
      )}
    </div>
  );
};

const ArchivedCard: React.FC<{ collection: Collection }> = ({ collection }) => {
  return (
    <div className="group relative aspect-[4/5] bg-charcoal border border-white/5 grayscale saturate-0 opacity-60 hover:opacity-80 transition-all duration-700">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={collection.image.url} 
          alt={collection.title}
          className="h-full w-full object-cover grayscale brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Vault Stamp */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-white/10 px-6 py-2">
        <span className="text-4xl font-black uppercase text-white/10 tracking-[0.3em]">VAULTED</span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <span className="text-[9px] font-black text-white/40 tracking-[0.4em] uppercase mb-1">
          {collection.series} // {collection.deploymentDate || 'N/A'}
        </span>
        <h3 className="text-2xl font-black uppercase tracking-tighter text-white/80 mb-6">
          {collection.title}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
          <div>
             <span className="block text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">UNITS DEPLOYED</span>
             <span className="text-[10px] font-black text-white/40">{collection.unitsDeployed || '0'}</span>
          </div>
          <div className="text-right">
             <span className="block text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">RARITY CLASS</span>
             <span className="text-[10px] font-black text-neonRed/40">{collection.rarity || 'COMMON'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArchivesPage: React.FC<{ onNavigate: (view: ViewMode) => void }> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-black/5 dark:border-white/5 pb-4">
          <button 
            onClick={() => onNavigate('HOME')}
            className="text-[9px] font-mono text-charcoal/40 dark:text-white/30 tracking-tighter uppercase hover:text-neonRed transition-colors"
          >
            ROOT
          </button>
          <span className="text-[9px] text-neonRed font-black">/</span>
          <span className="text-[9px] font-black text-charcoal dark:text-white tracking-[0.2em] uppercase">
            ARCHIVES
          </span>
          <div className="ml-auto flex items-center gap-4 pl-6">
            <span className="text-[9px] font-mono text-charcoal/20 dark:text-white/20 uppercase tracking-widest">Archives_Protocol: ACTIVE</span>
          </div>
        </nav>

        {/* Section 1: Signals (Upcoming) */}
        <div className="mb-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-charcoal dark:text-white leading-none">
              Signals <span className="text-neonRed">Upcoming</span>
            </h2>
            <div className="flex-1 h-[1px] bg-charcoal/5 dark:bg-white/5"></div>
            <span className="text-[9px] font-mono text-charcoal/20 dark:text-white/20 uppercase tracking-[0.4em] hidden md:block">
              SCANNING_FUTURE_DEPLOYS
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {UPCOMING_COLLECTIONS.map(col => (
              <UpcomingCard key={col.id} collection={col} />
            ))}
          </div>
        </div>

        {/* Section 2: The Vault (Past) */}
        <div>
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-charcoal/30 dark:text-white/20 leading-none">
              The <span className="text-charcoal/10 dark:text-white/10">Vault</span>
            </h2>
            <div className="flex-1 h-[1px] bg-charcoal/5 dark:bg-white/5"></div>
            <span className="text-[9px] font-mono text-charcoal/20 dark:text-white/20 uppercase tracking-[0.4em] hidden md:block">
              RECORDS_ENCRYPTED
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {ARCHIVED_COLLECTIONS.map(col => (
              <ArchivedCard key={col.id} collection={col} />
            ))}
          </div>
        </div>

        {/* Technical Disclaimer Footer */}
        <div className="mt-24 pt-12 border-t border-black/5 dark:border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/20 dark:text-white/10 max-w-2xl mx-auto text-center leading-relaxed">
            All archived assets are considered finalized. Legacy deployments cannot be re-staged once the vault is sealed. Upcoming signals are subject to field interference and technical re-calibration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchivesPage;
