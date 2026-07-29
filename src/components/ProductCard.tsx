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
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 flex flex-col justify-between hover:border-[#3A5303] transition-all duration-300 group shadow-xs hover:shadow-md">
      <div>
        {/* Product Image Link to Detail Page */}
        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-4">
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
            <span className="absolute top-2.5 left-2.5 bg-[#3A5303] text-white text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-xs">
              {product.badge}
            </span>
          )}

          <button
            onClick={() => onQuickView(product)}
            className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-stone-800 rounded-full shadow-md transition-all active:scale-90"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4 text-[#3A5303]" />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span className="text-amber-600 font-bold">★ {product.rating} ({product.reviewsCount})</span>
            <span className="uppercase text-[10px] tracking-wider text-[#3A5303] font-bold bg-[#3A5303]/10 px-2 py-0.5 rounded">{product.category}</span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="text-base sm:text-lg font-serif font-normal text-stone-900 group-hover:text-[#3A5303] transition-colors leading-tight block pt-1"
          >
            {product.name}
          </Link>
          <p className="text-xs text-stone-500 font-light line-clamp-1">{product.subtitle}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Touch Optimized Variant Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-xl transition-all active:scale-95 shrink-0 min-h-[36px] ${
                selectedVariant.id === v.id
                  ? 'bg-[#3A5303] text-white shadow-xs'
                  : 'bg-[#F7F6F2] text-stone-700 hover:bg-stone-200 border border-stone-200/80'
              }`}
            >
              {v.weight}
            </button>
          ))}
        </div>

        {/* Price & Add Action for Mobile Thumbs */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 gap-2">
          <div>
            <span className="text-lg font-bold text-[#3A5303]">₹{selectedVariant.price}</span>
            {selectedVariant.originalPrice && (
              <span className="text-xs text-stone-400 line-through ml-1.5">₹{selectedVariant.originalPrice}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-md flex items-center space-x-1.5 min-h-[44px] ${
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
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
