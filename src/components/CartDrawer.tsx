'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '@/types/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (appliedDiscount: number, promoCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.selectedVariant.price * item.quantity,
    0
  );

  const handleApplyPromo = () => {
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'ORGANIC10') {
      setAppliedCode('ORGANIC10');
      setDiscountPercent(10);
    } else if (promoCode.trim().toUpperCase() === 'BRINDAVANAM20') {
      setAppliedCode('BRINDAVANAM20');
      setDiscountPercent(20);
    } else {
      setPromoError('Invalid coupon code. Try ORGANIC10');
    }
  };

  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const freeShippingThreshold = 999;
  const deliveryFee = rawSubtotal >= freeShippingThreshold || items.length === 0 ? 0 : 70;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount + deliveryFee);
  const progressToFreeShipping = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-200 bg-[#F3F6F3]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#4B6B03] text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold font-serif text-stone-900">Your Organic Cart</h2>
                <span className="bg-[#94C000] text-[#1c260b] text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.length} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="mt-4 bg-white p-3 rounded-xl border border-stone-200 text-xs">
              {rawSubtotal >= freeShippingThreshold ? (
                <p className="text-emerald-700 font-bold flex items-center">
                  <Truck className="w-4 h-4 mr-1.5 text-[#4B6B03]" /> 🎉 Congratulations! You qualify for Free Delivery
                </p>
              ) : (
                <p className="text-stone-600 font-medium">
                  Add <span className="font-bold text-[#4B6B03]">₹{freeShippingThreshold - rawSubtotal}</span> more for <span className="font-bold text-emerald-700">FREE Shipping</span>
                </p>
              )}
              <div className="w-full bg-stone-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#94C000] to-[#4B6B03] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#F3F6F3] rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-700 font-serif">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Add some farm-fresh A2 Desi Ghee or Wood-Pressed Oils to get started!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 bg-[#4B6B03] text-white font-bold text-xs rounded-full shadow-md hover:bg-[#385002]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-4 p-3 bg-[#F3F6F3] rounded-2xl border border-stone-200"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-300 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold font-serif text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">{item.selectedVariant.weight}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-[#4B6B03]">
                        ₹{item.selectedVariant.price * item.quantity}
                      </span>
                      
                      {/* Quantity Incrementor */}
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Controls */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              {/* Promo Code Input */}
              <div>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. ORGANIC10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl uppercase bg-white focus:outline-none focus:ring-1 focus:ring-[#4B6B03]"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-[#4B6B03] text-white text-xs font-bold rounded-xl hover:bg-[#385002]"
                  >
                    Apply
                  </button>
                </div>
                {appliedCode && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-[#94C000]" /> Promo code {appliedCode} applied ({discountPercent}% OFF)
                  </p>
                )}
                {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{rawSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-[#4B6B03] text-base font-serif">₹{finalTotal}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  onCheckout(discountAmount, appliedCode || '');
                  onClose();
                }}
                className="w-full py-4 bg-[#4B6B03] hover:bg-[#385002] text-white font-bold text-sm rounded-xl shadow-xl flex items-center justify-center space-x-2 transition-transform active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4E90F5]" />
                <span>Protected by Google reCAPTCHA & Razorpay SSL</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
