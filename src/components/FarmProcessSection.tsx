'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Flame, Sun, Droplets, Heart } from 'lucide-react';

export const FarmProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Indigenous Heirloom Sourcing',
      tag: 'Native Gir Bloodline',
      desc: 'Free-grazing indigenous Gir cows feeding on open natural pastures, and organic non-GMO heirloom seeds cultivated without synthetic fertilizers or chemical pesticides.',
      icon: Heart,
      metric: '100% Native Breed'
    },
    {
      num: '02',
      title: 'Ancestral Bilona Churning',
      tag: 'Sacred Clay & Wood',
      desc: 'Whole raw milk naturally cultured into probiotic curd, bi-directionally hand-churned with wooden bilonas in earthen clay pots, and slow-simmered over wood fire.',
      icon: Flame,
      metric: '5-Step Vedic Method'
    },
    {
      num: '03',
      title: 'Zero-Heat Vaagai Pressing',
      tag: 'Under 40°C Mortar',
      desc: 'Traditional Marachekku wooden Ghani presses seeds with zero friction heat, retaining active enzymes, volatile aroma compounds, and raw botanical potency.',
      icon: Droplets,
      metric: 'Zero Chemical Solvents'
    },
    {
      num: '04',
      title: 'Natural Sun Sedimentation',
      tag: 'Zero Refining Solvents',
      desc: 'Zero hexane, zero artificial deodorizers, and zero bleaching chemicals. Our oils and ghee settle purely by gravity under natural filtered sunlight.',
      icon: Sun,
      metric: 'Unrefined & Pure'
    }
  ];

  return (
    <section id="traditional-process" className="py-10 sm:py-20 bg-[#F5EFE6] border-b border-[#D9CEBC] relative overflow-hidden">
      
      {/* Background grain */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">
        
        {/* Editorial Section Header */}
        <div className="border-b border-[#D9CEBC] pb-6 sm:pb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#C25E2E] bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#D9CEBC]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C25E2E]" />
              <span className="font-bold">Standard of Ancestral Integrity</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#162010] leading-[1.08] tracking-tight">
              Our Ancient Extraction Discipline
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#5C6352] font-sans leading-relaxed max-w-md bg-[#FAF6F0]/90 p-4 sm:p-5 rounded-2xl border border-[#D9CEBC] text-left shadow-xs">
            We adhere strictly to timeless Vedic science, earthen pottery bilona churning, and zero-heat Marachekku wooden pressing, preserving nature&apos;s vital botanical potency.
          </p>
        </div>

        {/* Numbered Editorial Signature Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative text-left">
          {steps.map((step) => {
            const IconComp = step.icon;
            return (
              <div 
                key={step.num} 
                className="clay-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-all duration-300 group hover:border-[#C25E2E]"
              >
                <div className="space-y-4">
                  {/* Step Num & Tag */}
                  <div className="flex items-center justify-between border-b border-[#D9CEBC] pb-3">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[#162010] group-hover:text-[#C25E2E] transition-colors">
                      ({step.num})
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#33441B] font-bold px-2 py-0.5 bg-[#FAF6F0] border border-[#D9CEBC] rounded">
                      {step.tag}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <IconComp className="w-4 h-4 text-[#C25E2E] shrink-0" />
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#162010] group-hover:text-[#C25E2E] transition-colors leading-snug">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#5C6352] font-sans leading-relaxed pt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D9CEBC] flex items-center justify-between text-[10px] font-mono text-[#5C6352] uppercase tracking-wider">
                  <span>Standard</span>
                  <span className="text-[#33441B] font-bold">{step.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
