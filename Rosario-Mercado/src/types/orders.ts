export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

export interface OrderItem {
  _id: string;
  productId: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  status: "pending" | "completed" | "expired" | "cancelled";
  items: OrderItem[];
  buyerId: string;
  sellerId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateOrderResponse {
  message: string;
  orderId: string;
  init_point: string;
  preferenceId: string;
}
