'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types/store';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/80 p-5 flex flex-col justify-between hover:border-[#3A5303] transition-all duration-300 group">
      <div>
        {/* Product Image Link to Detail Page */}
        <Link href={`/products/${product.id}`} className="block aspect-4/3 rounded-lg overflow-hidden bg-stone-100 mb-4 relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
          />
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 bg-[#3A5303] text-white text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm">
              {product.badge}
            </span>
          )}
        </Link>

        {/* Product Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>★ {product.rating} ({product.reviewsCount})</span>
            <span className="capitalize">{product.category}</span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="text-base font-serif font-normal text-stone-900 group-hover:text-[#3A5303] transition-colors leading-tight block"
          >
            {product.name}
          </Link>
          <p className="text-xs text-stone-500 font-light line-clamp-1">{product.subtitle}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Variant Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded transition-colors ${
                selectedVariant.id === v.id
                  ? 'bg-[#3A5303] text-white'
                  : 'bg-[#F7F6F2] text-stone-600 hover:bg-stone-200'
              }`}
            >
              {v.weight}
            </button>
          ))}
        </div>

        {/* Price & Add Action */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div>
            <span className="text-base font-semibold text-[#3A5303]">₹{selectedVariant.price}</span>
            {selectedVariant.originalPrice && (
              <span className="text-xs text-stone-400 line-through ml-2">₹{selectedVariant.originalPrice}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#3A5303] hover:bg-[#2b3e02] text-white'
            }`}
          >
            {added ? 'Added' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  );
};
