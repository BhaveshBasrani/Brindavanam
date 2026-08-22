import { Metadata } from 'next';
import { PRODUCTS } from '@/data/products';
import ProductDetailPageClient from '@/components/ProductDetailPageClient';

const SITE_URL = 'https://brindavanam.rendervoid.xyz';

export function generateStaticParams() {
  return PRODUCTS.flatMap((product) => [
    { id: product.id },
    { id: product.id.replace(/-/g, ' ') },
    { id: encodeURIComponent(product.id) },
    { id: encodeURIComponent(product.id.replace(/-/g, ' ')) },
  ]);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().replace(/\s+/g, '-');
  const product = PRODUCTS.find((p) => p.id === decodedId || p.id === id);

  if (!product) {
    return {
      title: 'Product Not Found | Brindavanam Farms',
      description: 'The requested organic produce could not be found.',
    };
  }

  const primaryVariant = product.variants[0];
  const pageUrl = `${SITE_URL}/products/${product.id}/`;
  const imageUrl = product.images[0] || 'https://images.pexels.com/photos/20689447/pexels-photo-20689447.jpeg';

  return {
    title: `${product.name} | Brindavanam Farms`,
    description: `${product.subtitle} - 100% pure & natural farm produce. ${product.description.slice(0, 140)}...`,
    keywords: [
      product.name,
      product.category,
      'Organic Produce',
      'Brindavanam Farms',
      'Hyderabad Farm Fresh',
      ...product.healthBenefits.slice(0, 3)
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${product.name} (₹${primaryVariant.price}) | Brindavanam Farms`,
      description: product.subtitle,
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Brindavanam Farms`,
      description: product.subtitle,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase().replace(/\s+/g, '-');
  const product = PRODUCTS.find((p) => p.id === decodedId || p.id === id);

  const productJsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Brindavanam Farms',
    },
    offers: product.variants.map((v) => ({
      '@type': 'Offer',
      price: v.price,
      priceCurrency: 'INR',
      name: v.weight,
      availability: v.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/products/${product.id}/`,
      seller: {
        '@type': 'Organization',
        name: 'Brindavanam Farms',
      },
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '12',
    },
  } : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailPageClient id={id} />
    </>
  );
}
