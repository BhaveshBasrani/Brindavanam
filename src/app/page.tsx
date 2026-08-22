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
    <div className="min-h-screen flex flex-col bg-[#F5EFE6] pb-mobile-nav font-sans">
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
          <div className="pt-16 sm:pt-28 pb-12">
            <section id="catalog" className="py-4 sm:py-8 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 border-b border-[#D9CEBC] pb-4 sm:pb-6 gap-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#C25E2E] inline-block" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C25E2E] font-bold">
                      100% Raw Certified Vedic Harvest
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-5xl font-serif text-[#162010] font-normal">
                    {getCategoryTitle()}
                  </h2>
                </div>
                <p className="text-xs text-[#5C6352] max-w-md mt-1 md:mt-0 font-sans leading-relaxed">
                  Every batch is hand-harvested at our Hyderabad estate without heating, chemical solvents, or artificial tampering.
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 sm:py-20 bg-[#FAF6F0] rounded-3xl border border-[#D9CEBC] p-6 sm:p-8 space-y-4 shadow-sm">
                  <p className="text-[#162010] font-serif text-xl sm:text-2xl">No farm produce found matching your search.</p>
                  <p className="text-xs text-[#5C6352]">Try searching for Desi Ghee, Wood-Pressed Mustard Oil, Paneer, or Eggs.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-3 px-6 py-2.5 bg-[#162010] hover:bg-[#C25E2E] text-[#F5EFE6] rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    View All Harvest
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                      onAddToCart={addToCart}
                    />
                  ))}
                  {filteredProducts.length === 5 && (
                    <div className="clay-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-br from-[#202B17] to-[#162010] text-[#F5EFE6] border border-[#243315] shadow-md text-left">
                      <div className="space-y-3">
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#D49B28] font-bold bg-white/10 px-2.5 py-1 rounded-full inline-block">
                          Direct Estate Delivery
                        </span>
                        <h3 className="text-xl font-serif text-[#F5EFE6]">
                          Raw Purity Guaranteed
                        </h3>
                        <p className="text-xs text-[#ECE4D5]/80 font-sans leading-relaxed">
                          Every single item is packed fresh in food-grade glass and earthenware containers with zero plastic contamination.
                        </p>
                        <div className="pt-2 text-[11px] font-mono text-[#D49B28] space-y-1">
                          <p>✓ Free Express Shipping on ₹2,000+</p>
                          <p>✓ 10% Auto Discount on ₹5,000+</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/15">
                        <a
                          href="https://wa.me/917995436215"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-[#C25E2E] hover:bg-[#9E451A] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center justify-center space-x-1.5 shadow-sm"
                        >
                          <span>Ask Farm Questions</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Secondary Nature, Reviews & Process section below products */}
            <BrindavanamNatureSection onSelectCategory={handleSetSelectedCategory} />
            <TestimonialSection />
            <FarmProcessSection />
          </div>
        ) : (
          /* VIEW B: DEFAULT HOME PAGE VIEW (When All Products is NOT clicked) */
          <div className="pt-14 sm:pt-20">
            {/* Pure. Natural. Honest. Farms Section with 5 Pillars Matrix */}
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
