import type { User, Product } from "./base";

export interface OrderItem {
  _id: string;
  product: string | Product;
  quantity: number;
  price: number;
  name: string;
  sku: string;
  color?: string;
  size?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  shortId: string;
  userId?: string;
  user?: User;
  items: OrderItem[];
  total: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cash' | 'banking' | 'momo' | 'stripe';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: {
      province: {
        name: string;
        code: string;
      };
      district: {
        name: string;
        code: string;
      };
      ward: {
        name: string;
        code: string;
      };
    };
  };
  shippingMethod: {
    method: string;
    expectedDate: string;
    courier: string;
    trackingId: string;
  };
  coupon?: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discountAmount: number;
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
    sku: string;
    quantity: number;
    color?: string;
    size?: string;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: {
      province: {
        name: string;
        code: string;
      };
      district: {
        name: string;
        code: string;
      };
      ward: {
        name: string;
        code: string;
      };
    };
  };
  paymentMethod: 'cash' | 'banking' | 'momo' | 'stripe';
  shippingMethod: string;
  couponCode?: string;
  note?: string;
}

export interface UpdateOrderInput {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  shippingAddress?: Order['shippingAddress'];
  shippingMethod?: Order['shippingMethod'];
  note?: string;
} 