'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/data/products';
import { Product, ProductVariant } from '@/types/store';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AuthModal } from '@/components/AuthModal';
import { UserOrdersModal } from '@/components/UserOrdersModal';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ArrowLeft, Star, CheckCircle, ShieldCheck, ShoppingBag, Zap, Truck } from 'lucide-react';

function ProductDetailPageContent({ id }: { id: string }) {
  const {
    products,
    cartItems,
    userOrders,
    addToCart,
    updateQuantity,
    removeCartItem,
    triggerCheckout,
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

  const [isCartOpen, setIsCartOpen] = useState(false);

  const rawDecoded = decodeURIComponent(id || '').trim();
  const cleanId = rawDecoded.toLowerCase();
  const slugifiedId = cleanId.replace(/\s+/g, '-');
  const spaceId = cleanId.replace(/-/g, ' ');

  const allProductsList = products && products.length > 0 ? products : PRODUCTS;

  const product =
    allProductsList.find((p) => {
      const pid = p.id.toLowerCase();
      const pname = p.name.toLowerCase();
      return (
        pid === cleanId ||
        pid === slugifiedId ||
        pid === spaceId ||
        pname === cleanId ||
        pname === spaceId ||
        pname.replace(/\s+/g, '-') === slugifiedId
      );
    }) ||
    PRODUCTS.find((p) => {
      const pid = p.id.toLowerCase();
      const pname = p.name.toLowerCase();
      return (
        pid === cleanId ||
        pid === slugifiedId ||
        pid === spaceId ||
        pname === cleanId ||
        pname === spaceId ||
        pname.replace(/\s+/g, '-') === slugifiedId
      );
    });

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product ? product.variants[0] : ({} as ProductVariant)
  );
  const [activeImage, setActiveImage] = useState<string>(product ? product.images[0] : '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'nutrition' | 'reviews'>('benefits');
  const [added, setAdded] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (!product) {
    return notFound();
  }

  const handleAdd = () => {
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setIsCheckoutOpen(true);
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFE6] pb-mobile-nav font-sans">
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery=""
        setSearchQuery={() => {}}
        selectedCategory=""
        setSelectedCategory={() => {}}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 w-full">
        {/* Breadcrumb Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-[#162010] hover:text-[#C25E2E] transition-colors font-mono font-bold uppercase tracking-wider bg-[#FAF6F0] px-4 py-2.5 rounded-xl border border-[#D9CEBC]"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-[#162010]" /> Back to Catalog
          </Link>
        </div>

        {/* Product Details Section */}
        <div className="clay-card rounded-3xl p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#F7F4EE] border border-[#DFDACF] relative">
              <img
                src={activeImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#151811] text-[#F7F4EE] text-[9px] uppercase tracking-[0.2em] font-mono font-bold px-3 py-1 rounded">
                  {product.badge}
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      (activeImage || product.images[0]) === img
                        ? 'border-[#151811] ring-1 ring-[#151811]'
                        : 'border-[#DFDACF] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C4703F] font-bold block">
                {product.category} · 100% Vedic Standard
              </span>

              <h1 className="text-3xl sm:text-5xl font-serif text-[#151811] font-normal leading-tight">
                {product.name}
              </h1>
              <p className="text-xs font-mono uppercase tracking-wider text-[#3A4B20]">
                {product.subtitle}
              </p>
              <p className="text-[#6B6D62] text-xs sm:text-sm font-sans leading-relaxed">
                {product.description}
              </p>

              {/* Process Info Box */}
              <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#DFDACF] text-xs text-[#6B6D62] font-sans">
                <span className="font-mono font-bold text-[#151811] uppercase tracking-wider block mb-1">Traditional Method:</span>
                {product.extractionMethod}
              </div>

              {/* Variant Selector */}
              <div className="pt-2">
                <label className="block text-xs font-mono font-bold text-[#162010] uppercase tracking-wider mb-2">
                  Select Pack Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border transition-colors cursor-pointer ${
                        selectedVariant.id === v.id
                          ? 'border-[#162010] bg-[#162010] text-[#F5EFE6]'
                          : 'border-[#D9CEBC] bg-[#FAF6F0] text-[#162010] hover:bg-[#ECE4D5]'
                      }`}
                    >
                      {v.weight} · ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Live Price */}
              <div className="pt-4 border-t border-[#D9CEBC] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-[#162010] uppercase">Quantity:</span>
                  <div className="flex items-center border border-[#D9CEBC] rounded-xl bg-[#FAF6F0] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1 text-[#162010] hover:bg-[#ECE4D5] font-bold text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-bold text-[#162010]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-1 text-[#162010] hover:bg-[#ECE4D5] font-bold text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[#162010]">
                    ₹{selectedVariant.price * quantity}
                  </span>
                  {selectedVariant.originalPrice && (
                    <span className="text-xs text-[#5C6352] line-through ml-2 font-mono">
                      ₹{selectedVariant.originalPrice * quantity}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[#D9CEBC]">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAdd}
                    className={`py-3.5 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider border transition-colors flex items-center justify-center space-x-2 cursor-pointer ${
                      added
                        ? 'bg-[#33441B] text-white border-[#33441B]'
                        : 'border-[#162010] text-[#162010] hover:bg-[#162010] hover:text-[#F5EFE6]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D49B28]" />
                    <span>{added ? 'Added to Cart' : '+ Add to Bag'}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 px-4 rounded-xl bg-[#C25E2E] hover:bg-[#9E451A] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform active:scale-98 shadow-md cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-white" />
                    <span>Buy Now (Express)</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#5C6352] pt-2">
                  <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#33441B]" /> 100% Raw Vedic Standard</span>
                  <span className="flex items-center"><Truck className="w-3.5 h-3.5 mr-1 text-[#C25E2E]" /> Sunrise Farm Dispatch</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed Info Section: Benefits, Nutrition, Reviews */}
        <div className="mt-12 bg-[#FAF6F0] rounded-3xl border border-[#D9CEBC] p-6 sm:p-10">
          <div className="flex space-x-8 border-b border-[#D9CEBC] pb-3 text-xs font-mono uppercase tracking-wider font-bold">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-1 transition-all cursor-pointer ${
                activeTab === 'benefits'
                  ? 'text-[#162010] border-b-2 border-[#162010]'
                  : 'text-[#5C6352] hover:text-[#162010]'
              }`}
            >
              Vedic Health Benefits
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-1 transition-all cursor-pointer ${
                activeTab === 'nutrition'
                  ? 'text-[#162010] border-b-2 border-[#162010]'
                  : 'text-[#5C6352] hover:text-[#162010]'
              }`}
            >
              Nutritional Profile
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-1 transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-[#162010] border-b-2 border-[#162010]'
                  : 'text-[#5C6352] hover:text-[#162010]'
              }`}
            >
              Patron Reviews ({product.reviewsCount})
            </button>
          </div>

          <div className="pt-6 text-xs text-[#5C6352] font-sans">
            {activeTab === 'benefits' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.healthBenefits.map((b, i) => (
                  <div key={i} className="flex items-start space-x-3 bg-[#F5EFE6] p-4 rounded-xl border border-[#D9CEBC]">
                    <span className="text-[#C25E2E] font-mono font-bold text-sm">✓</span>
                    <span className="text-[#162010]">{b}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="bg-[#F5EFE6] rounded-xl border border-[#D9CEBC] overflow-hidden max-w-md">
                <table className="w-full text-left text-xs font-mono">
                  <tbody className="divide-y divide-[#D9CEBC]">
                    {product.nutritionalInfo.map((n, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#F5EFE6]' : 'bg-[#FAF6F0]'}>
                        <td className="px-4 py-2.5 font-medium text-[#5C6352]">{n.label}</td>
                        <td className="px-4 py-2.5 font-bold text-[#162010]">{n.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Dynamic Patron Reviews List */}
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.reviews.map((r) => (
                      <div key={r.id} className="bg-[#F5EFE6] p-4 rounded-xl border border-[#D9CEBC] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#162010] font-mono flex items-center space-x-2">
                            <span>{r.author}</span>
                            {r.verifiedPurchase && (
                              <span className="text-[9px] bg-[#FAF6F0] text-[#33441B] font-bold px-2 py-0.5 rounded border border-[#D9CEBC]">Verified Patron</span>
                            )}
                          </span>
                          <span className="text-[10px] text-[#5C6352] font-mono">{r.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(r.rating)].map((_, sIdx) => (
                            <Star key={sIdx} className="w-3.5 h-3.5 text-[#D49B28] fill-[#D49B28]" />
                          ))}
                          <span className="text-[#162010] font-bold text-xs ml-1 font-mono">{r.rating}.0</span>
                        </div>
                        <p className="text-[#162010] text-xs font-normal leading-relaxed">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-[#F5EFE6] rounded-2xl border border-[#D9CEBC] space-y-2">
                    <p className="text-[#162010] font-medium text-xs font-serif">No patron reviews yet for this farm produce.</p>
                    <p className="text-[#5C6352] text-[11px]">Be the first patron to share your experience after ordering!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-serif text-stone-900">Recommended Produce</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={setQuickViewProduct}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Modals */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
        onBuyNow={(prod, v, q) => {
          addToCart(prod, v, q);
          setIsCheckoutOpen(true);
        }}
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

export default function ProductDetailPageClient({ id }: { id: string }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <ProductDetailPageContent id={id} />
      </StoreProvider>
    </AuthProvider>
  );
}
