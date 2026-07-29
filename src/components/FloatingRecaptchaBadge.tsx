'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

export const FloatingRecaptchaBadge: React.FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LcpqGstAAAAAMBOybBtJPFQ2aMtBfLmsUT9AAtB';

  useEffect(() => {
    // If window.grecaptcha exists, render invisible recaptcha
    if (typeof window !== 'undefined' && (window as any).grecaptcha) {
      setScriptLoaded(true);
    }
  }, []);

  return (
    <>
      {/* Official Google reCAPTCHA v2 Script */}
      <Script
        src="https://www.google.com/recaptcha/api.js"
        async
        defer
        onLoad={() => setScriptLoaded(true)}
      />

      {/* Official Google reCAPTCHA Container */}
      <div className="fixed bottom-3 right-3 z-40">
        <div
          className="g-recaptcha"
          data-sitekey={siteKey}
          data-badge="bottomright"
          data-[#1c260b]
        />
      </div>
    </>
  );
};
