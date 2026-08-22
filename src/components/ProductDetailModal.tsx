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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 font-sans">
      <div className="bg-[#FAF6F0] max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden relative border border-[#D9CEBC] my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-[#ECE4D5] hover:bg-[#D9CEBC] text-[#162010] rounded-xl border border-[#D9CEBC] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Media Gallery */}
          <div className="bg-[#ECE4D5]/70 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#D9CEBC]">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#D9CEBC] bg-[#FAF6F0] shadow-sm">
                <img
                  src={activeImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#162010] text-[#F5EFE6] text-[9px] font-mono font-bold px-3 py-1 rounded uppercase tracking-[0.2em] shadow-sm">
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
                      className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all shrink-0 cursor-pointer ${
                        activeImage === img ? 'border-[#162010] scale-105 shadow-sm' : 'border-[#D9CEBC] opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center space-x-2 text-[11px] text-[#5C6352] font-mono">
              <ShieldCheck className="w-4 h-4 text-[#33441B]" />
              <span>100% Certified Vedic Organic · Farm Fresh</span>
            </div>
          </div>

          {/* Right: Product Buying Controls & Details */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#C25E2E] tracking-widest block mb-1">
                  {product.category} · Heritage
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#162010] font-normal leading-snug">{product.name}</h2>
                <p className="text-xs text-[#5C6352] font-sans mt-1">{product.subtitle}</p>
              </div>

              {/* Price & Variant Selector */}
              <div className="space-y-3 border-t border-b border-[#D9CEBC] py-4">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-mono font-bold text-[#162010]">
                    ₹{selectedVariant.price}
                  </span>
                  {selectedVariant.originalPrice && (
                    <span className="text-sm text-[#5C6352] line-through font-mono">
                      ₹{selectedVariant.originalPrice}
                    </span>
                  )}
                  <span className="text-[10px] font-mono font-bold text-[#33441B] bg-[#ECE4D5] border border-[#D9CEBC] px-2 py-0.5 rounded">
                    Tax Inclusive
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-[#162010] uppercase tracking-wider">
                    Select Pack Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                          selectedVariant.id === v.id
                            ? 'bg-[#162010] text-[#F5EFE6] border-[#162010]'
                            : 'bg-[#ECE4D5] text-[#162010] border-[#D9CEBC] hover:bg-[#D9CEBC]'
                        }`}
                      >
                        {v.weight} · ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Incrementor */}
                <div className="flex items-center space-x-3 pt-2">
                  <label className="text-[10px] font-mono font-bold text-[#162010] uppercase">Quantity:</label>
                  <div className="flex items-center border border-[#D9CEBC] rounded-xl bg-[#ECE4D5] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-[#162010] hover:bg-[#D9CEBC] font-bold text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-bold text-[#162010]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-[#162010] hover:bg-[#D9CEBC] font-bold text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs: Benefits, Nutrition, Reviews */}
              <div className="space-y-3">
                <div className="flex space-x-4 border-b border-[#D9CEBC] text-xs font-mono font-bold">
                  <button
                    onClick={() => setActiveTab('benefits')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer uppercase ${
                      activeTab === 'benefits' ? 'border-[#162010] text-[#162010]' : 'border-transparent text-[#5C6352]'
                    }`}
                  >
                    Vedic Benefits
                  </button>
                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer uppercase ${
                      activeTab === 'nutrition' ? 'border-[#162010] text-[#162010]' : 'border-transparent text-[#5C6352]'
                    }`}
                  >
                    Nutritional Value
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer uppercase ${
                      activeTab === 'reviews' ? 'border-[#162010] text-[#162010]' : 'border-transparent text-[#6B6D62]'
                    }`}
                  >
                    Patron Reviews
                  </button>
                </div>

                {activeTab === 'benefits' && (
                  <ul className="space-y-1.5 text-xs text-[#6B6D62] font-sans">
                    {product.healthBenefits.map((b, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-[#C4703F] font-mono font-bold">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'nutrition' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {product.nutritionalInfo.map((info, i) => (
                      <div key={i} className="bg-[#EFECE3] p-2 rounded-lg border border-[#DFDACF]">
                        <span className="text-[10px] font-mono text-[#6B6D62] block">{info.label}</span>
                        <span className="font-bold font-sans text-[#151811]">{info.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-xs">
                    {/* Review Submission Form */}
                    <div className="bg-[#ECE4D5] p-3.5 rounded-2xl border border-[#D9CEBC] space-y-2.5">
                      <span className="text-[10px] font-mono font-bold text-[#162010] uppercase tracking-wider block">Write a Patron Review</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-[#5C6352]">Rating:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star className={`w-3.5 h-3.5 ${star <= newRating ? 'fill-[#D49B28] text-[#D49B28]' : 'text-[#D9CEBC]'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Your Name / Hyderabad Area..."
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full px-3 py-1.5 text-[11px] bg-[#FAF6F0] border border-[#D9CEBC] rounded-xl text-[#162010] focus:outline-none focus:border-[#162010]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Share your authentic experience with this harvest..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-3 py-1.5 text-[11px] bg-[#FAF6F0] border border-[#D9CEBC] rounded-xl text-[#162010] focus:outline-none focus:border-[#162010]"
                      />
                      <button
                        type="button"
                        onClick={handleSubmitModalReview}
                        disabled={!newComment.trim()}
                        className="w-full py-2.5 bg-[#162010] hover:bg-[#C25E2E] disabled:opacity-50 text-[#F5EFE6] font-mono font-bold text-[10px] uppercase rounded-xl transition-colors cursor-pointer"
                      >
                        Submit Patron Review
                      </button>
                    </div>

                    {/* Existing Reviews List */}
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((r) => (
                        <div key={r.id} className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#D9CEBC] space-y-1">
                          <div className="flex justify-between items-center font-bold text-[#162010] text-[11px]">
                            <span className="flex items-center space-x-1 font-mono">
                              <span>{r.author}</span>
                              {r.verifiedPurchase && (
                                <span className="text-[9px] bg-[#ECE4D5] text-[#33441B] font-bold px-1.5 py-0.5 rounded border border-[#D9CEBC]">Verified</span>
                              )}
                            </span>
                            <span className="text-[#D49B28] font-mono flex items-center">
                              <Star className="w-3 h-3 fill-[#D49B28] text-[#D49B28] mr-0.5" />
                              {r.rating}.0
                            </span>
                          </div>
                          <p className="text-[#5C6352] font-sans text-[11px] leading-relaxed">"{r.comment}"</p>
                          <span className="text-[9px] font-mono text-[#5C6352] block pt-0.5">{r.date}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-[#5C6352] text-xs font-mono italic">
                        No reviews yet. Be the first patron to share your feedback above!
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* CTAs */}
            <div className="flex space-x-3 pt-4 border-t border-[#D9CEBC]">
              <button
                onClick={handleAddToCartClick}
                className="w-1/2 py-3 rounded-xl border border-[#162010] text-[#162010] hover:bg-[#162010] hover:text-[#F5EFE6] font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={handleBuyNowClick}
                className="w-1/2 py-3 rounded-xl bg-[#C25E2E] hover:bg-[#9E451A] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md transition-transform active:scale-98 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>Buy Now</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
