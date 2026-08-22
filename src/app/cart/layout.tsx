import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Farm Bag & Cart | Brindavanam Farms',
  description: 'Review your selected authentic organic produce, apply harvest discount coupons, and complete your secure checkout.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
