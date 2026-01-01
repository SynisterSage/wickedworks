import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icons } from '../constants';

const ReturnsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledOrderId = (location.state as any)?.orderId;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(prefilledOrderId || '');

  useEffect(() => {
    if (prefilledOrderId) {
      setOrderId(prefilledOrderId);
    }
  }, [prefilledOrderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const InputField = ({ label, placeholder, type = "text", required = false, value, onChange }: any) => (
    <div className="space-y-3 group">
      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
        {label} {required && <span className="text-neonRed">*</span>}
      </label>
      <input 
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-bg-contrast-02 border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-bold text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest"
      />
    </div>
  );

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
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black">RETURN_PROTOCOL</span>
          <div className="ml-auto flex items-center gap-6 pl-6">
             <span className="text-[9px] font-mono text-text-secondary/20 uppercase tracking-[0.4em] hidden md:block italic">Gateway: SECURE_REVERSAL</span>
             <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest">GATEWAY: ACTIVE</span>
          </div>
        </nav>

        {/* Hero */}
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
            <span className="text-neonRed text-[11px] font-black uppercase tracking-[0.5em] italic">Archive_Reversal</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-text-primary mb-8 leading-[0.85] italic">
            Archive <span className="text-neonRed">Reversal.</span>
          </h2>
          <p className="text-text-secondary font-bold text-sm md:text-lg uppercase tracking-[0.1em] max-w-xl leading-relaxed italic">
            DE-MANIFEST YOUR ASSETS. IF THE EQUIPMENT DOES NOT MEET YOUR OPERATIONAL REQUIREMENTS, WE FACILITATE A SECURE RETURN.
          </p>
        </header>

        {/* Layout Grid - items-stretch ensures columns match heights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Main Form Card */}
          <div className="lg:col-span-7 h-full">
            <div className="relative group overflow-hidden bg-bg-secondary border border-border-color p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-neonRed/30 h-full flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <InputField 
                    label="Order Identifier" 
                    placeholder="WW-ORD-XXXX" 
                    required 
                    value={orderId}
                    onChange={(e: any) => setOrderId(e.target.value)}
                  />
                  <InputField label="Contact Signal" placeholder="EMAIL@NETWORK.WW" type="email" required />
                </div>
                
                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
                    Return Reason Protocol
                  </label>
                  <select 
                    className="w-full bg-bg-contrast-02 border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-black text-text-primary focus:outline-none transition-all uppercase tracking-widest appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-bg-secondary text-text-primary">SELECT_REASON...</option>
                    <option value="fit" className="bg-bg-secondary text-text-primary">FITMENT_INACCURACY</option>
                    <option value="damage" className="bg-bg-secondary text-text-primary">STRUCTURAL_INTERFERENCE</option>
                    <option value="change" className="bg-bg-secondary text-text-primary">STRATEGIC_PIVOT</option>
                    <option value="other" className="bg-bg-secondary text-text-primary">OTHER_ANOMALY</option>
                  </select>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
                    Detailed Intel
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="DESCRIBE_THE_ISSUE..."
                    className="w-full bg-bg-contrast-02 border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-bold text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest resize-none"
                  ></textarea>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-neonRed text-white py-6 font-black uppercase tracking-[0.4em] text-xs shadow-neon hover:shadow-neon-strong transition-all active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {loading ? 'TRANSMITTING...' : 'INITIATE_REVERSAL'}
                    {!loading && <Icons.ArrowRight />}
                  </span>
                  <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover/btn:left-[150%] transition-all duration-1000"></div>
                </button>
              </form>
              
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
                <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <aside className="lg:col-span-5 flex flex-col gap-8 h-full">
            {/* Protocol Card */}
            <div className="p-10 bg-bg-secondary border border-border-color relative group hover:border-neonRed/20 transition-all shadow-xl flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-4 w-1 bg-neonRed shadow-neon"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed italic">Manifesto Protocols</h3>
              </div>
              
              <div className="space-y-10 flex-1">
                <div className="group/item">
                  <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">30_DAY_DEPLOYMENT</span>
                  <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Items must be returned within 30 days of initial deployment signature.</p>
                </div>
                <div className="group/item">
                  <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">UNALTERED_STATE</span>
                  <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Assets must remain in original, unwashed state with all technical tags intact.</p>
                </div>
                <div className="group/item">
                  <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">RETURN_CREDIT</span>
                  <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Upon verification, credit will be re-routed to your primary source.</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-border-color"></div>
            </div>

            {/* Field Help Card - Refined as a mirrored Glass Card */}
            <div className="p-10 bg-bg-secondary border border-border-color relative group hover:border-neonRed/20 transition-all shadow-xl flex flex-col items-center justify-center text-center">
              <div 
                className="w-16 h-16 flex items-center justify-center border border-border-color rounded-full mb-8 group-hover:border-neonRed transition-all cursor-pointer shadow-sm group-hover:shadow-neon bg-bg-contrast-01" 
                onClick={() => navigate('/account/support')}
              >
                 <div className="text-text-secondary/50 group-hover:text-neonRed transition-all transform group-hover:scale-110">
                   <Icons.Adjustments />
                 </div>
              </div>
              <h4 className="text-2xl font-black text-text-primary uppercase tracking-tighter mb-4 italic leading-none">Need Field Help?</h4>
              
              <button 
                onClick={() => navigate('/account/support')}
                className="group/help text-[10px] font-black text-neonRed uppercase tracking-[0.4em] hover:text-text-primary transition-all relative py-2"
              >
                Contact Archive Support
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neonRed/20 group-hover/help:bg-neonRed transition-all"></span>
              </button>

              {/* Bottom Visual Scan Detail */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
                <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Success Overlay */}
      {submitted && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-tertiary/98 backdrop-blur-3xl animate-in fade-in duration-700"></div>
          <div className="relative bg-bg-secondary p-12 md:p-20 border border-border-color border-l-neonRed border-l-4 max-w-2xl w-full text-center animate-in slide-in-from-bottom-6 duration-700 shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="w-24 h-24 bg-neonRed text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-neon-strong animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
               </svg>
            </div>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-text-primary mb-6 italic">
              Protocol <span className="text-neonRed">Accepted.</span>
            </h3>
            <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.4em] text-text-secondary mb-12 max-w-sm mx-auto leading-loose italic text-center">
              YOUR RETURN SIGNAL HAS BEEN ENCRYPTED AND LOGGED. PLEASE MONITOR YOUR SECONDARY CONTACT SIGNAL FOR SHIPPING LOGISTICS.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/')}
                className="bg-text-primary text-bg-primary px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-neonRed hover:text-white transition-all shadow-xl"
              >
                Return to Base
              </button>
              <button 
                onClick={() => navigate('/account')}
                className="bg-bg-contrast-05 text-text-primary border border-border-color px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-bg-contrast-10 transition-all"
              >
                View Order Log
              </button>
            </div>
            <div className="absolute bottom-10 left-0 w-full h-[1px] bg-neonRed animate-[scan_3s_linear_infinite] opacity-50"></div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ReturnsPage;