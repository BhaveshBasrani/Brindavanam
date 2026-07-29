'use client';

import React from 'react';

export const FloatingRecaptchaBadge: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 shadow-2xl border border-stone-200/90 flex items-center space-x-2.5 text-[10px] text-stone-600 select-none hover:shadow-2xl transition-all">
      {/* Official Google reCAPTCHA Spinning Arrows Icon */}
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1 shrink-0 shadow-xs border border-stone-100">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path
            fill="#4285F4"
            d="M20 4c8.8 0 16 7.2 16 16 0 3.3-.9 6.4-2.7 9l-4.2-4.2C30.2 23.3 31 21.7 31 20c0-6.1-4.9-11-11-11v-5z"
          />
          <path
            fill="#34A853"
            d="M33.3 29C30.6 33.3 25.7 36 20 36c-8.8 0-16-7.2-16-16 0-3.3.9-6.4 2.7-9l4.2 4.2C9.8 16.7 9 18.3 9 20c0 6.1 4.9 11 11 11 3.5 0 6.6-1.6 8.6-4.1l4.7 2.1z"
          />
          <path
            fill="#FBBC05"
            d="M6.7 11C9.4 6.7 14.3 4 20 4v5c-6.1 0-11 4.9-11 11 0 1.7.4 3.3 1.1 4.8L5.9 29C4.1 26.4 3.2 23.3 3.2 20c0-3.3.9-6.4 3.5-9z"
          />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <span className="font-bold text-stone-800 tracking-tight">protected by reCAPTCHA</span>
        <div className="flex space-x-1.5 text-[9px] text-stone-400 font-medium">
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Privacy
          </a>
          <span>-</span>
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Terms
          </a>
        </div>
      </div>
    </div>
  );
};
