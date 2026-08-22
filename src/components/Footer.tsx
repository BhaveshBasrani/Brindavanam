'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#162010] text-[#F5EFE6] pt-12 sm:pt-16 pb-8 border-t border-[#243315] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Brand Statement Header */}
        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C25E2E] block font-bold">
              Ancestral Vedic Agriculture · Hyderabad Estate
            </span>
            <Link href="/" className="text-2xl sm:text-4xl font-display uppercase font-bold tracking-tight text-[#F5EFE6] hover:text-[#D49B28] transition-colors block">
              Brindavanam Farms
            </Link>
            <p className="text-sm font-serif italic text-[#ECE4D5]/80 pt-0.5">
              Food from the land, made with patience.
            </p>
          </div>

          <p className="text-xs text-[#ECE4D5]/70 font-sans max-w-sm leading-relaxed">
            100% pure A2 Gir Cow Bilona Ghee, zero-heat Marachekku wooden-pressed oils, and farm-fresh unadulterated produce direct from our farm to your home.
          </p>
        </div>

        {/* All Products Compact Line (Required by Brand Documentation) */}
        <div className="bg-[#202B17] p-3 rounded-2xl border border-[#243315] text-center">
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#ECE4D5]/85">
            <span className="text-[#D49B28] font-bold">All Products:</span> Milk · Ghee · Peanut Oil · Sesame Oil · Kusuma Oil · Mustard Oil · Coconut Oil · Fresh Paneer · Free-Range Eggs
          </p>
        </div>

        {/* Clean 3-Column Navigation & Contact Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs text-left">
          
          {/* Column 1: Produce Collections */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D49B28] font-bold">Produce Collections</h4>
            <ul className="space-y-2 text-[#ECE4D5]/75 font-sans text-xs">
              <li>
                <Link href="/products/a2-bilona-ghee" className="hover:text-white transition-colors block">
                  A2 Gir Cow Bilona Ghee
                </Link>
              </li>
              <li>
                <Link href="/products/pure-desi-cow-milk" className="hover:text-white transition-colors block">
                  Pure Desi Cow Milk
                </Link>
              </li>
              <li>
                <Link href="/products/wood-pressed-groundnut-oil" className="hover:text-white transition-colors block">
                  Wood-Pressed Groundnut Oil
                </Link>
              </li>
              <li>
                <Link href="/products/artisanal-desi-paneer" className="hover:text-white transition-colors block">
                  Fresh Desi Paneer
                </Link>
              </li>
              <li>
                <Link href="/products/farm-fresh-eggs" className="hover:text-white transition-colors block">
                  Pasture-Raised Country Eggs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Farm & Extraction Heritage */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D49B28] font-bold">Heritage & Standard</h4>
            <ul className="space-y-2 text-[#ECE4D5]/75 font-sans text-xs">
              <li>
                <a href="#traditional-process" className="hover:text-white transition-colors block">
                  Timeless 5-Step Bilona Discipline
                </a>
              </li>
              <li>
                <a href="#brindavanam-nature" className="hover:text-white transition-colors block">
                  Indigenous Gir Cow Bloodline
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors block">
                  Patron Harvest Stories
                </a>
              </li>
              <li>
                <span className="text-[#ECE4D5]/50 block">Zero Water Dilution Protocol</span>
              </li>
              <li>
                <span className="text-[#ECE4D5]/50 block">Pan-India Express Dispatch</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Patron Care & Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D49B28] font-bold">Patron Support</h4>
            <div className="space-y-2 text-[#ECE4D5]/75 font-sans text-xs">
              <a
                href="https://wa.me/917995436215"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-[#25D366] hover:text-[#4ade80] transition-colors font-mono font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>+91 79954 36215 (WhatsApp)</span>
              </a>
              <p className="flex items-center space-x-1.5 font-mono text-[11px]">
                <Mail className="w-3.5 h-3.5 text-[#D49B28]" />
                <span>brundavanamteam@gmail.com</span>
              </p>
              <p className="flex items-center space-x-1.5 font-mono text-[11px] text-[#ECE4D5]/60">
                <MapPin className="w-3.5 h-3.5 text-[#C25E2E]" />
                <span>Hyderabad, Telangana, India</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Copyright Minimal Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#ECE4D5]/50 gap-2 text-center sm:text-left">
          <p>© 2026 Brindavanam Farms. All Rights Reserved. Pure, Unadulterated Vedic Agriculture.</p>
          <p className="text-[#D49B28]">100% Native Breed · Zero Preservatives</p>
        </div>

      </div>
    </footer>
  );
};
