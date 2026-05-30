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
  stock: number;
  imageurl: string;
  category: string;
  sellerId?: number | null;
}

export interface ProductPayload {
  name: string;
  description: string;
  stock: number;
  price: number;
  imageurl: string;
  category: string;
}
