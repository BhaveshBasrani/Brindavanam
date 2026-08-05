'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle, ShieldCheck, ShoppingBag, Zap, Heart, Truck } from 'lucide-react';
import { Product, ProductVariant } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen?: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const { addProductReview } = useStore();
  const { user } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'nutrition' | 'reviews'>('benefits');

  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || null);
      setActiveImage(product.images[0] || '');
      setQuantity(1);
    }
    if (user?.displayName) {
      setNewAuthor(user.displayName);
    }
  }, [product, user]);

  if (!product || !selectedVariant) return null;
  if (isOpen === false) return null;

  const handleSubmitModalReview = () => {
    if (!newComment.trim() || !product) return;
    addProductReview(product.id, {
      author: newAuthor || 'Valued Patron',
      rating: newRating,
      comment: newComment.trim(),
    });
    setNewComment('');
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedVariant, quantity);
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
      onBuyNow(product, selectedVariant, quantity);
    } else {
      onAddToCart(product, selectedVariant, quantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Media Gallery */}
          <div className="bg-[#F7F6F2] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm">
                <img
                  src={activeImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#3A5303] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all shrink-0 ${
                        activeImage === img ? 'border-[#3A5303] scale-105 shadow-sm' : 'border-stone-200 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center space-x-2 text-[11px] text-stone-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#3A5303]" />
              <span>100% Certified Organic • Glass Bottle Sealed • Express Dispatch</span>
            </div>
          </div>

          {/* Right: Product Buying Controls & Details */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div>
                <span className="text-[10px] uppercase font-bold text-[#3A5303] tracking-widest block mb-1">
                  {product.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-bold">{product.name}</h2>
                <p className="text-xs text-stone-500 font-light mt-1">{product.subtitle}</p>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-800">{product.rating}</span>
                  <span className="text-xs text-stone-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Price & Variant Selector */}
              <div className="space-y-3 border-t border-b border-stone-100 py-4">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-serif font-bold text-[#3A5303]">
                    ₹{selectedVariant.price}
                  </span>
                  {selectedVariant.originalPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      ₹{selectedVariant.originalPrice}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Tax Inclusive
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider">
                    Select Weight / Pack Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedVariant.id === v.id
                            ? 'bg-[#3A5303] text-white border-[#3A5303] shadow-sm'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {v.weight} • ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Incrementor */}
                <div className="flex items-center space-x-3 pt-2">
                  <label className="text-[10px] font-bold text-stone-700 uppercase">Quantity:</label>
                  <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-stone-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs: Benefits, Nutrition, Reviews */}
              <div className="space-y-3">
                <div className="flex space-x-4 border-b border-stone-100 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('benefits')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'benefits' ? 'border-[#3A5303] text-[#3A5303]' : 'border-transparent text-stone-400'
                    }`}
                  >
                    Vedic Benefits
                  </button>
                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'nutrition' ? 'border-[#3A5303] text-[#3A5303]' : 'border-transparent text-stone-400'
                    }`}
                  >
                    Nutritional Value
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'reviews' ? 'border-[#3A5303] text-[#3A5303]' : 'border-transparent text-stone-400'
                    }`}
                  >
                    Patron Reviews ({product.reviewsCount})
                  </button>
                </div>

                {activeTab === 'benefits' && (
                  <ul className="space-y-1.5 text-xs text-stone-600 font-light">
                    {product.healthBenefits.map((b, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#3A5303] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'nutrition' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {product.nutritionalInfo.map((info, i) => (
                      <div key={i} className="bg-[#F7F6F2] p-2 rounded-lg border border-stone-200">
                        <span className="text-[10px] text-stone-400 block">{info.label}</span>
                        <span className="font-bold text-stone-800">{info.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-xs">
                    {/* Review Submission Form */}
                    <div className="bg-[#F7F6F2] p-3 rounded-2xl border border-stone-200 space-y-2">
                      <span className="text-[10px] font-bold text-[#3A5303] uppercase tracking-wider block">Write a Patron Review</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-stone-500 font-medium">Rating:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star className={`w-3.5 h-3.5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Your Name / Location..."
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full px-2.5 py-1 text-[11px] bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[#3A5303]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Share your experience with this organic produce..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-2.5 py-1 text-[11px] bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[#3A5303]"
                      />
                      <button
                        type="button"
                        onClick={handleSubmitModalReview}
                        disabled={!newComment.trim()}
                        className="w-full py-1.5 bg-[#3A5303] hover:bg-[#2b3e02] disabled:opacity-50 text-white font-bold text-[10px] uppercase rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Submit Patron Review
                      </button>
                    </div>

                    {/* Existing Reviews List */}
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((r) => (
                        <div key={r.id} className="bg-white p-3 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
                          <div className="flex justify-between items-center font-bold text-stone-800 text-[11px]">
                            <span className="flex items-center space-x-1">
                              <span>{r.author}</span>
                              {r.verifiedPurchase && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Verified</span>
                              )}
                            </span>
                            <span className="text-amber-500 font-mono flex items-center">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                              {r.rating}.0
                            </span>
                          </div>
                          <p className="text-stone-600 font-light text-[11px] leading-relaxed">{r.comment}</p>
                          <span className="text-[9px] text-stone-400 block pt-0.5">{r.date}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-stone-400 text-xs italic">
                        No reviews yet. Be the first patron to share your feedback above!
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* CTAs */}
            <div className="flex space-x-3 pt-4 border-t border-stone-100">
              <button
                onClick={handleAddToCartClick}
                className="w-1/2 py-3 rounded-xl border border-[#3A5303] text-[#3A5303] hover:bg-[#3A5303] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={handleBuyNowClick}
                className="w-1/2 py-3 rounded-xl bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-transform active:scale-98 flex items-center justify-center space-x-1.5"
              >
                <Zap className="w-4 h-4 text-[#94C000]" />
                <span>Buy Now</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
