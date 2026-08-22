import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const SITE_URL = 'https://brindavanam.rendervoid.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Brindavanam Farms | 100% Pure A2 Bilona Ghee & Wood-Pressed Oils',
    template: '%s | Brindavanam Farms'
  },
  description: 'Pure. Natural. Honest. Authentic organic farm produce direct from our Hyderabad farm. Traditional wood-fire hand-churned A2 Gir Cow Bilona Ghee, cold-extracted wood-pressed oils, and artisanal Desi Paneer.',
  keywords: [
    'A2 Bilona Ghee',
    'A2 Desi Cow Milk',
    'Wood Pressed Groundnut Oil',
    'Wood Pressed Sesame Oil',
    'Cold Pressed Coconut Oil',
    'Cold Pressed Kusuma Oil',
    'Kachi Ghani Mustard Oil',
    'Organic Fresh Paneer',
    'Free Range Eggs',
    'Brindavanam Farms',
    'Organic Farm Store Hyderabad',
    'Vedic Farm Produce'
  ],
  authors: [{ name: 'Brindavanam Farms', url: SITE_URL }],
  creator: 'Brindavanam Farms',
  publisher: 'Brindavanam Farms',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Brindavanam Farms | Pure. Natural. Honest.',
    description: 'Direct from our Hyderabad farm: Hand-churned A2 Desi Cow Bilona Ghee, zero-heat Marachekku pressed oils, and fresh artisanal produce.',
    url: SITE_URL,
    siteName: 'Brindavanam Farms',
    images: [
      {
        url: 'https://images.pexels.com/photos/20689447/pexels-photo-20689447.jpeg',
        width: 1200,
        height: 630,
        alt: 'Brindavanam Farms Organic Produce',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brindavanam Farms | 100% Authentic Organic Produce',
    description: 'Vedic A2 Bilona Ghee & Zero-Heat Wood-Pressed Oils delivered fresh from farm to your home.',
    images: ['https://images.pexels.com/photos/20689447/pexels-photo-20689447.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: './favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: './favicon.svg',
    apple: './favicon.svg',
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Brindavanam Farms',
  image: 'https://images.pexels.com/photos/20689447/pexels-photo-20689447.jpeg',
  '@id': 'https://brindavanam.rendervoid.xyz/#store',
  url: 'https://brindavanam.rendervoid.xyz',
  telephone: '+91-7995436215',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Brindavanam Nature Farm',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 17.385044,
    longitude: 78.486671,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '06:00',
    closes: '21:00',
  },
  sameAs: [
    'https://rendervoid.xyz',
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
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
