import { useState, useEffect, useCallback } from 'react';
import { Variant, Product } from '../types';
import { shopifyFetch, extractNodes } from '../lib/shopify/client';
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_QUERY,
} from '../lib/shopify/queries';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export interface CartItem {
  variantGid: string;
  lineId?: string; // Shopify cart line ID
  variant: Variant;
  productTitle: string;
  productHandle: string;
  productFeaturedImage: string;
  quantity: number;
}

interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          product: {
            id: string;
            title: string;
            handle: string;
            featuredImage?: {
              url: string;
              altText?: string;
            };
          };
          image?: {
            url: string;
            altText?: string;
          };
        };
      };
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ww_cart_payload');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartId, setCartId] = useState<string | null>(() => {
    return localStorage.getItem('ww_shopify_cart_id');
  });

  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync cart items to localStorage
  useEffect(() => {
    localStorage.setItem('ww_cart_payload', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync cart ID to localStorage
  useEffect(() => {
    if (cartId) {
      localStorage.setItem('ww_shopify_cart_id', cartId);
    } else {
      localStorage.removeItem('ww_shopify_cart_id');
    }
  }, [cartId]);

  // Create Shopify cart if items exist but no cartId (on page reload)
  useEffect(() => {
    if (!USE_MOCKS && cartItems.length > 0 && !cartId && !isLoading) {
      const createCartFromExisting = async () => {
        try {
          setIsLoading(true);
          const lines = cartItems.map((item) => ({
            merchandiseId: item.variantGid,
            quantity: item.quantity,
          }));

          const response = await shopifyFetch<any>({
            query: CART_CREATE_MUTATION,
            variables: { input: { lines } },
          });

          const result = response.data?.cartCreate;
          if (result?.cart) {
            setCartId(result.cart.id);
            setCheckoutUrl(result.cart.checkoutUrl);
          }
        } catch (err) {
          console.error('[useCart] Failed to recreate cart:', err);
        } finally {
          setIsLoading(false);
        }
      };

      createCartFromExisting();
    }
  }, [cartItems, cartId, isLoading]);

  // Map Shopify cart response to local cart items
  const mapShopifyCartToItems = (cart: ShopifyCart): CartItem[] => {
    return extractNodes(cart.lines).map((line) => ({
      variantGid: line.merchandise.id,
      lineId: line.id,
      variant: {
        gid: line.merchandise.id,
        title: line.merchandise.title,
        price: {
          amount: parseFloat(line.merchandise.price.amount),
          currencyCode: line.merchandise.price.currencyCode,
        },
        available: true,
        selectedOptions: [],
        image: line.merchandise.image
          ? {
              url: line.merchandise.image.url,
              altText: line.merchandise.image.altText || '',
              width: 0,
              height: 0,
            }
          : undefined,
      },
      productTitle: line.merchandise.product.title,
      productHandle: line.merchandise.product.handle,
      productFeaturedImage:
        line.merchandise.product.featuredImage?.url ||
        line.merchandise.image?.url ||
        '',
      quantity: line.quantity,
    }));
  };

  // Create or update Shopify cart
  const syncWithShopify = useCallback(
    async (
      action: 'create' | 'add' | 'update' | 'remove',
      payload: any
    ): Promise<ShopifyCart | null> => {
      try {
        setIsLoading(true);

        let mutation = '';
        let variables: any = {};

        switch (action) {
          case 'create':
            mutation = CART_CREATE_MUTATION;
            variables = { input: payload };
            break;
          case 'add':
            mutation = CART_LINES_ADD_MUTATION;
            variables = { cartId, lines: payload };
            break;
          case 'update':
            mutation = CART_LINES_UPDATE_MUTATION;
            variables = { cartId, lines: payload };
            break;
          case 'remove':
            mutation = CART_LINES_REMOVE_MUTATION;
            variables = { cartId, lineIds: payload };
            break;
        }

        const response = await shopifyFetch<any>({
          query: mutation,
          variables,
        });

        const mutationKey = Object.keys(response.data || {})[0];
        const result = response.data?.[mutationKey];

        if (result?.userErrors?.length > 0) {
          console.error('[useCart] Shopify errors:', result.userErrors);
          return null;
        }

        const cart = result?.cart;
        if (cart) {
          setCartId(cart.id);
          setCheckoutUrl(cart.checkoutUrl);
          const items = mapShopifyCartToItems(cart);
          setCartItems(items);
          return cart;
        }

        return null;
      } catch (err) {
        console.error('[useCart] Sync error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [cartId]
  );

  const addToCart = useCallback(
    async (variant: Variant, product: Product, quantity: number = 1) => {
      if (USE_MOCKS) {
        // Mock mode - local state only
        setCartItems((prev) => {
          const existing = prev.find((item) => item.variantGid === variant.gid);
          if (existing) {
            return prev.map((item) =>
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
              quantity,
            },
          ];
        });
        return;
      }

      // Shopify mode
      const line = {
        merchandiseId: variant.gid,
        quantity,
      };

      if (!cartId) {
        // Create new cart
        await syncWithShopify('create', {
          lines: [line],
        });
      } else {
        // Add to existing cart
        await syncWithShopify('add', [line]);
      }
    },
    [cartId, syncWithShopify]
  );

  const removeFromCart = useCallback(
    async (variantGid: string) => {
      if (USE_MOCKS) {
        setCartItems((prev) => prev.filter((item) => item.variantGid !== variantGid));
        return;
      }

      // Shopify mode - need lineId
      const item = cartItems.find((i) => i.variantGid === variantGid);
      if (item?.lineId && cartId) {
        await syncWithShopify('remove', [item.lineId]);
      }
    },
    [cartId, cartItems, syncWithShopify]
  );

  const updateQuantity = useCallback(
    async (variantGid: string, quantity: number) => {
      if (USE_MOCKS) {
        setCartItems((prev) => {
          if (quantity <= 0) {
            return prev.filter((item) => item.variantGid !== variantGid);
          }
          return prev.map((item) =>
            item.variantGid === variantGid ? { ...item, quantity } : item
          );
        });
        return;
      }

      // Shopify mode
      const item = cartItems.find((i) => i.variantGid === variantGid);
      if (!item?.lineId || !cartId) return;

      if (quantity <= 0) {
        await syncWithShopify('remove', [item.lineId]);
      } else {
        await syncWithShopify('update', [
          {
            id: item.lineId,
            quantity,
          },
        ]);
      }
    },
    [cartId, cartItems, syncWithShopify]
  );

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.variant.price.amount * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cartItems,
    cartCount,
    totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkoutUrl: checkoutUrl || '',
    isLoading,
  };
}
