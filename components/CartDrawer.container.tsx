
import React from 'react';
import { CartDrawerView } from './CartDrawer.view';
import { CartItem } from '../hooks/useCart';

interface CartDrawerContainerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onRemoveItem: (gid: string) => void;
  onUpdateQuantity: (gid: string, quantity: number) => void;
  checkoutUrl: string;
}

const CartDrawerContainer: React.FC<CartDrawerContainerProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  totalAmount, 
  onRemoveItem, 
  onUpdateQuantity,
  checkoutUrl
}) => {
  return (
    <CartDrawerView 
      isOpen={isOpen}
      onClose={onClose}
      cartItems={cartItems}
      totalAmount={totalAmount}
      onRemoveItem={onRemoveItem}
      onUpdateQuantity={onUpdateQuantity}
      checkoutUrl={checkoutUrl}
    />
  );
};

export default CartDrawerContainer;