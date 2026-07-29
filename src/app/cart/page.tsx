'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AuthModal } from '@/components/AuthModal';
import { UserOrdersModal } from '@/components/UserOrdersModal';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { Trash2, ArrowLeft, ArrowRight, ShieldCheck, Tag, ShoppingBag, Truck } from 'lucide-react';

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

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState({ text: '', isError: false });

  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.selectedVariant.price * item.quantity,
    0
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyPromoCode(promoInput);
    setPromoMessage({ text: result.message, isError: !result.success });
  };

  const freeShippingThreshold = 999;
  const deliveryFee = rawSubtotal >= freeShippingThreshold || cartItems.length === 0 ? 0 : 70;
  const finalTotal = Math.max(0, rawSubtotal - appliedDiscount + deliveryFee);
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
        searchQuery=""
        setSearchQuery={() => {}}
        selectedCategory="all"
        setSelectedCategory={() => {}}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-6">
          <div>
            <Link href="/" className="inline-flex items-center text-xs text-stone-500 hover:text-[#3A5303] mb-2 transition-colors font-medium">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Continue Shopping
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal">
              Your Organic Shopping Cart
            </h1>
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#3A5303] mt-2 sm:mt-0">
            {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} Selected
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-stone-200/80 space-y-4 max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
            <h2 className="text-xl font-serif text-stone-800">Your bag is currently empty</h2>
            <p className="text-xs text-stone-500 font-light max-w-xs mx-auto">
              Explore our small-batch A2 Desi Bilona Ghee and traditional wood-pressed oils.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#3A5303] text-white text-xs font-semibold uppercase tracking-wider rounded shadow-xs hover:bg-[#2b3e02] transition-colors"
            >
              <span>Explore Farm Produce</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Items List */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Shipping Bar */}
              <div className="bg-white p-4 rounded-xl border border-stone-200/80 text-xs">
                {rawSubtotal >= freeShippingThreshold ? (
                  <p className="text-[#3A5303] font-semibold flex items-center">
                    <Truck className="w-4 h-4 mr-2" /> 🎉 You qualify for Complimentary Express Delivery!
                  </p>
                ) : (
                  <p className="text-stone-600 font-light">
                    Add <span className="font-semibold text-[#3A5303]">₹{freeShippingThreshold - rawSubtotal}</span> more for <span className="font-semibold text-[#3A5303]">Free Shipping</span>
                  </p>
                )}
                <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[#3A5303] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden">
                <div className="divide-y divide-stone-100">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-lg object-cover bg-stone-100 border border-stone-200"
                        />
                        <div className="space-y-1">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="text-base font-serif text-stone-900 hover:text-[#3A5303] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-stone-500">{item.selectedVariant.weight}</p>
                          <p className="text-xs font-semibold text-[#3A5303]">₹{item.selectedVariant.price} each</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-stone-200 rounded overflow-hidden bg-[#F7F6F2]">
                          <button
                            onClick={() => updateQuantity(idx, item.quantity - 1)}
                            className="px-3 py-1 text-xs text-stone-600 hover:bg-stone-200 font-semibold"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-semibold text-stone-900 bg-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(idx, item.quantity + 1)}
                            className="px-3 py-1 text-xs text-stone-600 hover:bg-stone-200 font-semibold"
                          >
                            +
                          </button>
                        </div>

                        {/* Total price for line */}
                        <span className="text-sm font-semibold text-stone-900 min-w-[70px] text-right">
                          ₹{item.selectedVariant.price * item.quantity}
                        </span>

                        {/* Remove */}
                        <button
                          onClick={() => removeCartItem(idx)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Summary Box */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Promo Code Input */}
              <div className="bg-white p-6 rounded-xl border border-stone-200/80 space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900">
                  Have a Promo Code?
                </h3>
                <form onSubmit={handleApplyPromo} className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. ORGANIC10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded uppercase bg-[#F7F6F2] focus:outline-none focus:border-[#3A5303]"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#3A5303] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2b3e02] transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {promoMessage.text && (
                  <p className={`text-[11px] font-semibold ${promoMessage.isError ? 'text-red-600' : 'text-[#3A5303]'}`}>
                    {promoMessage.text}
                  </p>
                )}
                {appliedPromoCode && !promoMessage.text && (
                  <p className="text-[11px] font-semibold text-[#3A5303]">
                    Code {appliedPromoCode} applied!
                  </p>
                )}
              </div>

              {/* Order Breakdown */}
              <div className="bg-white p-6 rounded-xl border border-stone-200/80 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900 border-b border-stone-100 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-stone-600 font-light">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">₹{rawSubtotal}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[#3A5303] font-semibold">
                      <span>Discount ({appliedPromoCode})</span>
                      <span>-₹{appliedDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{deliveryFee === 0 ? <span className="text-[#3A5303] font-semibold">FREE</span> : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-stone-900 pt-3 border-t border-stone-100">
                    <span>Total Amount</span>
                    <span className="text-[#3A5303] text-base font-serif">₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => triggerCheckout(appliedDiscount, appliedPromoCode)}
                  className="w-full py-3.5 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-semibold text-xs uppercase tracking-wider rounded shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Razorpay Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center justify-center space-x-2 text-[10px] text-stone-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3A5303]" />
                  <span>Protected by Google reCAPTCHA Security</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={appliedDiscount}
        promoCode={appliedPromoCode}
        onOrderSuccess={onOrderSuccess}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <UserOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={userOrders}
      />

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
