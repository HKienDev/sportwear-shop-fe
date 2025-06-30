import { User } from './base';
import { Product } from './product';

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

export enum PaymentMethod {
  COD = "COD"
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded"
}

export enum ShippingMethod {
  STANDARD = "standard",
  EXPRESS = "express",
  SAME_DAY = "same_day"
}

export interface OrderItem {
  product: string | Product;
  quantity: number;
  price: number;
  name: string;
  sku: string;
  color?: string;
  size?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: {
    province: {
      name: string;
      code: number;
    };
    district: {
      name: string;
      code: number;
    };
    ward: {
      name: string;
      code: number;
    };
    street?: string;
  };
}

export interface ShippingInfo {
  method: ShippingMethod;
  fee: number;
  expectedDate?: Date;
  courier?: string;
  trackingId?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  updatedAt: Date;
  updatedBy: User;
  note?: string;
}

export interface Order {
  _id: string;
  shortId: string;
  user: User;
  phone: string;
  items: OrderItem[];
  totalPrice: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  shippingAddress: ShippingAddress;
  shippingInfo: ShippingInfo;
  shippingFee: number;
  status: OrderStatus;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: User;
  statusHistory: OrderStatusHistory[];
  isTotalSpentUpdated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  items: {
    product: string;
    quantity: number;
    price: number;
    name: string;
    sku: string;
    color?: string;
    size?: string;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  notes?: string;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingInfo?: ShippingInfo;
  notes?: string;
  cancellationReason?: string;
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
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  phone?: string;
} 