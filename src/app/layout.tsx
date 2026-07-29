import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brindavanam Organic | 100% Wood-Pressed Oils & A2 Bilona Ghee',
  description: 'Authentic organic farm produce inspired by Two Brothers Organic Farms and Organic India. Hand-churned A2 Gir Cow Bilona Ghee, zero-heat Kachi Ghani oils, and organic Desi Paneer.',
  keywords: ['A2 Bilona Ghee', 'Wood Pressed Groundnut Oil', 'Virgin Coconut Oil', 'Kusuma Safflower Oil', 'Organic Paneer', 'Two Brothers Organic Farms'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased selection:bg-[#94C000] selection:text-[#1c260b]">
        {children}
      </body>
    </html>
  );
}
