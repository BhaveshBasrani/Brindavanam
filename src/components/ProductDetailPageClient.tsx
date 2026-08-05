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
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    triggerCheckout(appliedDiscount, appliedPromoCode);
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumb */}
        <div className="mb-8 pt-16 lg:pt-20">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-stone-500 hover:text-[#3A5303] transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Storefront
          </Link>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative">
              <img
                src={activeImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#3A5303] text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded">
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
                    className={`w-20 h-20 rounded-lg overflow-hidden border transition-all ${
                      (activeImage || product.images[0]) === img
                        ? 'border-[#3A5303] ring-1 ring-[#3A5303]'
                        : 'border-stone-200 opacity-60 hover:opacity-100'
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
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-amber-500 text-xs">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-stone-900">{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount} verified reviews)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal leading-tight">
                {product.name}
              </h1>
              <p className="text-xs uppercase tracking-wider font-bold text-[#3A5303]">
                {product.subtitle}
              </p>
              <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed">
                {product.description}
              </p>

              {/* Process Info Box */}
              <div className="bg-[#F7F6F2] p-4 rounded-xl border border-stone-200 text-xs text-stone-700 font-light">
                <span className="font-semibold text-[#3A5303] block mb-0.5">Extraction Technique:</span>
                {product.extractionMethod}
              </div>

              {/* Variant Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Select Packaging Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded border transition-colors ${
                        selectedVariant.id === v.id
                          ? 'border-[#3A5303] bg-[#3A5303] text-white'
                          : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {v.weight} - ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center space-x-4 pt-2">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded overflow-hidden bg-[#F7F6F2]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-xs text-stone-900 bg-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-3xl font-serif text-[#3A5303]">
                  ₹{selectedVariant.price * quantity}
                </span>
                {selectedVariant.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{selectedVariant.originalPrice * quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className={`py-3.5 px-4 rounded font-semibold text-xs uppercase tracking-wider border transition-colors flex items-center justify-center space-x-2 ${
                    added
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'border-[#3A5303] text-[#3A5303] hover:bg-[#F7F6F2]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{added ? 'Added to Bag' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded bg-[#3A5303] hover:bg-[#2b3e02] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-xs"
                >
                  <Zap className="w-4 h-4 text-[#94C000]" />
                  <span>Buy Now (Express Checkout)</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-2">
                <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#3A5303]" /> 100% Lab Certified</span>
                <span className="flex items-center"><Truck className="w-3.5 h-3.5 mr-1 text-[#4E90F5]" /> Ships in 24 Hours</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Info Section: Benefits, Nutrition, Reviews */}
        <div className="mt-12 bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8">
          <div className="flex space-x-8 border-b border-stone-200 pb-3 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-1 transition-all ${
                activeTab === 'benefits'
                  ? 'text-[#3A5303] border-b-2 border-[#3A5303]'
                  : 'text-stone-400 hover:text-stone-800'
              }`}
            >
              Health Benefits
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-1 transition-all ${
                activeTab === 'nutrition'
                  ? 'text-[#3A5303] border-b-2 border-[#3A5303]'
                  : 'text-stone-400 hover:text-stone-800'
              }`}
            >
              Nutritional Facts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-1 transition-all ${
                activeTab === 'reviews'
                  ? 'text-[#3A5303] border-b-2 border-[#3A5303]'
                  : 'text-stone-400 hover:text-stone-800'
              }`}
            >
              Patron Reviews ({product.reviewsCount})
            </button>
          </div>

          <div className="pt-6 text-xs text-stone-700 font-light">
            {activeTab === 'benefits' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.healthBenefits.map((b, i) => (
                  <div key={i} className="flex items-start space-x-3 bg-[#F7F6F2] p-4 rounded-xl border border-stone-200">
                    <CheckCircle className="w-4 h-4 text-[#3A5303] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="bg-[#F7F6F2] rounded-xl border border-stone-200 overflow-hidden max-w-md">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-stone-200">
                    {product.nutritionalInfo.map((n, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F7F6F2]'}>
                        <td className="px-4 py-2.5 font-medium text-stone-600">{n.label}</td>
                        <td className="px-4 py-2.5 font-bold text-stone-900">{n.value}</td>
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
                      <div key={r.id} className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 flex items-center space-x-2">
                            <span>{r.author}</span>
                            {r.verifiedPurchase && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Verified Patron</span>
                            )}
                          </span>
                          <span className="text-[10px] text-stone-400">{r.date}</span>
                        </div>
                        <div className="text-amber-400 text-xs font-mono">
                          {'★'.repeat(r.rating)} <span className="text-stone-700 font-bold">{r.rating}.0</span>
                        </div>
                        <p className="text-stone-600 text-xs font-light leading-relaxed">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-[#F7F6F2] rounded-2xl border border-stone-200 space-y-2">
                    <p className="text-stone-500 font-medium text-xs">No patron reviews yet for this farm produce.</p>
                    <p className="text-stone-400 text-[11px]">Be the first patron to share your experience after ordering!</p>
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

      {/* Modals */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
        onBuyNow={(prod, v, q) => {
          addToCart(prod, v, q);
          triggerCheckout(appliedDiscount, appliedPromoCode);
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
