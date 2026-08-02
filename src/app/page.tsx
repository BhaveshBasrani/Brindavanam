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

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

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
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
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
        setSelectedCategory={setSelectedCategory}
      />

      <main className="flex-1">
        
        {/* Top Hero Banner (Title reduced 50-60%, pagination dots removed) */}
        <HeroBanner onShopNow={() => {
          const element = document.getElementById('catalog');
          element?.scrollIntoView({ behavior: 'smooth' });
        }} />

        {/* Store Catalog Section */}
        <section id="catalog" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#3A5303] mb-2 block">
                100% Certified Farm Produce
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">
                {getCategoryTitle()}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mt-2 md:mt-0 font-light">
              Every item is hand-bottled at our farm in Hyderabad without heat processing, chemicals, or artificial preservatives.
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm">
              <p className="text-stone-500 font-serif text-lg">No organic produce found matching your filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-6 py-2 bg-[#3A5303] text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Reset Catalog Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* Brindavanam Nature Centre Section (Pure. Natural. Honest.) */}
        <BrindavanamNatureSection />

        {/* Crazyyy Looking Testimonials Section */}
        <TestimonialSection />

        {/* Standard of Integrity / Our Ancient Extraction Method (Placed at bottom per Changes.pdf Page 3) */}
        <FarmProcessSection />

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
