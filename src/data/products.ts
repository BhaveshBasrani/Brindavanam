import { Product } from '@/types/store';

export const PRODUCTS: Product[] = [
  {
    id: 'a2-desi-cow-milk',
    name: 'Fresh A2 Desi Cow Milk',
    subtitle: '100% Pure, Raw & Delivered Fresh Daily',
    category: 'milk',
    description: 'Our fresh A2 Desi Cow Milk comes from native cows raised in a natural, stress-free environment. The cows are fed wholesome, natural feed and cared for with love. We never dilute our milk with water and never add preservatives or chemicals.',
    healthBenefits: [
      '100% Pure A2 Desi Cow Milk with A2 Beta-Casein Protein',
      'Zero added water & zero chemical preservatives',
      'Farm fresh, delivered directly to your doorstep in Hyderabad',
      'Naturally rich in calcium, essential nutrients, and authentic taste'
    ],
    extractionMethod: 'Freshly milked from native Desi cows fed natural pasture feed',
    badge: '100% Pure A2 Milk',
    rating: 5.0,
    reviewsCount: 0,
    images: [
      'https://i.pinimg.com/736x/0c/c1/32/0cc1327f65c7e4a0975a15ad399750ec.jpg'
    ],
    variants: [
      { id: 'milk-1l', weight: '1 Litre', price: 130, originalPrice: 150, inStock: true },
      { id: 'milk-2l', weight: '2 Litres', price: 260, originalPrice: 300, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '68 kcal per 100ml' },
      { label: 'Protein (A2 Beta-Casein)', value: '3.4g' },
      { label: 'Calcium', value: '120mg' },
      { label: 'Fat', value: '4.1g' },
      { label: 'Added Water', value: '0.0%' }
    ],
    reviews: []
  },
  {
    id: 'a2-bilona-ghee',
    name: 'A2 Desi Cow Bilona Ghee',
    subtitle: 'Hand-Churned in Clay Pots over Low Wood-Fire',
    category: 'ghee',
    description: 'Authentic A2 Bilona Ghee crafted from the pure milk of free-grazing Desi Cows. Prepared using the traditional 5-step Vedic Bilona method: boiled over slow wood-fire, cultured into curd, hand-churned with bi-directional wooden bilona, and gently heated to golden perfection in earthen pots.',
    healthBenefits: [
      'Rich in A2 Beta-Casein Protein for optimal digestion and gut health',
      'High smoke point (250°C) ideal for Indian cooking & sautéing',
      'Packed with Fat-Soluble Vitamins A, D, E, K and Essential Omega-3 fatty acids',
      'Nourishes brain health, enhances immunity, and lubricates joint cartilage'
    ],
    extractionMethod: 'Traditional 5-step Vedic Bilona method (Curd-churned in clay pots over slow wood fire)',
    badge: '100% A2 Certified Bilona',
    rating: 5.0,
    reviewsCount: 0,
    images: [
      'https://images.pexels.com/photos/20689447/pexels-photo-20689447.jpeg?_gl=1*qqa97x*_ga*MTI2MzM2MDI2Ni4xNzg1MzQ0OTYz*_ga_8JE65Q40S6*czE3ODUzNDQ5NjIkbzEkZzEkdDE3ODUzNDUwMjEkajEkbDAkaDA.'
    ],
    variants: [
      { id: 'ghee-500g', weight: '500 ml (½ KG)', price: 2200, originalPrice: 2400, inStock: true },
      { id: 'ghee-1kg', weight: '1 Litre (1 KG)', price: 4000, originalPrice: 4400, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '898 kcal per 100g' },
      { label: 'Total Fat', value: '99.8g' },
      { label: 'A2 Beta-Casein', value: '100% Certified' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: []
  },
  {
    id: 'wood-pressed-groundnut-oil',
    name: 'Wood-Pressed Groundnut Oil',
    subtitle: 'Zero-Heat Marachekku Kachi Ghani Extraction',
    category: 'oil',
    description: 'Pure, unrefined Wood-Pressed Groundnut (Peanut) Oil extracted from naturally dried native bold peanuts using slow-revolving wooden mortars (Marachekku). Zero heat generation ensures original nutty flavor, natural antioxidants, and essential nutrients remain 100% intact.',
    healthBenefits: [
      'Zero heat extraction preserves natural Vitamin E & Phytosterols',
      'Rich in Heart-Healthy Monounsaturated Fatty Acids (MUFA)',
      'High natural smoke point suitable for deep frying, tadka, and daily cooking',
      '100% free from chemical solvent extraction, hexane, and artificial bleaching'
    ],
    extractionMethod: 'Slow Marachekku Wood Pressing below 38°C (Cold Pressed Kachi Ghani)',
    badge: 'Traditional Wood Pressed',
    rating: 5.0,
    reviewsCount: 0,
    images: [
      'https://images.pexels.com/photos/209345/pexels-photo-209345.jpeg?_gl=1*lg6nef*_ga*MTI2MzM2MDI2Ni4xNzg1MzQ0OTYz*_ga_8JE65Q40S6*czE3ODUzNDQ5NjIkbzEkZzEkdDE3ODUzNDQ5OTQkajI4JGwwJGgw'
    ],
    variants: [
      { id: 'peanut-1l', weight: '1 Litre', price: 400, originalPrice: 450, inStock: true },
      { id: 'peanut-5l', weight: '5 Litres', price: 1950, originalPrice: 2200, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '884 kcal per 100g' },
      { label: 'Monounsaturated Fat (MUFA)', value: '48g' },
      { label: 'Vitamin E', value: '15.7mg' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: []
  },
  {
    id: 'wood-pressed-sesame-oil',
    name: 'Wood-Pressed Sesame Oil',
    subtitle: 'Traditional Cold-Pressed Til Oil for Daily Cooking',
    category: 'oil',
    description: 'We offer traditionally extracted wood-pressed sesame oil that retains its natural aroma, nutrients, and authentic flavor. The slow extraction process helps preserve the goodness of the seeds without excessive heat or chemicals.',
    healthBenefits: [
      'Rich in Sesamol & Sesamolin natural powerful antioxidants',
      'Supports healthy blood pressure and heart wellness',
      'Traditional wood-pressed extraction with no chemicals or refining',
      'No artificial colors or preservatives'
    ],
    extractionMethod: 'Slow Marachekku Wood Pressing from Organic Sesame Seeds',
    badge: 'Pure Wood-Pressed',
    rating: 5.0,
    reviewsCount: 0,
    images: [
      'https://i.pinimg.com/736x/a1/14/35/a114356e1d87a7b36c49bf5e200b4329.jpg'
    ],
    variants: [
      { id: 'sesame-1l', weight: '1 Litre', price: 500, originalPrice: 560, inStock: true },
      { id: 'sesame-5l', weight: '5 Litres', price: 2450, originalPrice: 2750, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '884 kcal per 100g' },
      { label: 'Sesamol Content', value: 'High Natural' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: []
  },
  {
    id: 'kusuma-safflower-oil',
    name: 'Wood-Pressed Kusuma Oil',
    subtitle: 'Rich in Linoleic Acid for Cardiovascular Wellness',
    category: 'oil',
    description: 'Heritage Kusuma (Safflower) Oil slow-pressed from native safflower seeds harvested in dryland organic farms. Famous in traditional Ayurveda for balancing cholesterol levels and promoting heart wellness with lightweight absorption.',
    healthBenefits: [
      'Highest concentration of Essential Linoleic Acid (Omega-6)',
      'Helps maintain healthy blood pressure and blood lipid profile',
      'Light texture with mild neutral aroma suitable for light frying & salads',
      'Unrefined, unbleached, zero chemical deodorization'
    ],
    extractionMethod: 'Slow Cold Pressing under 40°C from Select Organic Safflower Seeds',
    badge: 'Heart Health Choice',
    rating: 5.0,
    reviewsCount: 0,
    images: [
      'https://i.pinimg.com/736x/7b/72/ec/7b72ec0a7388518616a22806131e3aae.jpg'
    ],
    variants: [
      { id: 'kusuma-1l', weight: '1 Litre', price: 520, originalPrice: 580, inStock: true },
      { id: 'kusuma-5l', weight: '5 Litres', price: 2550, originalPrice: 2850, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '884 kcal per 100g' },
      { label: 'Polyunsaturated Fat (PUFA)', value: '74.6g' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: []
  },
  {
    id: 'wood-pressed-mustard-oil',
    name: 'Wood-Pressed Mustard Oil',
    subtitle: 'Pungent Kachi Ghani Mustard Oil',
    category: 'oil',
    description: 'Authentic Kachi Ghani Mustard Oil extracted from organic yellow and black mustard seeds. Prepared using traditional slow wood presses to retain natural allyl isothiocyanate for sharp authentic aroma and antimicrobial benefits.',
    healthBenefits: [
      'Authentic strong pungent aroma and natural golden hue',
      'Rich in Omega-3 and Omega-6 essential fatty acids',
      'Traditional cold-pressed extraction preserves natural antioxidants',
      'Ideal for North and East Indian pickles, curries, and tadka'
    ],
    extractionMethod: 'Slow Wood Pressed (Kachi Ghani) below 40°C',
    badge: 'Pungent Kachi Ghani',
    rating: 5.0,
    reviewsCount: 0,
    images: [
      'https://i.pinimg.com/736x/13/18/8d/13188d1e419f405b39e9dc48669c823e.jpg'
    ],
    variants: [
      { id: 'mustard-1l', weight: '1 Litre', price: 380, originalPrice: 430, inStock: true },
      { id: 'mustard-5l', weight: '5 Litres', price: 1850, originalPrice: 2100, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '884 kcal per 100g' },
      { label: 'Omega-3 Fatty Acids', value: '6.0g' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: []
  },
  {
    id: 'cold-pressed-coconut-oil',
    name: 'Cold-Pressed Coconut Oil',
    subtitle: 'Extracted from Sun-Dried Coastal Copra',
    category: 'oil',
    description: 'Raw, unrefined Extra Virgin Coconut Oil extracted from fresh sun-dried coconuts harvested from organic groves. Retains natural lauric acid, tropical coconut fragrance, and crystal-clear purity for culinary, hair, and ayurvedic care.',
    healthBenefits: [
      'Abundant in Lauric Acid (50%) for anti-microbial immunity support',
      'Contains Medium-Chain Triglycerides (MCTs) for instant cellular energy',
      'Nourishes scalp hair follicles, softens skin, and supports oil pulling',
      'Zero heat treatment, zero added fragrance, zero preservatives'
    ],
    extractionMethod: 'Zero-Heat Cold Expeller Pressed from Sun-Dried Organic Copra',
    badge: '100% Raw Virgin',
    rating: 5.0,
    reviewsCount: 0,
    images: [
      'https://images.pexels.com/photos/11809347/pexels-photo-11809347.jpeg?_gl=1*1y4fvrj*_ga*MTI2MzM2MDI2Ni4xNzg1MzQ0OTYz*_ga_8JE65Q40S6*czE3ODUzNDQ5NzEkajUxJGwwJGgw'
    ],
    variants: [
      { id: 'coco-1l', weight: '1 Litre', price: 680, originalPrice: 750, inStock: true },
      { id: 'coco-500ml', weight: '500 ml', price: 350, originalPrice: 400, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '862 kcal per 100g' },
      { label: 'Lauric Acid', value: '50.2g' },
      { label: 'MCT Content', value: '62%' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: []
  },
  {
    id: 'artisanal-desi-paneer',
    name: 'Fresh Artisanal Desi Paneer',
    subtitle: 'Handmade Daily from Pure Desi Cow Milk',
    category: 'paneer',
    description: 'Our paneer is handcrafted using our own fresh A2 Desi Cow Milk. It is soft, fresh, protein-rich, and made without artificial additives, preservatives, or fillers, making it perfect for healthy family meals.',
    healthBenefits: [
      'Made from fresh A2 Desi Cow Milk with zero starch or artificial fillers',
      'Soft, fresh, and rich in high biological value protein (18g per 100g)',
      'Prepared in hygienic estate conditions daily',
      'No preservatives, chemical coagulants, or synthetic additives'
    ],
    extractionMethod: 'Hand-curdled with natural lemon whey & pressed in organic muslin cloth',
    badge: 'Made Fresh Daily',
    rating: 5.0,
    reviewsCount: 0,
    images: [
      'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?q=80&w=1172&auto=format&fit=crop'
    ],
    variants: [
      { id: 'paneer-250g', weight: '250g', price: 300, originalPrice: 340, inStock: true },
      { id: 'paneer-500g', weight: '500g', price: 600, originalPrice: 680, inStock: true },
      { id: 'paneer-1kg', weight: '1 KG', price: 1200, originalPrice: 1350, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '298 kcal per 100g' },
      { label: 'Protein', value: '18.2g' },
      { label: 'Calcium', value: '480mg' },
      { label: 'Added Starch / Fillers', value: '0.0%' }
    ],
    reviews: []
  },
  {
    id: 'farm-fresh-eggs',
    name: 'Farm Fresh Free-Range Eggs',
    subtitle: 'Nutritious & Naturally Raised Hen Eggs',
    category: 'eggs',
    description: 'Our eggs come from naturally raised hens that are cared for in a healthy, stress-free environment. We focus on quality, freshness, and responsible farming to bring nutritious, protein-rich eggs directly from our farm to your home.',
    healthBenefits: [
      '100% Farm fresh & naturally produced by free-range hens',
      'Hygienically handled and packed for maximum freshness',
      'Rich in high-quality protein, Choline, and Vitamin D',
      'Delivered fresh from the farm directly to your home'
    ],
    extractionMethod: 'Harvested daily from healthy, naturally grazed hens',
    badge: 'Farm Fresh Daily',
    rating: 5.0,
    reviewsCount: 0,
    images: [
      'https://i.pinimg.com/736x/7f/4f/82/7f4f8291d388e9ab37c955181c227f08.jpg'
    ],
    variants: [
      { id: 'eggs-6', weight: '6 Eggs', price: 90, originalPrice: 115, inStock: true },
      { id: 'eggs-12', weight: '12 Eggs', price: 170, originalPrice: 210, inStock: true },
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '155 kcal per 100g' },
      { label: 'Protein', value: '13.0g' },
      { label: 'Choline', value: '147mg' },
      { label: 'Trans Fat', value: '0.0g' }
    ],
    reviews: []
  }
];

