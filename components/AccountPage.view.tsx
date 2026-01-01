import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, AccountSection } from '../types';
import { Icons } from '../constants';
import { ROUTES } from '../utils/routeHelpers';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences';
import { useAuth } from '../contexts/AuthContext';

// --- Reusable Sub-Components ---

const SectionHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="mb-12">
    <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-text-primary mb-4 leading-none italic">
      {title}<span className="text-neonRed">.</span>
    </h3>
    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] max-w-lg">
      {subtitle}
    </p>
    <div className="h-px bg-gradient-to-r from-neonRed/40 to-transparent w-48 mt-8"></div>
  </div>
);

const InputField: React.FC<{ label: string; placeholder: string; type?: string; defaultValue?: string; required?: boolean; }> = ({ label, placeholder, type = "text", defaultValue, required }) => (
  <div className="space-y-3 group">
    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
      {label} {required && <span className="text-neonRed">*</span>}
    </label>
    <input 
      type={type} 
      defaultValue={defaultValue}
      required={required}
      placeholder={placeholder}
      className="w-full bg-bg-surface border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-bold text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest shadow-inner"
    />
  </div>
);

const SupportContactForm: React.FC<{ onSubmit: (e: React.FormEvent) => void; loading: boolean }> = ({ onSubmit, loading }) => {
  return (
    <div className="bg-bg-secondary p-8 space-y-8 border border-border-color shadow-2xl h-full">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
        <h4 className="text-sm font-black text-neonRed uppercase tracking-widest italic">
          New Support Ticket
        </h4>
      </div>
      <form onSubmit={onSubmit} className="space-y-8">
        <InputField label="Order Identifier" placeholder="WW-ORD-XXXX (OPTIONAL)" />
        <div className="space-y-3 group">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
            Inquiry Classification
          </label>
          <select className="w-full bg-bg-surface border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-bold text-text-primary focus:outline-none transition-all uppercase tracking-widest appearance-none cursor-pointer shadow-inner">
            <option value="" className="bg-bg-surface">SELECT_PROTOCOL...</option>
            <option value="order" className="bg-bg-surface">ORDER_DEPLOYMENT</option>
            <option value="sizing" className="bg-bg-surface">FIT_CALIBRATION</option>
            <option value="returns" className="bg-bg-surface">ARCHIVE_REVERSAL</option>
          </select>
        </div>
        <div className="space-y-3 group">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary group-focus-within:text-neonRed transition-colors italic">
            Signal Content <span className="text-neonRed">*</span>
          </label>
          <textarea 
            rows={4} required placeholder="HOW_CAN_WE_AID_YOUR_DEPLOYMENT?"
            className="w-full bg-bg-surface border border-border-color group-focus-within:border-neonRed/30 px-5 py-4 text-xs font-bold text-text-primary focus:outline-none transition-all placeholder:text-text-primary/10 uppercase tracking-widest resize-none shadow-inner"
          ></textarea>
        </div>
        <div className="pt-2">
           <button 
             type="submit" 
             disabled={loading}
             className="w-full md:w-auto bg-neonRed text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] shadow-neon hover:shadow-neon-strong transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait"
           >
             {loading ? 'TRANSMITTING...' : 'Transmit Signal'}
           </button>
        </div>
      </form>
    </div>
  );
};

const NotificationToggle: React.FC<{ 
  label: string; 
  sub: string; 
  enabled: boolean; 
  onToggle: (enabled: boolean) => void;
  loading?: boolean;
}> = ({ label, sub, enabled, onToggle, loading }) => {
  return (
    <div className="flex items-start justify-between gap-4 group py-4 border-b border-border-color last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <h4 className={`text-sm font-black uppercase tracking-tight mb-1 transition-colors italic ${enabled ? 'text-text-primary' : 'text-text-secondary'}`}>{label}</h4>
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest leading-relaxed">{sub}</p>
      </div>
      <button 
        onClick={() => !loading && onToggle(!enabled)} 
        disabled={loading}
        className="relative inline-flex items-center cursor-pointer shrink-0 mt-1 disabled:opacity-50 disabled:cursor-wait"
      >
        <div className={`w-12 h-6 transition-all duration-300 border ${enabled ? 'bg-neonRed/10 border-neonRed shadow-neon' : 'bg-bg-contrast-05 border-border-color'}`}>
          <div className={`absolute top-1 bottom-1 w-4 transition-all duration-300 ${enabled ? 'left-7 bg-neonRed' : 'left-1 bg-text-secondary'}`} />
        </div>
      </button>
    </div>
  );
};

interface AddressData { id: string; name: string; street: string; suite: string; city: string; isDefault: boolean; }
const AddressForm: React.FC<{ initialData?: AddressData; onSave: () => void; onCancel: () => void }> = ({ initialData, onSave, onCancel }) => (
  <div className="bg-bg-secondary p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500 border border-border-color shadow-2xl">
    <div className="flex items-center gap-4">
      <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
      <h4 className="text-sm font-black text-neonRed uppercase tracking-widest italic">
        {initialData ? 'Reconfigure Shipping Zone' : 'Initialize New Zone'}
      </h4>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <InputField label="Zone Designation" placeholder="e.g. HOME BASE" defaultValue={initialData?.name} />
      <InputField label="Street Protocol" placeholder="123 STEALTH WAY" defaultValue={initialData?.street} />
      <InputField label="Suite / Level" placeholder="SUITE 404" defaultValue={initialData?.suite} />
      <InputField label="Sector / City" placeholder="NEO TOKYO" defaultValue={initialData?.city} />
    </div>
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <button onClick={onSave} className="flex-1 bg-neonRed text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] shadow-neon hover:shadow-neon-strong transition-all active:scale-95">
        {initialData ? 'Update Zone' : 'Authorize Zone'}
      </button>
      <button onClick={onCancel} className="flex-1 bg-bg-contrast-05 text-text-secondary px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:text-text-primary transition-all border border-border-color">
        Abort
      </button>
    </div>
  </div>
);

const IndustrialAiChat: React.FC<{ messages: any[]; onSend: (t: string) => void; isStreaming: boolean; onBack: () => void }> = ({ messages, onSend, isStreaming, onBack }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, isStreaming]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="bg-bg-secondary h-[600px] flex flex-col animate-in slide-in-from-bottom-4 duration-300 border border-border-color shadow-2xl relative overflow-hidden">
      {/* Laser line effect for active chat */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-neonRed shadow-neon z-20"></div>

      <div className="p-4 border-b border-border-color flex justify-between items-center bg-bg-tertiary">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-neonRed animate-pulse shadow-neon"></div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">ASU_UNIT_LINKED</span>
             <span className="text-[7px] font-mono text-text-secondary/50 uppercase tracking-widest">Protocol: Gemini_3_Flash</span>
          </div>
        </div>
        <button onClick={onBack} className="text-[9px] font-black text-text-secondary hover:text-neonRed uppercase tracking-widest transition-all">Terminate_Session</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-bg-primary/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-4 text-[11px] font-bold tracking-tight uppercase leading-relaxed ${
              m.role === 'user' 
                ? 'bg-neonRed text-white border-l-4 border-white/20 shadow-neon' 
                : 'bg-bg-contrast-05 text-text-primary border-l-4 border-neonRed'
            }`}>
              {m.text || (i === messages.length - 1 && isStreaming ? 'SYNCHRONIZING...' : '')}
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start">
             <div className="bg-bg-contrast-05 p-3 flex gap-1 items-center border-l-4 border-neonRed/20">
                <div className="w-1 h-1 bg-neonRed animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-neonRed animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-neonRed animate-bounce"></div>
             </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-5 border-t border-border-color bg-bg-tertiary">
        <div className="relative">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            disabled={isStreaming}
            placeholder={isStreaming ? "SYNCHRONIZING_SIGNAL..." : "TRANSMIT_SIGNAL..."} 
            className="w-full bg-bg-surface border border-border-color px-5 py-4 text-xs font-black text-text-primary focus:outline-none focus:border-neonRed/50 uppercase tracking-widest pr-16 placeholder:text-text-primary/10 disabled:opacity-50 shadow-inner" 
          />
          <button 
            type="submit" 
            disabled={isStreaming || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neonRed hover:text-white transition-all disabled:opacity-0"
          >
            <Icons.ArrowRight />
          </button>
        </div>
        <p className="text-[7px] font-mono text-text-secondary/30 mt-3 text-right uppercase tracking-widest">
           Encryption: AES_256_STABLE // BUILD: WW_ASU_25
        </p>
      </form>
    </div>
  );
};

const OrderReceipt: React.FC<{ order: Order; onInitiateReturn?: (orderId: string) => void }> = ({ order, onInitiateReturn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const getStatusColor = (status: string) => ({ 'STAGED': 'text-text-secondary', 'IN_TRANSIT': 'text-neonRed', 'DEPLOYED': 'text-green-500' }[status] || 'text-text-secondary/50');

  return (
    <div className={`border border-border-color transition-all duration-500 bg-bg-secondary ${isOpen ? 'bg-bg-contrast-02' : 'hover:border-text-primary/20'}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="p-5 cursor-pointer flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0"><span className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{order.date}</span><h4 className="text-xs font-black text-text-primary tracking-tighter uppercase font-mono truncate">{order.id}</h4></div>
        <div className="flex items-center gap-3 sm:gap-8 flex-shrink-0">
          <div className="text-right"><span className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-0.5">STATUS</span><span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(order.status)}`}><span className={`w-1.5 h-1.5 rounded-full ${order.status === 'IN_TRANSIT' ? 'bg-neonRed animate-pulse' : 'bg-current'}`}></span>{order.status.replace('_', ' ')}</span></div>
          <div className={`transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-text-secondary/50"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></div>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] border-t border-border-color opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6">
          <div className="space-y-4 mb-8">{order.items.map(item => (<div key={item.id} className="flex gap-4 items-center"><div className="w-12 h-16 bg-bg-tertiary border border-border-color flex-shrink-0"><img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale opacity-60" /></div><div className="flex-1 min-w-0"><h5 className="text-[10px] font-black text-text-primary uppercase tracking-wider mb-0.5 truncate">{item.title}</h5><span className="text-[9px] font-bold text-text-secondary uppercase">QTY: {item.quantity} // {item.price}</span></div></div>))}</div>
          <div className="pt-6 border-t border-border-color flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-4 items-center"><div className="flex items-center gap-4"><span className="text-[9px] font-bold text-text-secondary uppercase">Total</span><span className="text-sm font-black text-neonRed uppercase">{order.total}</span></div>{order.status === 'DEPLOYED' && <button onClick={() => onInitiateReturn?.(order.id)} className="bg-neonRed text-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] shadow-neon hover:shadow-neon-strong transition-all active:scale-95">Initiate Return</button>}</div>
            <button className="text-[9px] font-black text-text-secondary hover:text-text-primary uppercase tracking-widest transition-colors">Details →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main View Component ---

interface AccountPageViewProps {
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
  isChatActive: boolean;
  onToggleChat: () => void;
  isEditingAddress: boolean;
  editingAddressData: any;
  onEditAddress: (address: any) => void;
  onAddNewAddress: () => void;
  onSaveAddress: () => void;
  onCancelAddress: () => void;
  onInitiateReturn: (orderId: string) => void;
  orders: Order[];
  user: any;
  addresses: any[];
  prefilledOrderId?: string | null;
  isSupportFormSubmitted: boolean;
  isSupportFormLoading: boolean;
  onSupportSubmit: (e: React.FormEvent) => void;
  onCloseSupportSuccess: () => void;
  
  // AI Props
  aiMessages: any[];
  onSendMessage: (t: string) => void;
  isAiStreaming: boolean;
}

export const AccountPageView: React.FC<AccountPageViewProps> = ({
  activeSection, onSectionChange, isChatActive, onToggleChat,
  isEditingAddress, editingAddressData, onEditAddress, onAddNewAddress, onSaveAddress, onCancelAddress, onInitiateReturn,
  orders, user, addresses, prefilledOrderId,
  isSupportFormSubmitted, isSupportFormLoading, onSupportSubmit, onCloseSupportSuccess,
  aiMessages, onSendMessage, isAiStreaming
}) => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const { preferences, loading: prefsLoading, updatePreference } = useNotificationPreferences(customer?.id || null);
  
  const navItems = [
    { id: 'DETAILS', label: 'Account Details', icon: <Icons.User /> },
    { id: 'ORDERS', label: 'Order History', icon: <Icons.ShoppingBag /> },
    { id: 'ADDRESSES', label: 'Addresses', icon: <Icons.MapPin /> },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: <Icons.Bell /> },
    { id: 'SUPPORT', label: 'Support', icon: <Icons.Adjustments /> },
  ] as const;

  const renderContent = () => {
    switch (activeSection) {
      case 'DETAILS': return <div className="animate-in slide-in-from-bottom-4 duration-500"><SectionHeader title="Account Details" subtitle="Manage your identity and profile information." /><div className="bg-bg-secondary border border-border-color p-8 space-y-8 shadow-2xl"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><InputField label="First Name" placeholder="Operative" defaultValue={user.firstName} /><InputField label="Last Name" placeholder="Name" defaultValue={user.lastName} /></div><InputField label="Email Address" placeholder="user@network.ww" defaultValue={user.email} type="email" /><InputField label="Contact Number" placeholder="+1 (000) 000-0000" defaultValue={user.phone} /><div className="pt-4"><button className="w-full md:w-auto bg-neonRed text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] shadow-neon hover:shadow-neon-strong transition-all active:scale-95">Update Identity</button></div></div></div>;
      case 'ORDERS': return <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500"><SectionHeader title="Order History" subtitle="Track and manage your previous technical deployments." />{orders.length > 0 ? <div className="space-y-4">{orders.map(o => <OrderReceipt key={o.id} order={o} onInitiateReturn={onInitiateReturn} />)}</div> : <div className="bg-bg-secondary border border-dashed border-border-color p-12 text-center flex flex-col items-center justify-center min-h-[300px]"><div className="w-16 h-16 flex items-center justify-center text-text-secondary/10 mb-6"><Icons.ShoppingBag /></div><h4 className="text-xl font-black uppercase tracking-tighter text-text-secondary mb-2 italic">No Deployment History</h4><p className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest mb-8">Your order log is empty.</p><button onClick={() => navigate(ROUTES.SHOP)} className="bg-bg-contrast-05 text-text-secondary px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:text-text-primary transition-colors border border-border-color">Explore Archives</button></div>}</div>;
      case 'ADDRESSES': return <div className="animate-in slide-in-from-bottom-4 duration-500"><SectionHeader title="Addresses" subtitle="Configure your primary and secondary shipping zones." />{isEditingAddress ? <AddressForm initialData={editingAddressData} onSave={onSaveAddress} onCancel={onCancelAddress} /> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{addresses.map(addr => <div key={addr.id} className="bg-bg-secondary p-6 relative group transition-all duration-300 border border-border-color shadow-xl"><div className="absolute top-4 right-4 bg-neonRed text-[8px] font-black px-2 py-0.5 text-white tracking-widest shadow-neon">DEFAULT</div><h4 className="text-[10px] font-black text-text-secondary uppercase mb-4 tracking-widest flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neonRed shadow-neon"></div>{addr.name}</h4><p className="text-sm font-bold text-text-primary uppercase tracking-tight leading-relaxed">{addr.street}<br />{addr.suite}<br />{addr.city}</p><div className="mt-8 pt-6 border-t border-border-color flex gap-4"><button onClick={() => onEditAddress(addr)} className="text-[9px] font-black text-neonRed uppercase tracking-widest hover:underline">Edit</button><button className="text-[9px] font-black text-text-secondary hover:text-text-primary transition-colors">Delete</button></div></div>)}<button onClick={onAddNewAddress} className="bg-transparent flex flex-col items-center justify-center text-text-secondary hover:text-neonRed border border-dashed border-border-color hover:border-neonRed/40 transition-all group min-h-[160px]"><div className="w-10 h-10 border border-current flex items-center justify-center mb-4 group-hover:shadow-neon group-hover:scale-110 transition-transform"><span className="text-2xl font-light">+</span></div><span className="text-[10px] font-black uppercase tracking-[0.3em]">Add New Zone</span></button></div>}</div>;
      case 'NOTIFICATIONS': return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <SectionHeader 
            title="Notifications" 
            subtitle="Configure your signal preferences for drops and updates." 
          />
          <div className="bg-bg-secondary border border-border-color p-8 space-y-4 shadow-2xl">
            {!customer ? (
              <div className="text-center py-12">
                <p className="text-text-secondary text-sm uppercase tracking-wider mb-4">Authentication Required</p>
                <p className="text-text-secondary/50 text-xs uppercase tracking-widest">Log in to manage notification preferences</p>
              </div>
            ) : prefsLoading ? (
              <div className="text-center py-12">
                <p className="text-text-secondary text-xs uppercase tracking-widest">Loading preferences...</p>
              </div>
            ) : (
              <>
                <NotificationToggle 
                  label="New Arrivals" 
                  sub="Be the first to know about new technical deployments." 
                  enabled={preferences?.notify_new_arrivals ?? true}
                  onToggle={(enabled) => updatePreference('notify_new_arrivals', enabled)}
                  loading={prefsLoading}
                />
                <NotificationToggle 
                  label="Upcoming Releases" 
                  sub="Weekly digest of products dropping soon." 
                  enabled={preferences?.notify_upcoming_releases ?? true}
                  onToggle={(enabled) => updatePreference('notify_upcoming_releases', enabled)}
                  loading={prefsLoading}
                />
                <NotificationToggle 
                  label="Back In Stock" 
                  sub="Get notified when saved products are restocked." 
                  enabled={preferences?.notify_back_in_stock ?? true}
                  onToggle={(enabled) => updatePreference('notify_back_in_stock', enabled)}
                  loading={prefsLoading}
                />
                <NotificationToggle 
                  label="Promotions" 
                  sub="Receive updates on special offers and exclusive drops." 
                  enabled={preferences?.notify_promotions ?? false}
                  onToggle={(enabled) => updatePreference('notify_promotions', enabled)}
                  loading={prefsLoading}
                />
              </>
            )}
          </div>
        </div>
      );
      case 'SUPPORT': return <div className="animate-in slide-in-from-bottom-4 duration-500"><SectionHeader title="Support" subtitle="Technical assistance and tactical deployment help." />{isChatActive ? <IndustrialAiChat messages={aiMessages} onSend={onSendMessage} isStreaming={isAiStreaming} onBack={onToggleChat} /> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><SupportContactForm onSubmit={onSupportSubmit} loading={isSupportFormLoading} /><div className="space-y-8"><div className="bg-bg-secondary p-8 group hover:border-neonRed/20 transition-all border border-border-color shadow-2xl flex flex-col justify-center h-full"><h4 className="text-[10px] font-black text-neonRed uppercase tracking-widest mb-2 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neonRed animate-pulse shadow-neon"></div>Support Channels</h4><p className="text-[10px] font-bold text-text-secondary uppercase leading-relaxed mb-6 pr-12">Access live assistance or review our technical deployment documents.</p><div className="mt-auto space-y-4"><button onClick={onToggleChat} className="w-full text-center bg-bg-contrast-05 border border-border-color text-text-secondary hover:text-text-primary hover:border-text-primary/20 py-4 text-xs font-black uppercase tracking-widest transition-all">Launch AI Assistant</button><button onClick={() => navigate(ROUTES.RETURNS)} className="w-full text-center bg-bg-contrast-05 border border-border-color text-text-secondary hover:text-text-primary hover:border-text-primary/20 py-4 text-xs font-black uppercase tracking-widest transition-all">Access Knowledge Base</button></div></div></div></div>}</div>;
      default: return null;
    }
  };

  return (
    <>
      <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
          <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
            <button onClick={() => navigate(ROUTES.HOME)} className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors">ROOT</button>
            <span className="text-[9px] text-neonRed font-black">/</span>
            <span className="text-[9px] font-black text-text-primary tracking-[0.2em] uppercase italic">ACCOUNT</span>
            <div className="ml-auto flex items-center gap-4 pl-6"><span className="text-[9px] font-mono text-text-secondary/50 uppercase tracking-widest hidden md:block italic">UPLINK_STATUS: SECURE</span></div>
          </nav>

          <div className="mb-16">
            <span className="text-neonRed font-black text-[11px] uppercase tracking-[0.5em] mb-6 block italic">Operative Dashboard</span>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-text-primary leading-none italic">
              Welcome Back, <span className="text-text-secondary/20">Operative_01</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <aside className="lg:w-72 flex-shrink-0">
              <div className="relative group/nav-container">
                {/* Desktop Sidebar */}
                <nav className="hidden lg:flex flex-col space-y-1 relative border-l border-border-color">
                  {navItems.map(item => (<button key={item.id} onClick={() => onSectionChange(item.id as AccountSection)} className={`flex items-center gap-4 px-6 py-4 w-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative group whitespace-nowrap ${activeSection === item.id ? 'text-neonRed bg-bg-contrast-02' : 'text-text-secondary hover:text-text-primary/80'}`}><span className={`transition-all duration-300 ${activeSection === item.id ? 'scale-110 shadow-neon' : ''}`}>{item.icon}</span>{item.label}{activeSection === item.id && <span className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-neonRed shadow-neon rounded-r-full"></span>}</button>))}
                </nav>
                {/* Mobile Tab Bar */}
                <nav className="lg:hidden flex flex-row overflow-x-auto no-scrollbar border-b border-border-color relative">
                  {navItems.map(item => (<button key={item.id} onClick={() => onSectionChange(item.id as AccountSection)} className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative whitespace-nowrap ${activeSection === item.id ? 'text-neonRed' : 'text-text-secondary hover:text-text-primary'}`}>{item.icon}{item.label}{activeSection === item.id && <span className="absolute left-0 bottom-[-1px] w-full h-0.5 bg-neonRed shadow-neon"></span>}</button>))}
                </nav>
              </div>
            </aside>
            
            <main className="flex-1 min-w-0">
              <div className="min-h-[400px]">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      {isSupportFormSubmitted && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-tertiary/98 backdrop-blur-3xl animate-in fade-in duration-700"></div>
          <div className="relative bg-bg-secondary p-12 md:p-20 border border-border-color border-l-neonRed border-l-4 max-w-2xl w-full text-center animate-in slide-in-from-bottom-6 duration-700 shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="w-24 h-24 bg-neonRed text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-neon-strong animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
               </svg>
            </div>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-text-primary mb-6 italic">
              Signal <span className="text-neonRed">Received.</span>
            </h3>
            <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.4em] text-text-secondary mb-12 max-w-sm mx-auto leading-loose italic">
              OUR SUPPORT TEAM HAS RECEIVED YOUR SIGNAL AND WILL RESPOND WITHIN 24 HOURS.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => { onCloseSupportSuccess(); onSectionChange('DETAILS'); }}
                className="bg-text-primary text-bg-primary px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-neonRed hover:text-white transition-all shadow-xl"
              >
                Return to Dashboard
              </button>
              <button 
                onClick={onCloseSupportSuccess}
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
    </>
  );
};