'use client';

import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <div className="relative bg-[#F7F6F2] overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24 border-b border-stone-200">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#94C000]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#3A5303]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#3A5303]/10 border border-[#3A5303]/20 text-[#3A5303] text-xs font-bold uppercase tracking-widest mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-[#94C000]" />
              <span>Artisanal Organic Produce • Native Heirloom Farms</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-stone-900 leading-[1.15] font-normal">
              Pure Wood-Pressed Oils <br className="hidden sm:inline" />
              <span className="italic text-[#3A5303] font-normal">& A2 Desi Cow Bilona Ghee</span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Handcrafted in small batches using ancient Vedic methods. Slow wood-fire hand-churned Gir Cow Bilona Ghee, zero-heat Marachekku pressed oils, and fresh unadulterated Paneer.
            </p>

            {/* Key Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left max-w-lg mx-auto lg:mx-0 text-xs font-medium text-stone-700">
              <div className="flex items-center space-x-2 bg-white/80 p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#3A5303] shrink-0" />
                <span>Wood-Fire Hand Churned</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#3A5303] shrink-0" />
                <span>Zero Chemicals or Bleach</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#3A5303] shrink-0" />
                <span>Glass Packaging</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto px-8 py-4 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center space-x-2"
              >
                <span>Shop Organic Lineup</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-2xl border border-stone-300 shadow-xs transition-all active:scale-98 flex items-center justify-center space-x-2"
              >
                <Leaf className="w-4 h-4 text-[#3A5303]" />
                <span>Our Vedic Process</span>
              </button>
            </div>

          </div>

          {/* Right Column: Organic Hero Showcase Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-stone-200 group">
              <img
                src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1000&q=85"
                alt="A2 Desi Cow Bilona Ghee"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="px-3 py-1 rounded-full bg-[#94C000] text-[#1c260b] text-[10px] font-bold uppercase tracking-wider inline-block">
                  Vedic Hand-Churned
                </span>
                <h3 className="text-xl font-serif font-normal">A2 Gir Cow Bilona Ghee</h3>
                <p className="text-xs text-stone-200 font-light">Crafted in Earthen Clay Pots over Wood Fire</p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -left-2 sm:left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-xl flex items-center space-x-3 hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-[#3A5303] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#94C000]" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">100% Lab Tested & Certified</span>
                <span className="text-stone-500 text-[10px]">Zero Adulteration Guarantee</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
