export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageurl: string;
  sellerId?: number | null;
}

export interface ProductPayload {
  name: string;
  description: string;
  stock: number;
  price: number;
  imageurl: string;
}
