'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { FarmProcessSection } from '@/components/FarmProcessSection';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AuthModal } from '@/components/AuthModal';
import { UserOrdersModal } from '@/components/UserOrdersModal';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { CoolLoadingScreen } from '@/components/CoolLoadingScreen';
import { FloatingRecaptchaBadge } from '@/components/FloatingRecaptchaBadge';
import { Footer } from '@/components/Footer';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types/store';

function HomePageContent() {
  const {
    cartItems,
    userOrders,
    addToCart,
    updateQuantity,
    removeCartItem,
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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Secret Admin Listener: Check if URL contains #admin or ?admin=true
  useEffect(() => {
    const checkAdminHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        const search = window.location.search;
        if (hash === '#admin' || search.includes('admin=true')) {
          setIsAdminOpen(true);
        }
      }
    };
    checkAdminHash();
    window.addEventListener('hashchange', checkAdminHash);
    return () => window.removeEventListener('hashchange', checkAdminHash);
  }, [setIsAdminOpen]);

  // Product filtering
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      {/* Minimal Organic Loading Animation Screen */}
      <CoolLoadingScreen />

      {/* Official Google reCAPTCHA Badge */}
      <FloatingRecaptchaBadge />

      {/* Navigation */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Spotlight */}
        <HeroBanner onShopNow={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} />

        {/* Traditional Process Showcase */}
        <FarmProcessSection />

        {/* Product Catalog Grid */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-stone-200">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#3A5303] block mb-1">
                100% Unadulterated Produce
              </span>
              <h2 className="text-3xl font-serif font-normal text-stone-900">
                Organic Produce Collection
              </h2>
            </div>

            {/* Minimal Category Tabs */}
            <div className="flex items-center space-x-6 pt-4 md:pt-0 overflow-x-auto scrollbar-none text-xs uppercase font-semibold tracking-wider">
              {[
                { id: 'all', label: 'All Products' },
                { id: 'ghee', label: 'A2 Ghee' },
                { id: 'oil', label: 'Wood-Pressed Oils' },
                { id: 'paneer', label: 'Fresh Paneer' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`pb-1 transition-all ${
                    selectedCategory === cat.id
                      ? 'text-[#3A5303] border-b border-[#3A5303]'
                      : 'text-stone-400 hover:text-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-3">
              <h3 className="text-base font-serif text-stone-700">No products match your criteria</h3>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-[#3A5303] text-white text-xs font-semibold uppercase tracking-wider rounded"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* Testimonial & Trust Section */}
        <section className="bg-white py-20 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#3A5303] block mb-1">
                Patron Reviews
              </span>
              <h2 className="text-3xl font-serif text-stone-900">
                Trusted by Over 50,000 Families
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-[#F7F6F2] rounded-xl border border-stone-200/80 space-y-3">
                <p className="text-stone-700 text-xs font-light leading-relaxed">
                  "The A2 Bilona Ghee has an incredible grainy texture and rich aroma. Reminds me of traditional home-made ghee in our native village!"
                </p>
                <div className="pt-2 border-t border-stone-200 text-[11px] font-semibold text-[#3A5303]">
                  Vikram S. • Mumbai
                </div>
              </div>

              <div className="p-6 bg-[#F7F6F2] rounded-xl border border-stone-200/80 space-y-3">
                <p className="text-stone-700 text-xs font-light leading-relaxed">
                  "We switched to Brindavanam Wood-Pressed Groundnut Oil and Kusuma Oil 6 months ago. Our cooking feels so light and healthy."
                </p>
                <div className="pt-2 border-t border-stone-200 text-[11px] font-semibold text-[#3A5303]">
                  Radhika Patel • Pune
                </div>
              </div>

              <div className="p-6 bg-[#F7F6F2] rounded-xl border border-stone-200/80 space-y-3">
                <p className="text-stone-700 text-xs font-light leading-relaxed">
                  "The fresh organic Paneer melts in the mouth! Excellent packaging and super prompt express delivery. Highly recommended!"
                </p>
                <div className="pt-2 border-t border-stone-200 text-[11px] font-semibold text-[#3A5303]">
                  Kavita Reddy • Hyderabad
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
        onBuyNow={(prod, v, q) => {
          addToCart(prod, v, q);
          triggerCheckout(appliedDiscount, appliedPromoCode);
        }}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeCartItem}
        onCheckout={(d, p) => triggerCheckout(d, p)}
      />

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

export default function Home() {
  return (
    <AuthProvider>
      <StoreProvider>
        <HomePageContent />
      </StoreProvider>
    </AuthProvider>
  );
}
