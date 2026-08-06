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
    <div className="bg-white rounded-2xl border border-stone-200/90 p-3 sm:p-3.5 flex flex-col justify-between hover:border-[#3A5303] transition-all duration-300 group shadow-xs hover:shadow-md">
      <div>
        {/* Product Image Link to Detail Page */}
        <div className="relative aspect-[16/11] rounded-xl overflow-hidden bg-stone-100 mb-2.5">
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
            <span className="absolute top-2 left-2 bg-[#3A5303] text-white text-[8px] sm:text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md shadow-xs">
              {product.badge}
            </span>
          )}

          <button
            onClick={() => onQuickView(product)}
            className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded-full shadow-md transition-all active:scale-90"
            title="Quick View Details"
          >
            <Eye className="w-3.5 h-3.5 text-[#3A5303]" />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium mb-0.5">
            <span className="text-amber-600 font-bold">★ {product.rating} ({product.reviewsCount})</span>
            <span className="uppercase text-[9px] tracking-wider text-[#3A5303] font-bold bg-[#3A5303]/10 px-1.5 py-0.5 rounded">{product.category}</span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="text-sm sm:text-base font-serif font-bold text-stone-900 group-hover:text-[#3A5303] transition-colors leading-tight block truncate"
            title={product.name}
          >
            {product.name}
          </Link>
          <p className="text-[11px] text-stone-500 font-light line-clamp-1 leading-snug">{product.subtitle}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {/* Touch Optimized Variant Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 scrollbar-none">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={`px-2 py-1 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all active:scale-95 shrink-0 ${
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
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 gap-1.5">
          <div className="shrink-0">
            <span className="text-base sm:text-lg font-bold text-[#3A5303]">₹{selectedVariant.price}</span>
            {selectedVariant.originalPrice && (
              <span className="text-[11px] text-stone-400 line-through ml-1">₹{selectedVariant.originalPrice}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-sm flex items-center space-x-1 shrink-0 ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#3A5303] hover:bg-[#2b3e02] text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 text-[#94C000]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
