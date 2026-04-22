export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  video?: string;
  category: string;
  isSale?: boolean;
  originalPrice?: number;
  stock: number;
  // Detailed specs
  fabric?: string;
  care?: string;
  sizeGuide?: string;
  dimensions?: { h: number; w: number; d: number };
  weight?: string;
  assembly?: string;
  sizes?: string[]; // e.g. ["S", "M", "L"] or ["38", "40", "42"]
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  tracking: { status: string; date: string; message: string }[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
