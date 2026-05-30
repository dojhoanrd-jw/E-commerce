export const PRODUCT_CATEGORIES = [
  'Electrónica',
  'Hogar',
  'Ropa',
  'Deportes',
  'Juguetes',
  'Otros'
] as const;

export interface Variant {
  id: number;
  size?: string | null;
  color?: string | null;
  stock: number;
}

export interface VariantPayload {
  size?: string | null;
  color?: string | null;
  stock: number;
}

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
  variants: Variant[];
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
  variants: VariantPayload[];
}

export function effectivePrice(p: Product): number {
  return p.salePrice ?? p.price;
}

export function variantLabel(v: Variant): string {
  return [v.size, v.color].filter((s) => !!s && s.trim().length > 0).join(' · ');
}
