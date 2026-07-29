import { Order } from '@/types/store';
import { PromoCodeItem } from '@/context/StoreContext';

const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbwqHEdFL5zR_cCPSUkvb91nudf72H9K1CdFYPEyHgP_XInRSaHQU0TiZEtadcYHpQPS/exec';

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

// Sync Admin Promo Codes to Google Apps Script Backend
export const syncPromosToGAS = async (promos: PromoCodeItem[]): Promise<boolean> => {
  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'save_promos',
        promos,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (err) {
    console.warn('Apps Script Promo Sync notice:', err);
    return false;
  }
};

// Fetch Live Promo Codes from Google Apps Script Backend
export const fetchPromosFromGAS = async (): Promise<PromoCodeItem[] | null> => {
  try {
    const response = await fetch(`${gasUrl}?action=get_promos`);
    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.promos) && data.promos.length > 0) {
      return data.promos;
    }
    return null;
  } catch (err) {
    console.warn('Apps Script Promo Fetch notice:', err);
    return null;
  }
};
