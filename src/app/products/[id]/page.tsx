import { PRODUCTS } from '@/data/products';
import ProductDetailPageClient from '@/components/ProductDetailPageClient';

export function generateStaticParams() {
  return PRODUCTS.flatMap((product) => [
    { id: product.id },
    { id: product.id.replace(/-/g, ' ') },
    { id: encodeURIComponent(product.id) },
    { id: encodeURIComponent(product.id.replace(/-/g, ' ')) },
  ]);
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailPageClient id={id} />;
}
