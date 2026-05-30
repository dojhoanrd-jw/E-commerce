export const PRODUCT_CATEGORIES = [
  'Electrónica',
  'Hogar',
  'Ropa',
  'Deportes',
  'Juguetes',
  'Otros'
] as const;

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  imageurl: string;
  images: string[];
  category: string;
  sellerId?: number | null;
  averageRating: number;
  reviewCount: number;
  salesCount: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  stock: number;
  price: number;
  salePrice?: number | null;
  imageurl: string;
  images: string[];
  category: string;
}

export function effectivePrice(p: Product): number {
  return p.salePrice ?? p.price;
}
