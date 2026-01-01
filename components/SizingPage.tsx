import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { ROUTES } from '../utils/routeHelpers';

type SizingCategory = 'APPAREL' | 'OUTERWEAR' | 'FOOTWEAR';

const SizingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SizingCategory>('APPAREL');

  const sizingData = {
    APPAREL: {
      headers: ['Size', 'Chest (in)', 'Waist (in)', 'Sleeve (in)'],
      rows: [
        ['S', '36-38', '28-30', '32.5'],
        ['M', '39-41', '31-33', '33.5'],
        ['L', '42-44', '34-36', '34.5'],
        ['XL', '45-47', '37-39', '35.5'],
      ]
    },
    OUTERWEAR: {
      headers: ['Size', 'Chest (in)', 'Shoulder (in)', 'Length (in)'],
      rows: [
        ['S', '40', '17.5', '27'],
        ['M', '42', '18.5', '28'],
        ['L', '44', '19.5', '29'],
        ['XL', '47', '20.5', '30'],
      ]
    },
    FOOTWEAR: {
      headers: ['US', 'EU', 'UK', 'CM'],
      rows: [
        ['8', '41', '7.5', '26'],
        ['9', '42', '8.5', '27'],
        ['10', '43', '9.5', '28'],
        ['11', '44', '10.5', '29'],
      ]
    }
  };

  const tabs: SizingCategory[] = ['APPAREL', 'OUTERWEAR', 'FOOTWEAR'];

  return (
    <div className="pt-12 md:pt-32 pb-24 px-4 sm:px-6 min-h-screen relative overflow-hidden bg-bg-primary">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap pb-4 no-scrollbar border-b border-border-color">
          <button 
            onClick={() => navigate(ROUTES.HOME)}
            className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors"
          >
            ROOT
          </button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black">SIZING_PROTOCOL</span>
          <div className="ml-auto flex items-center gap-6 pl-6">
             <span className="text-[9px] font-mono text-text-secondary/20 uppercase tracking-[0.4em] hidden md:block italic">Partition: FIT_CALIBRATION</span>
             <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest">STATUS: ACCURATE</span>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
            <span className="text-neonRed text-[11px] font-black uppercase tracking-[0.5em] italic">Technical_Fit_Guide</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-text-primary mb-8 leading-[0.85] italic">
            Technical <br /> <span className="text-neonRed">Fit Guide.</span>
          </h2>
          <p className="text-text-secondary font-bold text-sm md:text-lg uppercase tracking-[0.1em] max-w-xl leading-relaxed italic">
            ENSURE OPTIMAL DEPLOYMENT MOBILITY BY SELECTING THE CORRECT CONFIGURATION FOR YOUR OPERATIONAL ZONE.
          </p>
        </header>

        {/* Tab Switcher - Terminal Style */}
        <div className="relative mb-12 flex justify-start">
          <div className="relative flex bg-bg-secondary border border-border-color p-1 h-14 w-full md:w-auto md:min-w-[500px] overflow-hidden">
            {/* Sliding Indicator */}
            <div 
              className="absolute top-1 bottom-1 bg-neonRed shadow-neon transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0"
              style={{
                left: `calc(${(tabs.indexOf(activeTab) / tabs.length) * 100}% + 4px)`,
                width: `calc(${100 / tabs.length}% - 8px)`
              }}
            />
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 flex-1 h-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${
                  activeTab === tab ? 'text-white' : 'text-text-secondary hover:text-text-primary/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch mb-20">
          
          {/* Table Card */}
          <div className="lg:col-span-8 h-full">
            <div className="relative group overflow-hidden bg-bg-secondary border border-border-color p-1 shadow-2xl transition-all duration-500 hover:border-neonRed/30 h-full">
              <div className="overflow-x-auto custom-scrollbar relative z-10">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-bg-contrast-02 border-b border-border-color">
                      {sizingData[activeTab].headers.map((header) => (
                        <th key={header} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-neonRed italic">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizingData[activeTab].rows.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className="border-b border-border-color last:border-0 hover:bg-neonRed/[0.03] transition-colors group/row"
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-8 py-6 text-sm font-mono font-bold text-text-secondary group-hover/row:text-text-primary transition-colors">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Bottom Visual Scan Bar */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
                <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <aside className="lg:col-span-4 flex flex-col gap-8 h-full">
            {/* How To Measure Card */}
            <div className="p-10 bg-bg-secondary border border-border-color relative group hover:border-neonRed/20 transition-all shadow-xl flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-4 w-1 bg-neonRed shadow-neon"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed italic">How To Measure</h3>
              </div>
              
              <div className="space-y-10 flex-1">
                <div className="group/item flex gap-6">
                  <div className="w-10 h-10 flex items-center justify-center border border-border-color text-[10px] font-black text-text-secondary group-hover/item:text-neonRed group-hover/item:border-neonRed/40 transition-all shrink-0">01</div>
                  <div>
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">Chest Protocol</span>
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                  </div>
                </div>
                <div className="group/item flex gap-6">
                  <div className="w-10 h-10 flex items-center justify-center border border-border-color text-[10px] font-black text-text-secondary group-hover/item:text-neonRed group-hover/item:border-neonRed/40 transition-all shrink-0">02</div>
                  <div>
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">Waist Alignment</span>
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Measure around the narrowest part (typically where your body bends side to side).</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-border-color"></div>
            </div>

            {/* Fit Note Card */}
            <div className="p-10 bg-bg-secondary border border-border-color relative group hover:border-neonRed/20 transition-all shadow-xl flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 flex items-center justify-center border border-border-color rounded-full mb-8 group-hover:border-neonRed transition-all shadow-sm group-hover:shadow-neon bg-bg-contrast-01">
                 <div className="text-text-secondary/50 group-hover:text-neonRed transition-all">
                   <Icons.Shield />
                 </div>
              </div>
              <h4 className="text-2xl font-black text-text-primary uppercase tracking-tighter mb-4 italic leading-none">Fit_Note</h4>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-8 leading-relaxed italic">
                MOST TECHNICAL SHELLS FEATURE AN ATHLETIC CUT. FOR AN OVERSIZED TACTICAL AESTHETIC, WE RECOMMEND SIZING UP ONE INCREMENT.
              </p>

              <button 
                onClick={() => navigate(ROUTES.SHOP)}
                className="w-full bg-neonRed text-white py-5 font-black uppercase tracking-[0.4em] text-[10px] shadow-neon hover:shadow-neon-strong transition-all flex items-center justify-center gap-4 group/btn relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-4">
                  Stage_Asset
                  <Icons.ArrowRight />
                </span>
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover/btn:left-[150%] transition-all duration-1000"></div>
              </button>

              {/* Bottom Visual Scan Detail */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
                <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SizingPage;