'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types/store';
import { ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(product.images[0] || FALLBACK_IMAGE);

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 flex flex-col justify-between hover:border-[#3A5303] transition-all duration-300 group shadow-xs hover:shadow-md">
      <div>
        {/* Product Image Link to Detail Page */}
        <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-stone-100 mb-3.5">
          <Link href={`/products/${product.id}`} className="block w-full h-full">
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[#3A5303] text-white text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-xs">
              {product.badge}
            </span>
          )}

          <button
            onClick={() => onQuickView(product)}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-stone-800 rounded-full shadow-md transition-all active:scale-90"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4 text-[#3A5303]" />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span className="text-amber-600 font-bold">★ {product.rating} ({product.reviewsCount})</span>
            <span className="uppercase text-[10px] tracking-wider text-[#3A5303] font-bold bg-[#3A5303]/10 px-2 py-0.5 rounded">{product.category}</span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-[#3A5303] transition-colors leading-snug block"
            title={product.name}
          >
            {product.name}
          </Link>
          <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed">{product.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {/* Touch Optimized Variant Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase rounded-xl transition-all active:scale-95 cursor-pointer ${
                selectedVariant.id === v.id
                  ? 'bg-[#3A5303] text-white shadow-xs'
                  : 'bg-[#F7F6F2] text-stone-700 hover:bg-stone-200 border border-stone-200/80'
              }`}
            >
              {v.weight}
            </button>
          ))}
        </div>

        {/* Price & Add Action */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 gap-2">
          <div>
            <span className="text-lg sm:text-xl font-bold text-[#3A5303]">₹{selectedVariant.price}</span>
            {selectedVariant.originalPrice && (
              <span className="text-xs text-stone-400 line-through ml-1.5">₹{selectedVariant.originalPrice}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`px-4 sm:px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-md flex items-center space-x-1.5 cursor-pointer ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#3A5303] hover:bg-[#2b3e02] text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#94C000]" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
