'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { BrindavanamNatureSection } from '@/components/BrindavanamNatureSection';
import { TestimonialSection } from '@/components/TestimonialSection';
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
import { Product } from '@/types/store';

function HomePageContent() {
  const {
    products,
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
    onOrderSuccess,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const isProgrammaticScroll = React.useRef(false);

  const handleSetSelectedCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (cat) {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

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

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'milk': return 'Pure Desi Cow Milk Lineup';
      case 'ghee': return 'Authentic A2 Bilona Ghee Lineup';
      case 'oil': return 'Pure Wood-Pressed Oils Lineup';
      case 'paneer': return 'Fresh Desi Paneer Lineup';
      case 'eggs': return 'Farm Fresh Eggs Lineup';
      default: return 'Fresh Farm Harvest Lineup';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <CoolLoadingScreen />
      <FloatingRecaptchaBadge />

      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleSetSelectedCategory}
      />

      <main className="flex-1">
        {selectedCategory ? (
          /* VIEW A: ALL PRODUCTS / CATEGORY VIEW - Catalog at the top without Hero section */
          <div className="pt-28 sm:pt-32 pb-16">
            <section id="catalog" className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-28">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#3A5303] mb-1 block">
                    100% Certified Farm Produce
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold">
                    {getCategoryTitle()}
                  </h2>
                </div>
                <p className="text-xs text-stone-500 max-w-md mt-1 md:mt-0 font-light leading-snug">
                  Every item is hand-bottled at our farm in Hyderabad without heat processing, chemicals, or artificial preservatives.
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm">
                  <p className="text-stone-500 font-serif text-base">No organic produce found matching your filter.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-6 py-2 bg-[#3A5303] text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Reset Catalog Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Secondary Nature & Reviews section below products */}
            <BrindavanamNatureSection onSelectCategory={handleSetSelectedCategory} />
            <TestimonialSection />
            <FarmProcessSection />
          </div>
        ) : (
          /* VIEW B: DEFAULT HOME PAGE VIEW (When All Products is NOT clicked) */
          <div className="pt-24 sm:pt-28">
            {/* Pure. Natural. Honest. Farms Section with 4 Pillars & Green Commitment Card */}
            <BrindavanamNatureSection onSelectCategory={handleSetSelectedCategory} />

            {/* Customer Reviews & Testimonials */}
            <TestimonialSection />

            {/* Ancient Extraction Process & Vedic Standards */}
            <FarmProcessSection />
          </div>
        )}
      </main>

      <Footer />

      {/* Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeCartItem}
        onCheckout={() => {
          setIsCartDrawerOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Product Quick-View Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, v, q) => {
          addToCart(p, v, q);
          setQuickViewProduct(null);
          setIsCartDrawerOpen(true);
        }}
        onBuyNow={(p, v, q) => {
          addToCart(p, v, q);
          setQuickViewProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={appliedDiscount}
        promoCode={appliedPromoCode}
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

      {/* Master Admin Operations Desk Modal */}
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
