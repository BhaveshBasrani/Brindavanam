'use client';

import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, CreditCard, Truck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CartItem, Order, ShippingAddress } from '@/types/store';
import { processRazorpayPayment } from '@/lib/razorpay';
import { sendOrderToGoogleAppsScript } from '@/lib/googleAppsScript';
import { useAuth } from '@/context/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  promoCode: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discount,
  promoCode,
  onOrderSuccess,
}) => {
  const { user } = useAuth();

  const [step, setStep] = useState<'shipping' | 'recaptcha' | 'processing' | 'success'>('shipping');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.displayName,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, i) => sum + i.selectedVariant.price * i.quantity, 0);
  const deliveryFee = subtotal >= 999 || items.length === 0 ? 0 : 70;
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.email || !address.phone || !address.addressLine1 || !address.pincode) {
      setErrorMsg('Please fill in all required shipping fields.');
      return;
    }
    setErrorMsg('');
    setStep('recaptcha');
  };

  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
    setRecaptchaError('');
  };

  const handleInitiatePayment = async () => {
    // In test/demo environment or when recaptcha key is fallback, token check passes smoothly
    if (!recaptchaToken && !siteKey.includes('6LeIxAc')) {
      setRecaptchaError('Please verify the reCAPTCHA security checkbox.');
      return;
    }

    setStep('processing');
    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      // Step 1: Process Razorpay Checkout
      const paymentId = await processRazorpayPayment({
        amountInINR: totalAmount,
        orderId,
        customerName: address.fullName,
        customerEmail: address.email,
        customerPhone: address.phone,
        onSuccess: async (payId) => {
          // Create final Order Payload
          const newOrder: Order = {
            id: orderId,
            date: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            items,
            shippingAddress: address,
            subtotal,
            discount,
            deliveryFee,
            total: totalAmount,
            paymentMethod: 'Razorpay',
            paymentId: payId,
            status: 'Processing',
          };

          // Step 2: Record Order into Google Apps Script Spreadsheet
          await sendOrderToGoogleAppsScript(newOrder);

          setCompletedOrder(newOrder);
          onOrderSuccess(newOrder);
          setStep('success');

          // Trigger Confetti fireworks!
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore fallback
          }
        },
        onDismiss: () => {
          setStep('shipping');
          setErrorMsg('Payment was cancelled or closed.');
        },
      });

      if (paymentId && typeof paymentId === 'string') {
        // Mock fallback resolution caught in handler above
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setStep('shipping');
      setErrorMsg('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 my-8 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-[#4B6B03] text-white p-6 flex justify-between items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#9EBEED] font-semibold">
              Brindavanam Checkout
            </span>
            <h2 className="text-xl font-bold font-serif">Secure Organic Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Shipping Address Form */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider font-serif border-b border-stone-200 pb-2">
                1. Delivery Address & Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl bg-[#F3F6F3]"
                    placeholder="e.g. Bhavesh Basrani"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl bg-[#F3F6F3]"
                    placeholder="e.g. bhavesh@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl bg-[#F3F6F3]"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl bg-[#F3F6F3]"
                    placeholder="e.g. 400001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl bg-[#F3F6F3]"
                  placeholder="House / Flat No., Building Name, Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl bg-[#F3F6F3]"
                    placeholder="e.g. Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl bg-[#F3F6F3]"
                  />
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="bg-[#F3F6F3] p-4 rounded-2xl border border-stone-200 mt-4 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span>Items ({items.length})</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({promoCode})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-300">
                  <span>Total Payable</span>
                  <span className="text-[#4B6B03] font-serif">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#4B6B03] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#385002]"
              >
                Continue to Security Verification
              </button>
            </form>
          )}

          {/* STEP 2: Google reCAPTCHA Verification */}
          {step === 'recaptcha' && (
            <div className="space-y-6 text-center py-4">
              <div className="space-y-2">
                <ShieldCheck className="w-12 h-12 text-[#4E90F5] mx-auto" />
                <h3 className="text-lg font-bold font-serif text-stone-900">
                  Google reCAPTCHA Security Defense
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Please complete the quick reCAPTCHA security verification to protect your transaction against automated bots.
                </p>
              </div>

              {/* reCAPTCHA Widget Box */}
              <div className="flex flex-col items-center justify-center my-4">
                <ReCAPTCHA
                  sitekey={siteKey}
                  onChange={handleRecaptchaVerify}
                />
                {recaptchaError && (
                  <p className="text-xs text-red-600 mt-2">{recaptchaError}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setStep('shipping')}
                  className="w-1/3 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100"
                >
                  Back
                </button>

                <button
                  onClick={handleInitiatePayment}
                  className="w-2/3 py-3 rounded-xl bg-[#4B6B03] hover:bg-[#385002] text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-4 h-4 text-[#94C000]" />
                  <span>Pay ₹{totalAmount} via Razorpay</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing Loader */}
          {step === 'processing' && (
            <div className="text-center py-16 space-y-4">
              <Loader2 className="w-12 h-12 text-[#4B6B03] animate-spin mx-auto" />
              <h3 className="text-lg font-bold font-serif text-stone-800">
                Processing Razorpay & Syncing Google Apps Script...
              </h3>
              <p className="text-xs text-stone-500">
                Please do not refresh or close this window.
              </p>
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {step === 'success' && completedOrder && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-[#4B6B03] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#94C000] font-bold">
                  Order Successfully Placed!
                </span>
                <h3 className="text-2xl font-bold font-serif text-stone-900">
                  Thank You, {address.fullName}!
                </h3>
                <p className="text-xs text-stone-500">
                  Your order ID is <span className="font-bold text-[#4B6B03]">{completedOrder.id}</span>
                </p>
                <p className="text-xs text-stone-500">
                  Recorded in Google Apps Script Backend & Payment Ref: <span className="font-mono text-stone-700">{completedOrder.paymentId}</span>
                </p>
              </div>

              {/* Order Items Recap */}
              <div className="bg-[#F3F6F3] p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
                <p className="font-bold text-stone-800 border-b border-stone-300 pb-1">Items Ordered:</p>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.product.name} ({it.selectedVariant.weight}) x{it.quantity}</span>
                    <span className="font-bold">₹{it.selectedVariant.price * it.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-stone-300 flex justify-between font-bold text-stone-900 text-sm">
                  <span>Total Paid:</span>
                  <span className="text-[#4B6B03]">₹{completedOrder.total}</span>
                </div>
              </div>

              <div className="flex justify-center space-x-2 text-xs text-stone-600">
                <Truck className="w-4 h-4 text-[#4E90F5]" />
                <span>Estimated Dispatch: Within 24 Hours via Express Courier</span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#4B6B03] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#385002]"
              >
                Back to Farm Shop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
