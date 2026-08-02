import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brindavanam Organic | 100% Wood-Pressed Oils & A2 Bilona Ghee',
  description: 'Authentic organic farm produce from Brindavanam Nature Centre. Hand-churned A2 Gir Cow Bilona Ghee, zero-heat Kachi Ghani oils, and organic Desi Paneer.',
  keywords: ['A2 Bilona Ghee', 'Wood Pressed Groundnut Oil', 'Virgin Coconut Oil', 'Kusuma Safflower Oil', 'Organic Paneer', 'Brindavanam Nature Centre'],
  icons: {
    icon: [
      { url: './favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: './favicon.svg',
    apple: './favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="./favicon.svg" />
        <link rel="apple-touch-icon" href="./favicon.svg" />
        <Script
          src="https://www.google.com/recaptcha/api.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="antialiased selection:bg-[#94C000] selection:text-[#1c260b]">
        {children}
      </body>
    </html>
  );
}
