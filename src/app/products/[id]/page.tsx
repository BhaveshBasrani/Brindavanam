import { PRODUCTS } from '@/data/products';
import ProductDetailPageClient from '@/components/ProductDetailPageClient';

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailPageClient id={id} />;
}
