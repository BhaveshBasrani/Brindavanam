'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Order } from '@/types/store';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import { 
  syncPromosToGAS, fetchPromosFromGAS, 
  syncProductsToGAS, fetchProductsFromGAS, 
  updateOrderDetailsInGAS, deleteOrderFromGAS,
  fetchAnnouncementsFromGAS, saveAnnouncementsToGAS, resetAnnouncementsInGAS,
  DEFAULT_OFFER_ANNOUNCEMENTS
} from '@/lib/googleAppsScript';

export interface PromoCodeItem {
  code: string;
  discountPercent: number;
  active: boolean;
  description: string;
}

interface StoreContextType {
  products: Product[];
  cartItems: CartItem[];
  userOrders: Order[];
  promoCodes: PromoCodeItem[];
  announcements: string[];
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
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addAnnouncement: (text: string) => void;
  deleteAnnouncement: (index: number) => void;
  updateAnnouncements: (list: string[]) => void;
  resetAnnouncements: () => void;
  updateOrderDetails: (orderId: string, details: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  triggerCheckout: (discount: number, promo: string) => void;
  onOrderSuccess: (order: Order) => void;
  refreshPromosFromGAS: () => Promise<void>;
  refreshProductsFromGAS: () => Promise<void>;
  refreshAnnouncementsFromGAS: () => Promise<void>;
}

const DEFAULT_PROMOS: PromoCodeItem[] = [
  { code: 'ORGANIC10', discountPercent: 10, active: true, description: '10% Discount on Produce' },
  { code: 'BRINDAVANAM20', discountPercent: 20, active: true, description: '20% Farm Harvest Special' },
  { code: 'FREESHIP', discountPercent: 15, active: true, description: '15% Express Shipping Coupon' },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>(DEFAULT_PROMOS);
  const [announcements, setAnnouncements] = useState<string[]>(DEFAULT_OFFER_ANNOUNCEMENTS);

  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync state with LocalStorage on Client Mount
  useEffect(() => {
    try {
      const localCart = localStorage.getItem('brindavanam_cart');
      if (localCart) setCartItems(JSON.parse(localCart));

      const localOrders = localStorage.getItem('brindavanam_orders');
      if (localOrders) setUserOrders(JSON.parse(localOrders));

      const localPromos = localStorage.getItem('brindavanam_promos');
      if (localPromos) setPromoCodes(JSON.parse(localPromos));

      const localProducts = localStorage.getItem('brindavanam_products');
      if (localProducts) setProducts(JSON.parse(localProducts));

      const localAnnouncements = localStorage.getItem('brindavanam_announcements');
      if (localAnnouncements) setAnnouncements(JSON.parse(localAnnouncements));
    } catch (err) {
      console.warn('LocalStorage hydration error:', err);
    }
  }, []);

  // Sync to GAS on Mount
  useEffect(() => {
    refreshPromosFromGAS();
    refreshProductsFromGAS();
    refreshAnnouncementsFromGAS();
  }, []);

  const refreshPromosFromGAS = async () => {
    const remotePromos = await fetchPromosFromGAS();
    if (remotePromos && remotePromos.length > 0) {
      setPromoCodes(remotePromos);
      localStorage.setItem('brindavanam_promos', JSON.stringify(remotePromos));
    }
  };

  const refreshProductsFromGAS = async () => {
    const remoteProducts = await fetchProductsFromGAS();
    if (remoteProducts && remoteProducts.length > 0) {
      setProducts(remoteProducts);
      localStorage.setItem('brindavanam_products', JSON.stringify(remoteProducts));
    }
  };

  const refreshAnnouncementsFromGAS = async () => {
    const remoteAnnouncements = await fetchAnnouncementsFromGAS();
    if (remoteAnnouncements && remoteAnnouncements.length > 0) {
      setAnnouncements(remoteAnnouncements);
      localStorage.setItem('brindavanam_announcements', JSON.stringify(remoteAnnouncements));
    }
  };

  // Cart operations
  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant.id === variant.id
      );

      let updated: CartItem[];
      if (existingIdx > -1) {
        updated = [...prev];
        updated[existingIdx].quantity += quantity;
      } else {
        updated = [...prev, { product, selectedVariant: variant, quantity }];
      }

      localStorage.setItem('brindavanam_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (index: number, newQty: number) => {
    setCartItems((prev) => {
      let updated: CartItem[];
      if (newQty <= 0) {
        updated = prev.filter((_, i) => i !== index);
      } else {
        updated = [...prev];
        updated[index].quantity = newQty;
      }
      localStorage.setItem('brindavanam_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeCartItem = (index: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('brindavanam_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const applyPromoCode = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === cleanCode && p.active);

    if (!found) {
      return { success: false, discountAmount: 0, message: 'Invalid or expired promo code.' };
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.selectedVariant.price * item.quantity,
      0
    );

    const discountAmount = Math.round((subtotal * found.discountPercent) / 100);
    setAppliedDiscount(discountAmount);
    setAppliedPromoCode(found.code);

    return {
      success: true,
      discountAmount,
      message: `Coupon '${found.code}' applied successfully! Saved ₹${discountAmount}.`,
    };
  };

  const addPromoCode = (code: string, discountPercent: number, description: string) => {
    const newPromo: PromoCodeItem = {
      code: code.trim().toUpperCase(),
      discountPercent,
      active: true,
      description,
    };
    setPromoCodes((prev) => {
      const updated = [...prev.filter((p) => p.code !== newPromo.code), newPromo];
      localStorage.setItem('brindavanam_promos', JSON.stringify(updated));
      syncPromosToGAS(updated);
      return updated;
    });
  };

  const togglePromoCode = (code: string) => {
    setPromoCodes((prev) => {
      const updated = prev.map((p) => (p.code === code ? { ...p, active: !p.active } : p));
      localStorage.setItem('brindavanam_promos', JSON.stringify(updated));
      syncPromosToGAS(updated);
      return updated;
    });
  };

  const deletePromoCode = (code: string) => {
    setPromoCodes((prev) => {
      const updated = prev.filter((p) => p.code !== code);
      localStorage.setItem('brindavanam_promos', JSON.stringify(updated));
      syncPromosToGAS(updated);
      return updated;
    });
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => {
      const updated = [product, ...prev];
      localStorage.setItem('brindavanam_products', JSON.stringify(updated));
      syncProductsToGAS(updated);
      return updated;
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      localStorage.setItem('brindavanam_products', JSON.stringify(updated));
      syncProductsToGAS(updated);
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      localStorage.setItem('brindavanam_products', JSON.stringify(updated));
      syncProductsToGAS(updated);
      return updated;
    });
  };

  const addAnnouncement = (text: string) => {
    if (!text.trim()) return;
    setAnnouncements((prev) => {
      const updated = [text.trim(), ...prev];
      localStorage.setItem('brindavanam_announcements', JSON.stringify(updated));
      saveAnnouncementsToGAS(updated);
      return updated;
    });
  };

  const deleteAnnouncement = (index: number) => {
    setAnnouncements((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const final = updated.length > 0 ? updated : DEFAULT_OFFER_ANNOUNCEMENTS;
      localStorage.setItem('brindavanam_announcements', JSON.stringify(final));
      saveAnnouncementsToGAS(final);
      return final;
    });
  };

  const updateAnnouncements = (list: string[]) => {
    setAnnouncements(list);
    localStorage.setItem('brindavanam_announcements', JSON.stringify(list));
    saveAnnouncementsToGAS(list);
  };

  const resetAnnouncements = () => {
    setAnnouncements(DEFAULT_OFFER_ANNOUNCEMENTS);
    localStorage.setItem('brindavanam_announcements', JSON.stringify(DEFAULT_OFFER_ANNOUNCEMENTS));
    resetAnnouncementsInGAS();
  };

  const updateOrderDetails = async (orderId: string, details: Partial<Order>) => {
    setUserOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, ...details } : o));
      localStorage.setItem('brindavanam_orders', JSON.stringify(updated));
      return updated;
    });
    await updateOrderDetailsInGAS(orderId, details as any);
  };

  const deleteOrder = async (orderId: string) => {
    setUserOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      localStorage.setItem('brindavanam_orders', JSON.stringify(updated));
      return updated;
    });
    await deleteOrderFromGAS(orderId);
  };

  const triggerCheckout = (discount: number, promo: string) => {
    setAppliedDiscount(discount);
    setAppliedPromoCode(promo);
    setIsCheckoutOpen(true);
  };

  const onOrderSuccess = (order: Order) => {
    setUserOrders((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem('brindavanam_orders', JSON.stringify(updated));
      return updated;
    });
    setCartItems([]);
    localStorage.removeItem('brindavanam_cart');
    setAppliedDiscount(0);
    setAppliedPromoCode('');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cartItems,
        userOrders,
        promoCodes,
        announcements,
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
        addProduct,
        updateProduct,
        deleteProduct,
        addAnnouncement,
        deleteAnnouncement,
        updateAnnouncements,
        resetAnnouncements,
        updateOrderDetails,
        deleteOrder,
        triggerCheckout,
        onOrderSuccess,
        refreshPromosFromGAS,
        refreshProductsFromGAS,
        refreshAnnouncementsFromGAS,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
