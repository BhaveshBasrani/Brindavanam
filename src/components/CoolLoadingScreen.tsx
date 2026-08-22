'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CoolLoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#151811] text-[#F7F4EE] flex flex-col items-center justify-center p-6 select-none font-sans"
        >
          <div className="relative flex flex-col items-center space-y-6">
            
            {/* Brand Title */}
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#C4703F] block">
                Ancestral Agriculture · Hyderabad
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight uppercase text-[#F7F4EE]">
                Brindavanam
              </h1>
              <p className="text-xs font-serif italic text-[#D4A843]">
                Pure. Natural. Honest.
              </p>
            </div>

            {/* Minimal Loading Bar */}
            <div className="w-36 bg-white/10 h-0.5 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.85, ease: 'easeInOut' }}
                className="w-full h-full bg-[#C4703F]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
