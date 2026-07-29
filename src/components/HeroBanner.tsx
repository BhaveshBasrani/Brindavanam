'use client';

import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <div className="relative bg-[#F7F6F2] py-16 lg:py-24 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-block border-b border-[#3A5303] pb-1">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#3A5303]">
                Artisanal Organic Produce • Native Heirloom Farms
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-stone-900 leading-[1.1] font-normal">
              Pure Wood-Pressed Oils <br />
              <span className="italic text-[#3A5303]">& A2 Desi Cow Bilona Ghee</span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base font-light max-w-xl leading-relaxed">
              Handcrafted in small batches using ancient Vedic methods. Slow wood-fire hand-churned Gir Cow Bilona Ghee, zero-heat Marachekku pressed oils, and fresh unadulterated Paneer.
            </p>

            {/* Key Quality Pillars */}
            <div className="flex flex-wrap gap-6 pt-2 text-xs font-semibold text-stone-700">
              <span className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-[#3A5303]" />
                <span>Wood-Fire Hand Churned</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-[#3A5303]" />
                <span>Zero Chemicals or Bleach</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-[#3A5303]" />
                <span>Glass Packaging</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center space-x-4">
              <button
                onClick={onShopNow}
                className="px-8 py-3.5 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center space-x-2 shadow-xs"
              >
                <span>Shop Organic Lineup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href="#traditional-process"
                className="px-6 py-3.5 text-stone-700 hover:text-[#3A5303] font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                Our Process
              </a>
            </div>
          </div>

          {/* Right Column: Clean Editorial Visual */}
          <div className="lg:col-span-5">
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-stone-300 shadow-sm bg-stone-200">
              <img
                src="https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80"
                alt="A2 Bilona Desi Ghee"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-stone-200/80">
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#3A5303] block mb-1">
                  100% Certified A2 Beta-Casein
                </span>
                <p className="text-xs font-serif font-bold text-stone-900">A2 Desi Gir Cow Bilona Ghee</p>
                <p className="text-[10px] text-stone-500 mt-0.5">Hand-churned from curd over clay pots & low wood fire.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
