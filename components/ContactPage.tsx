import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { ROUTES } from '../utils/routeHelpers';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const InputField = ({ label, placeholder, type = "text", required = false }: any) => (
    <div className="space-y-3 group">
      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
        {label} {required && <span className="text-neonRed">*</span>}
      </label>
      <input 
        type={type}
        required={required}
        placeholder={placeholder}
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
            onClick={() => navigate(ROUTES.HOME)}
            className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors"
          >
            ROOT
          </button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black">CONTACT_PROTOCOL</span>
          <div className="ml-auto flex items-center gap-6 pl-6">
             <span className="text-[9px] font-mono text-text-secondary/20 uppercase tracking-[0.4em] hidden md:block italic">Gateway: UPLINK_SUPPORT</span>
             <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest">SIGNAL: ACTIVE</span>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
            <span className="text-neonRed text-[11px] font-black uppercase tracking-[0.5em] italic">Get_In_Touch</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-text-primary mb-8 leading-[0.85] italic">
            Get In <span className="text-neonRed">Touch.</span>
          </h2>
          <p className="text-text-secondary font-bold text-sm md:text-lg uppercase tracking-[0.1em] max-w-xl leading-relaxed italic">
            OUR SUPPORT TEAM IS AVAILABLE FOR ALL TECHNICAL INQUIRIES, ORDER ASSISTANCE, AND GENERAL FEEDBACK.
          </p>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Main Contact Form Card */}
          <div className="lg:col-span-7 h-full">
            <div className="relative group overflow-hidden bg-bg-secondary border border-border-color p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-neonRed/30 h-full flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
                <h4 className="text-sm font-black text-text-primary uppercase tracking-widest italic">
                  Transmit <span className="text-neonRed">Signal</span>
                </h4>
              </div>
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <InputField label="Full Name" placeholder="JOHN DOE" required />
                  <InputField label="Contact Signal" placeholder="EMAIL@NETWORK.WW" required type="email" />
                </div>
                
                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
                    Inquiry Classification
                  </label>
                  <select 
                    className="w-full bg-bg-contrast-02 border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-black text-text-primary focus:outline-none transition-all uppercase tracking-widest appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-bg-secondary text-text-primary">SELECT_PROTOCOL...</option>
                    <option value="order" className="bg-bg-secondary text-text-primary">ORDER_DEPLOYMENT</option>
                    <option value="sizing" className="bg-bg-secondary text-text-primary">FIT_CALIBRATION</option>
                    <option value="returns" className="bg-bg-secondary text-text-primary">ARCHIVE_REVERSAL</option>
                    <option value="partnership" className="bg-bg-secondary text-text-primary">WHOLESALE_PARTNERSHIP</option>
                  </select>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
                    Signal Content
                  </label>
                  <textarea 
                    rows={5}
                    required
                    placeholder="HOW_CAN_WE_AID_YOUR_DEPLOYMENT?"
                    className="w-full bg-bg-contrast-02 border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-bold text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest resize-none"
                  ></textarea>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-neonRed text-white py-6 font-black uppercase tracking-[0.4em] text-xs shadow-neon hover:shadow-neon-strong transition-all active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {loading ? 'TRANSMITTING...' : 'SEND_MESSAGE'}
                    {!loading && <Icons.ArrowRight />}
                  </span>
                  <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover/btn:left-[150%] transition-all duration-1000"></div>
                </button>
              </form>
              
              {/* Bottom Visual Scan Detail */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
                <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <aside className="lg:col-span-5 flex flex-col gap-8 h-full">
            {/* Channels Card */}
            <div className="p-10 bg-bg-secondary border border-border-color relative group hover:border-neonRed/20 transition-all shadow-xl flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-4 w-1 bg-neonRed shadow-neon"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed italic">Direct Channels</h3>
              </div>
              
              <div className="space-y-12 flex-1">
                <div className="group/item">
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-2 italic">Email Support</span>
                  <p className="text-sm font-black text-text-primary uppercase tracking-widest group-hover/item:text-neonRed transition-colors">SUPPORT@WICKED.WORKS</p>
                </div>
                <div className="group/item">
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-2 italic">Press & Media</span>
                  <p className="text-sm font-black text-text-primary uppercase tracking-widest group-hover/item:text-neonRed transition-colors">MEDIA@WICKED.WORKS</p>
                </div>

                <div className="pt-8 border-t border-border-color">
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mb-6 italic">Response Times</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-bg-contrast-02 border border-border-color p-5">
                      <span className="block text-[8px] font-black text-text-secondary/50 uppercase tracking-widest mb-2">Standard</span>
                      <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">24 HOURS</span>
                    </div>
                    <div className="bg-bg-contrast-02 border border-border-color p-5">
                      <span className="block text-[8px] font-black text-text-secondary/50 uppercase tracking-widest mb-2">Availability</span>
                      <span className="text-[10px] font-black text-neonRed uppercase tracking-widest">MON - FRI</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-border-color"></div>
            </div>

            {/* Secure Inquiries Card - Mirrored Height/Style */}
            <div className="p-10 bg-bg-secondary border border-border-color relative group hover:border-neonRed/20 transition-all shadow-xl flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 flex items-center justify-center border border-border-color rounded-full mb-8 group-hover:border-neonRed transition-all shadow-sm group-hover:shadow-neon bg-bg-contrast-01">
                 <div className="text-text-secondary/10 group-hover:text-neonRed transition-all transform group-hover:scale-110">
                   <Icons.Shield />
                 </div>
              </div>
              <h4 className="text-2xl font-black text-text-primary uppercase tracking-tighter mb-4 italic leading-none">Secure Inquiries</h4>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 leading-relaxed italic max-w-xs mx-auto">
                ALL COMMUNICATIONS ARE HANDLED WITH ABSOLUTE CONFIDENTIALITY AND PRIVACY PROTOCOLS.
              </p>

              {/* Bottom Visual Scan Detail */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
                <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Success Modal */}
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
              Message <span className="text-neonRed">Received.</span>
            </h3>
            <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.4em] text-text-secondary mb-12 max-w-sm mx-auto leading-loose italic">
              THANK YOU FOR CONTACTING WICKED WORKS. OUR TEAM HAS RECEIVED YOUR SIGNAL AND WILL RESPOND WITHIN 24 HOURS.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate(ROUTES.HOME)}
                className="bg-text-primary text-bg-primary px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-neonRed hover:text-white transition-all shadow-xl"
              >
                Return Home
              </button>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-bg-contrast-05 text-text-primary border border-border-color px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-bg-contrast-10 transition-all"
              >
                Send Another
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

export default ContactPage;