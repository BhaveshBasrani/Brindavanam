'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Tag, ShieldCheck, Truck, Sparkles, CheckCircle } from 'lucide-react';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AuthModal } from '@/components/AuthModal';
import { UserOrdersModal } from '@/components/UserOrdersModal';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';

function CartPageContent() {
  const {
    cartItems,
    userOrders,
    updateQuantity,
    removeCartItem,
    applyPromoCode,
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
    triggerCheckout,
    onOrderSuccess,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState({ text: '', isError: false });

  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.selectedVariant.price * item.quantity,
    0
  );

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const result = await applyPromoCode(promoInput);
    setPromoMessage({ text: result.message, isError: !result.success });
  };

  // Thresholds per Changes.pdf Page 5:
  // 1. Free Shipping threshold: ₹2000
  // 2. Cart value above ₹5000: automatic 10% discount
  const freeShippingThreshold = 2000;
  const bulkDiscount = rawSubtotal >= 5000 ? Math.round(rawSubtotal * 0.10) : 0;
  const effectiveDiscount = Math.max(appliedDiscount, bulkDiscount);
  const effectivePromoLabel = appliedDiscount >= bulkDiscount && appliedDiscount > 0 ? appliedPromoCode : (bulkDiscount > 0 ? 'AUTO 10% BULK DISCOUNT' : '');

  const deliveryFee = rawSubtotal >= freeShippingThreshold || cartItems.length === 0 ? 0 : 70;
  const finalTotal = Math.max(0, rawSubtotal - effectiveDiscount + deliveryFee);
  const progressToFreeShipping = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      {/* Navigation */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => {}}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-[#3A5303] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Produce Store
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-bold">Your Organic Produce Cart</h1>
          <p className="text-xs text-stone-500 mt-1 font-light">Direct dispatch from Brindavanam Nature Centre</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-[#F7F6F2] rounded-full flex items-center justify-center mx-auto text-stone-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-serif text-stone-800 font-bold">Your Shopping Cart is Empty</h2>
            <p className="text-xs text-stone-500 font-light">
              Add some of our A2 Gir Cow Bilona Ghee, Wood-Pressed Oils, or Fresh Desi Paneer to your cart.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-[#3A5303] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#2b3e02] shadow-md transition-all"
            >
              Browse Organic Lineup
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Free Shipping Callout */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  {rawSubtotal >= freeShippingThreshold ? (
                    <span className="font-bold text-emerald-700 flex items-center">
                      <Truck className="w-4 h-4 mr-1.5 text-[#3A5303]" />
                      🎉 You unlocked FREE Express Delivery (Orders ₹2000+)!
                    </span>
                  ) : (
                    <span className="text-stone-600 font-medium">
                      Add <span className="font-bold text-[#3A5303]">₹{freeShippingThreshold - rawSubtotal}</span> more for <span className="font-bold text-emerald-700">FREE Shipping (₹2000 Min)</span>
                    </span>
                  )}
                  <span className="font-bold text-stone-500">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#94C000] to-[#3A5303] h-full transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Automatic 10% Bulk Discount Banner */}
              {rawSubtotal >= 5000 && (
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2 font-semibold">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>🎉 Order above ₹5000! Automatic 10% Farm Bulk Discount (₹{bulkDiscount}) applied!</span>
                </div>
              )}

              {/* Items Card List */}
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
                {cartItems.map((item, index) => (
                  <div key={index} className="p-4 sm:p-6 flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-[#3A5303] tracking-widest block">
                        {item.product.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-light mt-0.5">
                        {item.selectedVariant.weight} • ₹{item.selectedVariant.price} each
                      </p>

                      <div className="flex items-center space-x-4 mt-3">
                        {/* Incrementor */}
                        <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="px-3 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="px-3 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeCartItem(index)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-bold font-serif text-[#3A5303]">
                        ₹{item.selectedVariant.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Order Summary & Checkout Card */}
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                <h3 className="text-lg font-serif font-bold text-stone-900 border-b border-stone-100 pb-3">
                  Order Summary
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Have a Promo Code?
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="ORGANIC10"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl uppercase focus:outline-none focus:border-[#3A5303]"
                      />
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#3A5303] text-white text-xs font-bold rounded-xl hover:bg-[#2b3e02] transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {promoMessage.text && (
                    <p className={`text-xs ${promoMessage.isError ? 'text-red-600' : 'text-emerald-700 font-bold'} flex items-center mt-1`}>
                      {!promoMessage.isError && <Sparkles className="w-3.5 h-3.5 mr-1" />}
                      {promoMessage.text}
                    </p>
                  )}
                </form>

                {/* Price Breakdown Details */}
                <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-100 pt-4">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-stone-800">₹{rawSubtotal}</span>
                  </div>

                  {effectiveDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount ({effectivePromoLabel || 'Special Discount'})</span>
                      <span>-₹{effectiveDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="font-bold text-emerald-700">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-stone-200 pt-3 flex justify-between items-center text-sm font-bold text-stone-900">
                    <span>Total Amount</span>
                    <span className="text-xl font-serif text-[#3A5303]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() => triggerCheckout(effectiveDiscount, effectivePromoLabel || appliedPromoCode)}
                  className="w-full py-4 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-98"
                >
                  <span>Proceed to Farm Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center space-x-2 text-[10px] text-stone-400 pt-2 border-t border-stone-100">
                  <ShieldCheck className="w-4 h-4 text-[#3A5303]" />
                  <span>Encrypted 256-Bit Payment Guarantee</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={effectiveDiscount}
        promoCode={effectivePromoLabel || appliedPromoCode}
        onOrderSuccess={onOrderSuccess}
      />

      {/* Customer Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Customer Orders Modal */}
      <UserOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={userOrders}
      />

      {/* Admin Operations Desk Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        localOrders={userOrders}
      />
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartPageContent />
      </StoreProvider>
    </AuthProvider>
  );
}
