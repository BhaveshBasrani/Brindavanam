'use client';

import React, { useState } from 'react';
import { X, Star, CheckCircle, ShieldCheck, ShoppingBag, Zap, Heart, Truck } from 'lucide-react';
import { Product, ProductVariant } from '@/types/store';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product ? product.variants[0] : null
  );
  const [activeImage, setActiveImage] = useState<string>(product ? product.images[0] : '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'nutrition' | 'reviews'>('benefits');

  if (!product || !selectedVariant) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-stone-100 hover:bg-stone-200 text-stone-700 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative">
              <img
                src={activeImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#4B6B03] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
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
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      (activeImage || product.images[0]) === img
                        ? 'border-[#4B6B03] ring-2 ring-[#94C000]'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-amber-500 text-sm">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-stone-800">{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount} customer reviews)</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-[#4B6B03] font-semibold">{product.subtitle}</p>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{product.description}</p>

              {/* Extraction Method Info Box */}
              <div className="bg-[#F3F6F3] p-3 rounded-xl border border-stone-200 text-xs text-stone-700">
                <span className="font-bold text-[#4B6B03]">Traditional Process: </span>
                {product.extractionMethod}
              </div>

              {/* Select Variant */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Select Packaging Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        selectedVariant.id === v.id
                          ? 'border-[#4B6B03] bg-[#4B6B03] text-white shadow-md'
                          : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {v.weight} - ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 pt-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-sm text-stone-800">{quantity}</span>
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
                <span className="text-3xl font-bold text-[#4B6B03]">
                  ₹{selectedVariant.price * quantity}
                </span>
                {selectedVariant.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{selectedVariant.originalPrice * quantity}
                  </span>
                )}
                <span className="text-xs font-semibold text-[#94C000] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Save ₹{(selectedVariant.originalPrice ? selectedVariant.originalPrice - selectedVariant.price : 0) * quantity}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedVariant, quantity);
                    onClose();
                  }}
                  className="py-3.5 px-4 rounded-xl border-2 border-[#4B6B03] text-[#4B6B03] hover:bg-[#F3F6F3] font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, selectedVariant, quantity);
                    onClose();
                  }}
                  className="py-3.5 px-4 rounded-xl bg-[#4B6B03] hover:bg-[#385002] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-98"
                >
                  <Zap className="w-4 h-4 text-[#94C000]" />
                  <span>Buy Now (Razorpay)</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 px-1">
                <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#4B6B03]" /> 100% Lab Tested</span>
                <span className="flex items-center"><Truck className="w-3.5 h-3.5 mr-1 text-[#4E90F5]" /> Ships in 24 hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabs: Health Benefits, Nutritional Info, Reviews */}
        <div className="bg-[#F3F6F3] p-6 border-t border-stone-200">
          <div className="flex space-x-6 border-b border-stone-300 pb-3">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`text-xs font-bold pb-1 transition-all ${
                activeTab === 'benefits'
                  ? 'text-[#4B6B03] border-b-2 border-[#4B6B03]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Health Benefits
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`text-xs font-bold pb-1 transition-all ${
                activeTab === 'nutrition'
                  ? 'text-[#4B6B03] border-b-2 border-[#4B6B03]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Nutritional Facts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-xs font-bold pb-1 transition-all ${
                activeTab === 'reviews'
                  ? 'text-[#4B6B03] border-b-2 border-[#4B6B03]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Reviews ({product.reviews.length})
            </button>
          </div>

          <div className="pt-4 text-xs text-stone-700">
            {activeTab === 'benefits' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.healthBenefits.map((b, i) => (
                  <div key={i} className="flex items-start space-x-2 bg-white p-3 rounded-xl border border-stone-200">
                    <CheckCircle className="w-4 h-4 text-[#94C000] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden max-w-md">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-stone-100">
                    {product.nutritionalInfo.map((n, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-stone-50' : 'bg-white'}>
                        <td className="px-4 py-2 font-medium text-stone-600">{n.label}</td>
                        <td className="px-4 py-2 font-bold text-stone-900">{n.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {product.reviews.map((r) => (
                  <div key={r.id} className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">{r.author}</span>
                      <span className="text-[11px] text-stone-400">{r.date}</span>
                    </div>
                    <div className="flex text-amber-400 my-1">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-stone-600 mt-1">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
