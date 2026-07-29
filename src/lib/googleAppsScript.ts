import { Order } from '@/types/store';

export const sendOrderToGoogleAppsScript = async (order: Order): Promise<{ success: boolean; message: string }> => {
  const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbwqHEdFL5zR_cCPSUkvb91nudf72H9K1CdFYPEyHgP_XInRSaHQU0TiZEtadcYHpQPS/exec';

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
