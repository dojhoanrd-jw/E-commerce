export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}
