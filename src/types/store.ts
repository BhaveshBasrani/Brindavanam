export interface ProductVariant {
  id: string;
  weight: string; // e.g. "500 ml", "1 Litre", "5 Litres", "250g", "500g"
  price: number; // in INR
  originalPrice?: number;
  inStock: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'ghee' | 'oil' | 'paneer';
  description: string;
  healthBenefits: string[];
  extractionMethod: string;
  badge?: string; // e.g., "Bestseller", "100% Wood Pressed", "A2 Certified"
  rating: number;
  reviewsCount: number;
  images: string[];
  variants: ProductVariant[];
  nutritionalInfo: { label: string; value: string }[];
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'Razorpay' | 'Cash on Delivery';
  paymentId?: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  itemsSummary?: string;
  city?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
}
