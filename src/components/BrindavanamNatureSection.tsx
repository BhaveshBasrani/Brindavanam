'use client';

import React from 'react';
import { CheckCircle2 as CheckIcon } from 'lucide-react';

export const BrindavanamNatureSection: React.FC = () => {
  return (
    <section id="brindavanam-nature" className="py-16 sm:py-24 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Intro Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#3A5303] bg-[#3A5303]/10 px-4 py-1.5 rounded-full inline-block">
            Brindavanam Nature Centre
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-stone-900 font-normal">
            Pure. Natural. Honest.
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
            Welcome to Brindavanam Nature Centre, where every product is prepared with care, purity, and respect for nature. We believe that healthy food begins with healthy farming, happy animals, and honest practices. Our mission is to bring farm-fresh, chemical-free products directly to your family.
          </p>
        </div>

        {/* 4 Pillars Grid: Milk, Paneer, Oils, Eggs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Pillar 1: A2 Desi Cow Milk */}
          <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-stone-200/80 space-y-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3A5303] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                🥛
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">A2 Desi Cow Milk</h3>
                <span className="text-[10px] uppercase font-bold text-[#3A5303] tracking-widest">100% Native Gir Cow</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Our fresh A2 Desi Cow Milk comes from native cows raised in a natural, stress-free environment. The cows are fed wholesome, natural feed and cared for with love. We never dilute our milk with water and never add preservatives or chemicals.
            </p>

            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Why choose our milk?</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>100% Pure A2 Desi Cow Milk</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>No added water</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>No preservatives or chemicals</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Farm fresh, delivered directly to your home</span>
                </li>
                <li className="flex items-center space-x-2 col-span-1 sm:col-span-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Naturally rich in nutrients and taste</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 2: Fresh Paneer */}
          <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-stone-200/80 space-y-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3A5303] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                🧀
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Fresh Desi Paneer</h3>
                <span className="text-[10px] uppercase font-bold text-[#3A5303] tracking-widest">Handcrafted Daily</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Our paneer is handcrafted using our own fresh A2 Desi Cow Milk. It is soft, fresh, and made without artificial additives, preservatives, or fillers, making it perfect for healthy family meals.
            </p>

            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Highlights</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Made from fresh A2 Desi Cow Milk</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Soft, fresh, and protein-rich</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>No preservatives or artificial ingredients</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Prepared in hygienic conditions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 3: Wood-Pressed Oils */}
          <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-stone-200/80 space-y-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3A5303] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                🌿
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Wood-Pressed Oils</h3>
                <span className="text-[10px] uppercase font-bold text-[#3A5303] tracking-widest">Marachekku Cold Pressed</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              We offer traditionally extracted wood-pressed oils that retain their natural aroma, nutrients, and authentic flavor. The slow extraction process helps preserve the goodness of the seeds without excessive heat or chemicals.
            </p>

            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Our Promise</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Traditional wood-pressed extraction</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>No chemicals or refining</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>No artificial colors or preservatives</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Rich natural taste and nutrition</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 4: Farm Fresh Eggs */}
          <div className="bg-[#F7F6F2] p-8 rounded-3xl border border-stone-200/80 space-y-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3A5303] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                🥚
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Farm Fresh Eggs</h3>
                <span className="text-[10px] uppercase font-bold text-[#3A5303] tracking-widest">Free-Range Hen Eggs</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Our eggs come from naturally raised hens that are cared for in a healthy environment. We focus on quality, freshness, and responsible farming to bring nutritious eggs to your table.
            </p>

            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Why our eggs?</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Farm fresh</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Naturally produced</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Hygienically handled</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-[#3A5303] shrink-0" />
                  <span>Fresh from the farm to your home</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Banner Commitment */}
        <div className="bg-[#3A5303] text-white p-8 sm:p-10 rounded-3xl text-center space-y-3 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-serif font-normal">Our Commitment to Your Family</h3>
          <p className="text-xs sm:text-sm text-stone-200 font-light max-w-3xl mx-auto leading-relaxed">
            At Brindavanam Nature Centre, purity is our commitment. We believe food should be as nature intended—fresh, wholesome, and free from unnecessary chemicals. Every product reflects our dedication to quality, sustainability, and the well-being of your family.
          </p>
          <div className="pt-2">
            <span className="inline-block px-5 py-2 bg-[#94C000] text-[#1c260b] text-xs font-extrabold rounded-full uppercase tracking-wider">
              From Our Farm to Your Home — Naturally.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
