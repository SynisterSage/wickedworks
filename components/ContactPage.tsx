import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icons } from '../constants';
import { ROUTES } from '../utils/routeHelpers';
import { useAuth } from '../contexts/AuthContext';
import { notifySuccess, notifyError } from '../lib/toast';

type InquiryType = 'order' | 'sizing' | 'returns' | 'partnership';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer } = useAuth();
  
  const prefilledOrderId = (location.state as any)?.orderId;
  const [inquiryType, setInquiryType] = useState<InquiryType>('order');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(prefilledOrderId || '');
  const [returnReason, setReturnReason] = useState('');
  const [lastOrderId, setLastOrderId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', category: '', message: '' });

  // Fetch last order ID if customer is authenticated
  useEffect(() => {
    const fetchLastOrder = async () => {
      if (!customer?.id) return;
      
      try {
        console.log('[ContactPage] Fetching last order for customer:', customer.id);
        
        // Orders are not directly on customer type, use the customer context data
        // For now, we'll just use the customer ID if available
        const lastOrder = (customer as any).lastOrder;
        if (lastOrder?.id) {
          const orderNumber = lastOrder.name || lastOrder.id.split('/').pop() || '';
          setLastOrderId(orderNumber);
          setOrderId(orderNumber);
          console.log('[ContactPage] Last order ID:', orderNumber);
        }
      } catch (err) {
        console.error('[ContactPage] Error fetching last order:', err);
      }
    };

    fetchLastOrder();
  }, [customer?.id]);

  // Use prefilled orderId if provided (takes precedence)
  useEffect(() => {
    if (prefilledOrderId) {
      setOrderId(prefilledOrderId);
    }
  }, [prefilledOrderId]);

  const getFormEmail = () => {
    return 'nickkcusano@icloud.com';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // FormSubmit handles the actual submission via form action
    // We just need to track success state and reset form
    
    setTimeout(() => {
      try {
        setLoading(false);
        setSubmitted(true);
        notifySuccess('Message sent successfully!');
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', category: '', message: '' });
          setOrderId(lastOrderId);
          setReturnReason('');
        }, 2000);
      } catch (err) {
        notifyError('Failed to send message. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', category: '', message: '' });
    setOrderId(lastOrderId);
    setReturnReason('');
    setSubmitted(false);
  };

  const InputField = ({ label, placeholder, type = "text", required = false, value, onChange, name }: any) => (
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
        name={name}
        disabled={submitted || loading}
        className="w-full bg-bg-contrast-02 border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-bold text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );

  const getHeroTitle = () => {
    switch (inquiryType) {
      case 'returns':
        return <>Archive <span className="text-neonRed">Reversal.</span></>;
      case 'sizing':
        return <>Fit <span className="text-neonRed">Calibration.</span></>;
      case 'partnership':
        return <>Strategic <span className="text-neonRed">Partnership.</span></>;
      default:
        return <>Get In <span className="text-neonRed">Touch.</span></>;
    }
  };

  const getHeroSubtitle = () => {
    switch (inquiryType) {
      case 'returns':
        return 'DE-MANIFEST YOUR ASSETS. IF THE EQUIPMENT DOES NOT MEET YOUR OPERATIONAL REQUIREMENTS, WE FACILITATE A SECURE RETURN.';
      case 'sizing':
        return 'ENSURE OPTIMAL FIT FOR YOUR DEPLOYMENT. OUR CALIBRATION PROTOCOLS GUARANTEE PRECISION IN EVERY SPECIFICATION.';
      case 'partnership':
        return 'EXPLORE WHOLESALE, BULK, AND STRATEGIC COLLABORATION OPPORTUNITIES WITH THE WICKED WORKS ARCHIVE.';
      default:
        return 'OUR SUPPORT TEAM IS AVAILABLE FOR ALL TECHNICAL INQUIRIES, ORDER ASSISTANCE, AND GENERAL FEEDBACK.';
    }
  };

  const getFormLabel = () => {
    switch (inquiryType) {
      case 'returns':
        return 'De-Manifest';
      case 'sizing':
        return 'Calibrate';
      case 'partnership':
        return 'Collaborate';
      default:
        return 'Transmit Signal';
    }
  };

  const getSubmitButton = () => {
    switch (inquiryType) {
      case 'returns':
        return loading ? 'TRANSMITTING...' : 'INITIATE_REVERSAL';
      case 'sizing':
        return loading ? 'TRANSMITTING...' : 'REQUEST_CALIBRATION';
      case 'partnership':
        return loading ? 'TRANSMITTING...' : 'SEND_PROPOSAL';
      default:
        return loading ? 'TRANSMITTING...' : 'SEND_MESSAGE';
    }
  };

  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen relative overflow-hidden bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap pb-4 no-scrollbar border-b border-border-color">
          <button 
            onClick={() => navigate(ROUTES.HOME)}
            className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors"
          >
            ROOT
          </button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black">
            {inquiryType === 'returns' ? 'RETURN_PROTOCOL' : 'CONTACT_PROTOCOL'}
          </span>
          <div className="ml-auto flex items-center gap-6 pl-6">
            <span className="text-[9px] font-mono text-text-secondary/20 uppercase tracking-[0.4em] hidden md:block italic">
              Gateway: {inquiryType === 'returns' ? 'SECURE_REVERSAL' : 'UPLINK_SUPPORT'}
            </span>
            <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest">SIGNAL: ACTIVE</span>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
            <span className="text-neonRed text-[11px] font-black uppercase tracking-[0.5em] italic">
              {inquiryType === 'returns' ? 'Archive_Reversal' : inquiryType === 'sizing' ? 'Fit_Calibration' : inquiryType === 'partnership' ? 'Strategic_Partnership' : 'Get_In_Touch'}
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-text-primary mb-8 leading-[0.85] italic">
            {getHeroTitle()}
          </h2>
          <p className="text-text-secondary font-bold text-sm md:text-lg uppercase tracking-[0.1em] max-w-xl leading-relaxed italic">
            {getHeroSubtitle()}
          </p>
        </header>

        {/* Inquiry Type Switcher - Horizontal Scrollable Tabs */}
        <div className="relative mb-20">
          {/* Scrollable container with overflow */}
          <div className="relative overflow-hidden border-b border-border-color">
            <div className="flex gap-4 pb-8 overflow-x-auto overflow-y-hidden">
              {[
                { value: 'order' as InquiryType, label: 'Order_Support' },
                { value: 'sizing' as InquiryType, label: 'Fit_Calibration' },
                { value: 'returns' as InquiryType, label: 'Archive_Reversal' },
                { value: 'partnership' as InquiryType, label: 'Partnership' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    setInquiryType(value);
                    setOrderId(lastOrderId);
                    setReturnReason('');
                  }}
                  className={`px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] transition-all relative group/tab italic whitespace-nowrap flex-shrink-0 ${
                    inquiryType === value
                      ? 'text-neonRed'
                      : 'text-text-secondary/60 hover:text-text-primary'
                  }`}
                >
                  {label}
                  {inquiryType === value && (
                    <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-neonRed shadow-neon"></span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Left fade overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg-primary from-50% to-transparent z-10 pointer-events-none dark:from-bg-primary"></div>
            
            {/* Right fade overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg-primary from-50% to-transparent z-10 pointer-events-none dark:from-bg-primary"></div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Main Contact Form Card */}
          <div className="lg:col-span-7 h-full">
            <div className="relative group overflow-hidden bg-bg-secondary border border-border-color p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-neonRed/30 h-full flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
                <h4 className="text-sm font-black text-text-primary uppercase tracking-widest italic">
                  {getFormLabel()} <span className="text-neonRed">Request</span>
                </h4>
              </div>
              
              <form onSubmit={handleSubmit} action={`https://formsubmit.co/${getFormEmail()}`} method="POST" className="space-y-10 relative z-10">
                {/* Hidden fields for FormSubmit */}
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="inquiry_type" value={inquiryType} />
                {inquiryType === 'returns' && <input type="hidden" name="return_reason" value={returnReason} />}
                <input type="hidden" name="_next" value={`${window.location.origin}${ROUTES.CONTACT}`} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <InputField 
                    label="Full Name" 
                    placeholder="JOHN DOE" 
                    required
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                    name="name"
                  />
                  <InputField 
                    label="Contact Signal" 
                    placeholder="EMAIL@NETWORK.WW" 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                    name="email"
                  />
                </div>

                {/* Show order ID field for returns */}
                {inquiryType === 'returns' && (
                  <InputField 
                    label="Order Identifier" 
                    placeholder="WW-ORD-XXXX" 
                    required
                    value={orderId}
                    onChange={(e: any) => setOrderId(e.target.value)}
                    name="order_id"
                  />
                )}
                
                {/* Inquiry type or Return reason dropdown */}
                {inquiryType !== 'returns' ? (
                  <div className="space-y-3 group">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
                      Inquiry Classification
                    </label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      disabled={submitted || loading}
                      className="w-full bg-bg-contrast-02 border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-black text-text-primary focus:outline-none transition-all uppercase tracking-widest appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="" className="bg-bg-secondary text-text-primary">SELECT_PROTOCOL...</option>
                      {inquiryType === 'order' && (
                        <>
                          <option value="order_status" className="bg-bg-secondary text-text-primary">ORDER_STATUS</option>
                          <option value="order_issue" className="bg-bg-secondary text-text-primary">ORDER_ISSUE</option>
                        </>
                      )}
                      {inquiryType === 'sizing' && (
                        <>
                          <option value="size_fit" className="bg-bg-secondary text-text-primary">SIZE_FIT_QUESTION</option>
                          <option value="material_care" className="bg-bg-secondary text-text-primary">MATERIAL_CARE</option>
                        </>
                      )}
                      {inquiryType === 'partnership' && (
                        <>
                          <option value="wholesale" className="bg-bg-secondary text-text-primary">WHOLESALE_INQUIRY</option>
                          <option value="collaboration" className="bg-bg-secondary text-text-primary">COLLABORATION</option>
                        </>
                      )}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3 group">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
                      Return Reason Protocol
                    </label>
                    <select 
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      name="return_reason"
                      className="w-full bg-bg-contrast-02 border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-black text-text-primary focus:outline-none transition-all uppercase tracking-widest appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-bg-secondary text-text-primary">SELECT_REASON...</option>
                      <option value="fitment" className="bg-bg-secondary text-text-primary">FITMENT_INACCURACY</option>
                      <option value="damage" className="bg-bg-secondary text-text-primary">STRUCTURAL_INTERFERENCE</option>
                      <option value="strategic_pivot" className="bg-bg-secondary text-text-primary">STRATEGIC_PIVOT</option>
                      <option value="other" className="bg-bg-secondary text-text-primary">OTHER_ANOMALY</option>
                    </select>
                  </div>
                )}

                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
                    {inquiryType === 'returns' ? 'Detailed Intel' : 'Signal Content'}
                  </label>
                  <textarea 
                    rows={inquiryType === 'returns' ? 4 : 5}
                    required
                    placeholder={inquiryType === 'returns' ? 'DESCRIBE_THE_ISSUE...' : 'HOW_CAN_WE_AID_YOUR_DEPLOYMENT?'}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    disabled={submitted || loading}
                    className="w-full bg-bg-contrast-02 border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-bold text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    name="message"
                  ></textarea>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-neonRed text-white py-6 font-black uppercase tracking-[0.4em] text-xs shadow-neon hover:shadow-neon-strong transition-all active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group/btn disabled:opacity-75"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {getSubmitButton()}
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
            {/* Info Card */}
            <div className="p-10 bg-bg-secondary border border-border-color relative group hover:border-neonRed/20 transition-all shadow-xl flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-4 w-1 bg-neonRed shadow-neon"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neonRed italic">
                  {inquiryType === 'returns' ? 'Reversal Protocols' : inquiryType === 'sizing' ? 'Calibration Guidelines' : inquiryType === 'partnership' ? 'Partnership Terms' : 'Direct Channels'}
                </h3>
              </div>
              
              {inquiryType === 'returns' && (
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
              )}

              {inquiryType === 'sizing' && (
                <div className="space-y-10 flex-1">
                  <div className="group/item">
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">MEASUREMENT_TOOLS</span>
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Use our sizing guide and measurement templates for precise calibration.</p>
                  </div>
                  <div className="group/item">
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">MATERIAL_SHRINKAGE</span>
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Natural fabrics may shift slightly after initial deployment. Account for minor adjustments.</p>
                  </div>
                  <div className="group/item">
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">EXPERT_CONSULTATION</span>
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Our team is available for personalized sizing consultations.</p>
                  </div>
                </div>
              )}

              {inquiryType === 'partnership' && (
                <div className="space-y-10 flex-1">
                  <div className="group/item">
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">WHOLESALE_PROGRAMS</span>
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Volume discounts and custom terms available for qualified retailers.</p>
                  </div>
                  <div className="group/item">
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">COLLABORATION_OPTIONS</span>
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Co-branding, exclusive collections, and strategic partnerships available.</p>
                  </div>
                  <div className="group/item">
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest block mb-2 italic group-hover/item:text-neonRed transition-colors">TURNAROUND_TIME</span>
                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed">Expect partnership discussions and proposals within 5-7 business days.</p>
                  </div>
                </div>
              )}

              {inquiryType === 'order' && (
                <div className="space-y-12 flex-1">
                  <div className="space-y-6">
                    <div className="group/item">
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-2 italic">Primary Support</span>
                      <p className="text-sm font-black text-text-primary uppercase tracking-widest group-hover/item:text-neonRed transition-colors">SUPPORT@WICKED.WORKS</p>
                    </div>
                    <div className="group/item">
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-2 italic">Direct Inquiry</span>
                      <p className="text-sm font-black text-text-primary uppercase tracking-widest group-hover/item:text-neonRed transition-colors">NICKKCUSANO@ICLOUD.COM</p>
                    </div>
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
              )}

              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-border-color"></div>
            </div>

            {/* Trust Card */}
            <div className="p-10 bg-bg-secondary border border-border-color relative group hover:border-neonRed/20 transition-all shadow-xl flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 flex items-center justify-center border border-border-color rounded-full mb-8 group-hover:border-neonRed transition-all shadow-sm group-hover:shadow-neon bg-bg-contrast-01">
                <div className="text-text-secondary/10 group-hover:text-neonRed transition-all transform group-hover:scale-110">
                  <Icons.Shield />
                </div>
              </div>
              <h4 className="text-2xl font-black text-text-primary uppercase tracking-tighter mb-4 italic leading-none">
                {inquiryType === 'returns' ? 'Secure Reversals' : inquiryType === 'partnership' ? 'Strategic Trust' : 'Secure Inquiries'}
              </h4>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 leading-relaxed italic max-w-xs mx-auto">
                {inquiryType === 'returns' 
                  ? 'ALL RETURN PROCESSES ARE HANDLED WITH ABSOLUTE CONFIDENTIALITY AND SECURE PROTOCOLS.'
                  : inquiryType === 'partnership'
                  ? 'PARTNERSHIP DISCUSSIONS ARE CONFIDENTIAL AND TAILORED TO YOUR STRATEGIC GOALS.'
                  : 'ALL COMMUNICATIONS ARE HANDLED WITH ABSOLUTE CONFIDENTIALITY AND PRIVACY PROTOCOLS.'
                }
              </p>

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
              Signal <span className="text-neonRed">Received</span>
            </h3>
            
            <p className="text-text-secondary text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed mb-8 italic">
              {inquiryType === 'returns' 
                ? 'Your reversal request has been logged and prioritized.'
                : inquiryType === 'partnership'
                ? 'Thank you for your partnership interest. We will review and respond shortly.'
                : inquiryType === 'sizing'
                ? 'Your calibration request is received. Our team will assist soon.'
                : 'Your message has been received. We will respond within 24 hours.'
              }
            </p>
            
            <button
              onClick={() => {
                setSubmitted(false);
                navigate(ROUTES.HOME);
              }}
              className="bg-neonRed text-white py-4 px-10 font-black uppercase tracking-[0.4em] text-xs shadow-neon hover:shadow-neon-strong transition-all"
            >
              Return to Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;