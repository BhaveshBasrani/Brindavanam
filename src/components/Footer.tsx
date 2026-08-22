import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1c260b] text-stone-300 pt-16 pb-12 border-t border-stone-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <Link href="/" className="text-2xl font-serif italic text-white block hover:text-[#94C000] transition-colors">
              Brindavanam
            </Link>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Rooted in ancient Vedic agricultural traditions. Handcrafted A2 Bilona Ghee, zero-heat wood-pressed oils, and artisanal Desi Paneer.
            </p>
          </div>

          {/* Collection Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white font-sans">Collection</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li>
                <Link href="/products/a2-bilona-ghee" className="hover:text-white hover:underline transition-colors block">
                  A2 Gir Cow Bilona Ghee
                </Link>
              </li>
              <li>
                <Link href="/products/wood-pressed-groundnut-oil" className="hover:text-white hover:underline transition-colors block">
                  Wood-Pressed Groundnut Oil
                </Link>
              </li>
              <li>
                <Link href="/products/cold-pressed-coconut-oil" className="hover:text-white hover:underline transition-colors block">
                  Virgin Cold-Pressed Coconut Oil
                </Link>
              </li>
              <li>
                <Link href="/products/wood-pressed-kusuma-oil" className="hover:text-white hover:underline transition-colors block">
                  Cold-Pressed Kusuma Oil
                </Link>
              </li>
              <li>
                <Link href="/products/artisanal-desi-paneer" className="hover:text-white hover:underline transition-colors block">
                  Organic Fresh Paneer
                </Link>
              </li>
              <li>
                <Link href="/products/a2-desi-cow-milk" className="hover:text-white hover:underline transition-colors block">
                  Fresh A2 Desi Cow Milk
                </Link>
              </li>
              <li>
                <Link href="/products/farm-fresh-eggs" className="hover:text-white hover:underline transition-colors block">
                  Farm Fresh Free-Range Eggs
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Process */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white font-sans">Pillars</h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li>Vedic Bilona Method</li>
              <li>Marachekku Wood Pressing</li>
              <li>Zero Chemical Solvents</li>
              <li>Unadulterated Zero Preservatives</li>
              <li>100% Lab Tested Batches</li>
            </ul>
          </div>

          {/* Contact & Farm Info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white font-sans">Farm Location</h4>
            <div className="space-y-1.5 text-xs text-stone-400 font-light">
              <p className="font-bold text-white">Brindavanam Farms</p>
              <p>Hyderabad, Telangana, India</p>
              <p className="font-mono text-stone-300">brundavanamteam@gmail.com</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright & branding link to rendervoid.xyz */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 font-light gap-2">
          <p>© 2026 Brindavanam Farms. All rights reserved.</p>
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#94C000]">
            <span className="text-stone-400">Powered By</span>
            <a
              href="https://rendervoid.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-wider uppercase font-bold text-[#94C000] hover:text-white bg-[#94C000]/10 hover:bg-[#3A5303] px-2.5 py-0.5 rounded border border-[#94C000]/20 transition-all cursor-pointer inline-flex items-center"
            >
              Rendervoid
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
