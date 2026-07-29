'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';

export const CoolLoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fail-safe quick timer: unmount after 500ms max
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    const handleLoad = () => setLoading(false);
    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setLoading(false)}
          className="fixed inset-0 z-50 bg-[#1c260b] text-white flex flex-col items-center justify-center p-6 select-none cursor-pointer"
        >
          <div className="relative flex flex-col items-center space-y-4">
            {/* Glowing Logo Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#3A5303] flex items-center justify-center ring-4 ring-[#94C000]/40 shadow-2xl">
              <Leaf className="w-8 h-8 text-[#94C000] animate-pulse" />
            </div>

            {/* Brand Title */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-serif italic font-normal text-stone-100">
                Brindavanam
              </h1>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#94C000] font-bold">
                Tap to enter store
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
