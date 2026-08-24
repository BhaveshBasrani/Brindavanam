'use client';

import React from 'react';
import Script from 'next/script';

export const FloatingRecaptchaBadge: React.FC = () => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Lfpvm4tAAAAAC_wsr8Cg2-OCEyh0wzqPb5gtfmr';

  return (
    <>
      {/* Official Google reCAPTCHA v2 API Script */}
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="lazyOnload"
      />

      {/* Official Google reCAPTCHA Live Container */}
      <div className="fixed bottom-3 right-3 z-40">
        <div
          className="g-recaptcha"
          data-sitekey={siteKey}
          data-badge="bottomright"
          data-size="invisible"
        />
      </div>
    </>
  );
};
