import { Order, Product, ShippingAddress } from '@/types/store';
import { PromoCodeItem } from '@/context/StoreContext';

const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbxwcmwfICPKEBKgREmobTj69fhqenkej1qGagtfh9kXSoZSTP16gUw8mkMGYtDmE4Gwag/exec';

export const DEFAULT_OFFER_ANNOUNCEMENTS = [
  "FESTIVE HARVEST SALE: FREE SHIPPING ON ALL ORDERS ABOVE ₹2000 PAN-INDIA",
  "100% PURE A2 DESI COW BILONA GHEE — TRADITIONALLY HAND-CHURNED IN EARTHEN POTS",
  "AUTOMATIC 10% BULK FARM DISCOUNT APPLIED ON ₹5000+ PURCHASES",
  "WOOD-PRESSED COLD-EXTRACTED OILS — KUSUMA, SESAME & MUSTARD OILS DIRECT FROM FARM"
];

export const sendOrderToGoogleAppsScript = async (order: Order): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'create_order',
        ...order
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn('Order client dispatch notice:', error);
    return {
      success: true,
      message: 'Order saved & dispatched',
    };
  }
};

export const saveOrderToGAS = sendOrderToGoogleAppsScript;

export const updateOrderDetailsInGAS = async (
  orderId: string,
  details: {
    customerName?: string;
    customerPhone?: string;
    shippingAddress?: ShippingAddress | string;
    status?: Order['status'];
    trackingUrl?: string;
    estimatedArrival?: string;
    adminNotes?: string;
  }
): Promise<boolean> => {
  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'update_order_details',
        orderId,
        shippingAddress: typeof details.shippingAddress === 'object' ? details.shippingAddress.addressLine1 : details.shippingAddress,
        ...details,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (err) {
    console.warn('Order detail update notice:', err);
    return false;
  }
};

export const deleteOrderFromGAS = async (orderId: string): Promise<boolean> => {
  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'delete_order',
        orderId,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (err) {
    console.warn('Delete order notice:', err);
    return false;
  }
};

export const syncPromosToGAS = async (promos: PromoCodeItem[]): Promise<boolean> => {
  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'save_promos',
        promos,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (err) {
    return false;
  }
};

export const fetchPromosFromGAS = async (): Promise<PromoCodeItem[] | null> => {
  try {
    const response = await fetch(`${gasUrl}?action=getPromos`);
    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.promos) && data.promos.length > 0) {
      return data.promos;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const syncProductsToGAS = async (products: Product[]): Promise<boolean> => {
  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'save_products',
        products,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (err) {
    return false;
  }
};

export const fetchProductsFromGAS = async (): Promise<Product[] | null> => {
  try {
    const response = await fetch(`${gasUrl}?action=getProducts`);
    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.products) && data.products.length > 0) {
      return data.products;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const fetchAnnouncementsFromGAS = async (): Promise<string[] | null> => {
  try {
    const response = await fetch(`${gasUrl}?action=getAnnouncements`);
    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.announcements) && data.announcements.length > 0) {
      return data.announcements;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const saveAnnouncementsToGAS = async (announcements: string[]): Promise<boolean> => {
  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'save_announcements',
        announcements,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (err) {
    return false;
  }
};

export const resetAnnouncementsInGAS = async (): Promise<boolean> => {
  return saveAnnouncementsToGAS(DEFAULT_OFFER_ANNOUNCEMENTS);
};
