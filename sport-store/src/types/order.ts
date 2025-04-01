import type { User, Product } from "./base";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  shortId: string;
  user: User;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: "cash" | "banking" | "momo";
  paymentStatus: "pending" | "paid" | "failed";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
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