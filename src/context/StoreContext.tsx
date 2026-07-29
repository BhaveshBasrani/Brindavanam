'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Order } from '@/types/store';
import { syncPromosToGAS, fetchPromosFromGAS } from '@/lib/googleAppsScript';

export interface PromoCodeItem {
  code: string;
  discountPercent: number;
  active: boolean;
  description: string;
}

interface StoreContextType {
  cartItems: CartItem[];
  userOrders: Order[];
  promoCodes: PromoCodeItem[];
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
  applyPromoCode: (code: string) => Promise<{ success: boolean; discountAmount: number; message: string }>;
  addPromoCode: (code: string, discountPercent: number, description: string) => void;
  togglePromoCode: (code: string) => void;
  deletePromoCode: (code: string) => void;
  triggerCheckout: (discount: number, promo: string) => void;
  onOrderSuccess: (order: Order) => void;
  refreshPromosFromGAS: () => Promise<void>;
}

const DEFAULT_PROMOS: PromoCodeItem[] = [
  { code: 'ORGANIC10', discountPercent: 10, active: true, description: '10% Discount on Produce' },
  { code: 'BRINDAVANAM20', discountPercent: 20, active: true, description: '20% Farm Harvest Special' },
  { code: 'FREESHIP', discountPercent: 15, active: true, description: '15% Express Shipping Coupon' },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>(DEFAULT_PROMOS);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Function to refresh promo codes live from Google Apps Script
  const refreshPromosFromGAS = async () => {
    const remotePromos = await fetchPromosFromGAS();
    if (remotePromos && remotePromos.length > 0) {
      setPromoCodes(remotePromos);
      try {
        localStorage.setItem('brindavanam_promos', JSON.stringify(remotePromos));
      } catch (e) {
        console.warn('localStorage promo cache error:', e);
      }
    }
  };

  // Load saved cart, orders & promo codes from localStorage and Apps Script on initial mount
  useEffect(() => {
    const loadInitialData = async () => {
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
        const savedPromos = localStorage.getItem('brindavanam_promos');
        if (savedPromos) {
          const parsedPromos = JSON.parse(savedPromos);
          if (Array.isArray(parsedPromos) && parsedPromos.length > 0) {
            setPromoCodes(parsedPromos);
          }
        }

        // Fetch live promo codes from Google Apps Script backend
        await refreshPromosFromGAS();

      } catch (e) {
        console.warn('Store Context load error:', e);
      } font-serif finally {
        setIsLoaded(true);
      }
    };

    loadInitialData();
  }, []);

  // Sync cart changes to localStorage
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

  // Dynamic promo code evaluation against Apps Script and local state
  const applyPromoCode = async (code: string) => {
    const rawSubtotal = cartItems.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);
    const cleanCode = code.trim().toUpperCase();
    
    // Fetch latest live promo codes from Google Apps Script before applying
    const remotePromos = await fetchPromosFromGAS();
    const activePromosList = (remotePromos && remotePromos.length > 0) ? remotePromos : promoCodes;
    
    if (remotePromos && remotePromos.length > 0) {
      setPromoCodes(remotePromos);
    }

    const matched = activePromosList.find((p) => p.code.toUpperCase() === cleanCode);

    if (!matched) {
      return { success: false, discountAmount: 0, message: 'Invalid promo coupon code.' };
    }

    if (!matched.active) {
      return { success: false, discountAmount: 0, message: 'This coupon code has expired or is disabled.' };
    }

    const discount = Math.round((rawSubtotal * matched.discountPercent) / 100);
    setAppliedDiscount(discount);
    setAppliedPromoCode(matched.code);
    return {
      success: true,
      discountAmount: discount,
      message: `${matched.discountPercent}% discount applied! (${matched.description})`,
    };
  };

  const addPromoCode = (code: string, discountPercent: number, description: string) => {
    const clean = code.trim().toUpperCase().replace(/\s+/g, '');
    if (!clean) return;
    const newItem: PromoCodeItem = {
      code: clean,
      discountPercent,
      active: true,
      description: description || `${discountPercent}% Storewide Coupon`,
    };

    const updated = [...promoCodes.filter((p) => p.code !== clean), newItem];
    setPromoCodes(updated);
    
    try {
      localStorage.setItem('brindavanam_promos', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sync to Google Apps Script Backend
    syncPromosToGAS(updated);
  };

  const togglePromoCode = (code: string) => {
    const updated = promoCodes.map((p) => (p.code === code ? { ...p, active: !p.active } : p));
    setPromoCodes(updated);

    try {
      localStorage.setItem('brindavanam_promos', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sync to Google Apps Script Backend
    syncPromosToGAS(updated);
  };

  const deletePromoCode = (code: string) => {
    const updated = promoCodes.filter((p) => p.code !== code);
    setPromoCodes(updated);

    try {
      localStorage.setItem('brindavanam_promos', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sync to Google Apps Script Backend
    syncPromosToGAS(updated);
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
        promoCodes,
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
        addPromoCode,
        togglePromoCode,
        deletePromoCode,
        triggerCheckout,
        onOrderSuccess,
        refreshPromosFromGAS,
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
