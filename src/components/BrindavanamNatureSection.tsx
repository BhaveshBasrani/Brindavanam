'use client';

import React from 'react';
import { Milk, Flame, Droplets, Egg, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface BrindavanamNatureSectionProps {
  onSelectCategory?: (category: string) => void;
}

export const BrindavanamNatureSection: React.FC<BrindavanamNatureSectionProps> = ({ onSelectCategory }) => {
  const cards = [
    {
      id: 'milk',
      title: 'A2 Desi Cow Milk',
      badge: '100% NATIVE GIR COW',
      icon: Milk,
      description:
        'Our fresh A2 Desi Cow Milk comes from native cows raised in a natural, stress-free environment. The cows are fed wholesome, natural feed and cared for with love. We never dilute our milk with water and never add preservatives or chemicals.',
      sectionTitle: 'WHY CHOOSE OUR MILK?',
      points: [
        '100% Pure A2 Desi Cow Milk',
        'No added water & zero dilution',
        'No preservatives or chemicals',
        'Farm fresh, delivered directly to your home',
        'Naturally rich in nutrients and taste'
      ]
    },
    {
      id: 'ghee',
      title: 'A2 Desi Cow Bilona Ghee',
      badge: 'TRADITIONAL BILONA METHOD',
      icon: Flame,
      description:
        'Handcrafted using the sacred 5-step Vedic Bilona method from curd of free-grazing Desi cows. Churned with two-way wooden bilona in earthen clay pots and slow-cooked over gentle wood fire for unmatched aroma and medicinal purity.',
      sectionTitle: 'WHY OUR GHEE?',
      points: [
        'Curd-churned in clay pots (Vedic Bilona)',
        'Simmered over slow natural wood fire',
        'Rich in Fat-Soluble Vitamins A, D, E, K',
        '0% trans fat & zero synthetic chemicals',
        'Golden granular texture with rich aroma'
      ]
    },
    {
      id: 'paneer',
      title: 'Fresh Desi Paneer',
      badge: 'HANDCRAFTED DAILY',
      icon: Sparkles,
      description:
        'Our paneer is handcrafted daily using our own fresh A2 Desi Cow Milk. It is soft, fresh, and made without artificial additives, preservatives, or fillers, making it perfect for healthy family meals.',
      sectionTitle: 'HIGHLIGHTS',
      points: [
        'Made from fresh A2 Desi Cow Milk',
        'Soft, fresh, and protein-rich (18g protein)',
        'No preservatives or artificial ingredients',
        'Prepared in hygienic conditions daily',
        'Hand-pressed in clean muslin cloth'
      ]
    },
    {
      id: 'oil',
      title: 'Wood-Pressed Oils',
      badge: 'MARACHEKKU COLD PRESSED',
      icon: Droplets,
      description:
        'We offer traditionally extracted wood-pressed oils (Groundnut, Sesame, Kusuma, Mustard, Coconut) that retain their natural aroma, nutrients, and authentic flavor. Slow extraction preserves the seed goodness without excessive heat or chemicals.',
      sectionTitle: 'OUR PROMISE',
      points: [
        'Traditional wood-pressed extraction under 40°C',
        'No chemicals, bleaching, or refining',
        'No artificial colors or preservatives',
        'Rich natural taste, aroma, and antioxidants',
        'Settled by gravity under natural sunlight'
      ]
    },
    {
      id: 'eggs',
      title: 'Farm Fresh Eggs',
      badge: 'FREE-RANGE HEN EGGS',
      icon: Egg,
      description:
        'Our eggs come from naturally raised hens that are cared for in a healthy, stress-free environment. We focus on quality, freshness, and responsible farming to bring nutritious eggs straight to your table.',
      sectionTitle: 'WHY OUR EGGS?',
      points: [
        '100% Farm fresh & naturally produced',
        'Non-caged, free pasture grazing country hens',
        'Hygienically handled and carefully packed',
        'Fresh from the farm directly to your home',
        'Rich in natural proteins, Omega-3 & vitamins'
      ]
    }
  ];

  const handleCategoryClick = (catKey: string) => {
    if (onSelectCategory) {
      onSelectCategory(catKey);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="brindavanam-nature" className="py-8 sm:py-16 bg-[#F5EFE6] border-b border-[#D9CEBC] relative overflow-hidden font-sans">
      
      {/* Background grain */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">
        
        {/* 1. TOP EDITORIAL HEADER (Client Content & Layout Authority) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-block">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#33441B] font-bold bg-[#FAF6F0] px-4 py-1.5 rounded-full border border-[#D9CEBC] shadow-xs">
              Brindavanam Farms
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#162010] tracking-tight font-normal leading-[1.08]">
            Pure. Natural. Honest.
          </h1>

          <p className="text-xs sm:text-sm text-[#5C6352] font-sans leading-relaxed max-w-2xl mx-auto">
            Welcome to <strong className="text-[#162010] font-semibold">Brindavanam Farms</strong>, where every product is prepared with care, purity, and respect for nature. We believe that healthy food begins with healthy farming, happy animals, and honest practices. Our mission is to bring farm-fresh, chemical-free products directly to your family.
          </p>
        </div>

        {/* 2. TWO-COLUMN PRODUCT HIGHLIGHT CARDS (Exact Layout & Content from Client Mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className="clay-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5 transition-all duration-300 group hover:border-[#C25E2E] shadow-xs text-left"
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Card Header: Icon + Title + Badge */}
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#33441B] text-[#F5EFE6] flex items-center justify-center shrink-0 shadow-xs">
                      <IconComponent className="w-5 h-5 text-[#D49B28]" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#162010] group-hover:text-[#C25E2E] transition-colors leading-tight">
                        {card.title}
                      </h2>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#33441B] font-bold">
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#5C6352] font-sans leading-relaxed">
                    {card.description}
                  </p>

                  {/* Bullet Highlights Grid */}
                  <div className="pt-2 border-t border-[#D9CEBC]/70 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#162010] font-bold block">
                      {card.sectionTitle}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#162010] font-sans">
                      {card.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-[#33441B] shrink-0 mt-0.5" />
                          <span className="text-xs text-[#162010] leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Action Link to Parent Page */}
                <div className="pt-3 border-t border-[#D9CEBC] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#5C6352] uppercase tracking-wider">
                    Direct Farm Harvest
                  </span>
                  <button
                    onClick={() => handleCategoryClick(card.id)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold font-mono uppercase tracking-wider text-[#F5EFE6] bg-[#162010] group-hover:bg-[#C25E2E] px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span>View Lineup</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. BOTTOM COMMITMENT BANNER (Exact Client Layout & Content) */}
        <div className="bg-[#33441B] text-[#F5EFE6] rounded-3xl p-6 sm:p-10 border border-[#243315] shadow-lg text-center space-y-4 max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-serif text-[#F5EFE6] font-normal">
            Our Commitment to Your Family
          </h3>
          <p className="text-xs sm:text-sm text-[#ECE4D5]/90 font-sans leading-relaxed max-w-2xl mx-auto">
            At <strong className="text-white font-semibold">Brindavanam Farms</strong>, purity is our commitment. We believe food should be as nature intended—fresh, wholesome, and free from unnecessary chemicals. Every product reflects our dedication to quality, sustainability, and the well-being of your family.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleCategoryClick('all')}
              className="px-6 py-2.5 sm:py-3 bg-[#D49B28] hover:bg-[#E8B44A] text-[#162010] font-mono text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all active:scale-95 cursor-pointer shadow-md inline-flex items-center space-x-2"
            >
              <span>From Our Farm to Your Home — Naturally</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
