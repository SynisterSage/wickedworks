
import { useState, useEffect, useCallback } from 'react';
import { Variant, Product } from '../types';

export interface CartItem {
  variantGid: string;
  variant: Variant;
  productTitle: string;
  productHandle: string;
  productFeaturedImage: string;
  quantity: number;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ww_cart_payload');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ww_cart_payload', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((variant: Variant, product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.variantGid === variant.gid);
      if (existing) {
        return prev.map(item => 
          item.variantGid === variant.gid 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [
        ...prev, 
        { 
          variantGid: variant.gid, 
          variant, 
          productTitle: product.title,
          productHandle: product.handle,
          productFeaturedImage: product.featuredImage.url,
          quantity 
        }
      ];
    });
  }, []);

  const removeFromCart = useCallback((variantGid: string) => {
    setCartItems(prev => prev.filter(item => item.variantGid !== variantGid));
  }, []);

  const updateQuantity = useCallback((variantGid: string, quantity: number) => {
    setCartItems(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.variantGid !== variantGid);
      }
      return prev.map(item => 
        item.variantGid === variantGid 
          ? { ...item, quantity } 
          : item
      );
    });
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => 
    acc + (item.variant.price.amount * item.quantity), 0
  );

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cartItems,
    cartCount,
    totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkoutUrl: '/checkout' // Mock
  };
}