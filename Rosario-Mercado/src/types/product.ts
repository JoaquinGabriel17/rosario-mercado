import type { User } from "./user";

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  imageId?: string;
  userId: string;
  stock: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProductResponse {
  product: Product;
  user: User;
}
