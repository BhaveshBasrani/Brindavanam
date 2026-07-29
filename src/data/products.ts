import { Product } from '@/types/store';

export const PRODUCTS: Product[] = [
  {
    id: 'a2-bilona-ghee',
    name: 'A2 Desi Gir Cow Bilona Ghee',
    subtitle: 'Hand-Churned in Clay Pots over Low Wood-Fire',
    category: 'ghee',
    description: 'Authentic A2 Bilona Ghee crafted from the pure milk of free-grazing Gir Cows. Prepared using the traditional 5-step Vedic Bilona method: boiled over slow wood-fire, cultured into curd, hand-churned with bi-directional wooden bilona, and gently heated to golden perfection in earthen pots.',
    healthBenefits: [
      'Rich in A2 Beta-Casein Protein for optimal digestion and gut health',
      'High smoke point (250°C / 482°F) ideal for Indian cooking & sautéing',
      'Packed with Fat-Soluble Vitamins A, D, E, K and Essential Omega-3 fatty acids',
      'Nourishes brain health, enhances immunity, and lubricates joint cartilage'
    ],
    extractionMethod: 'Traditional 5-step Vedic Bilona method (Curd-churned in clay pots over slow wood fire)',
    badge: '100% A2 Certified Bilona',
    rating: 4.9,
    reviewsCount: 148,
    images: [
      'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1200&q=85'
    ],
    variants: [
      { id: 'ghee-500ml', weight: '500 ml Glass Jar', price: 1450, originalPrice: 1650, inStock: true },
      { id: 'ghee-1l', weight: '1 Litre Glass Jar', price: 2750, originalPrice: 3150, inStock: true },
      { id: 'ghee-5l', weight: '5 Litres Bulk Pack', price: 12900, originalPrice: 14500, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '898 kcal per 100g' },
      { label: 'Total Fat', value: '99.8g' },
      { label: 'A2 Beta-Casein', value: '100% Certified' },
      { label: 'Saturated Fatty Acids', value: '65g' },
      { label: 'Cholesterol', value: '190mg' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Dr. Ramesh Kulkarni',
        rating: 5,
        date: '14 Oct 2025',
        comment: 'Reminds me of my grandmother village farm in Gujarat. The aroma, granular Danedar texture, and deep golden color are unmatched.',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        author: 'Ananya Sharma',
        rating: 5,
        date: '28 Dec 2025',
        comment: 'Pure bliss! You can tell it is authentic curd-churned Bilona ghee by the nutty wood-fire aroma. Will never buy commercial ghee again.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'wood-pressed-groundnut-oil',
    name: 'Cold-Pressed Wood-Pressed Groundnut Oil',
    subtitle: 'Zero-Heat Marachekku Kachi Ghani Extraction',
    category: 'oil',
    description: 'Pure, unrefined Wood-Pressed Groundnut Oil extracted from naturally dried native bold peanuts using slow-revolving wooden mortars (Marachekku). Zero heat generation ensures original nutty flavor, natural antioxidants, and essential nutrients remain 100% intact.',
    healthBenefits: [
      'Zero heat extraction preserves natural Vitamin E & Phytosterols',
      'Rich in Heart-Healthy Monounsaturated Fatty Acids (MUFA)',
      'High natural smoke point suitable for deep frying, tadka, and daily cooking',
      '100% free from chemical solvent extraction, hexane, and artificial bleaching'
    ],
    extractionMethod: 'Slow Marachekku Wood Pressing below 38°C (Cold Pressed Kachi Ghani)',
    badge: 'Traditional Wood Pressed',
    rating: 4.8,
    reviewsCount: 96,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1541256942802-7b29531f0df8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=1200&q=85'
    ],
    variants: [
      { id: 'peanut-1l', weight: '1 Litre Glass Bottle', price: 420, originalPrice: 480, inStock: true },
      { id: 'peanut-5l', weight: '5 Litres Tin Can', price: 1980, originalPrice: 2250, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '884 kcal per 100g' },
      { label: 'Monounsaturated Fat (MUFA)', value: '48g' },
      { label: 'Polyunsaturated Fat (PUFA)', value: '32g' },
      { label: 'Vitamin E', value: '15.7mg' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Sunil Deshmukh',
        rating: 5,
        date: '02 Jan 2026',
        comment: 'The authentic peanut aroma while making Maharashtrian puran poli and tadka is incredible. Natural yellow color without chemical refining.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cold-pressed-coconut-oil',
    name: 'Pure Cold-Pressed Virgin Coconut Oil',
    subtitle: 'Extracted from Sun-Dried Kerala Farm Copra',
    category: 'oil',
    description: 'Raw, unrefined Extra Virgin Coconut Oil extracted from fresh sun-dried coconuts harvested from coastal organic groves. Retains natural lauric acid, tropical coconut fragrance, and crystal-clear purity for culinary, hair, and ayurvedic skin care.',
    healthBenefits: [
      'Abundant in Lauric Acid (50%) for anti-microbial immunity support',
      'Contains Medium-Chain Triglycerides (MCTs) for instant cellular energy',
      'Nourishes scalp hair follicles, softens skin, and supports oil pulling',
      'Zero heat treatment, zero added fragrance, zero preservatives'
    ],
    extractionMethod: 'Zero-Heat Cold Expeller Pressed from Sun-Dried Organic Copra',
    badge: '100% Raw Virgin',
    rating: 4.9,
    reviewsCount: 112,
    images: [
      'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1541256942802-7b29531f0df8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=85'
    ],
    variants: [
      { id: 'coco-500ml', weight: '500 ml Glass Jar', price: 380, originalPrice: 440, inStock: true },
      { id: 'coco-1l', weight: '1 Litre Glass Bottle', price: 690, originalPrice: 790, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '862 kcal per 100g' },
      { label: 'Lauric Acid', value: '50.2g' },
      { label: 'MCT Content', value: '62%' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Priya Nambiar',
        rating: 5,
        date: '10 Jan 2026',
        comment: 'Crystal clear consistency in liquid state and thick pure white in winter. Absolutely genuine South Indian coconut oil quality.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'kusuma-safflower-oil',
    name: 'Cold-Pressed Kusuma (Safflower) Oil',
    subtitle: 'Rich in Linoleic Acid for Cardiovascular Wellness',
    category: 'oil',
    description: 'Heritage Kusuma (Safflower) Oil slow-pressed from native safflower seeds harvested in dryland organic farms. Famous in traditional Ayurveda for balancing cholesterol levels and promoting vibrant skin health with lightweight non-greasy absorption.',
    healthBenefits: [
      'Highest concentration of Essential Linoleic Acid (Omega-6)',
      'Helps maintain healthy blood pressure and blood lipid profile',
      'Light texture with mild neutral aroma suitable for light frying & salads',
      'Unrefined, unbleached, zero chemical deodorization'
    ],
    extractionMethod: 'Slow Cold Pressing under 40°C from Select Organic Safflower Seeds',
    badge: 'Heart Health Choice',
    rating: 4.7,
    reviewsCount: 64,
    images: [
      'https://images.unsplash.com/photo-1541256942802-7b29531f0df8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=85'
    ],
    variants: [
      { id: 'kusuma-1l', weight: '1 Litre Glass Bottle', price: 460, originalPrice: 520, inStock: true },
      { id: 'kusuma-5l', weight: '5 Litres Tin Can', price: 2150, originalPrice: 2450, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '884 kcal per 100g' },
      { label: 'Polyunsaturated Fat (PUFA)', value: '74.6g' },
      { label: 'Monounsaturated Fat (MUFA)', value: '14.4g' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Vijay Patel',
        rating: 5,
        date: '19 Jan 2026',
        comment: 'Recommended by our nutritionist for heart health. Very light for daily cooking and zero heavy grease feeling.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'artisanal-desi-paneer',
    name: 'Farm Fresh Artisanal Desi Paneer',
    subtitle: 'Handmade Daily from Pure Organic Cow & Buffalo Whole Milk',
    category: 'paneer',
    description: 'Melt-in-your-mouth soft Artisanal Desi Paneer crafted fresh every morning on our estate farm. Prepared by curdling pure unadulterated whole milk with natural lemon whey, gently pressed in muslin cloth without synthetic starch or chemical coagulants.',
    healthBenefits: [
      'Packed with 18g High Biological Value Protein per 100g serving',
      'Abundant in Natural Milk Calcium and Phosphorus for bone density',
      'Super soft texture that absorbs spices effortlessly without getting rubbery',
      'Freshly made daily with zero starch fillers or artificial preservatives'
    ],
    extractionMethod: 'Hand-curdled with natural lemon whey & pressed in organic muslin cloth',
    badge: 'Made Fresh Daily',
    rating: 5.0,
    reviewsCount: 182,
    images: [
      'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=1200&q=85'
    ],
    variants: [
      { id: 'paneer-250g', weight: '250g Fresh Vacuum Pack', price: 140, originalPrice: 160, inStock: true },
      { id: 'paneer-500g', weight: '500g Fresh Vacuum Pack', price: 270, originalPrice: 310, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '298 kcal per 100g' },
      { label: 'Protein', value: '18.2g' },
      { label: 'Calcium', value: '480mg' },
      { label: 'Carbohydrates', value: '2.1g' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Meenakshi Iyer',
        rating: 5,
        date: '24 Jan 2026',
        comment: 'So soft and fresh! When cooked in Shahi Paneer, it literally melts in the mouth. Best organic cottage cheese available.',
        verifiedPurchase: true
      }
    ]
  }
];
