import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchCustomerOrders, fetchCustomerAddresses, createCustomerAddress, updateCustomerAddress, updateCustomerProfile, deleteCustomerAddress, setDefaultCustomerAddress, ShopifyOrder, ShopifyAddress, getStoredTokens } from '../lib/auth';

type TabType = 'orders' | 'addresses' | 'profile';

// Notification Component
interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10001] w-[calc(100%-2rem)] max-w-md animate-slide-down">
      <div className={`
        bg-white dark:bg-bg-secondary 
        border-2 
        ${type === 'success' ? 'border-emerald-500 dark:border-emerald-400' : 'border-neonRed'}
        shadow-2xl
        p-4 sm:p-5
        flex items-center gap-3 sm:gap-4
        relative
        overflow-hidden
      `}>
        {/* Animated pulse bar */}
        <div className={`
          absolute left-0 top-0 bottom-0 w-1.5
          ${type === 'success' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-neonRed'}
          animate-pulse
        `}></div>
        
        {/* Icon */}
        <div className="flex-shrink-0 ml-2">
          {type === 'success' ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neonRed" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          )}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className={`
            text-[10px] sm:text-xs 
            font-black 
            uppercase 
            tracking-widest 
            ${type === 'success' ? 'text-emerald-500 dark:text-emerald-400' : 'text-neonRed'}
          `}>
            {type === 'success' ? 'Success' : 'Error'}
          </p>
          <p className="text-xs sm:text-sm text-text-primary font-medium mt-0.5 truncate">
            {message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-text-secondary hover:text-neonRed transition-colors text-xl leading-none p-1"
        >
          ×
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bg-tertiary overflow-hidden">
          <div className={`
            h-full 
            ${type === 'success' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-neonRed'}
            animate-progress
          `}></div>
        </div>
      </div>
    </div>
  );
};

// Helper to map Shopify status to display status
const getDisplayStatus = (financialStatus: string, fulfillmentStatus: string): { status: string; color: string; pulseColor: string } => {
  if (fulfillmentStatus === 'FULFILLED') {
    return { 
      status: 'DEPLOYED', 
      color: 'text-emerald-500 dark:text-emerald-400',
      pulseColor: 'bg-emerald-500 dark:bg-emerald-400'
    };
  }
  if (fulfillmentStatus === 'IN_TRANSIT' || fulfillmentStatus === 'PARTIALLY_FULFILLED') {
    return { 
      status: 'IN_TRANSIT', 
      color: 'text-neonRed',
      pulseColor: 'bg-neonRed'
    };
  }
  if (financialStatus === 'PENDING' || fulfillmentStatus === 'UNFULFILLED') {
    return { 
      status: 'STAGED', 
      color: 'text-amber-500 dark:text-amber-400',
      pulseColor: 'bg-amber-500 dark:bg-amber-400'
    };
  }
  return { 
    status: 'PROCESSING', 
    color: 'text-text-secondary',
    pulseColor: 'bg-text-secondary'
  };
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '.');
};

// OrderReceipt Component
const OrderReceipt: React.FC<{ order: ShopifyOrder }> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { status, color, pulseColor } = getDisplayStatus(order.financialStatus, order.fulfillmentStatus);

  return (
    <div className={`border border-border-color transition-all duration-500 bg-bg-secondary ${isOpen ? 'bg-bg-contrast-02' : 'hover:border-text-primary/20'}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="p-5 cursor-pointer flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">
            {formatDate(order.processedAt)}
          </span>
          <h4 className="text-xs font-black text-text-primary tracking-tighter uppercase font-mono truncate">
            {order.name}
          </h4>
        </div>
        <div className="flex items-center gap-3 sm:gap-8 flex-shrink-0">
          <div className="text-right">
            <span className="block text-[8px] font-black text-text-secondary uppercase tracking-widest mb-0.5">
              STATUS
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pulseColor} ${status === 'IN_TRANSIT' ? 'animate-pulse shadow-neon' : ''}`}></span>
              {status.replace('_', ' ')}
            </span>
          </div>
          <div className={`transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-text-secondary/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] border-t border-border-color opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6">
          <div className="space-y-4 mb-8">
            {order.lineItems.nodes.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="w-12 h-16 bg-bg-tertiary border border-border-color flex-shrink-0">
                  {item.image ? (
                    <img src={item.image.url} alt={item.title} className="w-full h-full object-cover grayscale opacity-60" />
                  ) : (
                    <div className="w-full h-full bg-bg-contrast-05"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[10px] font-black text-text-primary uppercase tracking-wider mb-0.5 truncate">
                    {item.title}
                  </h5>
                  <span className="text-[9px] font-bold text-text-secondary uppercase">
                    QTY: {item.quantity} // ${parseFloat(item.price.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-border-color flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-bold text-text-secondary uppercase">Total</span>
                <span className="text-sm font-black text-neonRed uppercase">
                  ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AddressCard Component
interface AddressCardProps {
  address: ShopifyAddress;
  isDefault: boolean;
  onEdit: (address: ShopifyAddress) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, isDefault, onEdit, onDelete, onSetDefault }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={`border border-border-color transition-all duration-500 bg-white dark:bg-bg-secondary ${isOpen ? 'bg-bg-contrast-02 dark:bg-bg-tertiary' : 'hover:border-text-primary/20'}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="p-5 cursor-pointer flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">
            {address.firstName} {address.lastName}
          </span>
          <h4 className="text-xs font-black text-text-primary tracking-tighter uppercase font-mono truncate">
            {address.address1}
          </h4>
          <span className="text-[9px] text-text-secondary/70 truncate">
            {address.city}, {address.province} {address.zip}
          </span>
          {isDefault && (
            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 dark:text-emerald-400 mt-1">
              Default Address
            </span>
          )}
        </div>
        <div className={`transition-transform duration-300 ml-1 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-text-secondary/50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[600px] border-t border-border-color opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary">
            <div>
              <span className="font-bold block mb-1">Name</span>
              <span>{address.firstName} {address.lastName}</span>
            </div>
            <div>
              <span className="font-bold block mb-1">Phone</span>
              <span>{address.phoneNumber || 'N/A'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold block mb-1">Address</span>
              <span>{address.address1}</span>
              {address.address2 && <span className="block">{address.address2}</span>}
            </div>
            <div>
              <span className="font-bold block mb-1">City</span>
              <span>{address.city}</span>
            </div>
            <div>
              <span className="font-bold block mb-1">State/Province</span>
              <span>{address.province}</span>
            </div>
            <div>
              <span className="font-bold block mb-1">Zip Code</span>
              <span>{address.zip}</span>
            </div>
            <div>
              <span className="font-bold block mb-1">Country</span>
              <span>{address.country}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border-color flex flex-col sm:flex-row gap-2">
            {!isDefault && (
              <button
                onClick={() => onSetDefault(address.id)}
                className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
              >
                Set as Default
              </button>
            )}
            <button
              onClick={() => onEdit(address)}
              className="text-[10px] font-bold uppercase tracking-widest text-text-primary hover:text-neonRed transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-neonRed hover:text-neonRed/70 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-white/40 dark:bg-black/90 backdrop-blur-3xl z-[9999] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white dark:bg-bg-secondary border border-border-color max-w-sm w-full p-6 sm:p-8 space-y-6 shadow-2xl relative z-[10000]">
            <div>
              <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-2">Delete Address?</h3>
              <p className="text-[10px] text-text-secondary">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-bg-primary border border-border-color hover:border-neonRed/30 text-text-primary font-bold uppercase tracking-widest text-xs py-3 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(address.id);
                  setShowConfirm(false);
                }}
                className="flex-1 bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-3 transition-all shadow-neon hover:shadow-neon-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AddressForm Component
interface AddressFormProps {
  address?: ShopifyAddress;
  onClose: () => void;
  onSave: (address: Partial<ShopifyAddress>) => Promise<void>;
  isSaving?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState<Partial<ShopifyAddress>>(
    address || {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      zip: '',
      country: '',
      phoneNumber: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-white/40 dark:bg-black/90 backdrop-blur-3xl z-[9999] flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-white dark:bg-bg-secondary border border-border-color max-w-md w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative z-[10000]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
            <h3 className="text-sm sm:text-base font-black text-text-primary uppercase tracking-widest italic">
              {address ? 'Edit Address' : 'Add Address'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-neonRed transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                First Name
              </label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                required
                className="w-full bg-bg-primary border border-border-color px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                Last Name
              </label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                required
                className="w-full bg-bg-primary border border-border-color px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
              Street Address
            </label>
            <input 
              type="text" 
              name="address1"
              value={formData.address1 || ''}
              onChange={handleChange}
              required
              className="w-full bg-bg-primary border border-border-color px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
              Apt/Suite (Optional)
            </label>
            <input 
              type="text" 
              name="address2"
              value={formData.address2 || ''}
              onChange={handleChange}
              className="w-full bg-bg-primary border border-border-color px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                City
              </label>
              <input 
                type="text" 
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                required
                className="w-full bg-bg-primary border border-border-color px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic whitespace-nowrap">
                State/Province
              </label>
              <select 
                name="province"
                value={formData.province || ''}
                onChange={handleChange}
                required
                className="w-full bg-bg-primary border border-border-color px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all"
              >
                <option value="">Select a state</option>
                <option value="Alabama">Alabama</option>
                <option value="Alaska">Alaska</option>
                <option value="Arizona">Arizona</option>
                <option value="Arkansas">Arkansas</option>
                <option value="California">California</option>
                <option value="Colorado">Colorado</option>
                <option value="Connecticut">Connecticut</option>
                <option value="Delaware">Delaware</option>
                <option value="Florida">Florida</option>
                <option value="Georgia">Georgia</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Idaho">Idaho</option>
                <option value="Illinois">Illinois</option>
                <option value="Indiana">Indiana</option>
                <option value="Iowa">Iowa</option>
                <option value="Kansas">Kansas</option>
                <option value="Kentucky">Kentucky</option>
                <option value="Louisiana">Louisiana</option>
                <option value="Maine">Maine</option>
                <option value="Maryland">Maryland</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="Michigan">Michigan</option>
                <option value="Minnesota">Minnesota</option>
                <option value="Mississippi">Mississippi</option>
                <option value="Missouri">Missouri</option>
                <option value="Montana">Montana</option>
                <option value="Nebraska">Nebraska</option>
                <option value="Nevada">Nevada</option>
                <option value="New Hampshire">New Hampshire</option>
                <option value="New Jersey">New Jersey</option>
                <option value="New Mexico">New Mexico</option>
                <option value="New York">New York</option>
                <option value="North Carolina">North Carolina</option>
                <option value="North Dakota">North Dakota</option>
                <option value="Ohio">Ohio</option>
                <option value="Oklahoma">Oklahoma</option>
                <option value="Oregon">Oregon</option>
                <option value="Pennsylvania">Pennsylvania</option>
                <option value="Rhode Island">Rhode Island</option>
                <option value="South Carolina">South Carolina</option>
                <option value="South Dakota">South Dakota</option>
                <option value="Tennessee">Tennessee</option>
                <option value="Texas">Texas</option>
                <option value="Utah">Utah</option>
                <option value="Vermont">Vermont</option>
                <option value="Virginia">Virginia</option>
                <option value="Washington">Washington</option>
                <option value="West Virginia">West Virginia</option>
                <option value="Wisconsin">Wisconsin</option>
                <option value="Wyoming">Wyoming</option>
                <option value="District of Columbia">District of Columbia</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                Zip Code
              </label>
              <input 
                type="text" 
                name="zip"
                value={formData.zip || ''}
                onChange={handleChange}
                required
                className="w-full bg-bg-primary border border-border-color px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                Country (Optional)
              </label>
              <input 
                type="text" 
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                className="w-full bg-bg-primary border border-border-color px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
              Phone (Optional)
            </label>
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="w-full bg-bg-primary border border-border-color px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 bg-bg-primary border border-border-color hover:border-neonRed/30 text-text-primary font-bold uppercase tracking-widest text-xs py-3 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-neonRed hover:bg-neonRed/90 disabled:bg-neonRed/50 text-white font-black uppercase tracking-widest text-xs py-3 transition-all shadow-neon hover:shadow-neon-lg disabled:shadow-none"
            >
              {isSaving ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AccountPage() {
  const navigate = useNavigate();
  const { customer, isAuthenticated, isLoading, login, logout, refreshCustomer } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShopifyAddress | undefined>();
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [addresses, setAddresses] = useState<ShopifyAddress[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch orders when authenticated
  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoadingOrders(true);
        const tokens = getStoredTokens();
        if (!tokens?.accessToken) return;
        
        const customerOrders = await fetchCustomerOrders(tokens.accessToken);
        setOrders(customerOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  // Fetch addresses as soon as the account page is entered (once authenticated)
  // so the Addresses tab count is accurate without requiring a click.
  useEffect(() => {
    const loadAddresses = async () => {
      if (!isAuthenticated) {
        setAddresses([]);
        return;
      }

      try {
        setLoadingAddresses(true);
        const tokens = getStoredTokens();
        if (!tokens?.accessToken) return;

        const customerAddresses = await fetchCustomerAddresses(tokens.accessToken);
        setAddresses(customerAddresses);
      } catch (error) {
        console.error('Failed to load addresses:', error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-bg-primary flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonRed mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-text-secondary text-xs uppercase tracking-widest">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-text-primary mb-4 leading-none italic">
              Account<span className="text-neonRed">.</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">
              Sign in to access your orders and account details
            </p>
          </div>

          <div className="bg-bg-surface border border-border-color p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <button
                onClick={login}
                className="w-full bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-4 px-6 transition-all shadow-neon hover:shadow-neon-lg"
              >
                Sign in with Shopify
              </button>
              
              <p className="text-[10px] text-text-secondary/60 leading-relaxed">
                You'll be redirected to Shopify's secure login page to authenticate your account.
              </p>
            </div>

            <div className="pt-6 border-t border-border-color">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-4">
                Quick Actions
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full text-left px-4 py-3 bg-bg-secondary hover:bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all text-[10px] font-bold uppercase tracking-widest text-text-primary"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/saved')}
                  className="w-full text-left px-4 py-3 bg-bg-secondary hover:bg-bg-primary border border-border-color hover:border-neonRed/30 transition-all text-[10px] font-bold uppercase tracking-widest text-text-primary"
                >
                  View Saved Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      {/* Notification Toast */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-text-primary leading-none">
            Welcome Back<span className="text-neonRed">.</span>
          </h1>
          <div className="space-y-1">
            <p className="text-sm sm:text-base text-text-primary font-semibold">{customer?.displayName}</p>
            <p className="text-xs sm:text-sm text-text-secondary/70">{customer?.email}</p>
          </div>
          <div className="h-px bg-gradient-to-r from-neonRed/40 to-transparent w-32 sm:w-48"></div>
        </div>

        {/* Account Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-12">
          {/* Orders Tab */}
          <div 
            onClick={() => setActiveTab('orders')}
            className={`cursor-pointer transition-all duration-300 p-3 sm:p-6 border-2 ${
              activeTab === 'orders' 
                ? 'bg-white dark:bg-bg-secondary border-neonRed shadow-neon scale-[1.02]' 
                : 'bg-white dark:bg-bg-surface border-border-color dark:border-border-color hover:border-neonRed/50 hover:bg-gray-50 dark:hover:bg-bg-secondary/50'
            } group relative overflow-hidden`}
          >
            {/* Left accent bar - always visible */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${activeTab === 'orders' ? 'bg-neonRed shadow-neon' : 'bg-text-secondary/30 dark:bg-text-secondary/40'}`}></div>
            
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 pl-2">
              <h3 className={`text-[11px] sm:text-sm font-black uppercase tracking-widest italic transition-colors duration-300 ${activeTab === 'orders' ? 'text-neonRed' : 'text-text-secondary group-hover:text-text-primary'}`}>
                Orders
              </h3>
            </div>
            <p className={`text-[8px] sm:text-[10px] leading-tight sm:leading-relaxed mb-2 sm:mb-3 pl-2 transition-colors duration-300 hidden sm:block ${activeTab === 'orders' ? 'text-text-secondary' : 'text-text-secondary/60'}`}>
              View your order history and track shipments
            </p>
            <div className={`text-lg sm:text-3xl font-black mb-0.5 sm:mb-1 pl-2 transition-colors duration-300 ${activeTab === 'orders' ? 'text-neonRed' : 'text-text-secondary/50'}`}>
              {orders.length}
            </div>
            <p className="text-[7px] sm:text-[9px] text-text-secondary/50 uppercase tracking-wider font-bold pl-2">Orders</p>
          </div>

          {/* Addresses Tab */}
          <div 
            onClick={() => setActiveTab('addresses')}
            className={`cursor-pointer transition-all duration-300 p-3 sm:p-6 border-2 ${
              activeTab === 'addresses' 
                ? 'bg-white dark:bg-bg-secondary border-neonRed shadow-neon scale-[1.02]' 
                : 'bg-white dark:bg-bg-surface border-border-color dark:border-border-color hover:border-neonRed/50 hover:bg-gray-50 dark:hover:bg-bg-secondary/50'
            } group relative overflow-hidden`}
          >
            {/* Left accent bar - always visible */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${activeTab === 'addresses' ? 'bg-neonRed shadow-neon' : 'bg-text-secondary/30 dark:bg-text-secondary/40'}`}></div>
            
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 pl-2">
              <h3 className={`text-[11px] sm:text-sm font-black uppercase tracking-widest italic transition-colors duration-300 ${activeTab === 'addresses' ? 'text-neonRed' : 'text-text-secondary group-hover:text-text-primary'}`}>
                Addresses
              </h3>
            </div>
            <p className={`text-[8px] sm:text-[10px] leading-tight sm:leading-relaxed mb-2 sm:mb-3 pl-2 transition-colors duration-300 hidden sm:block ${activeTab === 'addresses' ? 'text-text-secondary' : 'text-text-secondary/60'}`}>
              Manage your shipping and billing addresses
            </p>
            <div className={`text-lg sm:text-3xl font-black mb-0.5 sm:mb-1 pl-2 transition-colors duration-300 ${activeTab === 'addresses' ? 'text-neonRed' : 'text-text-secondary/50'}`}>
              {addresses.length}
            </div>
            <p className="text-[7px] sm:text-[9px] text-text-secondary/50 uppercase tracking-wider font-bold pl-2">Addresses</p>
          </div>

          {/* Profile Tab */}
          <div 
            onClick={() => setActiveTab('profile')}
            className={`cursor-pointer transition-all duration-300 p-3 sm:p-6 border-2 ${
              activeTab === 'profile' 
                ? 'bg-white dark:bg-bg-secondary border-neonRed shadow-neon scale-[1.02]' 
                : 'bg-white dark:bg-bg-surface border-border-color dark:border-border-color hover:border-neonRed/50 hover:bg-gray-50 dark:hover:bg-bg-secondary/50'
            } group relative overflow-hidden`}
          >
            {/* Left accent bar - always visible */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${activeTab === 'profile' ? 'bg-neonRed shadow-neon' : 'bg-text-secondary/30 dark:bg-text-secondary/40'}`}></div>
            
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 pl-2">
              <h3 className={`text-[11px] sm:text-sm font-black uppercase tracking-widest italic transition-colors duration-300 ${activeTab === 'profile' ? 'text-neonRed' : 'text-text-secondary group-hover:text-text-primary'}`}>
                Profile
              </h3>
            </div>
            <p className={`text-[8px] sm:text-[10px] leading-tight sm:leading-relaxed mb-2 sm:mb-3 pl-2 transition-colors duration-300 hidden sm:block ${activeTab === 'profile' ? 'text-text-secondary' : 'text-text-secondary/60'}`}>
              Update your account information
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('profile');
                setShowEditProfile(true);
              }}
              className={`text-[7px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 pl-2 ${activeTab === 'profile' ? 'text-neonRed hover:text-neonRed/80' : 'text-text-secondary/50 group-hover:text-neonRed'}`}
            >
              Edit →
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-white/40 dark:bg-black/90 backdrop-blur-3xl z-[9999] flex items-center justify-center p-4 pointer-events-auto">
            <div className="bg-white dark:bg-bg-secondary border border-border-color max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative z-[10000]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
                  <h3 className="text-sm sm:text-base font-black text-text-primary uppercase tracking-widest italic">
                    Edit Profile
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    setShowEditProfile(false);
                    setProfileForm({ firstName: '', lastName: '', phoneNumber: '' });
                  }}
                  className="text-text-secondary hover:text-neonRed transition-colors text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setSavingProfile(true);
                try {
                  const tokens = getStoredTokens();
                  if (!tokens?.accessToken) {
                    setNotification({ message: 'Authentication required. Please sign in again.', type: 'error' });
                    return;
                  }

                  await updateCustomerProfile(tokens.accessToken, {
                    firstName: profileForm.firstName || customer?.firstName,
                    lastName: profileForm.lastName || customer?.lastName,
                    phoneNumber: profileForm.phoneNumber || undefined,
                  });

                  // Refresh customer data
                  if (refreshCustomer) {
                    await refreshCustomer();
                  }

                  setNotification({ message: 'Profile updated successfully', type: 'success' });
                  setShowEditProfile(false);
                  setProfileForm({ firstName: '', lastName: '', phoneNumber: '' });
                } catch (error) {
                  console.error('Failed to update profile:', error);
                  setNotification({ 
                    message: error instanceof Error ? error.message : 'Failed to update profile', 
                    type: 'error' 
                  });
                } finally {
                  setSavingProfile(false);
                }
              }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                    First Name
                  </label>
                  <input 
                    type="text" 
                    value={profileForm.firstName || customer?.firstName || ''}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full bg-bg-primary border border-border-color px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    value={profileForm.lastName || customer?.lastName || ''}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full bg-bg-primary border border-border-color px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-neonRed/30 transition-all uppercase tracking-wider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={customer?.email || ''}
                    disabled
                    className="w-full bg-bg-primary/50 border border-border-color px-4 py-3 text-xs text-text-secondary cursor-not-allowed uppercase tracking-wider"
                  />
                  <p className="text-[9px] text-text-secondary/60">Email managed by Shopify</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditProfile(false);
                      setProfileForm({ firstName: '', lastName: '', phoneNumber: '' });
                    }}
                    disabled={savingProfile}
                    className="flex-1 bg-bg-primary border border-border-color hover:border-neonRed/30 text-text-primary font-bold uppercase tracking-widest text-xs py-3 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex-1 bg-neonRed hover:bg-neonRed/90 disabled:bg-neonRed/50 text-white font-black uppercase tracking-widest text-xs py-3 transition-all shadow-neon hover:shadow-neon-lg disabled:shadow-none"
                  >
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Address Form Modal */}
        {showAddressForm && (
          <AddressForm
            address={editingAddress}
            onClose={() => {
              setShowAddressForm(false);
              setEditingAddress(undefined);
            }}
            onSave={async (formData) => {
              setSavingAddress(true);
              try {
                const tokens = getStoredTokens();
                if (!tokens?.accessToken) {
                  setNotification({ message: 'Authentication required. Please sign in again.', type: 'error' });
                  return;
                }

                if (editingAddress?.id) {
                  // Update existing address
                  await updateCustomerAddress(tokens.accessToken, editingAddress.id, formData);
                  setNotification({ message: 'Address updated successfully', type: 'success' });
                } else {
                  // Create new address
                  await createCustomerAddress(tokens.accessToken, formData);
                  setNotification({ message: 'Address saved successfully', type: 'success' });
                }

                // Refresh addresses list
                const customerAddresses = await fetchCustomerAddresses(tokens.accessToken);
                setAddresses(customerAddresses);

                setShowAddressForm(false);
                setEditingAddress(undefined);
              } catch (error) {
                console.error('Failed to save address:', error);
                setNotification({ 
                  message: error instanceof Error ? error.message : 'Failed to save address', 
                  type: 'error' 
                });
              } finally {
                setSavingAddress(false);
              }
            }}
            isSaving={savingAddress}
          />
        )}

        {/* Tab Content */}
        <div className="bg-white dark:bg-bg-secondary border border-border-color p-6 sm:p-8">
          {/* Orders Tab Content */}
          {activeTab === 'orders' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest italic">
                    Recent Orders
                  </h3>
                </div>
              </div>

              {loadingOrders ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neonRed mx-auto mb-4"></div>
                  <p className="text-text-secondary text-xs uppercase tracking-wider">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <OrderReceipt key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16">
                  <p className="text-text-secondary text-xs uppercase tracking-wider mb-6">
                    No orders yet
                  </p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-3 px-6 sm:px-8 transition-all shadow-neon hover:shadow-neon-lg inline-block"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </>
          )}

          {/* Addresses Tab Content */}
          {activeTab === 'addresses' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest italic">
                    Your Addresses
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setEditingAddress(undefined);
                    setShowAddressForm(true);
                  }}
                  className="bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-2 px-4 transition-all shadow-neon hover:shadow-neon-lg"
                >
                  + Add Address
                </button>
              </div>

              {loadingAddresses ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neonRed mx-auto mb-4"></div>
                  <p className="text-text-secondary text-xs uppercase tracking-wider">Loading addresses...</p>
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <AddressCard 
                      key={address.id} 
                      address={address}
                      isDefault={address.isDefault || false}
                      onEdit={(addr) => {
                        setEditingAddress(addr);
                        setShowAddressForm(true);
                      }}
                      onDelete={async (addressId) => {
                        try {
                          const tokens = getStoredTokens();
                          if (!tokens?.accessToken) return;
                          await deleteCustomerAddress(tokens.accessToken, addressId);
                          const customerAddresses = await fetchCustomerAddresses(tokens.accessToken);
                          setAddresses(customerAddresses);
                          setNotification({ message: 'Address deleted successfully', type: 'success' });
                        } catch (error) {
                          console.error('Failed to delete address:', error);
                          setNotification({ message: 'Failed to delete address', type: 'error' });
                        }
                      }}
                      onSetDefault={async (addressId) => {
                        try {
                          const tokens = getStoredTokens();
                          if (!tokens?.accessToken) return;
                          await setDefaultCustomerAddress(tokens.accessToken, addressId);
                          const customerAddresses = await fetchCustomerAddresses(tokens.accessToken);
                          setAddresses(customerAddresses);
                          setNotification({ message: 'Default address updated', type: 'success' });
                        } catch (error) {
                          console.error('Failed to set default address:', error);
                          setNotification({ message: 'Failed to set default address', type: 'error' });
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16">
                  <p className="text-text-secondary text-xs uppercase tracking-wider mb-6">
                    No saved addresses
                  </p>
                  <button
                    onClick={() => {
                      setEditingAddress(undefined);
                      setShowAddressForm(true);
                    }}
                    className="bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-3 px-6 sm:px-8 transition-all shadow-neon hover:shadow-neon-lg inline-block"
                  >
                    Add Your First Address
                  </button>
                </div>
              )}
            </>
          )}

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest italic">
                    Account Information
                  </h3>
                </div>
              </div>

              <div className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                    First Name
                  </label>
                  <p className="text-xs text-text-primary font-medium">{customer?.firstName || 'N/A'}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                    Last Name
                  </label>
                  <p className="text-xs text-text-primary font-medium">{customer?.lastName || 'N/A'}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary italic">
                    Email
                  </label>
                  <p className="text-xs text-text-primary font-medium">{customer?.email || 'N/A'}</p>
                </div>

                <button
                  onClick={() => setShowEditProfile(true)}
                  className="mt-8 bg-neonRed hover:bg-neonRed/90 text-white font-black uppercase tracking-widest text-xs py-3 px-6 transition-all shadow-neon hover:shadow-neon-lg"
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={logout}
            className="w-full bg-bg-surface border border-border-color hover:border-neonRed/50 text-text-secondary hover:text-text-primary font-bold uppercase tracking-widest text-xs py-3 px-6 sm:px-8 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
