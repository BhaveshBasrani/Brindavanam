'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '@/types/store';
import { useStore } from '@/context/StoreContext';

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
  const { applyPromoCode } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.selectedVariant.price * item.quantity,
    0
  );

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError('');
    setPromoMessage('');
    setApplying(true);

    try {
      const res = await applyPromoCode(promoCode);
      if (res.success) {
        setAppliedCode(promoCode.trim().toUpperCase());
        setDiscountAmount(res.discountAmount);
        setPromoMessage(res.message);
      } else {
        setPromoError(res.message);
      }
    } catch {
      setPromoError('Failed to apply promo code.');
    } finally {
      setApplying(false);
    }
  };

  // Thresholds per Changes.pdf Page 5:
  // 1. Free Delivery ONLY after ₹2000 shopping
  // 2. At ₹5000 shopping, automatic 10% discount
  const freeShippingThreshold = 2000;
  const bulkDiscount = rawSubtotal >= 5000 ? Math.round(rawSubtotal * 0.10) : 0;
  const effectiveDiscount = Math.max(discountAmount, bulkDiscount);
  const effectivePromoLabel = discountAmount >= bulkDiscount && discountAmount > 0 ? (appliedCode || '') : (bulkDiscount > 0 ? 'AUTO 10% BULK DISCOUNT' : '');

  const deliveryFee = rawSubtotal >= freeShippingThreshold || items.length === 0 ? 0 : 70;
  const finalTotal = Math.max(0, rawSubtotal - effectiveDiscount + deliveryFee);
  const progressToFreeShipping = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col justify-between border-l border-[#D9CEBC] animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#D9CEBC] bg-[#ECE4D5]/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#162010] text-[#F5EFE6] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-[#D49B28]" />
                </div>
                <h2 className="text-lg font-bold font-display uppercase tracking-tight text-[#162010]">Your Harvest Cart</h2>
                <span className="bg-[#162010] text-[#F5EFE6] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {items.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#162010] hover:text-[#C25E2E] rounded-xl hover:bg-[#D9CEBC] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator (₹2000 Min) */}
            <div className="mt-4 bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#D9CEBC] text-xs">
              {rawSubtotal >= freeShippingThreshold ? (
                <div>
                  <p className="text-[#33441B] font-mono font-bold flex items-center">
                    <Truck className="w-4 h-4 mr-1.5 text-[#33441B] shrink-0" />
                    <span>Qualified for FREE Express Dispatch</span>
                  </p>
                  <p className="text-[11px] text-[#5C6352] font-sans mt-1 leading-snug">
                    Orders exceeding ₹5,000 automatically receive an additional 10% bulk harvest discount.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[#5C6352] font-sans">
                    Add <span className="font-mono font-bold text-[#162010]">₹{freeShippingThreshold - rawSubtotal}</span> more for <span className="font-mono font-bold text-[#C25E2E]">FREE Delivery (₹2000 Min)</span>
                  </p>
                  <p className="text-[11px] text-[#5C6352] font-sans mt-0.5 leading-snug">
                    Orders exceeding ₹5,000 automatically receive an additional 10% bulk harvest discount.
                  </p>
                </div>
              )}
              <div className="w-full bg-[#D9CEBC] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-[#C25E2E] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Automatic 10% Bulk Discount Banner */}
            {rawSubtotal >= 5000 && (
              <div className="mt-2.5 bg-[#ECE4D5] p-2.5 rounded-xl border border-[#D9CEBC] text-xs text-[#162010] flex items-center space-x-1.5 font-mono font-bold">
                <Sparkles className="w-4 h-4 text-[#D49B28] shrink-0" />
                <span>Bulk Farm Order ₹5000+! 10% Discount (₹{bulkDiscount}) Applied.</span>
              </div>
            )}
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#ECE4D5] rounded-2xl flex items-center justify-center mx-auto text-[#5C6352]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif text-[#162010]">Your cart is empty</h3>
                <p className="text-xs text-[#5C6352] font-sans max-w-xs mx-auto">
                  Add some farm-fresh A2 Desi Cow Ghee or Wood-Pressed Oils to get started!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 bg-[#162010] text-[#F5EFE6] font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#33441B] transition-colors cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-4 p-3.5 bg-[#ECE4D5]/70 rounded-2xl border border-[#D9CEBC]"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#D9CEBC] bg-[#FAF6F0]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-serif font-bold text-[#162010] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#5C6352]">{item.selectedVariant.weight}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-mono font-bold text-[#162010]">
                        ₹{item.selectedVariant.price * item.quantity}
                      </span>
                      
                      {/* Quantity Incrementor */}
                      <div className="flex items-center border border-[#D9CEBC] rounded-lg overflow-hidden bg-[#FAF6F0]">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-[#162010] hover:bg-[#D9CEBC] font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-mono font-bold text-[#162010]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-[#162010] hover:bg-[#D9CEBC] font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="p-2 text-[#5C6352] hover:text-[#C25E2E] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Controls */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#D9CEBC] bg-[#ECE4D5]/50 space-y-4">
              {/* Promo Code Input */}
              <div>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. ORGANIC10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-[#D9CEBC] rounded-xl uppercase bg-[#FAF6F0] font-mono focus:outline-none focus:border-[#162010]"
                    />
                    <Tag className="w-3.5 h-3.5 text-[#5C6352] absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    disabled={applying}
                    className="px-4 py-2 bg-[#162010] text-[#F5EFE6] text-xs font-mono font-bold uppercase rounded-xl hover:bg-[#33441B] transition-colors cursor-pointer"
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>
                {appliedCode && (
                  <p className="text-[11px] text-[#33441B] font-mono font-semibold mt-1 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-[#D49B28]" /> {promoMessage || `Coupon ${appliedCode} applied`}
                  </p>
                )}
                {promoError && <p className="text-[11px] font-mono text-[#C25E2E] mt-1">{promoError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5C6352] font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#162010] font-bold">₹{rawSubtotal}</span>
                </div>
                {effectiveDiscount > 0 && (
                  <div className="flex justify-between text-[#33441B] font-semibold">
                    <span>Discount ({effectivePromoLabel || 'Special Discount'})</span>
                    <span>-₹{effectiveDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-[#33441B] font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#162010] pt-2 border-t border-[#D9CEBC]">
                  <span className="font-display uppercase tracking-wider">Total Amount</span>
                  <span className="text-xl font-mono">₹{finalTotal}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  onCheckout(effectiveDiscount, effectivePromoLabel || '');
                  onClose();
                }}
                className="w-full py-3.5 bg-[#C25E2E] hover:bg-[#9E451A] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-[#5C6352]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#33441B]" />
                <span>Protected by SSL Encryption & Razorpay</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
