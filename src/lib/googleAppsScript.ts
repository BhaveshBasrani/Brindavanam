import { Order } from '@/types/store';

export const sendOrderToGoogleAppsScript = async (order: Order): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/gas-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error posting order to Google Apps Script proxy:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error during Google Apps Script dispatch',
    };
  }
};
