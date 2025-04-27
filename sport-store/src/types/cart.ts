import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
  size: string;
  totalPrice: number;
  _id: string;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  cartTotal: number;
  loading: boolean;
  error: string | null;
  createdAt?: string;
  updatedAt?: string;
} 