'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types/store';
import { ShoppingBag, Eye, Check, ArrowRight } from 'lucide-react';

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

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div className="clay-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 group relative">
      <div className="space-y-3">
        {/* Product Image Link to Detail Page */}
        <div className="relative aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden bg-[#ECE4D5] border border-[#D9CEBC]">
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
            <span className="absolute top-2.5 left-2.5 bg-[#162010]/90 text-[#F5EFE6] text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold px-2 py-0.5 rounded-lg shadow-sm font-mono backdrop-blur-xs">
              {product.badge}
            </span>
          )}

          <button
            onClick={() => onQuickView(product)}
            className="absolute top-2.5 right-2.5 p-1.5 sm:p-2 bg-[#FAF6F0]/90 hover:bg-[#FAF6F0] text-[#162010] rounded-xl border border-[#D9CEBC] shadow-xs transition-all active:scale-90 cursor-pointer backdrop-blur-xs"
            title="Inspect Produce Details"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5 text-[#162010]" />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between text-xs text-[#5C6352] font-mono">
            <span className="uppercase text-[9px] tracking-wider text-[#33441B] font-bold bg-[#FAF6F0] border border-[#D9CEBC] px-2 py-0.5 rounded">
              {product.category}
            </span>
            <span className="text-[10px] text-[#C25E2E] font-medium">100% Raw</span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="text-base sm:text-lg font-serif font-bold text-[#162010] group-hover:text-[#C25E2E] transition-colors leading-snug block line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>
          <p className="text-xs text-[#5C6352] font-sans line-clamp-2 leading-relaxed">{product.subtitle}</p>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-[#D9CEBC] space-y-3">
        {/* Variant Selection */}
        <div className="flex flex-wrap items-center gap-1">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                selectedVariant.id === v.id
                  ? 'bg-[#162010] text-[#F5EFE6] shadow-xs'
                  : 'bg-[#FAF6F0] text-[#162010] hover:bg-[#ECE4D5] border border-[#D9CEBC]'
              }`}
            >
              {v.weight}
            </button>
          ))}
        </div>

        {/* Price & Add Action */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-lg sm:text-xl font-bold text-[#162010] font-mono">₹{selectedVariant.price}</span>
            {selectedVariant.originalPrice && (
              <span className="text-[11px] text-[#5C6352] line-through ml-1 font-mono">₹{selectedVariant.originalPrice}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center space-x-1 cursor-pointer shrink-0 border ${
              added
                ? 'bg-[#33441B] text-white border-[#33441B]'
                : 'bg-[#162010] hover:bg-[#C25E2E] text-[#F5EFE6] border-[#162010]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 text-[#D49B28]" />
                <span>+ Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
