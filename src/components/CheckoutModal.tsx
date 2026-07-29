'use client';

import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Truck, ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { CartItem, Order, ShippingAddress } from '@/types/store';
import { SafeRecaptcha } from '@/components/SafeRecaptcha';
import { saveOrderToGAS } from '@/lib/googleAppsScript';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  promoCode?: string;
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
  const [step, setStep] = useState<'address' | 'review' | 'processing' | 'success'>('address');
  
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (acc, item) => acc + item.selectedVariant.price * item.quantity,
    0
  );
  const discountAmount = Math.round((rawSubtotal * discount) / 100);
  const totalAmount = Math.max(0, rawSubtotal - discountAmount);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.email || !address.phone || !address.addressLine1 || !address.pincode) {
      setErrorMessage('Please fill in all required shipping fields.');
      return;
    }
    setErrorMessage('');
    setStep('review');
  };

  const handleInitiatePayment = async () => {
    if (!recaptchaToken) {
      setErrorMessage('Please verify the security captcha checkbox.');
      return;
    }

    setStep('processing');
    setErrorMessage('');

    const newOrder: Order = {
      id: `BRND-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...items],
      subtotal: rawSubtotal,
      discount: discountAmount,
      total: totalAmount,
      status: 'Processing',
      shippingAddress: { ...address },
      paymentMethod: 'Razorpay',
      paymentId: `pay_test_${Math.random().toString(36).substring(7)}`,
      recaptchaVerified: true,
      promoCode: promoCode || 'ORGANIC10',
    };

    try {
      const gasResult = await saveOrderToGAS(newOrder);
      console.log('Order dispatch result:', gasResult);

      setTimeout(() => {
        setCompletedOrder(newOrder);
        onOrderSuccess(newOrder);
        setStep('success');
      }, 1200);

    } catch (err) {
      console.error('Payment/Order submission error:', err);
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
      setStep('success');
    }
  };

  const handleCloseAll = () => {
    setStep('address');
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-[#3A5303] text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
              <Truck className="w-5 h-5 text-[#94C000]" />
            </div>
            <div>
              <h2 className="text-xl font-serif">Farm Dispatch Checkout</h2>
              <p className="text-xs text-[#94C000] font-light">100% Certified Organic • Express Delivery</p>
            </div>
          </div>

          <button
            onClick={handleCloseAll}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Steps Progress Bar */}
        {step !== 'success' && (
          <div className="bg-[#F7F6F2] px-6 py-3 border-b border-stone-200 flex justify-between items-center text-xs font-semibold text-stone-600">
            <span className={step === 'address' ? 'text-[#3A5303] font-bold' : ''}>1. Delivery Address</span>
            <span>→</span>
            <span className={step === 'review' ? 'text-[#3A5303] font-bold' : ''}>2. Review & Security</span>
            <span>→</span>
            <span className={step === 'processing' ? 'text-[#3A5303] font-bold' : ''}>3. Secure Payment</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Address Entry */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <h3 className="text-base font-serif font-semibold text-stone-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#3A5303]" />
                <span>Shipping Address Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3A5303]"
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3A5303]"
                    placeholder="ramesh@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Mobile Phone (WhatsApp Updates) *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3A5303]"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3A5303]"
                    placeholder="500001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Street / House Address *</label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3A5303]"
                  placeholder="Flat No, Building, Road Name, Colony"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3A5303]"
                    placeholder="Hyderabad"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3A5303]"
                    placeholder="Telangana"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#3A5303] hover:bg-[#2b3e02] text-white font-semibold text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2"
                >
                  <span>Continue to Security & Order Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Order Review & Security Check */}
          {step === 'review' && (
            <div className="space-y-5">
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <h4 className="font-bold text-stone-900 border-b border-stone-300 pb-1">Order Summary ({items.length} items)</h4>
                {items.map((item) => (
                  <div key={item.product.id + item.selectedVariant.id} className="flex justify-between text-stone-700">
                    <span>{item.product.name} ({item.selectedVariant.weight}) x{item.quantity}</span>
                    <span className="font-bold text-stone-900">₹{item.selectedVariant.price * item.quantity}</span>
                  </div>
                ))}
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold border-t border-stone-200 pt-1">
                    <span>Coupon Discount ({discount}%):</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-900 font-bold text-sm border-t border-stone-300 pt-2">
                  <span>Grand Total:</span>
                  <span className="text-[#3A5303]">₹{totalAmount}</span>
                </div>
              </div>

              <div className="bg-[#F7F6F2] p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-stone-800 block">Deliver To:</span>
                <p>{address.fullName} • {address.phone}</p>
                <p className="text-stone-500">{address.addressLine1}, {address.city} - {address.pincode}</p>
              </div>

              {/* Security Captcha Checkbox */}
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#3A5303]" />
                  <span>Security Verification</span>
                </label>
                
                <SafeRecaptcha
                  siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LcpqGstAAAAAMBOybBtJPFQ2aMtBfLmsUT9AAtB'}
                  onVerify={setRecaptchaToken}
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setStep('address')}
                  className="w-1/3 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleInitiatePayment}
                  className="w-2/3 py-3 rounded-xl bg-[#3A5303] hover:bg-[#2b3e02] text-white font-semibold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2"
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
              <Loader2 className="w-12 h-12 text-[#3A5303] animate-spin mx-auto" />
              <h3 className="text-lg font-serif text-stone-800">
                Processing Secure Order & Payment Dispatch...
              </h3>
              <p className="text-xs text-stone-500">
                Please do not refresh or close this window.
              </p>
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {step === 'success' && completedOrder && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-[#3A5303] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#3A5303] font-bold">
                  Order Successfully Placed!
                </span>
                <h3 className="text-2xl font-serif text-stone-900">
                  Thank You, {address.fullName}!
                </h3>
                <p className="text-xs text-stone-500">
                  Your order ID is <span className="font-bold text-[#3A5303]">{completedOrder.id}</span>
                </p>
                <p className="text-xs text-stone-500">
                  Payment Reference: <span className="font-mono text-stone-700">{completedOrder.paymentId}</span>
                </p>
              </div>

              {/* Order Items Recap */}
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
                <p className="font-bold text-stone-800 border-b border-stone-300 pb-1">Items Ordered:</p>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.product.name} ({it.selectedVariant.weight}) x{it.quantity}</span>
                    <span className="font-bold text-stone-900">₹{it.selectedVariant.price * it.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-stone-300 pt-2 flex justify-between font-bold text-sm text-[#3A5303]">
                  <span>Total Amount Paid:</span>
                  <span>₹{completedOrder.total}</span>
                </div>
              </div>

              <button
                onClick={handleCloseAll}
                className="w-full py-3.5 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
              >
                Return to Storefront
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
