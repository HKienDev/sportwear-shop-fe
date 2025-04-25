export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
} 