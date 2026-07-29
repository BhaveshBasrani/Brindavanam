'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Order } from '@/types/store';

interface StoreContextType {
  cartItems: CartItem[];
  userOrders: Order[];
  appliedDiscount: number;
  appliedPromoCode: string;
  isCheckoutOpen: boolean;
  isAuthOpen: boolean;
  isOrdersOpen: boolean;
  isAdminOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAuthOpen: (open: boolean) => void;
  setIsOrdersOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  updateQuantity: (index: number, newQty: number) => void;
  removeCartItem: (index: number) => void;
  applyPromoCode: (code: string) => { success: boolean; discountAmount: number; message: string };
  triggerCheckout: (discount: number, promo: string) => void;
  onOrderSuccess: (order: Order) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load saved cart from localStorage on initial client mount FIRST
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('brindavanam_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
        }
      }
      const savedOrders = localStorage.getItem('brindavanam_orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders)) {
          setUserOrders(parsedOrders);
        }
      }
    } catch (e) {
      console.warn('Store Context localStorage load error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync cart changes to localStorage ONLY after initial load completes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('brindavanam_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Store Context localStorage save error:', e);
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant.id === variant.id
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, selectedVariant: variant, quantity }];
    });
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const removeCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const applyPromoCode = (code: string) => {
    const rawSubtotal = cartItems.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'ORGANIC10') {
      const discount = Math.round((rawSubtotal * 10) / 100);
      setAppliedDiscount(discount);
      setAppliedPromoCode('ORGANIC10');
      return { success: true, discountAmount: discount, message: '10% discount applied!' };
    } else if (cleanCode === 'BRINDAVANAM20') {
      const discount = Math.round((rawSubtotal * 20) / 100);
      setAppliedDiscount(discount);
      setAppliedPromoCode('BRINDAVANAM20');
      return { success: true, discountAmount: discount, message: '20% discount applied!' };
    }
    return { success: false, discountAmount: 0, message: 'Invalid promo code. Try ORGANIC10' };
  };

  const triggerCheckout = (discount: number, promo: string) => {
    setAppliedDiscount(discount);
    setAppliedPromoCode(promo);
    setIsCheckoutOpen(true);
  };

  const onOrderSuccess = (newOrder: Order) => {
    setUserOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('brindavanam_orders', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setCartItems([]);
    setAppliedDiscount(0);
    setAppliedPromoCode('');
  };

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        userOrders,
        appliedDiscount,
        appliedPromoCode,
        isCheckoutOpen,
        isAuthOpen,
        isOrdersOpen,
        isAdminOpen,
        setIsCheckoutOpen,
        setIsAuthOpen,
        setIsOrdersOpen,
        setIsAdminOpen,
        addToCart,
        updateQuantity,
        removeCartItem,
        applyPromoCode,
        triggerCheckout,
        onOrderSuccess,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
