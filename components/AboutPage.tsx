import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { ROUTES } from '../utils/routeHelpers';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="pt-12 md:pt-32 pb-24 px-4 sm:px-6 min-h-screen relative overflow-hidden bg-bg-primary">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap pb-4 no-scrollbar border-b border-border-color">
          <button 
            onClick={() => navigate('/')}
            className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors"
          >
            ROOT
          </button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black">MANIFESTO_PROTOCOL</span>
          <div className="ml-auto flex items-center gap-6 pl-6">
             <span className="text-[9px] font-mono text-text-secondary/20 uppercase tracking-[0.4em] hidden md:block italic">Partition: ALPHA_MANIFESTO</span>
             <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest">STATUS: AUTHENTICATED</span>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="mb-20 md:mb-32">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
            <span className="text-neonRed text-[11px] font-black uppercase tracking-[0.5em] italic">Identity_Vault</span>
          </div>
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-text-primary mb-8 leading-[0.85] italic">
            Industrial <br /> <span className="text-neonRed">DNA.</span>
          </h2>
          <p className="text-text-secondary font-bold text-lg md:text-3xl uppercase tracking-tight max-w-2xl leading-[1.1] italic">
            WE ARE THE ARCHITECTS OF THE URBAN FRONTIER. EQUIPMENT FOR THE DAILY GRIND.
          </p>
        </header>

        {/* Mission Partition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-40">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-10">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-secondary mb-6">The_Mission</h3>
              <p className="text-base md:text-xl font-bold text-text-secondary uppercase tracking-[0.05em] leading-relaxed italic">
                Emerging from the neon industrial sectors of Neo Tokyo, Wicked Works is a response to the homogenization of modern utility. We prioritize raw function over vanity, and performance over posturing.
              </p>
              <p className="text-base md:text-xl font-bold text-text-secondary uppercase tracking-[0.05em] leading-relaxed italic">
                Every technical fiber is stress-tested in simulated urban environments to ensure absolute deployment readiness. We build for those who operate in the margins.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
               <div className="flex-1 p-6 bg-bg-contrast-02 border border-border-color relative group">
                  <span className="block text-[8px] font-black text-neonRed uppercase tracking-widest mb-2">SCAN_LOG_01</span>
                  <span className="text-sm font-black text-text-primary uppercase tracking-tighter italic">100% Structural Integrity</span>
               </div>
               <div className="flex-1 p-6 bg-bg-contrast-02 border border-border-color relative group">
                  <span className="block text-[8px] font-black text-neonRed uppercase tracking-widest mb-2">SCAN_LOG_02</span>
                  <span className="text-sm font-black text-text-primary uppercase tracking-tighter italic">Zero Aesthetic Waste</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* Consistent Technical Glass Panel */}
            <div className="relative group overflow-hidden bg-bg-secondary border border-border-color p-8 shadow-2xl transition-all duration-500 hover:border-neonRed/30">
               <div className="relative z-10 space-y-12">
                  <div className="flex items-center justify-between gap-4 border-b border-border-color pb-6">
                    <span className="text-neonRed text-[10px] font-black uppercase tracking-[0.4em] italic">Technical_Readout</span>
                    <span className="text-text-secondary/40 font-mono text-[8px] uppercase tracking-widest whitespace-nowrap">REF_ID: WW_PROTO_25</span>
                  </div>

                  <div className="space-y-10">
                    <div className="flex items-start gap-5">
                       <div className="w-10 h-10 flex items-center justify-center border border-neonRed/40 text-neonRed font-black text-xs transition-all group-hover:bg-neonRed group-hover:text-white shrink-0 shadow-neon">01</div>
                       <div>
                         <span className="text-[11px] font-black uppercase tracking-widest text-text-primary block mb-1">Brutalist Precision</span>
                         <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest leading-tight block">Engineered for extreme structural integrity.</span>
                       </div>
                    </div>
                    <div className="flex items-start gap-5">
                       <div className="w-10 h-10 flex items-center justify-center border border-neonRed/40 text-neonRed font-black text-xs transition-all group-hover:bg-neonRed group-hover:text-white shrink-0 shadow-neon">02</div>
                       <div>
                         <span className="text-[11px] font-black uppercase tracking-widest text-text-primary block mb-1">Environmental Shielding</span>
                         <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest leading-tight block">Optimized for high-frequency field testing.</span>
                       </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border-color space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[8px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">
                          <span>MOBILITY_STATUS</span>
                          <span>94%</span>
                       </div>
                       <div className="w-full bg-bg-contrast-05 h-1 relative overflow-hidden">
                         <div className="absolute top-0 left-0 h-full w-[94%] bg-neonRed shadow-neon group-hover:w-full transition-all duration-1000"></div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-neonRed shadow-neon animate-pulse"></div>
                       <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em]">SECURE_UPLINK_STABLE</span>
                    </div>
                  </div>
               </div>
               
               {/* Bottom Scan Line Detail */}
               <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
                 <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Narrative Break */}
        <div className="relative mb-40 group">
          <div className="absolute inset-0 bg-neonRed opacity-0 group-hover:opacity-[0.02] transition-opacity duration-1000"></div>
          <div className="border-y border-border-color py-24 px-6 md:px-0 relative text-center">
             <div className="max-w-3xl mx-auto">
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-text-primary mb-8 italic">
                  Built for the <span className="text-neonRed">Sprawl.</span>
                </h3>
                <p className="text-xs md:text-sm font-bold text-text-secondary uppercase tracking-[0.2em] leading-loose">
                  Our archives represent a lineage of technical evolution. From the SS24 Origin drop to the upcoming Signal deployments, we maintain a strict code of industrial excellence. We outlast the trends in the shadows.
                </p>
             </div>
             {/* Decorative Metadata */}
             <div className="absolute top-6 left-6 text-[8px] font-mono text-text-secondary/20 uppercase tracking-widest">X: 42.109 // Y: -12.454</div>
             <div className="absolute bottom-6 right-6 text-[8px] font-mono text-text-secondary/20 uppercase tracking-widest italic">DEPLOYMENT_LOG_ARCHIVE_NODE</div>
          </div>
        </div>

        {/* Footer Call to Action */}
        <div className="relative overflow-hidden bg-bg-secondary border border-border-color p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 group transition-all hover:border-neonRed/30 shadow-2xl">
           <div className="absolute inset-0 bg-neonRed opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000"></div>
           
           <div className="text-center lg:text-left relative z-10">
              <span className="text-neonRed font-black text-[10px] uppercase tracking-[0.4em] mb-4 block italic">Operation_Shop</span>
              <h4 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-text-primary leading-none italic">
                Ready_For <br className="hidden md:block" /> Deployment?
              </h4>
           </div>

           <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto relative z-10">
             <button 
               onClick={() => navigate(ROUTES.SHOP)}
               className="relative overflow-hidden bg-neonRed text-white px-12 py-6 font-black uppercase tracking-[0.4em] text-xs shadow-neon hover:shadow-neon-strong transition-all duration-300 flex items-center justify-center gap-4 active:scale-95 group/btn"
             >
               <span className="relative z-10 flex items-center gap-4">
                 Stage_Asset
                 <Icons.ArrowRight />
               </span>
               <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover/btn:left-[150%] transition-all duration-1000"></div>
             </button>

             <button 
               onClick={() => navigate(ROUTES.HOME)}
               className="relative overflow-hidden bg-bg-contrast-05 border border-border-color text-text-primary px-12 py-6 font-black uppercase tracking-[0.4em] text-xs hover:bg-bg-contrast-10 transition-all duration-300 active:scale-95 group/ghost"
             >
               <span className="relative z-10">System_Root</span>
               <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-text-primary transition-all duration-500 group-hover/ghost:w-full"></div>
             </button>
           </div>

           {/* Bottom Visual Scan Detail */}
           <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
             <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;