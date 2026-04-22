import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: "Men's Collection",
    slug: 'men',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop',
    description: 'Refined elegance for the modern man.'
  },
  {
    id: 'cat-2',
    name: "Women's Collection",
    slug: 'women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
    description: 'Ethereal designs for every occasion.'
  },
  {
    id: 'cat-3',
    name: "Kids' Collection",
    slug: 'kids',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    description: 'Style and comfort for the little ones.'
  },
  {
    id: 'cat-4',
    name: "Home Decor",
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop',
    description: 'Elevate your living space.'
  }
];

export const PRODUCTS: Product[] = [
  // Men
  {
    id: 'm1',
    name: 'Tailored Linen Blazer',
    price: 4999,
    description: 'Breathable linen blazer for a smart-casual look.',
    image: 'https://images.unsplash.com/photo-1594932224010-75f43048ec1b?q=80&w=2000&auto=format&fit=crop',
    category: 'men',
    isSale: true,
    originalPrice: 7999,
    stock: 5
  },
  {
    id: 'm2',
    name: 'Classic Oxford Shirt',
    price: 1599,
    description: 'Essential white oxford shirt in premium cotton.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=1973&auto=format&fit=crop',
    category: 'men',
    stock: 20
  },
  // Women
  {
    id: 'w1',
    name: 'Silk Wrap Dress',
    price: 3499,
    description: 'Elegant silk wrap dress in emerald green.',
    image: 'https://images.unsplash.com/photo-1539109132382-361bd57557d8?q=80&w=1974&auto=format&fit=crop',
    category: 'women',
    stock: 3
  },
  {
    id: 'w2',
    name: 'Minimalist Leather Tote',
    price: 2299,
    description: 'Spacious leather tote for daily essentials.',
    image: 'https://images.unsplash.com/photo-1584917765829-d73b58a2c1ca?q=80&w=1935&auto=format&fit=crop',
    category: 'women',
    isSale: true,
    originalPrice: 3299,
    stock: 10
  },
  // Kids
  {
    id: 'k1',
    name: 'Organic Cotton Romper',
    price: 899,
    description: 'Soft organic cotton romper for newborns.',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1974&auto=format&fit=crop',
    category: 'kids',
    stock: 15
  },
  // Home
  {
    id: 'h1',
    name: 'Handcrafted Ceramic Vase',
    price: 1299,
    description: 'Minimalist ceramic vase for minimalist homes.',
    image: 'https://images.unsplash.com/photo-1578500494198-246f312ee3b2?q=80&w=2070&auto=format&fit=crop',
    category: 'home',
    stock: 8
  }
];
