import type { User, Product } from "./base";

export interface OrderItem {
  _id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  shortId: string;
  userId?: string;
  user?: User;
  phone: string;
  items: OrderItem[];
  total: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cash' | 'banking' | 'momo';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface OrderSearchParams {
  query?: string;
  status?: string;
  paymentStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  phone?: string;
}

export interface CreateOrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  paymentMethod: 'cash' | 'banking' | 'momo';
  note?: string;
  phone: string;
}

export interface UpdateOrderInput {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  shippingAddress?: Order['shippingAddress'];
  note?: string;
} 