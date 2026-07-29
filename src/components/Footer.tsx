'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1c260b] text-stone-300 pt-16 pb-12 border-t border-stone-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <span className="text-2xl font-serif italic text-white block">Brindavanam</span>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Rooted in ancient Vedic agricultural traditions. Handcrafted A2 Bilona Ghee, zero-heat wood-pressed oils, and artisanal Desi Paneer.
            </p>
          </div>

          {/* Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white font-sans">Collection</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li><a href="#" className="hover:text-white transition-colors">A2 Gir Cow Bilona Ghee</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Wood-Pressed Groundnut Oil</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Virgin Cold-Pressed Coconut Oil</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cold-Pressed Kusuma Oil</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Organic Fresh Paneer</a></li>
            </ul>
          </div>

          {/* Standards */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white font-sans">Pillars</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li>Vedic Bilona Method</li>
              <li>Marachekku Wood Pressing</li>
              <li>Zero Chemical Solvents</li>
              <li>Glass Jar Packaging</li>
              <li>100% Lab Tested Batches</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white font-sans">Farm Desk</h4>
            <div className="space-y-1.5 text-xs text-stone-400 font-light">
              <p>Native Organic Estate, India</p>
              <p>care@brindavanamorganic.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-light">
          <p>© 2026 Brindavanam Organic Farms. All rights reserved.</p>
          <div className="flex items-center space-x-3 text-stone-400">
            <span>Next.js</span>
            <span>•</span>
            <span>Razorpay</span>
            <span>•</span>
            <span>Firebase</span>
            <span>•</span>
            <span>Google Apps Script</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
