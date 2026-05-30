export interface CartItem {
  productId: number;
  variantId?: number | null;
  variantLabel?: string;
  name: string;
  price: number;
  imageurl: string;
  quantity: number;
}
