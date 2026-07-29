'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';

export const CoolLoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#1c260b] text-white flex flex-col items-center justify-center p-6 select-none"
        >
          <div className="relative flex flex-col items-center space-y-6">
            
            {/* Glowing Logo Icon */}
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-3xl bg-[#3A5303] flex items-center justify-center ring-4 ring-[#94C000]/40 shadow-2xl relative"
            >
              <Leaf className="w-10 h-10 text-[#94C000] animate-pulse" />
              <div className="absolute inset-0 rounded-3xl bg-[#94C000]/20 blur-xl -z-10" />
            </motion.div>

            {/* Brand Title */}
            <div className="text-center space-y-1.5">
              <h1 className="text-3xl font-serif tracking-tight italic font-normal text-stone-100">
                Brindavanam
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#94C000] font-bold">
                Pure Vedic Produce & A2 Bilona Ghee
              </p>
            </div>

            {/* Minimal Loading Bar */}
            <div className="w-48 bg-stone-800 h-1 rounded-full overflow-hidden mt-4">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="w-full h-full bg-[#94C000]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
