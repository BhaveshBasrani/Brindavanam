'use client';

import React from 'react';

export const FarmProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Native Heirloom Produce',
      desc: 'Free-roaming Desi Gir cows and sun-dried organic seeds sourced directly from village farmers.'
    },
    {
      num: '02',
      title: 'Vedic Bilona Churning',
      desc: 'Milk converted to curd, bi-directionally hand-churned, and simmered slowly on wood fires.'
    },
    {
      num: '03',
      title: 'Zero-Heat Wood Pressing',
      desc: 'Marachekku wooden Ghani presses seeds under 45°C to lock in natural antioxidants.'
    },
    {
      num: '04',
      title: 'Zero Chemical Refining',
      desc: 'No chemical solvents, no mineral oils, and zero bleach. Pure unadulterated nature.'
    }
  ];

  return (
    <section id="traditional-process" className="py-20 bg-[#F7F6F2] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#3A5303] block mb-2">
            Standard of Integrity
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-stone-900 leading-tight">
            Our Ancient Extraction Method
          </h2>
        </div>

        {/* Minimalist Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          {steps.map((step, idx) => (
            <div key={idx} className={`${idx !== 0 ? 'pt-6 md:pt-0 md:pl-8' : ''} space-y-3`}>
              <span className="text-3xl font-serif italic text-[#3A5303] block">
                {step.num}
              </span>
              <h3 className="text-base font-semibold text-stone-900 tracking-tight">
                {step.title}
              </h3>
              <p className="text-stone-600 text-xs font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
