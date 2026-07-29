import { Product } from '@/types/store';

export const PRODUCTS: Product[] = [
  {
    id: 'a2-bilona-ghee',
    name: 'Pure A2 Desi Cow Bilona Ghee',
    subtitle: 'Cultured & Hand-Churned over Wood Fire',
    category: 'ghee',
    description: 'Crafted using the ancient Vedic Bilona method from grass-fed Desi Gir cows. Milk is converted into curd and hand-churned bidirectionally before simmering slowly on a low wood fire. Rich in Golden A2 Beta-Casein, butyric acid, and essential fat-soluble vitamins.',
    healthBenefits: [
      'Boosts Immunity & Digestive Gut Health',
      'Rich in Essential Omega-3 & Fat-Soluble Vitamins A, D, E, K',
      'High Smoke Point (250°C) ideal for cooking & frying',
      'Promotes Heart Health & Glowing Skin'
    ],
    extractionMethod: 'Traditional 5-Step Vedic Bilona Process (Boiling -> Curdling -> Hand Churning -> Claypot Wood-Fire Simmering)',
    badge: '🏆 Bestseller & A2 Certified',
    rating: 4.9,
    reviewsCount: 384,
    images: [
      'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589927986077-4b2a0998b59b?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'ghee-500ml', weight: '500 ml', price: 950, originalPrice: 1100, inStock: true },
      { id: 'ghee-1000ml', weight: '1 Litre Glass Jar', price: 1850, originalPrice: 2150, inStock: true },
      { id: 'ghee-5000ml', weight: '5 Litres Family Tin', price: 8900, originalPrice: 9900, inStock: true }
    ],
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '898 kcal' },
      { label: 'Total Fat', value: '99.8 g' },
      { label: 'Saturated Fat', value: '62.0 g' },
      { label: 'Omega-3 Fatty Acids', value: '1.2 g' },
      { label: 'Cholesterol', value: '180 mg' }
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Ramesh K.',
        rating: 5,
        date: '2026-07-15',
        comment: 'The aroma takes me right back to my grandmother’s village farm! Absolutely genuine granular texture and rich nutty flavor.',
        verifiedPurchase: true
      },
      {
        id: 'r2',
        author: 'Priya Sharma',
        rating: 5,
        date: '2026-07-22',
        comment: 'Pure A2 Bilona Ghee. Great glass packaging and super fast delivery. Will order the 5L tin next time.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'wood-pressed-groundnut-oil',
    name: 'Cold-Pressed Groundnut Oil (Kachi Ghani)',
    subtitle: '100% Unrefined Wood-Pressed Peanut Oil',
    category: 'oil',
    description: 'Extracted at low temperatures using traditional wooden Marachekku (Ghani) presses. Preserves natural anti-oxidants, natural nutty aroma, and rich Vitamin E content without any chemical refining or bleaching.',
    healthBenefits: [
      'Zero Trans-Fat & Zero Added Chemicals',
      'Abundant in Natural Phytosterols & Heart-Healthy MUFA',
      'High Smoke Point perfect for everyday Indian cooking & deep frying',
      'Sourced directly from organic sun-dried native peanuts'
    ],
    extractionMethod: 'Low-Temperature Wood Ghani Pressing (< 45°C) to lock in natural nutrients.',
    badge: '🌿 100% Wood Pressed',
    rating: 4.8,
    reviewsCount: 245,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'gnut-1L', weight: '1 Litre Bottle', price: 380, originalPrice: 440, inStock: true },
      { id: 'gnut-5L', weight: '5 Litres Can', price: 1800, originalPrice: 2100, inStock: true }
    ],
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '884 kcal' },
      { label: 'Monounsaturated Fat (MUFA)', value: '48.0 g' },
      { label: 'Polyunsaturated Fat (PUFA)', value: '34.0 g' },
      { label: 'Vitamin E', value: '15.7 mg' }
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Sunil Rao',
        rating: 5,
        date: '2026-07-18',
        comment: 'Authentic taste for everyday cooking. Food made with this oil tastes significantly lighter and healthier.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cold-pressed-coconut-oil',
    name: 'Virgin Cold-Pressed Coconut Oil',
    subtitle: 'Raw & Unrefined Raw Kernel Press',
    category: 'oil',
    description: 'Extracted from fresh handpicked organic coconuts. Unrefined, unbleached, and non-deodorized. Rich in Lauric Acid (Medium Chain Triglycerides - MCTs) that provide instant clean metabolic energy.',
    healthBenefits: [
      'Rich in Lauric Acid (50%) for Cellular Immunity',
      'Supports Weight Management & Brain Function (MCTs)',
      'Multi-purpose: Ideal for Oil Pulling, Cooking, Hair & Skincare',
      'Natural Sweet Coconut Aroma'
    ],
    extractionMethod: 'Traditional Cold Mechanical Pressing of fresh sun-dried copra without artificial heat.',
    badge: '✨ Raw & Virgin',
    rating: 4.9,
    reviewsCount: 198,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'coc-500ml', weight: '500 ml Glass Jar', price: 340, originalPrice: 390, inStock: true },
      { id: 'coc-1L', weight: '1 Litre Bottle', price: 620, originalPrice: 720, inStock: true }
    ],
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '862 kcal' },
      { label: 'Lauric Acid', value: '49.8 g' },
      { label: 'Medium Chain Triglycerides', value: '65.0 g' }
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Ananya S.',
        rating: 5,
        date: '2026-07-20',
        comment: 'I use this for oil pulling and cooking. Extremely pure quality and smells divine.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cold-pressed-kusuma-oil',
    name: 'Cold-Pressed Kusuma (Safflower) Oil',
    subtitle: 'Traditional Wood-Pressed Safflower Seed Oil',
    category: 'oil',
    description: 'Heritage Kusuma (Safflower) oil wood-pressed from organic safflower seeds. Renowned in Ayurvedic tradition for its cardioprotective properties, high Oleic Acid content, and light delicate flavor.',
    healthBenefits: [
      'Helps Regulate Blood Pressure & Cholesterol Levels',
      'High in Essential Omega-6 Fatty Acids & Oleic Acid',
      'Light Neutral Flavor – Great for Sauteing & Dressing',
      'Traditional Ayurvedic Health Oil'
    ],
    extractionMethod: 'Slow Wood-Churn Extraction to preserve delicate plant sterols.',
    badge: '❤️ Heart-Health Ayurvedic Special',
    rating: 4.7,
    reviewsCount: 112,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'kus-1L', weight: '1 Litre Glass Bottle', price: 490, originalPrice: 560, inStock: true },
      { id: 'kus-5L', weight: '5 Litres Can', price: 2350, originalPrice: 2650, inStock: true }
    ],
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '884 kcal' },
      { label: 'Oleic Acid (Omega-9)', value: '75.0 g' },
      { label: 'Linoleic Acid (Omega-6)', value: '14.0 g' },
      { label: 'Vitamin E', value: '34.0 mg' }
    ],
    reviews: [
      {
        id: 'r5',
        author: 'Dr. Madhavan',
        rating: 5,
        date: '2026-07-10',
        comment: 'Hard to find authentic Kusuma oil nowadays. Brindavanam has delivered top notch quality!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'farm-fresh-desi-paneer',
    name: 'Farm-Fresh Artisanal Desi Paneer',
    subtitle: '100% Organic A2 Whole Cow Milk Malai Paneer',
    category: 'paneer',
    description: 'Made fresh daily from unadulterated A2 whole milk of free-roaming indigenous cows. Curdled naturally using fresh lemon juice. Soft, melt-in-the-mouth texture with zero starch, synthetic gums, or preservatives.',
    healthBenefits: [
      '20g Protein per 100g – Excellent for Muscle Fitness',
      'Zero Preservatives, Starch, or Chemical Curdlers',
      'Vacuum-Sealed Freshness Delivered in Thermal Insulation',
      'Ultra Soft Creamy Texture'
    ],
    extractionMethod: 'Fresh Daily Morning Milk -> Natural Lemon Juice Curdling -> Hand-Pressed Muslin Cloth',
    badge: '🧀 Freshly Made Daily',
    rating: 4.9,
    reviewsCount: 289,
    images: [
      'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'pan-250g', weight: '250g Pack', price: 160, originalPrice: 190, inStock: true },
      { id: 'pan-500g', weight: '500g Pack', price: 300, originalPrice: 350, inStock: true },
      { id: 'pan-1kg', weight: '1 kg Saver Pack', price: 580, originalPrice: 680, inStock: true }
    ],
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '289 kcal' },
      { label: 'Protein', value: '20.5 g' },
      { label: 'Carbohydrates', value: '2.8 g' },
      { label: 'Calcium', value: '480 mg' }
    ],
    reviews: [
      {
        id: 'r6',
        author: 'Meenakshi N.',
        rating: 5,
        date: '2026-07-24',
        comment: 'So soft and juicy! Makes the best Paneer Butter Masala. Extremely fresh taste.',
        verifiedPurchase: true
      }
    ]
  }
];
