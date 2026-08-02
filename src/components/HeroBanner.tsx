'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

interface HeroBannerProps {
  onShopNow: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80';

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [heroImgError, setHeroImgError] = useState<Record<string, boolean>>({});

  // Auto-switch products every 4.5 seconds (unless hovered)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const currentProduct = PRODUCTS[currentIndex];
  const activeHeroImg = heroImgError[currentProduct.id] ? FALLBACK_IMAGE : (currentProduct.images[0] || FALLBACK_IMAGE);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  };

  const handleScrollToNature = () => {
    const el = document.getElementById('brindavanam-nature');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onShopNow();
    }
  };

  return (
    <div 
      className="relative bg-[#F7F6F2] overflow-hidden pt-28 sm:pt-32 pb-12 sm:pb-16 border-b border-stone-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#94C000]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#3A5303]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#3A5303]/10 border border-[#3A5303]/20 text-[#3A5303] text-[11px] font-bold uppercase tracking-widest mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-[#94C000]" />
              <span>Artisanal Organic Produce • Native Heirloom Farms</span>
            </div>

            {/* Compact Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-stone-900 leading-[1.2] font-normal">
              Pure Wood-Pressed Oils <br className="hidden sm:inline" />
              <span className="italic text-[#3A5303] font-normal">& A2 Desi Cow Bilona Ghee</span>
            </h1>

            <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Handcrafted in small batches using ancient Vedic methods. Slow wood-fire hand-churned Gir Cow Bilona Ghee, zero-heat Marachekku pressed oils, and fresh unadulterated Paneer.
            </p>

            {/* Dynamic Product Spotlight Tag (Clickable to jump to catalog) */}
            <div 
              onClick={onShopNow}
              className="bg-white/90 p-3 rounded-2xl border border-stone-200 shadow-xs max-w-lg mx-auto lg:mx-0 cursor-pointer hover:border-[#3A5303] transition-all group"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#94C000] animate-pulse shrink-0" />
                    <div>
                      <span className="font-bold text-stone-900 group-hover:text-[#3A5303] block transition-colors">{currentProduct.name}</span>
                      <span className="text-[10px] text-stone-500 line-clamp-1">{currentProduct.subtitle}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#3A5303] bg-[#3A5303]/10 px-3 py-1 rounded-full text-[11px] shrink-0">
                    ₹{currentProduct.variants[0].price}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Key Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-left max-w-lg mx-auto lg:mx-0 text-xs font-medium text-stone-700">
              <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-xl border border-stone-200/80 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3A5303] shrink-0" />
                <span>Wood-Fire Hand Churned</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-xl border border-stone-200/80 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3A5303] shrink-0" />
                <span>Zero Chemicals or Bleach</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-xl border border-stone-200/80 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3A5303] shrink-0" />
                <span>Glass Packaging</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={onShopNow}
                  className="w-full sm:w-auto px-7 py-3 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Shop Organic Lineup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleScrollToNature}
                  className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-2xl border border-stone-300 shadow-xs transition-all active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Leaf className="w-4 h-4 text-[#3A5303]" />
                  <span>Our Vedic Process</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Auto-Switching Product Card Image */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-0 sm:-left-4 z-20 p-2.5 rounded-full bg-white/90 shadow-md text-stone-700 hover:bg-[#3A5303] hover:text-white transition-colors cursor-pointer"
              title="Previous Organic Produce"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div 
              onClick={onShopNow}
              className="relative w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-stone-200 group cursor-pointer"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentProduct.id}
                  src={activeHeroImg}
                  alt={currentProduct.name}
                  onError={() => setHeroImgError((prev) => ({ ...prev, [currentProduct.id]: true }))}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5 text-left">
                <span className="px-3 py-1 rounded-full bg-[#94C000] text-[#1c260b] text-[10px] font-bold uppercase tracking-wider inline-block">
                  {currentProduct.badge || '100% Certified Organic'}
                </span>
                <h3 className="text-2xl font-serif font-normal">{currentProduct.name}</h3>
                <p className="text-xs text-stone-200 font-light">{currentProduct.extractionMethod}</p>
                <div className="pt-2 flex items-center justify-between font-bold text-sm text-[#94C000]">
                  <span>Starting at ₹{currentProduct.variants[0].price}</span>
                  <span className="text-xs text-white/80 font-normal">★ {currentProduct.rating} ({currentProduct.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-0 sm:-right-4 z-20 p-2.5 rounded-full bg-white/90 shadow-md text-stone-700 hover:bg-[#3A5303] hover:text-white transition-colors cursor-pointer"
              title="Next Organic Produce"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -left-2 sm:left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-xl flex items-center space-x-3 hidden sm:flex z-10">
              <div className="w-10 h-10 rounded-xl bg-[#3A5303] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#94C000]" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">100% Certified Native Farm</span>
                <span className="text-stone-500 text-[10px]">Zero Adulteration Guarantee</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
