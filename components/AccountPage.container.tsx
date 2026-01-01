import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AccountPageView } from './AccountPage.view';
import { AccountSection, Order } from '../types';
import { MOCK_ORDERS } from '../constants';
import { useGeminiAssistant } from '../hooks/useGeminiAssistant';

// This would typically come from a Customer API hook
const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'operative_01@wicked.works',
  phone: '+1 (555) 012-3456',
};

// This would also come from a Customer API hook
const mockAddresses = [
  {
    id: '1',
    name: 'Home Base',
    street: '123 Stealth Way',
    suite: 'Suite 404',
    city: 'Neo Tokyo, NT 101-001',
    isDefault: true,
  }
];

const AccountPageContainer: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledOrderId = (location.state as any)?.orderId;
  
  const [activeSection, setActiveSection] = useState<AccountSection>(
    (section?.toUpperCase() as AccountSection) || 'DETAILS'
  );
  const [isChatActive, setIsChatActive] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState<any | undefined>(undefined);
  const [isSupportFormSubmitted, setIsSupportFormSubmitted] = useState(false);
  const [isSupportFormLoading, setIsSupportFormLoading] = useState(false);
  
  const { messages, sendMessage, isStreaming } = useGeminiAssistant();

  // This state would be managed by your data fetching library (e.g., Hydrogen's useQuery)
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [user, setUser] = useState(mockUser);
  const [addresses, setAddresses] = useState(mockAddresses);

  useEffect(() => {
    // If navigating from "Track Order" link, switch to Orders section
    if (prefilledOrderId) {
        setActiveSection('ORDERS');
    }
    setIsEditingAddress(false);
    if (activeSection !== 'SUPPORT') setIsChatActive(false);
  }, [activeSection, prefilledOrderId]);
  
  const handleSectionChange = (section: AccountSection) => {
    setActiveSection(section);
    setIsEditingAddress(false);
    if (section !== 'SUPPORT') setIsChatActive(false);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddressData(address);
    setIsEditingAddress(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddressData(undefined);
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    // Here you would call your Shopify `customerAddressUpdate` or `customerAddressCreate` mutation
    console.log('Saving address...', editingAddressData);
    setIsEditingAddress(false);
  };
  
  const handleInitiateReturn = (orderId: string) => {
    navigate('/returns', { state: { orderId } });
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSupportFormLoading(true);
    setTimeout(() => {
      setIsSupportFormLoading(false);
      setIsSupportFormSubmitted(true);
    }, 1500);
  };

  return (
    <AccountPageView
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      isChatActive={isChatActive}
      onToggleChat={() => setIsChatActive(!isChatActive)}
      isEditingAddress={isEditingAddress}
      editingAddressData={editingAddressData}
      onEditAddress={handleEditAddress}
      onAddNewAddress={handleAddNewAddress}
      onSaveAddress={handleSaveAddress}
      onCancelAddress={() => setIsEditingAddress(false)}
      onInitiateReturn={handleInitiateReturn}
      orders={orders}
      user={user}
      addresses={addresses}
      prefilledOrderId={prefilledOrderId}
      isSupportFormSubmitted={isSupportFormSubmitted}
      isSupportFormLoading={isSupportFormLoading}
      onSupportSubmit={handleSupportSubmit}
      onCloseSupportSuccess={() => setIsSupportFormSubmitted(false)}
      
      // AI Props
      aiMessages={messages}
      onSendMessage={sendMessage}
      isAiStreaming={isStreaming}
    />
  );
};

export default AccountPageContainer;